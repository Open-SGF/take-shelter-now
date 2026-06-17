<script lang="ts">
	import { DEFAULT_IMAGE_ALT } from '$lib/seo';

	type Props = {
		title: string;
		description: string;
		imageUrl: string;
		imageAlt?: string;
		ogType?: 'website' | 'article';
	};

	let {
		title,
		description,
		imageUrl,
		imageAlt = DEFAULT_IMAGE_ALT,
		ogType = 'website',
	}: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
