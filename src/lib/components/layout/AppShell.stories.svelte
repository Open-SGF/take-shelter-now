<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import { Map } from '$lib/components/ui/Map';
	import AppShell from './AppShell.svelte';

	const nextFrame = (win: Window) =>
		new Promise<void>((resolve) => {
			win.requestAnimationFrame(() => resolve());
		});

	const resizeCanvas = async (canvasElement: HTMLElement, width: number, height = 900) => {
		const win = canvasElement.ownerDocument.defaultView ?? window;
		const frame = win.frameElement as HTMLElement | null;

		if (!frame) {
			throw new Error('Storybook preview frame is not available for resizing');
		}

		frame.style.width = `${width}px`;
		frame.style.height = `${height}px`;
		win.dispatchEvent(new Event('resize'));
		await nextFrame(win);
		await nextFrame(win);
	};

	const shelterMarkers = [
		{ id: 'north', label: 'North Shelter', latitude: 37.2392, longitude: -93.2951 },
		{ id: 'center', label: 'Center Shelter', latitude: 37.208957, longitude: -93.292299 },
		{ id: 'south', label: 'South Shelter', latitude: 37.1735, longitude: -93.2868 },
	];

	const { Story } = defineMeta({
		title: 'Layout/App Shell',
		component: AppShell,
	});
</script>

{#snippet DefaultTemplate()}
	<AppShell>
		{#snippet map()}
			<Map class="h-full w-full" markers={shelterMarkers} defaultZoom={13} />
		{/snippet}

		<div class="space-y-4 p-4">
			<div>
				<h2 class="text-lg font-semibold text-slate-900">Shelter Results</h2>
				<p class="text-sm text-slate-600">Tap a shelter to update map context.</p>
			</div>
			<div class="space-y-2">
				{#each Array.from({ length: 10 }, (_, index) => index) as index (index)}
					<div class="rounded-lg bg-slate-100 p-3 text-sm">
						<div class="font-semibold text-slate-900">Shelter {index + 1}</div>
						<div class="text-xs text-slate-600">Open now · 1.{index} miles away</div>
					</div>
				{/each}
			</div>
		</div>
	</AppShell>
{/snippet}

<Story
	name="Default"
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const win = canvasElement.ownerDocument.defaultView ?? window;
		const frame = win.frameElement as HTMLElement | null;
		const previousWidth = frame?.style.width ?? '';
		const previousHeight = frame?.style.height ?? '';

		try {
			await resizeCanvas(canvasElement, 390);

			await expect(canvas.getByTestId('app-shell')).toBeInTheDocument();
			await expect(canvas.getByTestId('nav')).toBeInTheDocument();
			await expect(canvas.getByTestId('sheet')).toBeInTheDocument();
			await expect(canvas.queryByTestId('sidebar')).not.toBeInTheDocument();

			await waitFor(() => {
				expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(0);
			});

			const mapBeforeResize = canvas.getByTestId('map');

			await expect(canvas.getByText('Shelter Results')).toBeInTheDocument();

			await resizeCanvas(canvasElement, 1280);

			await waitFor(() => {
				expect(canvas.getByTestId('sidebar')).toBeInTheDocument();
			});
			await expect(canvas.queryByTestId('sheet')).not.toBeInTheDocument();
			await expect(canvas.getByTestId('map')).toBe(mapBeforeResize);
			await expect(canvas.getAllByTestId('map')).toHaveLength(1);

			await resizeCanvas(canvasElement, 390);

			await waitFor(() => {
				expect(canvas.getByTestId('sheet')).toBeInTheDocument();
			});
			await expect(canvas.queryByTestId('sidebar')).not.toBeInTheDocument();
			await expect(canvas.getByTestId('map')).toBe(mapBeforeResize);
			await expect(canvas.getAllByTestId('map')).toHaveLength(1);
		} finally {
			if (frame) {
				frame.style.width = previousWidth;
				frame.style.height = previousHeight;
				win.dispatchEvent(new Event('resize'));
				await nextFrame(win);
			}
		}
	}}
/>
