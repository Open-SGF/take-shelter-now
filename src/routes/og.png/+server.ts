import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from './$types';
import OgImage from '$lib/components/social/OgImage.svelte';

export const prerender = true;

export const GET: RequestHandler = () => {
	return new ImageResponse(OgImage, {
		width: 1200,
		height: 630,
	});
};
