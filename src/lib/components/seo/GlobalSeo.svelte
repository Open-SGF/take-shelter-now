<script lang="ts">
	import { page } from '$app/state';
	import { config } from '$lib/config';
	import { SITE_TITLE, siteUrl } from '$lib/seo';

	const robotsContent = config.allowIndexing ? undefined : 'noindex, nofollow';
	let canonicalUrl = $derived(siteUrl(page.url.pathname));
</script>

<svelte:head>
	<meta property="og:site_name" content={SITE_TITLE} />
	<meta property="og:url" content={canonicalUrl} />
	<link rel="canonical" href={canonicalUrl} />
	{#if robotsContent}
		<meta name="robots" content={robotsContent} />
	{/if}
</svelte:head>
