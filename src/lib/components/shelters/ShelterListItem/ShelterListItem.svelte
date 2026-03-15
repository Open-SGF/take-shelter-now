<script lang="ts">
	import { resolve } from '$app/paths';
	import AccessibilityIcon from '@lucide/svelte/icons/accessibility';
	import BatteryChargingIcon from '@lucide/svelte/icons/battery-charging';
	import PawPrintIcon from '@lucide/svelte/icons/paw-print';
	import { Badge } from '$lib/components/ui/badge';
	import * as Item from '$lib/components/ui/item';
	import { ShelterCategoryBadge } from '$lib/components/shelters';
	import {
		formatShelterAddress,
		formatShelterDistance,
		getAvailableAmenities,
		type ShelterAmenity,
	} from '$lib/shelters/presentation';
	import type { Shelter } from '$lib/shelters/types';

	type ShelterListItemProps = {
		shelter: Shelter;
		distanceMiles?: number | null;
	};

	let { shelter, distanceMiles }: ShelterListItemProps = $props();

	const amenityMeta: Record<ShelterAmenity, { icon: typeof PawPrintIcon; label: string }> = {
		petsAllowed: { icon: PawPrintIcon, label: 'Pets allowed' },
		backupPower: { icon: BatteryChargingIcon, label: 'Backup power' },
		accessibility: { icon: AccessibilityIcon, label: 'Accessible' },
	};

	let address = $derived(formatShelterAddress(shelter));
	let amenities = $derived(getAvailableAmenities(shelter));
	let distanceLabel = $derived(formatShelterDistance(distanceMiles));
</script>

<Item.Root
	variant="outline"
	size="sm"
	class="bg-card w-full rounded-xl shadow-sm"
	data-testid="shelter-list-item"
>
	{#snippet child({ props })}
		{#if shelter.slug}
			<a
				{...props}
				href={resolve('/shelters/[slug]', { slug: shelter.slug })}
				style:view-transition-name="shelter-{shelter.slug}"
			>
				<Item.Content class="gap-1.5">
					<div class="flex items-start justify-between gap-3">
						<ShelterCategoryBadge
							category={shelter.category}
							data-testid="shelter-list-item-category"
						/>
						<Item.Actions class="shrink-0">
							{#if distanceLabel}
								<span
									class="text-muted-foreground text-xs font-semibold"
									data-testid="shelter-list-item-distance">{distanceLabel}</span
								>
							{/if}
						</Item.Actions>
					</div>

					<Item.Title class="text-sm leading-tight font-bold" data-testid="shelter-list-item-name"
						>{shelter.name}</Item.Title
					>
					<Item.Description
						class="line-clamp-1 text-xs text-slate-600"
						data-testid="shelter-list-item-address">{address}</Item.Description
					>

					{#if amenities.length > 0}
						<div class="flex flex-wrap gap-2" data-testid="shelter-list-item-amenities">
							{#each amenities as amenity (amenity)}
								{@const amenityDetails = amenityMeta[amenity]}
								{@const AmenityIcon = amenityDetails.icon}
								<Badge
									variant="outline"
									class="h-5 gap-1 border-emerald-200 bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-800"
								>
									<AmenityIcon class="size-3.5" aria-hidden="true" />
									{amenityDetails.label}
								</Badge>
							{/each}
						</div>
					{/if}
				</Item.Content>
			</a>
		{:else}
			<div {...props}>
				<Item.Content class="gap-1.5">
					<div class="flex items-start justify-between gap-3">
						<ShelterCategoryBadge
							category={shelter.category}
							data-testid="shelter-list-item-category"
						/>
						<Item.Actions class="shrink-0">
							{#if distanceLabel}
								<span
									class="text-muted-foreground text-xs font-semibold"
									data-testid="shelter-list-item-distance">{distanceLabel}</span
								>
							{/if}
						</Item.Actions>
					</div>

					<Item.Title class="text-sm leading-tight font-bold" data-testid="shelter-list-item-name"
						>{shelter.name}</Item.Title
					>
					<Item.Description
						class="line-clamp-1 text-xs text-slate-600"
						data-testid="shelter-list-item-address">{address}</Item.Description
					>

					{#if amenities.length > 0}
						<div class="flex flex-wrap gap-2" data-testid="shelter-list-item-amenities">
							{#each amenities as amenity (amenity)}
								{@const amenityDetails = amenityMeta[amenity]}
								{@const AmenityIcon = amenityDetails.icon}
								<Badge
									variant="outline"
									class="h-5 gap-1 border-emerald-200 bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-800"
								>
									<AmenityIcon class="size-3.5" aria-hidden="true" />
									{amenityDetails.label}
								</Badge>
							{/each}
						</div>
					{/if}
				</Item.Content>
			</div>
		{/if}
	{/snippet}
</Item.Root>
