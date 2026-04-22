import { GeocodingApi } from '@stadiamaps/api';
import { fromGeoJSONPoint, type GeoPoint } from './point';

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

function formatLabel(name?: string | null, coarseLocation?: string | null): string {
	if (name && coarseLocation) {
		return `${name}, ${coarseLocation}`;
	}
	return name ?? coarseLocation ?? '';
}

export async function searchAddresses(query: string) {
	if (query.length < 3) {
		return [];
	}

	try {
		const response = await geocodingApi.autocompleteV2({
			text: query,
			focusPointLat: SPRINGFIELD_MO_FOCUS.latitude,
			focusPointLon: SPRINGFIELD_MO_FOCUS.longitude,
			boundaryCountry: ['US'],
			layers: ['address', 'poi'],
			size: 5,
		});

		return response.features.map((feature) => {
			const props = feature.properties;
			return {
				gid: props?.gid ?? '',
				label: formatLabel(props?.name, props?.coarseLocation),
				address: props?.formattedAddressLine ?? props?.name ?? '',
			};
		});
	} catch (error) {
		console.error('Geocoding autocomplete error:', error);
		return [];
	}
}

export async function getPlaceDetails(gid: string) {
	try {
		const response = await geocodingApi.placeDetailsV2({ ids: [gid] });

		const feature = response.features[0];
		if (!feature?.geometry?.coordinates) {
			return null;
		}

		const props = feature.properties;

		return {
			label: formatLabel(props?.name, props?.coarseLocation),
			address: props?.formattedAddressLine ?? props?.name ?? '',
			location: fromGeoJSONPoint(feature.geometry.coordinates),
		};
	} catch (error) {
		console.error('Geocoding place details error:', error);
		return null;
	}
}

export async function geocodeAddress(address: string) {
	try {
		const response = await geocodingApi.searchV2({
			text: address,
			focusPointLat: SPRINGFIELD_MO_FOCUS.latitude,
			focusPointLon: SPRINGFIELD_MO_FOCUS.longitude,
			boundaryCountry: ['US'],
			layers: ['address', 'poi'],
			size: 1,
		});

		const feature = response.features[0];
		if (!feature?.geometry?.coordinates) {
			return null;
		}

		const props = feature.properties;

		return {
			label: formatLabel(props?.name, props?.coarseLocation),
			address: props?.formattedAddressLine ?? props?.name ?? '',
			location: fromGeoJSONPoint(feature.geometry.coordinates),
		};
	} catch (error) {
		console.error('Geocoding search error:', error);
		return null;
	}
}
