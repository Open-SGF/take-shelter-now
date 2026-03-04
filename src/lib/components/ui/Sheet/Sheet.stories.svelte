<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sheet from './Sheet.svelte';

	const { Story } = defineMeta({
		title: 'UI/Sheet',
		component: Sheet,
	});
</script>

<Story name="With Content">
	<div class="space-y-3">
		<p class="text-sm text-slate-700">Use your location to find nearby shelter options.</p>
		<div class="rounded-xl bg-slate-100 p-3 text-sm">
			<ul class="space-y-1">
				<li>Ozark Community Center</li>
				<li>Parkview High School</li>
				<li>Doling Family Center</li>
			</ul>
		</div>
	</div>
</Story>
