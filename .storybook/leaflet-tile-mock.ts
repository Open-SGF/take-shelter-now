import { fromGeojsonVt } from 'vt-pbf';

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

export const createMockTile = (label: string): Uint8Array => {
	const layerMap = {
		water: createWaterLayer(),
		water_name: createWaterNameLayer(label),
	};

	return fromGeojsonVt(layerMap as never, {
		version: 2,
		extent: TILE_EXTENT,
	});
};
