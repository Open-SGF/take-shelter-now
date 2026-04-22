<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Popover, PopoverContent, PopoverTrigger } from './index';

	const { Story } = defineMeta({
		title: 'UI/Popover',
		component: Popover,
	});
</script>

<Story name="Default">
	<Popover>
		<PopoverTrigger>Open Popover</PopoverTrigger>
		<PopoverContent>
			<div class="space-y-2">
				<h4 class="font-medium">Popover Title</h4>
				<p class="text-sm text-slate-500">This is the popover content.</p>
			</div>
		</PopoverContent>
	</Popover>
</Story>

<Story name="With Form">
	<Popover>
		<PopoverTrigger class="rounded border px-4 py-2">Settings</PopoverTrigger>
		<PopoverContent>
			<div class="space-y-3">
				<h4 class="font-medium">Quick Settings</h4>
				<label class="flex items-center gap-2 text-sm">
					<input type="checkbox" />
					Enable notifications
				</label>
				<label class="flex items-center gap-2 text-sm">
					<input type="checkbox" checked />
					Dark mode
				</label>
			</div>
		</PopoverContent>
	</Popover>
</Story>
