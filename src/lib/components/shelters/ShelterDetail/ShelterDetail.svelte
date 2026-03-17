<script lang="ts">
	import AccessibilityIcon from '@lucide/svelte/icons/accessibility';
	import BatteryChargingIcon from '@lucide/svelte/icons/battery-charging';
	import Clock3Icon from '@lucide/svelte/icons/clock-3';
	import InfoIcon from '@lucide/svelte/icons/info';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PawPrintIcon from '@lucide/svelte/icons/paw-print';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { Badge } from '$lib/components/ui/badge';
	import { ShelterCategoryBadge } from '$lib/components/shelters';
	import { summarizeShelterHours } from '$lib/shelters/hours-presentation';
	import {
		formatLastVerifiedDate,
		formatShelterAddress,
		formatShelterBoolean,
		formatShelterCapacity,
		formatSpecialInstructions,
	} from '$lib/shelters/presentation';
	import type { Shelter } from '$lib/shelters/types';
	import DirectionsAction from './DirectionsAction.svelte';

	type ShelterDetailProps = {
		shelter: Shelter;
		transitionId?: string;
	};

	let { shelter, transitionId }: ShelterDetailProps = $props();

	const positiveBadgeClass =
		'h-5 gap-1 border-success-border bg-success-bg px-2 text-[11px] font-semibold text-success-text';
	const neutralBadgeClass =
		'h-5 gap-1 border-border bg-muted px-2 text-[11px] font-semibold text-text-secondary';
	const warningBadgeClass =
		'h-5 gap-1 border-warning-border bg-warning-bg px-2 text-[11px] font-semibold text-warning-text';
	const positivePillClass = 'border-success-border bg-success-bg-alt text-success-text';
	const neutralPillClass = 'border-border bg-muted text-text-tertiary';

	let fullAddress = $derived(formatShelterAddress(shelter));
	let petsAllowed = $derived(
		formatShelterBoolean(shelter.petFriendly, {
			yes: 'Allowed',
			no: 'Not allowed',
			unknown: 'Unknown',
		}),
	);
	let wheelchairAccess = $derived(
		formatShelterBoolean(shelter.accessibility, {
			yes: 'Available',
			no: 'Not available',
			unknown: 'Unknown',
		}),
	);
	let backupPower = $derived(
		formatShelterBoolean(shelter.hasBackupPower, {
			yes: 'Available',
			no: 'Not available',
			unknown: 'Unknown',
		}),
	);
	let availableHoursSummary = $derived(summarizeShelterHours(shelter.hours));
	let capacity = $derived(formatShelterCapacity(shelter.capacity));
	let specialInstructions = $derived(formatSpecialInstructions(shelter.specialInstructions));
	let lastVerifiedDate = $derived(formatLastVerifiedDate(shelter.lastUpdated));
	let availableHoursBadgeClass = $derived(
		availableHoursSummary.status === 'open'
			? positiveBadgeClass
			: availableHoursSummary.status === 'closed'
				? warningBadgeClass
				: neutralBadgeClass,
	);

	let petsPillClass = $derived(shelter.petFriendly === true ? positivePillClass : neutralPillClass);
	let accessibilityPillClass = $derived(
		shelter.accessibility === true ? positivePillClass : neutralPillClass,
	);
	let backupPowerPillClass = $derived(
		shelter.hasBackupPower === true ? positivePillClass : neutralPillClass,
	);
</script>

<div
	class="w-full rounded-2xl p-5"
	data-testid="shelter-detail-card"
	style:view-transition-name={transitionId}
>
	<h1 class="text-2xl leading-tight font-black sm:text-3xl" data-testid="shelter-detail-name">
		{shelter.name}
	</h1>
	<div class="mt-2 flex flex-wrap items-center gap-2">
		<ShelterCategoryBadge category={shelter.category} data-testid="shelter-detail-category" />
		<Badge variant="outline" class={availableHoursBadgeClass} data-testid="shelter-detail-status">
			<Clock3Icon class="size-3.5" aria-hidden="true" />
			{availableHoursSummary.statusLabel}
		</Badge>
	</div>
	<p
		class="text-muted-foreground mt-1 text-xs font-medium"
		data-testid="shelter-detail-last-updated"
	>
		Last updated: {lastVerifiedDate}
	</p>

	<div class="border-border mt-5 border-t pt-5" data-testid="shelter-detail-core-info">
		<div class="space-y-4">
			<div class="flex items-start gap-3">
				<div
					class="bg-highlight-bg text-highlight-text mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full"
				>
					<MapPinIcon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-muted-foreground text-sm font-medium">Address</p>
					<p class="text-foreground text-base leading-snug" data-testid="shelter-detail-address">
						{fullAddress}
					</p>
					<DirectionsAction {shelter} />
				</div>
			</div>

			<div class="flex items-start gap-3">
				<div
					class="bg-highlight-bg text-highlight-text mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full"
				>
					<Clock3Icon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<p class="text-muted-foreground text-sm font-medium">Location hours</p>
					{#if availableHoursSummary.scheduleLines.length > 0}
						<ul
							class="text-foreground mt-1 space-y-0.5 text-base leading-snug"
							data-testid="shelter-detail-hours-lines"
						>
							{#each availableHoursSummary.scheduleLines as line (line)}
								<li>{line}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>

			<div class="flex items-start gap-3">
				<div
					class="bg-muted text-text-tertiary mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full"
				>
					<UsersIcon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<p class="text-muted-foreground text-sm font-medium">Capacity</p>
					<p class="text-foreground text-base leading-snug">{capacity}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="border-border mt-5 border-t pt-5" data-testid="shelter-detail-operational">
		<div class="flex items-start gap-3">
			<div
				class="bg-muted text-text-tertiary mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full"
			>
				<InfoIcon class="size-5" aria-hidden="true" />
			</div>
			<div class="min-w-0">
				<p class="text-muted-foreground text-sm font-medium">Special instructions</p>
				<p class="text-foreground text-base leading-snug">{specialInstructions}</p>
			</div>
		</div>
	</div>

	<div class="border-border mt-5 border-t pt-5" data-testid="shelter-detail-accessibility">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${petsPillClass}`}
				>
					<PawPrintIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-text-secondary text-xs font-semibold tracking-wide uppercase">
					Pets {petsAllowed}
				</p>
			</div>
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${accessibilityPillClass}`}
				>
					<AccessibilityIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-text-secondary text-xs font-semibold tracking-wide uppercase">
					Access {wheelchairAccess}
				</p>
			</div>
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${backupPowerPillClass}`}
				>
					<BatteryChargingIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-text-secondary text-xs font-semibold tracking-wide uppercase">
					Backup power {backupPower}
				</p>
			</div>
		</div>
	</div>
</div>
