<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { ShelterDetail } from '$lib/components/shelters';
	import { Button } from '$lib/components/ui/button';
	import { navigateToShelterList } from '$lib/shelters/navigation';

	let { data } = $props();
</script>

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
