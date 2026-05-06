<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { ShelterDetail } from '$lib/components/shelters';
	import { Button } from '$lib/components/ui/button';
	import { config } from '$lib/config';
	import { navigateToShelterList } from '$lib/shelters/navigation';

	let { data } = $props();

	let pageTitle = $derived(`${data.shelter.name} | Take Shelter Now`);
	let pageDescription = $derived(
		`${data.shelter.name} shelter at ${data.shelter.addressLine1}, ${data.shelter.city}, ${data.shelter.state}.`
	);
	let imageUrl = $derived(`${config.siteUrl}/shelters/${data.shelter.slug}/og.png`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${data.shelter.name} social share image`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>

<article class="p-4 pt-6" data-testid="shelter-detail">
	<Button
		variant="outline"
		size="sm"
		class="border-border-strong bg-surface text-text-secondary mb-4"
		data-testid="shelter-detail-back"
		onclick={navigateToShelterList}
	>
		<ArrowLeftIcon class="size-4" aria-hidden="true" />
		Back to list
	</Button>

	<ShelterDetail shelter={data.shelter} transitionId="shelter-{data.shelter.slug}" />
</article>
