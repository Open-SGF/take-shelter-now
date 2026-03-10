<script lang="ts">
	export let title: string = 'Central High School';
	export let distance: number | null = null;
	export let address: string = '423 East Central, Springfield, MO 65802';
	export let onclick: (() => void) | undefined = undefined;

	export let capacity: number | null = null;
	export let category: string | null = null;
	export let shelterType: string | null = null;
	export let accessibility: string | null = null;
	export let petFriendly: string | null = null;
	export let hasBackupPower: string | null = null;
	export let hoursAsShelter: string | null = null;

	$: distanceValue = distance !== null && distance < 1 ? Math.round(distance * 5280) : distance !== null ? distance.toFixed(1) : null;
	$: unit = distance !== null && distance < 1 ? 'Feet Away' : 'Miles Away';

	function chip(label: string, value: string | null) {
		if (!value || value === 'No' || value === '') return null;
		return label;
	}

	$: chips = [
		chip('Accessible', accessibility),
		chip('Pet Friendly', petFriendly),
		chip('Backup Power', hasBackupPower),
	].filter(Boolean) as string[];
</script>

<button
	type="button"
	class="shelter-card mb-4 flex w-full cursor-pointer flex-col rounded-2xl text-left"
	on:click={onclick}
>
	<!-- Left accent bar -->
	<div class="flex w-full flex-row">
		<div class="accent-bar rounded-l-2xl"></div>

		{#if distance !== null}
			<div class="distance-block flex flex-col items-center justify-center px-4 py-4 text-center">
				<p class="font-[DM_Sans] text-[22px] leading-[18px] font-black text-[#c91c1c]">{distanceValue}</p>
				<p class="font-[DM_Sans] text-[12px] leading-[18px] text-[#c91c1c]">{unit}</p>
			</div>
		{/if}

		<div class="flex flex-1 flex-col justify-center p-4 {distance !== null ? 'pl-2' : ''}">
			<h2 class="text-[16px] font-extrabold leading-tight tracking-tight">{title}</h2>
			<p class="font-[DM_Sans] text-[12px] font-normal text-gray-400">{address}</p>

			<div class="mt-2 flex flex-wrap gap-1.5">
				{#if category}
					<span class="flair flair-blue">{category}</span>
				{/if}
				{#if shelterType}
					<span class="flair flair-red">{shelterType}</span>
				{/if}
				{#if capacity && capacity > 0}
					<span class="flair flair-green">Cap: {capacity}</span>
				{/if}
				{#if hoursAsShelter}
					<span class="flair flair-purple">{hoursAsShelter}</span>
				{/if}
			</div>
		</div>
	</div>

	{#if chips.length > 0}
		<div class="flex flex-wrap gap-1.5 px-4 pb-3 pt-0">
			{#each chips as c}
				<span class="chip">{c}</span>
			{/each}
		</div>
	{/if}
</button>

<style>
	.shelter-card {
		background: #ffffff;
		border: 1px solid #ebebeb;
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.06),
			0 1px 2px rgba(0, 0, 0, 0.04);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease;
		position: relative;
		overflow: hidden;
	}

	.shelter-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(8, 146, 210, 0.04) 0%, transparent 60%);
		opacity: 0;
		transition: opacity 0.18s ease;
		pointer-events: none;
	}

	.shelter-card:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.1),
			0 2px 6px rgba(0, 0, 0, 0.06);
		border-color: #0892d2;
	}

	.shelter-card:hover::before {
		opacity: 1;
	}

	.shelter-card:active {
		transform: translateY(0px);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.06),
			0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.accent-bar {
		width: 4px;
		min-height: 100%;
		background: linear-gradient(180deg, #0892d2, #c91c1c);
		flex-shrink: 0;
		transition: width 0.18s ease;
	}

	.shelter-card:hover .accent-bar {
		width: 5px;
	}

	.distance-block {
		min-width: 64px;
	}

	.flair {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.01em;
		border: 2px solid transparent;
	}

	.flair-blue {
		background: #dbeafe;
		color: #1d4ed8;
		border-color: #bfdbfe;
	}

	.flair-red {
		background: #fee2e2;
		color: #b91c1c;
		border-color: #fecaca;
	}

	.flair-green {
		background: #dcfce7;
		color: #15803d;
		border-color: #bbf7d0;
	}

	.flair-purple {
		background: #ede9fe;
		color: #6d28d9;
		border-color: #ddd6fe;
	}

	.chip {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		background: #e0f0f9;
		color: #0892d2;
		border: 1px solid #bde3f5;
		transition: background 0.15s ease;
	}

	.shelter-card:hover .chip {
		background: #cce8f6;
	}
</style>
