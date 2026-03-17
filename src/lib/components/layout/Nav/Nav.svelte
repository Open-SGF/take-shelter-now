<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils.js';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import { Popover } from '$lib/components/ui/popover';
	import PopoverContent from '$lib/components/ui/popover/popover-content.svelte';
	import PopoverTrigger from '$lib/components/ui/popover/popover-trigger.svelte';
	import { getLocationStateContext } from '$lib/state/location-state.svelte';
	import { getUserStateContext } from '$lib/state/user-state.svelte';

	type NavProps = {
		class?: string;
	};

	let { class: className }: NavProps = $props();
	const locationState = getLocationStateContext();
	const userState = getUserStateContext();

	const showEditLocation = $derived(
		locationState.hasLocation && page.url.pathname !== '/location/',
	);
	const showMenu = $derived(showEditLocation || userState.directionsApp !== undefined);

	function handleEditLocationClick() {
		goto(resolve('/location/'));
	}
</script>

<header
	data-testid="nav"
	class={cn(
		'bg-surface z-50 flex h-[72px] w-full items-center justify-center rounded-b-2xl p-8 md:justify-start',
		className,
	)}
>
	<nav aria-label="Primary" class="flex w-full items-center justify-center md:justify-start">
		<img class="w-[218px]" src="/images/logo-dark.png" alt="Take Shelter Now Logo" />
	</nav>

	{#if showMenu}
		<Popover>
			<PopoverTrigger
				class="text-text-tertiary hover:bg-interactive-bg hover:text-interactive-text cursor-pointer rounded-md p-2 transition-colors"
				data-testid="nav-menu-trigger"
			>
				<MoreVerticalIcon class="size-5" />
				<span class="sr-only">Menu</span>
			</PopoverTrigger>
			<PopoverContent align="end" class="z-[1100] w-56 p-1">
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
					>
						Reset Directions App
					</button>
				{/if}
			</PopoverContent>
		</Popover>
	{/if}
</header>
