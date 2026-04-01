import type * as Leaflet from 'leaflet';
import type { StyleSpecification } from 'maplibre-gl';
import type { MapTheme } from './types';

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
		import('maplibre-gl/dist/maplibre-gl.css'),
		import('@maplibre/maplibre-gl-leaflet'),
	]);

	return resolveLeafletModule(leafletModule);
};

export const loadBasemapStyle = async (theme: MapTheme): Promise<StyleSpecification> => {
	const module =
		theme === 'dark'
			? await import('./map-styles-dark.json')
			: await import('./map-styles-light.json');
	return module.default as unknown as StyleSpecification;
};
