<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { JsonLd, PageSeo } from '$lib/components/seo';
	import { DEFAULT_DESCRIPTION, SITE_TITLE, siteJsonLd, siteUrl } from '$lib/seo';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const locationState = getLocationStateContext();
	const pageTitle = `Find Emergency Shelters Near You | ${SITE_TITLE}`;
	const imageUrl = siteUrl('/og.png');
	const jsonLd = siteJsonLd();

	$effect(() => {
		if (!locationState.hasLocation) {
			goto(resolve('/location/'), { replaceState: true });
		}
	});
</script>

<PageSeo title={pageTitle} description={DEFAULT_DESCRIPTION} {imageUrl} />
<JsonLd value={jsonLd} />

{#if locationState.hasLocation}
	{@render children()}
{/if}
