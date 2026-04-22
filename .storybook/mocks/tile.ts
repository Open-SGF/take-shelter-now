import { fromGeojsonVt } from 'vt-pbf';
import { HttpResponse, http, type RequestHandler } from 'msw';

const TILE_EXTENT = 4096;

type VtPoint = [number, number];

type VtFeature = {
	type: 1 | 3;
	geometry: VtPoint[] | VtPoint[][];
	tags: Record<string, string>;
};

type GeojsonVtTile = {
	features: VtFeature[];
};

const createWaterLayer = (): GeojsonVtTile => {
	const ring: VtPoint[] = [
		[1024, 1024],
		[3072, 1024],
		[3072, 3072],
		[1024, 3072],
		[1024, 1024],
	];

	return {
		features: [
			{
				type: 3,
				geometry: [ring],
				tags: {},
			},
		],
	};
};

const createWaterNameLayer = (label: string): GeojsonVtTile => {
	return {
		features: [
			{
				type: 1,
				geometry: [[2048, 2048]],
				tags: {
					class: 'ocean',
					'name:latin': label,
				},
			},
		],
	};
};

const createMockTile = (label: string): Uint8Array => {
	const layerMap = {
		water: createWaterLayer(),
		water_name: createWaterNameLayer(label),
	};

	return fromGeojsonVt(layerMap as never, {
		version: 2,
		extent: TILE_EXTENT,
	});
};

export const tileHandlers: RequestHandler[] = [
	http.get('https://tiles.stadiamaps.com/data/openmaptiles/:z/:x/:y.pbf', ({ params }) => {
		const z = String(params.z ?? '0');
		const x = String(params.x ?? '0');
		const y = String(params.y ?? '0');
		const tile = createMockTile(`TEST ${z}/${x}/${y}`);
		const tileBuffer = tile.buffer.slice(tile.byteOffset, tile.byteOffset + tile.byteLength);

		return HttpResponse.arrayBuffer(tileBuffer, {
			headers: {
				'Content-Type': 'application/vnd.mapbox-vector-tile',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	}),
];
