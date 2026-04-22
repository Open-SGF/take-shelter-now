<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { Button } from '$lib/components/ui/button';
	import { GetLocation } from '$lib/components/shelters';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';

	const locationState = getLocationStateContext();

	const isEditMode = $derived(locationState.hasLocation);

	function handleLocationConfirmed() {
		goto(resolve('/'), { replaceState: true });
	}
</script>

<article class="p-4 pt-6 pb-32">
	{#if isEditMode}
		<Button
			href={resolve('/')}
			variant="outline"
			size="sm"
			class="border-border-strong bg-surface text-text-secondary mb-4"
			data-testid="location-back"
		>
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Back
		</Button>
	{/if}

	<GetLocation onLocationConfirmed={handleLocationConfirmed} />
</article>
