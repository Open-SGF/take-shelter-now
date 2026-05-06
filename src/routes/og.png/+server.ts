import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from './$types';
import HomeOgImage from '$lib/components/social/HomeOgImage.svelte';
import { config } from '$lib/config';

export const prerender = true;

export const GET: RequestHandler = () => {
	return new ImageResponse(
		HomeOgImage,
		{
			width: 1200,
			height: 630,
		},
		{
			logoSrc: `${config.siteUrl}/images/logo-light.svg`,
		},
	);
};
