<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/components/utils';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import { Popover } from '$lib/components/ui/popover';
	import PopoverContent from '$lib/components/ui/popover/popover-content.svelte';
	import PopoverTrigger from '$lib/components/ui/popover/popover-trigger.svelte';
	import Dialog from '$lib/components/ui/dialog/dialog.svelte';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import { getUserStateContext } from '$lib/state/user-state.svelte';
	import { getShelterStateContext } from '$lib/state/shelter-state.svelte';

	type NavProps = {
		class?: string;
	};

	interface EmergencyContact {
		name: string;
		phone: string;
		description: string;
	}

	const contacts: EmergencyContact[] = [
		{ name: '911', phone: '911', description: 'Police, Fire, Medical Emergency' },
		{ name: 'American Red Cross', phone: '1-800-733-2767', description: '24/7 Disaster Relief' },
	];

	let { class: className }: NavProps = $props();
	const locationState = getLocationStateContext();
	const userState = getUserStateContext();
	const shelterState = getShelterStateContext();

	const isListPage = $derived(page.url.pathname === '/');
	const showEditLocation = $derived(
		locationState.hasLocation && page.url.pathname !== '/location/',
	);
	const showClearFilters = $derived(isListPage && shelterState.hasActiveFilters);

	let contactsDialogOpen = $state(false);

	function handleEditLocationClick() {
		goto(resolve('/location/'));
	}

	function handleClearFiltersClick() {
		shelterState.clearFilters();
	}

	function handleResetDirectionsAppClick() {
		userState.setDirectionsApp(undefined);
	}
</script>

<header
	data-testid="nav"
	class={cn(
		'bg-surface flex h-[72px] w-full items-center justify-between rounded-b-2xl p-8',
		className,
	)}
>
	<nav aria-label="Primary" class="flex items-center">
		<img class="w-[218px]" src="/images/logo-dark.png" alt="Take Shelter Now Logo" />
	</nav>

	<Popover>
		<PopoverTrigger
			class="text-text-tertiary hover:bg-interactive-bg hover:text-interactive-text cursor-pointer rounded-md p-2 transition-colors"
			data-testid="nav-menu-trigger"
		>
			<MoreVerticalIcon class="size-5" />
			<span class="sr-only">Menu</span>
		</PopoverTrigger>
		<PopoverContent align="end" class="z-popover w-56 p-1">
			<button
				type="button"
				class="hover:bg-interactive-bg flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
				onclick={() => (contactsDialogOpen = true)}
			>
				Emergency Contacts
			</button>
			<button
				type="button"
				class="hover:bg-interactive-bg flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors"
				onclick={() => userState.setRadarEnabled(!userState.radarEnabled)}
			>
				<span>Radar</span>
				<span class="text-xs {userState.radarEnabled ? 'text-sky-500' : 'text-text-tertiary'}">
					{userState.radarEnabled ? 'On' : 'Off'}
				</span>
			</button>
			{#if showClearFilters}
				<button
					type="button"
					class="hover:bg-interactive-bg flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
					data-testid="nav-menu-clear-filters"
					onclick={handleClearFiltersClick}
				>
					Clear Filters
				</button>
			{/if}
			{#if showEditLocation}
				<button
					type="button"
					class="hover:bg-interactive-bg flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
					data-testid="nav-menu-edit-location"
					onclick={handleEditLocationClick}
				>
					Edit Location
				</button>
			{/if}
			{#if userState.directionsApp}
				<button
					type="button"
					class="hover:bg-interactive-bg flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
					data-testid="nav-menu-reset-directions"
					onclick={handleResetDirectionsAppClick}
				>
					Reset Directions App
				</button>
			{/if}
		</PopoverContent>
	</Popover>
</header>

<Dialog bind:open={contactsDialogOpen}>
	<DialogContent class="max-w-sm p-0">
		<div class="border-b border-gray-100 px-6 py-4">
			<h2 class="text-base font-semibold">Emergency Contacts</h2>
		</div>
		<div class="px-2 py-2">
			{#each contacts as contact (contact.name)}
				<div class="flex items-center justify-between rounded-lg px-4 py-3">
					<div>
						<p class="text-sm font-semibold">{contact.name}</p>
						<p class="text-text-tertiary text-xs">{contact.description}</p>
					</div>
					<a
						href="tel:{contact.phone}"
						class="flex items-center gap-1.5 rounded-full bg-[#0892d2] px-3 py-1.5 text-white transition-colors hover:bg-[#0780bc]"
					>
						<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
						</svg>
						<span class="text-xs font-semibold">{contact.phone}</span>
					</a>
				</div>
			{/each}
		</div>
	</DialogContent>
</Dialog>
