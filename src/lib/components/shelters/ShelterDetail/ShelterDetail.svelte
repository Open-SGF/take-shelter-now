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
	};

	let { shelter }: ShelterDetailProps = $props();

	const positiveBadgeClass =
		'h-5 gap-1 border-emerald-200 bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-800';
	const neutralBadgeClass =
		'h-5 gap-1 border-slate-200 bg-slate-50 px-2 text-[11px] font-semibold text-slate-700';
	const warningBadgeClass =
		'h-5 gap-1 border-amber-200 bg-amber-50 px-2 text-[11px] font-semibold text-amber-800';
	const positivePillClass = 'border-emerald-200 bg-emerald-100 text-emerald-800';
	const neutralPillClass = 'border-slate-200 bg-slate-100 text-slate-600';

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

<div class="w-full rounded-2xl p-5" data-testid="shelter-detail-card">
	<h1 class="text-2xl leading-tight font-black sm:text-3xl" data-testid="shelter-detail-name">
		{shelter.name}
	</h1>
	<div class="mt-2 flex flex-wrap items-center gap-2">
		<ShelterCategoryBadge category={shelter.category} data-testid="shelter-detail-category" />
		<Badge variant="outline" class={availableHoursBadgeClass} data-testid="shelter-detail-status">
			{availableHoursSummary.statusLabel}
		</Badge>
	</div>
	<p class="mt-1 text-xs font-medium text-slate-500" data-testid="shelter-detail-last-updated">
		Last updated: {lastVerifiedDate}
	</p>

	<div class="mt-5 border-t border-slate-200 pt-5" data-testid="shelter-detail-core-info">
		<div class="space-y-4">
			<div class="flex items-start gap-3">
				<div
					class="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600"
				>
					<MapPinIcon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-slate-500">Address</p>
					<p class="text-base leading-snug text-slate-900" data-testid="shelter-detail-address">
						{fullAddress}
					</p>
					<DirectionsAction {shelter} />
				</div>
			</div>

			<div class="flex items-start gap-3">
				<div
					class="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600"
				>
					<Clock3Icon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<p class="text-sm font-medium text-slate-500">Location hours</p>
					{#if availableHoursSummary.scheduleLines.length > 0}
						<ul
							class="mt-1 space-y-0.5 text-base leading-snug text-slate-900"
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
					class="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
				>
					<UsersIcon class="size-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<p class="text-sm font-medium text-slate-500">Capacity</p>
					<p class="text-base leading-snug text-slate-900">{capacity}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-5 border-t border-slate-200 pt-5" data-testid="shelter-detail-operational">
		<div class="flex items-start gap-3">
			<div
				class="mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
			>
				<InfoIcon class="size-5" aria-hidden="true" />
			</div>
			<div class="min-w-0">
				<p class="text-sm font-medium text-slate-500">Special instructions</p>
				<p class="text-base leading-snug text-slate-900">{specialInstructions}</p>
			</div>
		</div>
	</div>

	<div class="mt-5 border-t border-slate-200 pt-5" data-testid="shelter-detail-accessibility">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${petsPillClass}`}
				>
					<PawPrintIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-xs font-semibold tracking-wide text-slate-700 uppercase">
					Pets {petsAllowed}
				</p>
			</div>
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${accessibilityPillClass}`}
				>
					<AccessibilityIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-xs font-semibold tracking-wide text-slate-700 uppercase">
					Access {wheelchairAccess}
				</p>
			</div>
			<div class="flex flex-col items-center gap-2 text-center">
				<div
					class={`flex size-[4.5rem] items-center justify-center rounded-full border ${backupPowerPillClass}`}
				>
					<BatteryChargingIcon class="size-8" aria-hidden="true" />
				</div>
				<p class="text-xs font-semibold tracking-wide text-slate-700 uppercase">
					Backup power {backupPower}
				</p>
			</div>
		</div>
	</div>
</div>
