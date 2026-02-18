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
</script>

<div class="mb-4 rounded-2xl bg-[#f4f4f4] p-4 shadow-md">
	<div class="mb-3 flex items-center gap-2">
		<svg class="h-5 w-5 text-[#0892d2]" fill="currentColor" viewBox="0 0 20 20">
			<path
				d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
			/>
		</svg>
		<span class="font-[DM_Sans] text-[16px] font-extrabold">Emergency Contacts</span>
	</div>

	<div>
		{#each contacts as contact (contact.name)}
			<div
				class="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0"
			>
				<div>
					<p class="font-[DM_Sans] text-[14px] font-bold">{contact.name}</p>
					<p class="font-[DM_Sans] text-[11px] text-gray-500">{contact.description}</p>
				</div>
				<a
					href="tel:{contact.phone}"
					class="flex items-center gap-1 rounded-full bg-[#0892d2] px-3 py-1 text-white transition-colors hover:bg-[#0780bc]"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
						/>
					</svg>
					<span class="font-[DM_Sans] text-[12px] font-semibold">{contact.phone}</span>
				</a>
			</div>
		{/each}
	</div>
</div>
