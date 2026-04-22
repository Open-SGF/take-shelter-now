<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ComponentProps } from 'svelte';
	import { expect, fireEvent, within } from 'storybook/test';
	import Sheet from './Sheet.svelte';

	const { Story } = defineMeta({
		title: 'Layout/Sheet',
		component: Sheet,
		args: {
			snapPoints: [0.4, 0.8],
			collapsedHeight: 96,
			snapIndex: -1,
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

{#snippet CustomSnapPointsTemplate(args: SheetArgs)}
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
			<div class="space-y-3">
				<p class="text-sm text-slate-700">
					Custom snap points set to 30%, 60%, 90% with a shorter collapsed height.
				</p>
				{@render DefaultContent(20)}
			</div>
		</Sheet>
	</div>
{/snippet}

<Story
	name="Default"
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const win = canvasElement.ownerDocument?.defaultView ?? window;
		const handle = canvas.getByTestId('sheet-handle');
		const sheet = canvas.getByTestId('sheet');
		const content = canvas.getByTestId('sheet-content');
		const viewportHeight = win.innerHeight;
		const snapPoints = [0.4, 0.8];
		const minHeight = 96;
		const snapHeights = [
			minHeight,
			...snapPoints.map((point) => Math.max(minHeight, Math.round(point * viewportHeight))),
		].sort((a, b) => a - b);
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

		await expect(canvas.getByTestId('sheet-handle')).toBeInTheDocument();
		await expect(canvas.getByTestId('sheet-content')).toHaveClass('overflow-y-auto');

		await expect(sheet).toHaveAttribute('data-snap-index', '-1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - minHeight, 0);

		await dragToHeight(snapHeights[0], snapHeights[1]);
		await expect(sheet).toHaveAttribute('data-snap-index', '0');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[1], 0);

		await dragToHeight(snapHeights[1], snapHeights[2]);
		await expect(sheet).toHaveAttribute('data-snap-index', '1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[2], 0);

		await dragToHeight(snapHeights[2], snapHeights[0]);
		await expect(sheet).toHaveAttribute('data-snap-index', '-1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[0], 0);

		await fireEvent.scroll(content, { target: { scrollTop: 16 } });
		await new Promise((resolve) => win.requestAnimationFrame(() => resolve(undefined)));
		await expect(sheet).toHaveAttribute('data-snap-index', '1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[2], 0);
	}}
/>

<Story
	name="Custom Snap Points"
	args={{ snapPoints: [0.3, 0.6, 0.9], collapsedHeight: 80, snapIndex: 2 }}
	template={CustomSnapPointsTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const win = canvasElement.ownerDocument?.defaultView ?? window;
		const handle = canvas.getByTestId('sheet-handle');
		const sheet = canvas.getByTestId('sheet');
		const content = canvas.getByTestId('sheet-content');

		const getTranslateY = () => {
			const transform = sheet.style.transform;
			const match = /translateY\(([-\d.]+)px\)/.exec(transform);
			return match ? Number(match[1]) : 0;
		};

		const collapsedHeight = 80;
		const snapHeights = [
			collapsedHeight,
			...[0.3, 0.6, 0.9].map((point) =>
				Math.max(collapsedHeight, Math.round(point * win.innerHeight)),
			),
		].sort((a, b) => a - b);
		const maxHeight = Math.max(...snapHeights);

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

		await new Promise((resolve) => win.requestAnimationFrame(() => resolve(undefined)));
		await expect(sheet).toHaveAttribute('data-snap-index', '2');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[3], 0);

		await dragToHeight(snapHeights[3], snapHeights[2]);
		await expect(sheet).toHaveAttribute('data-snap-index', '1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[2], 0);

		await dragToHeight(snapHeights[2], snapHeights[1]);
		await expect(sheet).toHaveAttribute('data-snap-index', '0');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[1], 0);

		await dragToHeight(snapHeights[1], snapHeights[0]);
		await expect(sheet).toHaveAttribute('data-snap-index', '-1');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - collapsedHeight, 0);

		await fireEvent.scroll(content, { target: { scrollTop: 16 } });
		await new Promise((resolve) => win.requestAnimationFrame(() => resolve(undefined)));
		await expect(sheet).toHaveAttribute('data-snap-index', '2');
		await expect(getTranslateY()).toBeCloseTo(maxHeight - snapHeights[3], 0);
	}}
/>
