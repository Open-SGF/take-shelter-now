<script lang="ts">
	const contacts = [
		{ name: '911', phone: '911', description: 'Emergency' },
		{ name: 'Red Cross', phone: '1-800-733-2767', description: 'Disaster Relief' },
		{ name: 'Greene Co. EM', phone: '(NEEDED)', description: 'Local' },
		{ name: 'Missouri EM', phone: '(NEEDED)', description: 'State' },
		{ name: 'FEMA', phone: '(NEEDED)', description: 'Federal' },
	];
</script>

<section class="z-50 w-screen rounded-b-2xl bg-white shadow-md">
	<div
		class="md:justify-left flex h-[72px] items-center justify-center p-8 md:justify-start"
	>
		<img
			class="w-[218px]"
			src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1755893551/logo_dark_b1yskw.png"
			alt="Take Shelter Now Logo"
		/>
	</div>

	<nav class="flex gap-2 overflow-x-auto border-t border-gray-200 px-4 py-2">
		{#each contacts as contact (contact.name)}
			<a
				href="tel:{contact.phone}"
				class="flex shrink-0 items-center gap-1.5 rounded-full bg-[#0892d2] px-3 py-1.5 text-white transition-colors hover:bg-[#0780bc]"
			>
				<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
					/>
				</svg>
				<span class="font-[DM_Sans] text-[12px] font-semibold">{contact.name}</span>
			</a>
		{/each}
	</nav>
</section>
