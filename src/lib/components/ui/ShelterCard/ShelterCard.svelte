<script lang="ts">
	import { resolve } from '$app/paths';

	interface ShelterCardProps {
		title?: string;
		distance?: number;
		address?: string;
		slug?: string | null;
	}

	let {
		title = 'Central High School',
		distance = 0.4,
		address = '423 East Central, Springfield, MO 65802',
		slug = null,
	}: ShelterCardProps = $props();

	let distanceValue = $derived(distance < 1 ? Math.round(distance * 5280) : distance.toFixed(1));
	let unit = $derived(distance < 1 ? 'Feet Away' : 'Miles Away');
</script>

{#if slug}
	<a class="mb-4 block" href={resolve('/shelters/[slug]', { slug })}>
		<div class="flex flex-row rounded-2xl bg-[#f4f4f4] shadow-md">
			<div class="flex flex-col items-center justify-center p-4 text-center">
				<p class="font-[DM_Sans] text-[22px] leading-[18px] font-black text-[#c91c1c]">
					{distanceValue}
				</p>
				<p class="font-[DM_Sans] text-[12px] leading-[18px] text-[#c91c1c]">{unit}</p>
			</div>

			<div class="p-4">
				<h2 class="text-[16px] font-extrabold">{title}</h2>
				<p class="font-[DM_Sans] text-[12px] font-normal">{address}</p>
			</div>
		</div>
	</a>
{:else}
	<div class="mb-4 flex flex-row rounded-2xl bg-[#f4f4f4] shadow-md">
		<div class="flex flex-col items-center justify-center p-4 text-center">
			<p class="font-[DM_Sans] text-[22px] leading-[18px] font-black text-[#c91c1c]">
				{distanceValue}
			</p>
			<p class="font-[DM_Sans] text-[12px] leading-[18px] text-[#c91c1c]">{unit}</p>
		</div>

		<div class="p-4">
			<h2 class="text-[16px] font-extrabold">{title}</h2>
			<p class="font-[DM_Sans] text-[12px] font-normal">{address}</p>
		</div>
	</div>
{/if}
