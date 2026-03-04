<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sheet from './Sheet.svelte';

	const { Story } = defineMeta({
		title: 'UI/Sheet',
		component: Sheet,
		args: {
			snapPoints: [0.4, 0.8],
			collapsedHeight: 96,
			snapIndex: 0,
			handleLabel: 'Drag to resize',
		},
	});
</script>

<Story name="Default" asChild>
	<div class="relative h-dvh w-full overflow-hidden bg-slate-900">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,transparent_65%),linear-gradient(180deg,#0b1b2b,#0f172a_45%,#111827_100%)]"
		>
			<!-- background gradient -->
		</div>
		<div
			class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60')] bg-cover opacity-30"
		>
			<!-- background image -->
		</div>
		<div class="absolute inset-x-0 top-4 flex items-center justify-center">
			<div
				class="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase"
			>
				Shelter Map
			</div>
		</div>
		<Sheet snapPoints={[0.4, 0.8]} collapsedHeight={96} snapIndex={0} handleLabel="Drag to resize">
			<div class="space-y-4">
				<p class="text-sm text-slate-700">
					Use your location to find nearby shelter options and real-time alerts.
				</p>
				<div class="space-y-3 pr-1">
					{#each Array.from({ length: 12 }, (_, index) => index) as index (index)}
						<div class="rounded-xl bg-slate-100 p-3 text-sm">
							<div class="font-semibold text-slate-900">
								Shelter {index + 1}
							</div>
							<div class="text-xs text-slate-600">
								Open now · 1.{index} miles away
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Sheet>
	</div>
</Story>

<Story name="Expanded" asChild>
	<Sheet snapPoints={[0.4, 0.8]} collapsedHeight={96} snapIndex={1} handleLabel="Drag to resize">
		<div class="space-y-3">
			<p class="text-sm text-slate-700">Expanded layout preview with summary content.</p>
			<div class="rounded-xl bg-slate-100 p-3 text-sm">
				<ul class="space-y-1">
					<li>Ozark Community Center</li>
					<li>Parkview High School</li>
					<li>Doling Family Center</li>
				</ul>
			</div>
		</div>
	</Sheet>
</Story>

<Story name="Custom Snap Points" asChild>
	<Sheet
		snapPoints={[0.3, 0.6, 0.9]}
		collapsedHeight={80}
		snapIndex={2}
		handleLabel="Drag to resize"
	>
		<div class="space-y-3">
			<p class="text-sm text-slate-700">
				Custom snap points set to 30%, 60%, 90% with a shorter collapsed height.
			</p>
			<div class="rounded-xl bg-slate-100 p-3 text-sm">
				<ul class="space-y-1">
					<li>Jefferson Street Shelter</li>
					<li>Downtown Library</li>
					<li>Meadow Park Rec Center</li>
				</ul>
			</div>
		</div>
	</Sheet>
</Story>
