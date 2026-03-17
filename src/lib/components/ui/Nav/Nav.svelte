<script lang="ts">
	import { cn } from '$lib/utils.js';

	type NavProps = {
		class?: string;
	};

	let { class: className }: NavProps = $props();

	interface EmergencyContact {
		name: string;
		phone: string;
		description: string;
	}

	const contacts: EmergencyContact[] = [
		{ name: '911', phone: '911', description: 'Police, Fire, Medical Emergency' },
		{ name: 'American Red Cross', phone: '1-800-733-2767', description: '24/7 Disaster Relief' },
		{
			name: 'Greene County Emergency Management',
			phone: '(NEEDED)',
			description: 'Local Emergency Coordination',
		},
		{
			name: 'Missouri Emergency Management',
			phone: '(NEEDED)',
			description: 'State Emergency Services',
		},
		{ name: 'FEMA', phone: '(NEEDED)', description: 'Federal Disaster Assistance' },
	];

	let open = $state(false);

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('[data-contacts-dropdown]')) {
			open = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header
	data-testid="nav"
	class={cn(
		'z-50 flex h-[72px] w-full items-center justify-between rounded-b-2xl bg-white px-6 py-4 md:px-8',
		className,
	)}
>
	<nav aria-label="Primary" class="flex items-center">
		<img class="w-[218px]" src="/images/logo-dark.png" alt="Take Shelter Now Logo" />
	</nav>

	<div class="relative" data-contacts-dropdown>
		<button
			onclick={() => (open = !open)}
			aria-expanded={open}
			class="flex items-center gap-2 rounded-full bg-[#0892d2] px-4 py-2 text-white transition-colors hover:bg-[#0780bc]"
		>
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
				/>
			</svg>
			<span class="hidden text-sm font-semibold sm:inline">Emergency Contacts</span>
			<svg
				class="h-3.5 w-3.5 transition-transform {open ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if open}
			<div
				class="fixed right-4 top-[76px] z-[9999] w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
			>
				<div class="border-b border-gray-100 px-4 py-3">
					<p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Emergency Contacts</p>
				</div>
				{#each contacts as contact (contact.name)}
					<div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
						<div>
							<p class="text-sm font-bold text-gray-800">{contact.name}</p>
							<p class="text-xs text-gray-500">{contact.description}</p>
						</div>
						<a
							href="tel:{contact.phone}"
							class="flex items-center gap-1 rounded-full bg-[#0892d2] px-3 py-1 text-white transition-colors hover:bg-[#0780bc]"
						>
							<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
								/>
							</svg>
							<span class="text-xs font-semibold">{contact.phone}</span>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</header>
