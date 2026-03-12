import { describe, expect, test } from 'vitest';
import {
	formatLocalScheduleLines,
	isOpenAtMinute,
	shiftIntervalsToLocal,
	summarizeShelterHours,
} from './hours-presentation';

describe('hours presentation', () => {
	test('shifts intervals across day boundaries', () => {
		const shifted = shiftIntervalsToLocal([{ startMinute: 0, endMinute: 60 }], 120);
		expect(shifted).toEqual([{ startMinute: 120, endMinute: 180 }]);

		const wrapped = shiftIntervalsToLocal([{ startMinute: 100, endMinute: 300 }], -200);
		expect(wrapped).toEqual([
			{ startMinute: 0, endMinute: 100 },
			{ startMinute: 9980, endMinute: 10080 },
		]);
	});

	test('merges overlapping intervals after shifting', () => {
		const merged = shiftIntervalsToLocal(
			[
				{ startMinute: 100, endMinute: 250 },
				{ startMinute: 200, endMinute: 400 },
			],
			0,
		);

		expect(merged).toEqual([{ startMinute: 100, endMinute: 400 }]);
	});

	test('formats local schedule into grouped day lines', () => {
		const lines = formatLocalScheduleLines([
			{ startMinute: 510, endMinute: 990 },
			{ startMinute: 1950, endMinute: 2430 },
			{ startMinute: 3390, endMinute: 3870 },
			{ startMinute: 4830, endMinute: 5310 },
			{ startMinute: 6270, endMinute: 6750 },
		]);

		expect(lines).toEqual(['Mon-Fri: 8:30 AM - 4:30 PM', 'Sat-Sun: Closed']);
	});

	test('computes open status and fallback behavior', () => {
		expect(
			summarizeShelterHours(undefined, {
				currentMinuteOfWeek: 600,
			}),
		).toEqual({
			status: 'unknown',
			statusLabel: 'Unknown',
			scheduleLines: [],
		});

		const summary = summarizeShelterHours(
			{
				timeZone: 'America/Chicago',
				intervals: [{ startMinute: 510, endMinute: 990 }],
			},
			{
				offsetDeltaMinutes: 0,
				currentMinuteOfWeek: 600,
			},
		);

		expect(summary.status).toBe('open');
		expect(summary.statusLabel).toBe('Open now');
		expect(summary.scheduleLines[0]).toBe('Mon: 8:30 AM - 4:30 PM');

		const closed = summarizeShelterHours(
			{
				timeZone: 'America/Chicago',
				intervals: [{ startMinute: 510, endMinute: 990 }],
			},
			{
				offsetDeltaMinutes: 0,
				currentMinuteOfWeek: 100,
			},
		);

		expect(closed.status).toBe('closed');
		expect(closed.statusLabel).toBe('Closed now');
		expect(closed.scheduleLines.length).toBeGreaterThan(0);

		expect(isOpenAtMinute([{ startMinute: 0, endMinute: 60 }], 61)).toBe(false);
		expect(isOpenAtMinute([{ startMinute: 0, endMinute: 60 }], 0)).toBe(true);
		expect(isOpenAtMinute([{ startMinute: 0, endMinute: 60 }], 60)).toBe(false);
	});

	test('handles full-week availability as always open', () => {
		const summary = summarizeShelterHours(
			{
				timeZone: 'America/Chicago',
				intervals: [{ startMinute: 0, endMinute: 10080 }],
			},
			{
				offsetDeltaMinutes: 0,
				currentMinuteOfWeek: 4321,
			},
		);

		expect(summary.status).toBe('open');
		expect(summary.statusLabel).toBe('Open now');
		expect(summary.scheduleLines).toEqual(['Mon-Sun: Open 24 hours']);
	});
});
