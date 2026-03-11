import type { ShelterHoursInterval } from './types';

const NON_SCHOOL_HOURS = 'non school hours';
const DEFAULT_TIME_ZONE = 'America/Chicago';
const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;
const SCHOOL_DAY_START = 8 * 60 + 30;
const SCHOOL_DAY_END = 16 * 60 + 30;

const normalizeInput = (value: string | undefined) => (value ?? '').trim();

const normalizeMeridiem = (value: string) => {
	return value.replace(/\s*(a\.?m\.?|p\.?m\.?)$/i, (match) =>
		match.replace(/\./g, '').toLowerCase(),
	);
};

const parseMinuteOfDay = (value: string) => {
	const normalized = normalizeMeridiem(value.trim());
	const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);

	if (!match) {
		return undefined;
	}

	const hours = Number.parseInt(match[1], 10);
	const minutes = Number.parseInt(match[2] ?? '0', 10);
	const meridiem = match[3].toLowerCase();

	if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
		return undefined;
	}

	const normalizedHours = (hours % 12) + (meridiem === 'pm' ? 12 : 0);
	return normalizedHours * 60 + minutes;
};

const buildHours = (intervals: ShelterHoursInterval[]) => ({
	timeZone: DEFAULT_TIME_ZONE,
	intervals,
});

const normalizeIntervals = (intervals: ShelterHoursInterval[]) => {
	if (intervals.length === 0) {
		return [];
	}

	const sortedIntervals = [...intervals].sort(
		(left, right) => left.startMinute - right.startMinute,
	);
	const normalized: ShelterHoursInterval[] = [{ ...sortedIntervals[0] }];

	for (const interval of sortedIntervals.slice(1)) {
		const previous = normalized[normalized.length - 1];
		if (interval.startMinute <= previous.endMinute) {
			previous.endMinute = Math.max(previous.endMinute, interval.endMinute);
			continue;
		}

		normalized.push({ ...interval });
	}

	return normalized;
};

const addDailyRange = (
	intervals: ShelterHoursInterval[],
	dayIndex: number,
	openMinute: number,
	closeMinute: number,
) => {
	const dayStart = dayIndex * MINUTES_PER_DAY;
	const startMinute = dayStart + openMinute;

	if (closeMinute === openMinute) {
		intervals.push({
			startMinute: dayStart,
			endMinute: dayStart + MINUTES_PER_DAY,
		});
		return;
	}

	if (closeMinute > openMinute) {
		intervals.push({
			startMinute,
			endMinute: dayStart + closeMinute,
		});
		return;
	}

	const overnightEnd = dayStart + MINUTES_PER_DAY + closeMinute;
	if (overnightEnd <= MINUTES_PER_WEEK) {
		intervals.push({
			startMinute,
			endMinute: overnightEnd,
		});
		return;
	}

	intervals.push({
		startMinute,
		endMinute: MINUTES_PER_WEEK,
	});
	intervals.push({
		startMinute: 0,
		endMinute: overnightEnd - MINUTES_PER_WEEK,
	});
};

const addRangeForAllDays = (openMinute: number, closeMinute: number) => {
	const intervals: ShelterHoursInterval[] = [];

	for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
		addDailyRange(intervals, dayIndex, openMinute, closeMinute);
	}

	return normalizeIntervals(intervals);
};

const parseRange = (value: string) => {
	const match = value.match(/^(.+?)\s*-\s*(.+)$/);
	if (!match) {
		return undefined;
	}

	const open = parseMinuteOfDay(match[1]);
	const close = parseMinuteOfDay(match[2]);

	if (open === undefined || close === undefined) {
		return undefined;
	}

	if (open === close) {
		return undefined;
	}

	return buildHours(addRangeForAllDays(open, close));
};

const nonSchoolHoursIntervals = () => {
	const intervals: ShelterHoursInterval[] = [];

	for (let dayIndex = 0; dayIndex < 5; dayIndex += 1) {
		addDailyRange(intervals, dayIndex, 0, SCHOOL_DAY_START);
		addDailyRange(intervals, dayIndex, SCHOOL_DAY_END, 0);
	}

	addDailyRange(intervals, 5, 0, 0);
	addDailyRange(intervals, 6, 0, 0);

	return normalizeIntervals(intervals);
};

export const parseShelterHours = (value: string | undefined) => {
	const trimmed = normalizeInput(value);
	if (!trimmed) {
		return undefined;
	}

	if (trimmed.toLowerCase() === NON_SCHOOL_HOURS) {
		return buildHours(nonSchoolHoursIntervals());
	}

	return parseRange(trimmed);
};
