<script lang="ts">
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
</script>

<div class="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
	<button
		class="flex w-full items-center justify-between px-3 py-2.5 text-left"
		onclick={() => (open = !open)}
		aria-expanded={open}
	>
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-[#0892d2]" fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
				/>
			</svg>
			<span class="text-sm font-bold text-gray-800">Emergency Contacts</span>
		</div>
		<svg
			class="h-4 w-4 shrink-0 text-gray-400 transition-transform {open ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if open}
		<div class="border-t border-gray-100 px-3">
			{#each contacts as contact (contact.name)}
				<div class="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-b-0">
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
