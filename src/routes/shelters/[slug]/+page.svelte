<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { ShelterDetail } from '$lib/components/shelters';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<article class="p-4 pt-6 pb-32" data-testid="shelter-detail">
	<Button
		href={resolve('/')}
		variant="outline"
		size="sm"
		class="mb-4 border-slate-300 bg-white text-slate-700"
		data-testid="shelter-detail-back"
	>
		<ArrowLeftIcon class="size-4" aria-hidden="true" />
		Back to list
	</Button>

	<ShelterDetail shelter={data.shelter} />
</article>
