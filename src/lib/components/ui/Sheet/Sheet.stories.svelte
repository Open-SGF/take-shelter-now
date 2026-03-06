<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ComponentProps } from 'svelte';
	import { expect, fireEvent, within } from 'storybook/test';
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

	type SheetArgs = ComponentProps<typeof Sheet>;
</script>

{#snippet StoryShell(args: SheetArgs, items: number)}
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
		<Sheet {...args}>
			{@render DefaultContent(items)}
		</Sheet>
	</div>
{/snippet}

{#snippet DefaultContent(items: number)}
	<div class="space-y-4">
		<p class="text-sm text-slate-700">
			Use your location to find nearby shelter options and real-time alerts.
		</p>
		<div class="space-y-3 pr-1">
			{#each Array.from({ length: items }, (_, index) => index) as index (index)}
				<div class="rounded-xl bg-slate-100 p-3 text-sm">
					<div class="font-semibold text-slate-900">Shelter {index + 1}</div>
					<div class="text-xs text-slate-600">Open now · 1.{index} miles away</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet DefaultTemplate(args: SheetArgs)}
	{@render StoryShell(args, 12)}
{/snippet}

{#snippet DragTemplate(args: SheetArgs)}
	{@render StoryShell(args, 8)}
{/snippet}

{#snippet ExpandedTemplate(args: SheetArgs)}
	<Sheet {...args}>
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
{/snippet}

{#snippet CustomSnapPointsTemplate(args: SheetArgs)}
	<Sheet {...args}>
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
{/snippet}

<Story
	name="Default"
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('sheet-handle')).toBeInTheDocument();
		await expect(canvas.getByTestId('sheet-content')).toHaveClass('overflow-y-auto');
	}}
/>

<Story
	name="Drag Snap Points"
	template={DragTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const win = canvasElement.ownerDocument?.defaultView ?? window;
		const handle = canvas.getByTestId('sheet-handle');
		const sheet = canvas.getByTestId('sheet');
		const viewportHeight = win.innerHeight;
		const snapPoints = [0.4, 0.8];
		const minHeight = 96;
		const snapHeights = snapPoints
			.map((point) => Math.max(minHeight, Math.round(point * viewportHeight)))
			.sort((a, b) => a - b);
		const maxHeight = Math.max(...snapHeights);

		const getTranslateY = () => {
			const transform = sheet.style.transform;
			const match = /translateY\(([-\d.]+)px\)/.exec(transform);
			return match ? Number(match[1]) : 0;
		};

		const dragToHeight = async (startHeight: number, targetHeight: number) => {
			const { top, height } = handle.getBoundingClientRect();
			const startY = top + height / 2;
			const deltaY = startHeight - targetHeight;
			const endY = startY + deltaY;
			await fireEvent.pointerDown(handle, {
				clientY: startY,
				pointerId: 1,
				pointerType: 'mouse',
				buttons: 1,
			});
			await fireEvent.pointerMove(win, {
				clientY: endY,
				pointerId: 1,
			});
			await fireEvent.pointerUp(win, {
				clientY: endY,
				pointerId: 1,
			});
			await new Promise((resolve) => win.requestAnimationFrame(() => resolve(undefined)));
		};

		await dragToHeight(snapHeights[0], snapHeights[1]);
		await expect(sheet).toHaveAttribute('data-snap-index', '1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[1], 0);

		await dragToHeight(snapHeights[1], snapHeights[0]);
		await expect(sheet).toHaveAttribute('data-snap-index', '0');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[0], 0);
	}}
/>

<Story name="Expanded" args={{ snapIndex: 1 }} template={ExpandedTemplate} />

<Story
	name="Custom Snap Points"
	args={{ snapPoints: [0.3, 0.6, 0.9], collapsedHeight: 80, snapIndex: 2 }}
	template={CustomSnapPointsTemplate}
/>
