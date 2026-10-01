<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { JsonLd, PageSeo } from '#lib/components/seo/index.js';
	import { ShelterDetail } from '#lib/components/shelters/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { SITE_TITLE, shelterPlaceJsonLd, siteUrl } from '#lib/seo/index.js';
	import { formatShelterAddress } from '#lib/shelters/presentation.js';
	import { navigateToShelterList } from '#lib/shelters/navigation.js';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let shelterAddress = $derived(formatShelterAddress(data.shelter));
	let pageTitle = $derived(`${data.shelter.name} | ${SITE_TITLE}`);
	let pageDescription = $derived(`${data.shelter.name} shelter at ${shelterAddress}.`);
	let imageUrl = $derived(siteUrl(`/shelters/${data.shelter.slug}/og.png`));
	let placeJsonLd = $derived(shelterPlaceJsonLd(data.shelter));
</script>

<PageSeo
	title={pageTitle}
	description={pageDescription}
	{imageUrl}
	imageAlt={`${data.shelter.name} social share image`}
	ogType="article"
/>
<JsonLd value={placeJsonLd} />

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
