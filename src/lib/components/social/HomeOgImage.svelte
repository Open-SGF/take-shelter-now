<div class="flex h-full w-full flex-col bg-slate-100 text-slate-900">
	<div class="flex flex-1 p-10">
		<div class="flex flex-1 flex-col rounded-3xl border border-slate-200 bg-white px-14 py-12">
			<div class="flex flex-row items-center justify-between">
				<div class="flex rounded-full bg-slate-900 px-5 py-3 text-lg font-semibold text-white">
					Take Shelter Now
				</div>
				<div class="flex text-lg font-semibold text-slate-500">takeshelternow.org</div>
			</div>

			<div class="mt-8 flex flex-1 flex-col rounded-3xl border border-slate-200 bg-slate-50 px-8 py-8">
				<div class="flex self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold uppercase text-slate-700">
					Emergency shelter information
				</div>

				<h1 class="mt-8 flex max-w-[44rem] text-5xl leading-none font-black text-slate-900">
					Find nearby shelters fast.
				</h1>

				<p class="mt-6 flex max-w-[42rem] text-2xl leading-tight font-medium text-slate-600">
					Current hours and access details during weather emergencies.
				</p>

				<div class="mt-8 flex flex-row">
					{#each ['Nearby shelters', 'Current hours', 'Access details'] as featureTag, index (featureTag)}
						<div
							class={`flex rounded-full border px-4 py-2 text-xl font-semibold ${
								index === 0
									? 'border-emerald-200 bg-emerald-50 text-emerald-800'
									: index === 1
										? 'ml-3 border-slate-200 bg-slate-100 text-slate-700'
										: 'ml-3 border-sky-200 bg-sky-50 text-sky-800'
							}`}
						>
							{featureTag}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
