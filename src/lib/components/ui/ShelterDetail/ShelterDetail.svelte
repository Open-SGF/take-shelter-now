<script lang="ts">
	import AccessibilityIcon from '@lucide/svelte/icons/accessibility';
	import BatteryChargingIcon from '@lucide/svelte/icons/battery-charging';
	import PawPrintIcon from '@lucide/svelte/icons/paw-print';
	import { Badge } from '$lib/components/ui/badge';
	import { summarizeShelterHours } from '$lib/shelters/hours-presentation';
	import {
		formatLastVerifiedDate,
		formatShelterAddress,
		formatShelterBoolean,
		formatShelterCapacity,
		formatShelterCategory,
		formatSpecialInstructions,
	} from '$lib/shelters/presentation';
	import type { Shelter } from '$lib/shelters/types';

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

	let fullAddress = $derived(formatShelterAddress(shelter));
	let category = $derived(formatShelterCategory(shelter.category));
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

	let petsBadgeClass = $derived(
		shelter.petFriendly === true ? positiveBadgeClass : neutralBadgeClass,
	);
	let accessibilityBadgeClass = $derived(
		shelter.accessibility === true ? positiveBadgeClass : neutralBadgeClass,
	);
	let backupPowerBadgeClass = $derived(
		shelter.hasBackupPower === true ? positiveBadgeClass : neutralBadgeClass,
	);
	let availableHoursBadgeClass = $derived(
		availableHoursSummary.status === 'open'
			? positiveBadgeClass
			: availableHoursSummary.status === 'closed'
				? warningBadgeClass
				: neutralBadgeClass,
	);
</script>

<div
	class="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
	data-testid="shelter-detail-card"
>
	<h1 class="text-xl leading-tight font-black sm:text-2xl" data-testid="shelter-detail-name">
		{shelter.name}
	</h1>
	<p class="mt-2 text-sm text-slate-700" data-testid="shelter-detail-address">{fullAddress}</p>
	<p class="mt-1 text-xs font-medium text-slate-500" data-testid="shelter-detail-last-updated">
		Last updated: {lastVerifiedDate}
	</p>

	<div class="mt-4 border-t border-slate-200 pt-4" data-testid="shelter-detail-core-info">
		<h2 class="text-xs font-bold tracking-wide text-slate-500 uppercase">Core info</h2>
		<dl class="mt-2 space-y-2 text-sm">
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Category</dt>
				<dd class="text-right text-slate-900">{category}</dd>
			</div>
		</dl>
	</div>

	<div class="mt-4 border-t border-slate-200 pt-4" data-testid="shelter-detail-accessibility">
		<h2 class="text-xs font-bold tracking-wide text-slate-500 uppercase">
			Accessibility and policy
		</h2>
		<dl class="mt-2 space-y-2 text-sm">
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Pets</dt>
				<dd>
					<Badge variant="outline" class={petsBadgeClass}>
						<PawPrintIcon class="size-3.5" aria-hidden="true" />
						{petsAllowed}
					</Badge>
				</dd>
			</div>
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Wheelchair accessibility</dt>
				<dd>
					<Badge variant="outline" class={accessibilityBadgeClass}>
						<AccessibilityIcon class="size-3.5" aria-hidden="true" />
						{wheelchairAccess}
					</Badge>
				</dd>
			</div>
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Backup power</dt>
				<dd>
					<Badge variant="outline" class={backupPowerBadgeClass}>
						<BatteryChargingIcon class="size-3.5" aria-hidden="true" />
						{backupPower}
					</Badge>
				</dd>
			</div>
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Available hours</dt>
				<dd class="text-right">
					<Badge variant="outline" class={availableHoursBadgeClass}>
						{availableHoursSummary.statusLabel}
					</Badge>
					{#if availableHoursSummary.scheduleLines.length > 0}
						<ul
							class="mt-1 space-y-0.5 text-xs text-slate-600"
							data-testid="shelter-detail-hours-lines"
						>
							{#each availableHoursSummary.scheduleLines as line (line)}
								<li>{line}</li>
							{/each}
						</ul>
					{/if}
				</dd>
			</div>
			<div class="flex items-start justify-between gap-3">
				<dt class="font-semibold text-slate-700">Capacity</dt>
				<dd class="text-right text-slate-900">{capacity}</dd>
			</div>
		</dl>
	</div>

	<div class="mt-4 border-t border-slate-200 pt-4" data-testid="shelter-detail-operational">
		<h2 class="text-xs font-bold tracking-wide text-slate-500 uppercase">Operational</h2>
		<dl class="mt-2 space-y-2 text-sm">
			<div class="space-y-1">
				<dt class="font-semibold text-slate-700">Special instructions</dt>
				<dd class="text-slate-900">{specialInstructions}</dd>
			</div>
		</dl>
	</div>
</div>
