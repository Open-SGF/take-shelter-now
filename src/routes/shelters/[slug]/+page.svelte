<script lang="ts">
	let { data } = $props();
</script>

<article class="p-4 pt-6" data-testid="shelter-detail">
	<h1 class="text-2xl font-black">{data.shelter.name}</h1>
	<p class="mt-2 font-[DM_Sans] text-sm">
		{data.shelter.addressLine1}
		{data.shelter.addressLine2 ? `, ${data.shelter.addressLine2}` : ''},
		{data.shelter.city},
		{data.shelter.state}
		{data.shelter.zip}
	</p>
	{#if data.shelter.specialInstructions}
		<p class="mt-4 font-[DM_Sans] text-sm">{data.shelter.specialInstructions}</p>
	{/if}
</article>
