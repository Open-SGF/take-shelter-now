<script lang="ts">
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { onMount } from 'svelte';
	import {
		ensureSheltersLoaded,
		hasLocation,
		sheltersLoadError,
		sheltersLoadStatus,
	} from '$lib/stores/global';

	onMount(() => {
		void ensureSheltersLoaded();
	});
</script>

<div class="p-4 pt-6">
	{#if $sheltersLoadStatus === 'error'}
		<div class="rounded-lg border border-[#c91c1c] bg-[#fff1f1] p-4">
			<h2 class="font-[DM_Sans] text-lg font-bold text-[#7a1111]">
				Shelter data is temporarily unavailable
			</h2>
			<p class="mt-1 font-[DM_Sans] text-sm text-[#7a1111]">
				{$sheltersLoadError ?? 'Please try again shortly.'}
			</p>
		</div>
	{:else if !$hasLocation}
		<GetLocation />
	{:else}
		<ShelterList />
	{/if}
</div>
