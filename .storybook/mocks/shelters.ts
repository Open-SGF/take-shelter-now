import { HttpResponse, http, delay, type RequestHandler } from 'msw';
import type { Shelter, ShelterCategory } from '../../src/lib/shelters/types';

const categories: ShelterCategory[] = ['school', 'church', 'other'];

const buildShelter = (index: number): Shelter => ({
	name: `Shelter ${index + 1}`,
	slug: `shelter-${index + 1}`,
	addressLine1: `${400 + index} Main St`,
	addressLine2: '',
	city: 'Springfield',
	state: 'MO',
	zip: '65802',
	latitude: 37.2 + index * 0.005,
	longitude: -93.29 - index * 0.005,
	photoUrls: [],
	category: categories[index % 3],
	petFriendly: index % 2 === 0,
	accessibility: index % 3 === 0,
	hasBackupPower: index % 4 === 0,
});

const readyShelters = Array.from({ length: 14 }, (_, index) => buildShelter(index));

export const sheltersHandlers: Record<string, RequestHandler> = {
	loading: http.get('/shelters.json', async () => {
		await delay('infinite');
		return HttpResponse.json([]);
	}),
	ready: http.get('/shelters.json', () => {
		return HttpResponse.json(readyShelters);
	}),
	empty: http.get('/shelters.json', () => {
		return HttpResponse.json([]);
	}),
	error: http.get('/shelters.json', () => {
		return new HttpResponse(null, { status: 500 });
	}),
};
