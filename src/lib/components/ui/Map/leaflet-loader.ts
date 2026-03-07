import type * as Leaflet from 'leaflet';

const resolveLeafletModule = (
	module: typeof Leaflet & { default?: typeof Leaflet },
): typeof Leaflet => {
	if (!module.default) {
		throw new Error('Leaflet module did not expose a default export');
	}

	return module.default;
};

export const loadLeaflet = async (): Promise<typeof Leaflet> => {
	const [leafletModule] = await Promise.all([
		import('leaflet'),
		import('maplibre-gl'),
		import('@maplibre/maplibre-gl-leaflet'),
	]);

	return resolveLeafletModule(leafletModule);
};
