<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, within } from 'storybook/test';
	import Sidebar from './Sidebar.svelte';

	const { Story } = defineMeta({
		title: 'UI/Sidebar',
		component: Sidebar,
	});
</script>

<Story
	name="Default"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const content = canvas.getByTestId('sidebar-content');

		await fireEvent.scroll(content, { target: { scrollTop: 240 } });
		await expect(content.scrollTop).toBe(240);
	}}
>
	<div class="space-y-4 p-4">
		<div class="space-y-1">
			<h2 class="text-lg font-semibold text-slate-900">Shelters Nearby</h2>
			<p class="text-sm text-slate-600">Desktop sidebar content preview.</p>
		</div>
		<div class="space-y-3 pr-1">
			{#each Array.from({ length: 16 }, (_, index) => index) as index (index)}
				<div class="rounded-xl bg-slate-100 p-3 text-sm">
					<div class="font-semibold text-slate-900">Shelter {index + 1}</div>
					<div class="text-xs text-slate-600">Open now · 1.{index} miles away</div>
				</div>
			{/each}
		</div>
	</div>
</Story>
