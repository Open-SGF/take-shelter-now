import { HttpResponse, http, type RequestHandler } from 'msw';

const mockAddresses = [
	{
		gid: 'openstreetmap:address:way/123456',
		label: '123 Main St, Springfield, MO',
		address: '123 Main St, Springfield, MO, 65801',
		coordinates: [-93.292299, 37.208957],
	},
	{
		gid: 'openstreetmap:address:way/234567',
		label: '415 E Commercial St, Springfield, MO',
		address: '415 E Commercial St, Springfield, MO, 65803',
		coordinates: [-93.291234, 37.209123],
	},
	{
		gid: 'openstreetmap:address:way/345678',
		label: '301 E Walnut St, Springfield, MO',
		address: '301 E Walnut St, Springfield, MO, 65806',
		coordinates: [-93.290876, 37.207654],
	},
	{
		gid: 'openstreetmap:address:way/567890',
		label: '322 E Walnut St, Springfield, MO',
		address: '322 E Walnut St, Springfield, MO, 65806',
		coordinates: [-93.290123, 37.20789],
	},
];

function createAutocompleteResponse(query: string) {
	const filtered = mockAddresses.filter(
		(addr) =>
			addr.label.toLowerCase().includes(query.toLowerCase()) ||
			addr.address.toLowerCase().includes(query.toLowerCase()),
	);

	return {
		type: 'FeatureCollection',
		geocoding: { attribution: 'https://stadiamaps.com/attribution/' },
		features: filtered.map((addr) => ({
			type: 'Feature',
			geometry: { type: 'Point', coordinates: addr.coordinates },
			properties: {
				gid: addr.gid,
				label: addr.label,
				name: addr.label.split(',')[0],
				street: addr.label.split(',')[0],
				housenumber: addr.label.split(' ')[0],
				locality: 'Springfield',
				regionA: 'MO',
				postalcode: addr.address.match(/\d{5}/)?.[0] ?? '65801',
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
					label: addr.label,
					name: addr.label.split(',')[0],
					street: addr.label.split(',')[0],
					housenumber: addr.label.split(' ')[0],
					locality: 'Springfield',
					regionA: 'MO',
					postalcode: addr.address.match(/\d{5}/)?.[0] ?? '65801',
				},
			},
		],
	};
}

export const geocodingHandlers: RequestHandler[] = [
	http.get('https://api.stadiamaps.com/geocoding/v1/autocomplete', ({ request }) => {
		const url = new URL(request.url);
		const query = url.searchParams.get('text') ?? '';
		return HttpResponse.json(createAutocompleteResponse(query));
	}),
	http.get('https://api.stadiamaps.com/geocoding/v1/place', ({ request }) => {
		const url = new URL(request.url);
		const idsParam = url.searchParams.get('ids');
		const gid = idsParam?.split(',')[0] ?? '';
		return HttpResponse.json(createPlaceDetailsResponse(gid));
	}),
];
