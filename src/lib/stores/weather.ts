import { writable, derived } from 'svelte/store';

export interface NWSAlert {
	id: string;
	event: string;
	severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
	urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
	headline: string;
	description: string;
	instruction: string | null;
	effective: string;
	expires: string;
	areas: string[];
}

export interface WeatherAlertsState {
	alerts: NWSAlert[];
	loading: boolean;
	error: string | null;
	lastUpdated: Date | null;
}

export const SEVERITY_COLORS: Record<string, string> = {
	Extreme: '#c91c1c',
	Severe: '#ff6600',
	Moderate: '#ffcc00',
	Minor: '#0892d2',
	Unknown: '#6b7280',
};

// Default coordinates for Springfield, MO
const DEFAULT_LAT = 37.208957;
const DEFAULT_LON = -93.292299;

// Test alert for development - remove when done testing
const TEST_ALERT: NWSAlert = {
	id: 'test-tornado-warning-1',
	event: 'Tornado Warning',
	severity: 'Extreme',
	urgency: 'Immediate',
	headline: 'Tornado Warning issued for Greene County, MO until 6:00 PM CST',
	description:
		'The National Weather Service has issued a Tornado Warning for Greene County. A severe thunderstorm capable of producing a tornado was located near Springfield, moving northeast at 35 mph. TAKE COVER NOW!',
	instruction:
		'TAKE SHELTER NOW! Move to a basement or interior room on the lowest floor of a sturdy building. Avoid windows.',
	effective: new Date().toISOString(),
	expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
	areas: ['Greene County', 'Springfield'],
};

export const weatherAlertsState = writable<WeatherAlertsState>({
	alerts: [TEST_ALERT], // Remove TEST_ALERT when done testing
	loading: false,
	error: null,
	lastUpdated: new Date(),
});

export const hasActiveAlerts = derived(weatherAlertsState, ($state) => $state.alerts.length > 0);

// Track if the alert banner is expanded
export const alertBannerExpanded = writable(false);

function parseNWSAlerts(data: {
	features?: Array<{ properties: Record<string, unknown> }>;
}): NWSAlert[] {
	return (data.features || []).map((feature) => ({
		id: feature.properties.id as string,
		event: feature.properties.event as string,
		severity: (feature.properties.severity as NWSAlert['severity']) || 'Unknown',
		urgency: (feature.properties.urgency as NWSAlert['urgency']) || 'Unknown',
		headline: feature.properties.headline as string,
		description: feature.properties.description as string,
		instruction: (feature.properties.instruction as string) || null,
		effective: feature.properties.effective as string,
		expires: feature.properties.expires as string,
		areas: ((feature.properties.areaDesc as string) || '')
			.split(';')
			.map((s: string) => s.trim())
			.filter(Boolean),
	}));
}

// For testing/demo purposes - inject fake alerts
export function setFakeAlerts(alerts: NWSAlert[]): void {
	weatherAlertsState.set({
		alerts,
		loading: false,
		error: null,
		lastUpdated: new Date(),
	});
}

// Convenience function to add a sample tornado warning for testing
export function addTestTornadoWarning(): void {
	const fakeAlert: NWSAlert = {
		id: 'test-tornado-warning-1',
		event: 'Tornado Warning',
		severity: 'Extreme',
		urgency: 'Immediate',
		headline:
			'Tornado Warning issued for Greene County, MO until 6:00 PM CST',
		description:
			'The National Weather Service has issued a Tornado Warning for Greene County. A severe thunderstorm capable of producing a tornado was located near Springfield, moving northeast at 35 mph. TAKE COVER NOW!',
		instruction:
			'TAKE SHELTER NOW! Move to a basement or interior room on the lowest floor of a sturdy building. Avoid windows.',
		effective: new Date().toISOString(),
		expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
		areas: ['Greene County', 'Springfield'],
	};

	weatherAlertsState.update((state) => ({
		...state,
		alerts: [fakeAlert, ...state.alerts],
		lastUpdated: new Date(),
	}));
}

export async function fetchWeatherAlerts(
	lat: number = DEFAULT_LAT,
	lon: number = DEFAULT_LON,
): Promise<void> {
	weatherAlertsState.update((s) => ({ ...s, loading: true, error: null }));

	try {
		const response = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
			headers: {
				Accept: 'application/geo+json',
				'User-Agent': 'TakeShelterNow Emergency App',
			},
		});

		if (!response.ok) {
			throw new Error(`NWS API error: ${response.status}`);
		}

		const data = await response.json();
		const fetchedAlerts = parseNWSAlerts(data);

		weatherAlertsState.update((s) => {
			// Preserve test alerts (for development) while adding real alerts
			const testAlerts = s.alerts.filter((a) => a.id.startsWith('test-'));
			return {
				alerts: [...testAlerts, ...fetchedAlerts],
				loading: false,
				error: null,
				lastUpdated: new Date(),
			};
		});
	} catch (error) {
		weatherAlertsState.update((s) => ({
			...s,
			loading: false,
			error: error instanceof Error ? error.message : 'Failed to fetch alerts',
		}));
	}
}
