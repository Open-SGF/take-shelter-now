import type { ShelterHours, ShelterHoursInterval } from './types';

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

type DayWindow = {
	startMinute: number;
	endMinute: number;
};

export type ShelterHoursSummary = {
	status: 'open' | 'closed' | 'unknown';
	statusLabel: string;
	scheduleLines: string[];
};

const normalizeIntervals = (intervals: ShelterHoursInterval[]): ShelterHoursInterval[] => {
	if (intervals.length === 0) {
		return [];
	}

	const sorted = [...intervals].sort((left, right) => left.startMinute - right.startMinute);
	const normalized: ShelterHoursInterval[] = [{ ...sorted[0] }];

	for (const interval of sorted.slice(1)) {
		const previous = normalized[normalized.length - 1];
		if (interval.startMinute <= previous.endMinute) {
			previous.endMinute = Math.max(previous.endMinute, interval.endMinute);
			continue;
		}

		normalized.push({ ...interval });
	}

	return normalized;
};

const wrapMinuteOfWeek = (minute: number) => {
	const wrapped = minute % MINUTES_PER_WEEK;
	return wrapped < 0 ? wrapped + MINUTES_PER_WEEK : wrapped;
};

export const shiftIntervalsToLocal = (
	intervals: ShelterHoursInterval[],
	offsetDeltaMinutes: number,
): ShelterHoursInterval[] => {
	if (intervals.length === 0) {
		return [];
	}

	const shifted: ShelterHoursInterval[] = [];

	for (const interval of intervals) {
		const shiftedStart = interval.startMinute + offsetDeltaMinutes;
		const duration = interval.endMinute - interval.startMinute;

		if (duration >= MINUTES_PER_WEEK) {
			return [{ startMinute: 0, endMinute: MINUTES_PER_WEEK }];
		}

		const startWrapped = wrapMinuteOfWeek(shiftedStart);
		const endWrapped = startWrapped + duration;

		if (endWrapped <= MINUTES_PER_WEEK) {
			shifted.push({
				startMinute: startWrapped,
				endMinute: endWrapped,
			});
			continue;
		}

		shifted.push({
			startMinute: startWrapped,
			endMinute: MINUTES_PER_WEEK,
		});
		shifted.push({
			startMinute: 0,
			endMinute: endWrapped - MINUTES_PER_WEEK,
		});
	}

	return normalizeIntervals(shifted);
};

const pad = (value: number) => value.toString().padStart(2, '0');

const getTimeZoneOffsetMinutes = (date: Date, timeZone: string): number => {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	const parts = formatter.formatToParts(date);
	const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	const asUtc = Date.UTC(
		Number.parseInt(byType.year ?? '0', 10),
		Number.parseInt(byType.month ?? '1', 10) - 1,
		Number.parseInt(byType.day ?? '1', 10),
		Number.parseInt(byType.hour ?? '0', 10),
		Number.parseInt(byType.minute ?? '0', 10),
		Number.parseInt(byType.second ?? '0', 10),
	);

	return Math.round((asUtc - date.getTime()) / 60000);
};

const getOffsetDeltaMinutes = (sourceTimeZone: string, now: Date) => {
	const localOffset = -now.getTimezoneOffset();
	const sourceOffset = getTimeZoneOffsetMinutes(now, sourceTimeZone);
	return localOffset - sourceOffset;
};

export const getCurrentMinuteOfWeek = (date: Date): number => {
	const dayIndex = (date.getDay() + 6) % 7;
	return dayIndex * MINUTES_PER_DAY + date.getHours() * 60 + date.getMinutes();
};

export const isOpenAtMinute = (
	intervals: ShelterHoursInterval[],
	minuteOfWeek: number,
): boolean => {
	return intervals.some(
		(interval) => minuteOfWeek >= interval.startMinute && minuteOfWeek < interval.endMinute,
	);
};

const toDailyWindows = (intervals: ShelterHoursInterval[]): DayWindow[][] => {
	const days: DayWindow[][] = [[], [], [], [], [], [], []];

	for (const interval of intervals) {
		let cursor = interval.startMinute;

		while (cursor < interval.endMinute) {
			const dayIndex = Math.floor(cursor / MINUTES_PER_DAY);
			const dayStart = dayIndex * MINUTES_PER_DAY;
			const dayEnd = dayStart + MINUTES_PER_DAY;
			const segmentEnd = Math.min(interval.endMinute, dayEnd);

			days[dayIndex].push({
				startMinute: cursor - dayStart,
				endMinute: segmentEnd - dayStart,
			});

			cursor = segmentEnd;
		}
	}

	return days;
};

const formatMinute = (minuteOfDay: number): string => {
	const hours24 = Math.floor(minuteOfDay / 60) % 24;
	const minutes = minuteOfDay % 60;
	const meridiem = hours24 >= 12 ? 'PM' : 'AM';
	const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
	return `${hours12}:${pad(minutes)} ${meridiem}`;
};

const formatWindows = (windows: DayWindow[]) => {
	if (windows.length === 0) {
		return 'Closed';
	}

	if (
		windows.length === 1 &&
		windows[0].startMinute === 0 &&
		windows[0].endMinute === MINUTES_PER_DAY
	) {
		return 'Open 24 hours';
	}

	return windows
		.map((window) => `${formatMinute(window.startMinute)} - ${formatMinute(window.endMinute)}`)
		.join(', ');
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDayRange = (startDay: number, endDay: number) => {
	if (startDay === endDay) {
		return DAY_LABELS[startDay];
	}

	return `${DAY_LABELS[startDay]}-${DAY_LABELS[endDay]}`;
};

export const formatLocalScheduleLines = (intervals: ShelterHoursInterval[]): string[] => {
	if (
		intervals.length === 1 &&
		intervals[0].startMinute === 0 &&
		intervals[0].endMinute === MINUTES_PER_WEEK
	) {
		return ['Open 24/7'];
	}

	const days = toDailyWindows(intervals);
	const lines: string[] = [];

	let startDay = 0;
	while (startDay < 7) {
		const signature = formatWindows(days[startDay]);
		let endDay = startDay;

		while (endDay + 1 < 7 && formatWindows(days[endDay + 1]) === signature) {
			endDay += 1;
		}

		lines.push(`${formatDayRange(startDay, endDay)}: ${signature}`);
		startDay = endDay + 1;
	}

	return lines;
};

export const summarizeShelterHours = (
	hours: ShelterHours | undefined,
	options?: { offsetDeltaMinutes?: number; currentMinuteOfWeek?: number; now?: Date },
): ShelterHoursSummary => {
	if (!hours || hours.intervals.length === 0) {
		return {
			status: 'unknown',
			statusLabel: 'Unknown',
			scheduleLines: [],
		};
	}

	const now = options?.now ?? new Date();
	const delta = options?.offsetDeltaMinutes ?? getOffsetDeltaMinutes(hours.timeZone, now);
	const localIntervals = shiftIntervalsToLocal(hours.intervals, delta);
	const minuteOfWeek = options?.currentMinuteOfWeek ?? getCurrentMinuteOfWeek(now);
	const isOpen = isOpenAtMinute(localIntervals, minuteOfWeek);

	return {
		status: isOpen ? 'open' : 'closed',
		statusLabel: isOpen ? 'Open now' : 'Closed now',
		scheduleLines: formatLocalScheduleLines(localIntervals),
	};
};
