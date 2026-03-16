import { HttpResponse, http, type RequestHandler } from 'msw';

const mockAddresses = [
	{
		gid: 'openstreetmap:address:way/123456',
		name: '123 Main St',
		coarseLocation: 'Springfield, MO',
		formattedAddressLine: '123 Main St, Springfield, MO 65801',
		coordinates: [-93.292299, 37.208957],
	},
	{
		gid: 'openstreetmap:address:way/234567',
		name: '415 E Commercial St',
		coarseLocation: 'Springfield, MO',
		formattedAddressLine: '415 E Commercial St, Springfield, MO 65803',
		coordinates: [-93.291234, 37.209123],
	},
	{
		gid: 'openstreetmap:address:way/345678',
		name: '301 E Walnut St',
		coarseLocation: 'Springfield, MO',
		formattedAddressLine: '301 E Walnut St, Springfield, MO 65806',
		coordinates: [-93.290876, 37.207654],
	},
	{
		gid: 'openstreetmap:address:way/567890',
		name: '322 E Walnut St',
		coarseLocation: 'Springfield, MO',
		formattedAddressLine: '322 E Walnut St, Springfield, MO 65806',
		coordinates: [-93.290123, 37.20789],
	},
];

function createAutocompleteResponse(query: string) {
	const filtered = mockAddresses.filter(
		(addr) =>
			addr.name.toLowerCase().includes(query.toLowerCase()) ||
			addr.formattedAddressLine.toLowerCase().includes(query.toLowerCase()),
	);

	return {
		type: 'FeatureCollection',
		geocoding: { attribution: 'https://stadiamaps.com/attribution/' },
		features: filtered.map((addr) => ({
			type: 'Feature',
			geometry: null,
			properties: {
				gid: addr.gid,
				name: addr.name,
				coarse_location: addr.coarseLocation,
				formatted_address_line: addr.formattedAddressLine,
				layer: 'address',
				precision: 'point',
			},
		})),
	};
}

function createPlaceDetailsResponse(gid: string) {
	const addr = mockAddresses.find((a) => a.gid === gid);
	if (!addr) {
		return {
			type: 'FeatureCollection',
			geocoding: { attribution: 'https://stadiamaps.com/attribution/' },
			features: [],
		};
	}

	return {
		type: 'FeatureCollection',
		geocoding: { attribution: 'https://stadiamaps.com/attribution/' },
		features: [
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: addr.coordinates },
				properties: {
					gid: addr.gid,
					name: addr.name,
					coarse_location: addr.coarseLocation,
					formatted_address_line: addr.formattedAddressLine,
					layer: 'address',
					precision: 'point',
				},
			},
		],
	};
}

export const geocodingHandlers: RequestHandler[] = [
	http.get('https://api.stadiamaps.com/geocoding/v2/autocomplete', ({ request }) => {
		const url = new URL(request.url);
		const query = url.searchParams.get('text') ?? '';
		return HttpResponse.json(createAutocompleteResponse(query));
	}),
	http.get('https://api.stadiamaps.com/geocoding/v2/place_details', ({ request }) => {
		const url = new URL(request.url);
		const idsParam = url.searchParams.get('ids');
		const gid = idsParam?.split(',')[0] ?? '';
		return HttpResponse.json(createPlaceDetailsResponse(gid));
	}),
];
