<script lang="ts">
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

	const showMenu = $derived(locationState.hasLocation || userState.mapProvider !== null);
</script>

<header
	data-testid="nav"
	class={cn(
		'z-50 flex h-[72px] w-full items-center justify-center rounded-b-2xl bg-white p-8 md:justify-start',
		className,
	)}
>
	<nav aria-label="Primary" class="flex w-full items-center justify-center md:justify-start">
		<img class="w-[218px]" src="/images/logo-dark.png" alt="Take Shelter Now Logo" />
	</nav>

	{#if showMenu}
		<Popover>
			<PopoverTrigger
				class="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
				data-testid="nav-menu-trigger"
			>
				<MoreVerticalIcon class="size-5" />
				<span class="sr-only">Menu</span>
			</PopoverTrigger>
			<PopoverContent align="end" class="w-56 p-1">
				{#if locationState.hasLocation}
					<button
						type="button"
						class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100"
						data-testid="nav-menu-edit-location"
					>
						Edit Location
					</button>
				{/if}
				{#if userState.mapProvider}
					<button
						type="button"
						class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100"
						data-testid="nav-menu-reset-directions"
					>
						Reset Directions App
					</button>
				{/if}
			</PopoverContent>
		</Popover>
	{/if}
</header>
