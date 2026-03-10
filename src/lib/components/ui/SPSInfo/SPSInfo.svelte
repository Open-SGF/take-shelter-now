<script lang="ts">
	let open = $state(false);

	const schools = [
		{ name: 'Boyd Elementary', address: '833 E. Division St.', door: 1, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Cowden Elementary', address: '2927 S. Kimbrough Ave', door: 4, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Delaware Elementary', address: '1505 S. Delaware', door: 1, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Field Elementary', address: '2120 E. Barataria', door: 8, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Fremont Elementary', address: '2814 N. Fremont', door: 6, hours: '8:10 AM – 3:10 PM' },
		{ name: 'Hillcrest High School', address: '3319 N. Grant Ave.', door: 27, hours: 'Non-school hours' },
		{ name: 'Holland Elementary', address: '2403 S. Holland Ave.', door: 7, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Jarrett Middle School', address: '906 W. Portland', door: 9, hours: '9:00 AM – 4:00 PM' },
		{ name: 'Jeffries Elementary', address: '4051 S. Scenic Ave.', door: 1, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Kickapoo High School', address: '3710 S. Jefferson Ave.', door: 15, hours: 'Non-school hours' },
		{ name: 'Mann Elementary', address: '3745 S. Broadway Ave.', door: 7, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Pittman Elementary', address: '2934 E. Bennett St.', door: 11, hours: '8:10 AM – 3:10 PM' },
		{ name: 'Sherwood Elementary', address: '2524 S. Golden Ave.', door: 3, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Sunshine Elementary', address: '421 E. Sunshine', door: 6, hours: '8:10 AM – 3:10 PM' },
		{ name: 'Twain Elementary', address: '2352 S. Weaver Ave.', door: 3, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Watkins Elementary', address: '732 W. Talmage St.', door: 8, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Westport K-8', address: '415 S. Golden Ave.', door: 2, hours: '9:00 AM – 4:00 PM' },
		{ name: 'Wilder Elementary', address: '2526 S. Hilsboro St.', door: 7, hours: '7:20 AM – 2:20 PM' },
		{ name: 'Williams Elementary', address: '2205 W. Kearney', door: 1, hours: '8:10 AM – 3:10 PM' },
		{ name: 'York Elementary', address: '2100 W. Nichols', door: 10, hours: '8:10 AM – 3:10 PM' },
	];
</script>

<div class="mb-3 overflow-hidden rounded-xl border border-blue-200 bg-blue-50">
	<button
		class="flex w-full items-center gap-3 px-3 py-2.5 text-left"
		onclick={() => (open = !open)}
	>
		<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0892d2] text-white">
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
			</svg>
		</div>
		<div class="flex-1">
			<p class="text-sm font-bold text-[#0892d2]">SPS Tornado Safe Rooms</p>
			<p class="text-xs text-blue-500">20 schools · open to community during warnings</p>
		</div>
		<svg
			class="h-4 w-4 shrink-0 text-blue-400 transition-transform duration-200 {open ? 'rotate-180' : ''}"
			fill="none" stroke="currentColor" viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if open}
		<div class="border-t border-blue-200 px-3 py-3">
			<p class="mb-2 text-xs leading-relaxed text-blue-900">
				Safe rooms open automatically after a tornado warning is issued and
				<strong>close 10 min later</strong>. Recommended for those within a
				<strong>half-mile radius</strong>. No pets allowed.
			</p>

			<div class="mb-3 space-y-1.5">
				{#each schools as school}
					<div class="rounded-lg border border-blue-100 bg-white px-3 py-2">
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0">
								<p class="text-xs font-bold text-gray-800 leading-tight">{school.name}</p>
								<p class="text-[11px] text-gray-400">{school.address}</p>
							</div>
							<span class="shrink-0 rounded-full bg-[#0892d2] px-2 py-0.5 text-[10px] font-bold text-white">
								Door {school.door}
							</span>
						</div>
						<p class="mt-1 text-[11px] text-gray-500">School hours: {school.hours}</p>
					</div>
				{/each}
			</div>

			<a
				href="https://www.sps.org/community/tornado-safe-room"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1 text-xs font-semibold text-[#0892d2] underline hover:text-[#0780bc]"
			>
				View on SPS website
				<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
				</svg>
			</a>
		</div>
	{/if}
</div>
