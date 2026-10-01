<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { JsonLd, PageSeo } from '#lib/components/seo/index.js';
	import { DEFAULT_DESCRIPTION, SITE_TITLE, siteJsonLd, siteUrl } from '#lib/seo/index.js';
	import { getLocationStateContext } from '#lib/state/location-state.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const locationState = getLocationStateContext();
	const pageTitle = `Find Emergency Shelters Near You | ${SITE_TITLE}`;
	const imageUrl = siteUrl('/og.png');
	const jsonLd = siteJsonLd();

	$effect(() => {
		if (!locationState.hasLocation) {
			goto(resolve('/location'), { replace: true });
		}
	});
</script>

<PageSeo title={pageTitle} description={DEFAULT_DESCRIPTION} {imageUrl} />

<JsonLd value={jsonLd} />

{#if locationState.hasLocation}
	{@render children()}
{/if}
