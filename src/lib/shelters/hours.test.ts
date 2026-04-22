import { describe, expect, test } from 'vitest';
import { parseShelterHours } from './hours';

describe('parseShelterHours', () => {
	test('parses a plain-language time range into weekly minute intervals', () => {
		expect(parseShelterHours('8:30am - 4:30pm')).toEqual({
			timeZone: 'America/Chicago',
			intervals: [
				{ startMinute: 510, endMinute: 990 },
				{ startMinute: 1950, endMinute: 2430 },
				{ startMinute: 3390, endMinute: 3870 },
				{ startMinute: 4830, endMinute: 5310 },
				{ startMinute: 6270, endMinute: 6750 },
				{ startMinute: 7710, endMinute: 8190 },
				{ startMinute: 9150, endMinute: 9630 },
			],
		});
	});

	test('handles spacing and meridiem formatting variants', () => {
		expect(parseShelterHours(' 8:30 AM-4:30 PM ')).toEqual({
			timeZone: 'America/Chicago',
			intervals: [
				{ startMinute: 510, endMinute: 990 },
				{ startMinute: 1950, endMinute: 2430 },
				{ startMinute: 3390, endMinute: 3870 },
				{ startMinute: 4830, endMinute: 5310 },
				{ startMinute: 6270, endMinute: 6750 },
				{ startMinute: 7710, endMinute: 8190 },
				{ startMinute: 9150, endMinute: 9630 },
			],
		});
	});

	test('maps Non School Hours to intervals including weekday early mornings', () => {
		expect(parseShelterHours('Non School Hours')).toEqual({
			timeZone: 'America/Chicago',
			intervals: [
				{ startMinute: 0, endMinute: 510 },
				{ startMinute: 990, endMinute: 1950 },
				{ startMinute: 2430, endMinute: 3390 },
				{ startMinute: 3870, endMinute: 4830 },
				{ startMinute: 5310, endMinute: 6270 },
				{ startMinute: 6750, endMinute: 10080 },
			],
		});
	});

	test('returns undefined for unparseable values', () => {
		expect(parseShelterHours('TBD at warning time')).toBeUndefined();
		expect(parseShelterHours('')).toBeUndefined();
		expect(parseShelterHours(undefined)).toBeUndefined();
	});
});
