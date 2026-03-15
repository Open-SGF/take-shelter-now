import { GeocodingApi } from '@stadiamaps/api';
import type { GeoPoint } from './point';

export type GeocodingResult = {
	label: string;
	address: string;
	location: GeoPoint;
};

export type AutocompleteSuggestion = {
	gid: string;
	label: string;
	address: string;
};

const geocodingApi = new GeocodingApi();

const SPRINGFIELD_MO_FOCUS = {
	latitude: 37.208957,
	longitude: -93.292299,
};

function formatAddress(props: {
	name?: string;
	street?: string;
	housenumber?: string;
	locality?: string;
	region?: string;
	postalcode?: string;
}): string {
	const parts: string[] = [];

	if (props.housenumber && props.street) {
		parts.push(`${props.housenumber} ${props.street}`);
	} else if (props.street) {
		parts.push(props.street);
	} else if (props.name) {
		parts.push(props.name);
	}

	if (props.locality) parts.push(props.locality);
	if (props.region) parts.push(props.region);
	if (props.postalcode) parts.push(props.postalcode);

	return parts.join(', ');
}

function coordinatesToGeoPoint(coordinates: number[]): GeoPoint {
	return {
		longitude: coordinates[0],
		latitude: coordinates[1],
	};
}

export async function searchAddresses(query: string): Promise<AutocompleteSuggestion[]> {
	if (query.length < 3) return [];

	try {
		const response = await geocodingApi.autocomplete({
			text: query,
			focusPointLat: SPRINGFIELD_MO_FOCUS.latitude,
			focusPointLon: SPRINGFIELD_MO_FOCUS.longitude,
			boundaryCountry: ['US'],
			layers: ['address', 'venue'],
			size: 5,
		});

		return response.features.map((feature) => ({
			gid: feature.properties?.gid ?? '',
			label: feature.properties?.label ?? '',
			address: formatAddress({
				name: feature.properties?.name,
				street: feature.properties?.street,
				housenumber: feature.properties?.housenumber,
				locality: feature.properties?.locality,
				region: feature.properties?.regionA,
				postalcode: feature.properties?.postalcode,
			}),
		}));
	} catch (error) {
		console.error('Geocoding autocomplete error:', error);
		return [];
	}
}

export async function getPlaceDetails(gid: string): Promise<GeocodingResult | null> {
	try {
		const response = await geocodingApi.placeDetails({ ids: [gid] });

		const feature = response.features[0];
		if (!feature?.geometry?.coordinates) return null;

		return {
			label: feature.properties?.label ?? '',
			address: formatAddress({
				name: feature.properties?.name,
				street: feature.properties?.street,
				housenumber: feature.properties?.housenumber,
				locality: feature.properties?.locality,
				region: feature.properties?.regionA,
				postalcode: feature.properties?.postalcode,
			}),
			location: coordinatesToGeoPoint(feature.geometry.coordinates),
		};
	} catch (error) {
		console.error('Geocoding place details error:', error);
		return null;
	}
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
	try {
		const response = await geocodingApi.search({
			text: address,
			focusPointLat: SPRINGFIELD_MO_FOCUS.latitude,
			focusPointLon: SPRINGFIELD_MO_FOCUS.longitude,
			boundaryCountry: ['US'],
			layers: ['address', 'venue'],
			size: 1,
		});

		const feature = response.features[0];
		if (!feature?.geometry?.coordinates) return null;

		return {
			label: feature.properties?.label ?? '',
			address: formatAddress({
				name: feature.properties?.name,
				street: feature.properties?.street,
				housenumber: feature.properties?.housenumber,
				locality: feature.properties?.locality,
				region: feature.properties?.regionA,
				postalcode: feature.properties?.postalcode,
			}),
			location: coordinatesToGeoPoint(feature.geometry.coordinates),
		};
	} catch (error) {
		console.error('Geocoding search error:', error);
		return null;
	}
}
