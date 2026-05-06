<script lang="ts">
	type Props = {
		title?: string;
		subtitle?: string;
		label?: string;
		location?: string;
		tags?: string[];
	};

	let {
		title = 'Find shelter fast during weather emergencies.',
		subtitle = 'Nearby shelters, hours, and access details.',
		label = 'Emergency shelter information',
		location,
		tags = [],
	}: Props = $props();
</script>

<div class="flex h-full w-full flex-col bg-slate-100 text-slate-900">
	<div class="flex flex-1 p-10">
		<div class="flex flex-1 flex-col rounded-3xl border border-slate-200 bg-white px-14 py-12">
			<div class="flex flex-row items-center justify-between">
				<div class="flex rounded-full bg-slate-900 px-5 py-3 text-lg font-semibold text-white">
					Take Shelter Now
				</div>
				<div class="flex text-lg font-semibold text-slate-500">takeshelternow.org</div>
			</div>

			<div class="mt-8 flex flex-col rounded-3xl border border-slate-200 bg-slate-50 px-8 py-7">
				<div class="flex flex-row items-center">
					<div class="flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold uppercase text-slate-700">
						{label}
					</div>
					{#if location}
						<div class="ml-3 flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
							{location}
						</div>
					{/if}
				</div>

				<h1 class="mt-8 flex max-w-[900px] text-7xl leading-none font-black text-slate-900">
					{title}
				</h1>

				<p class="mt-6 flex max-w-[860px] text-3xl leading-tight font-medium text-slate-600">
					{subtitle}
				</p>

				{#if tags.length > 0}
					<div class="mt-8 flex flex-row flex-wrap items-start">
						{#each tags as tag, index (tag)}
							<div
								class={`flex rounded-full border px-4 py-2 text-xl font-semibold ${
									index === 0
										? 'border-emerald-200 bg-emerald-50 text-emerald-800'
										: index === 1
											? 'ml-3 border-slate-200 bg-slate-100 text-slate-700'
											: index === 2
												? 'ml-3 border-sky-200 bg-sky-50 text-sky-800'
												: 'mt-3 border-rose-200 bg-rose-50 text-rose-700'
								}`}
							>
								{tag}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
