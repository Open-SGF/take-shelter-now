<script lang="ts">
	// Props
	export let title: string = 'Central High School';
	export let distance: number | null = null;
	export let address: string = '423 East Central, Springfield, MO 65802';
	export let available: 'Available' | 'Full' | null = null;
	export let onclick: (() => void) | undefined = undefined;

	$: distanceValue = distance !== null && distance < 1 ? Math.round(distance * 5280) : distance !== null ? distance.toFixed(1) : null;
	$: unit = distance !== null && distance < 1 ? 'Feet Away' : 'Miles Away';
</script>

<button
	type="button"
	class="mb-4 flex w-full cursor-pointer flex-row rounded-2xl bg-[#f4f4f4] text-left shadow-md transition-colors hover:bg-[#e8e8e8]"
	on:click={onclick}
>
	{#if distance !== null}
		<!-- Distance view -->
		<div class="flex flex-col items-center justify-center p-4 text-center">
			<p class="font-[DM_Sans] text-[22px] leading-[18px] font-black text-[#c91c1c]">
				{distanceValue}
			</p>
			<p class="font-[DM_Sans] text-[12px] leading-[18px] text-[#c91c1c]">{unit}</p>
		</div>
	{/if}

	<!-- Text view -->
	<div class="flex flex-1 items-start justify-between p-4">
		<div>
			<h2 class="text-[16px] font-extrabold">{title}</h2>
			<p class="font-[DM_Sans] text-[12px] font-normal">{address}</p>
		</div>
		{#if available !== null}
			<span
				class="ml-3 mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold
					{available === 'Full' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}"
			>
				{available}
			</span>
		{/if}
	</div>
</button>
