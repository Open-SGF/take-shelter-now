<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, waitFor, within } from 'storybook/test';
	import { Toaster } from './index';
	import { toast } from 'svelte-sonner';

	const { Story } = defineMeta({
		title: 'UI/Toaster',
		component: Toaster,
	});
</script>

<Story
	name="Default"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Show Toast' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByText('Default notification')).toBeInTheDocument();
		});
	}}
>
	{#snippet template()}
		<div class="space-y-4 p-4">
			<Toaster position="bottom-left" />
			<div class="flex flex-wrap gap-2">
				<button
					class="rounded bg-slate-900 px-4 py-2 text-sm text-white"
					onclick={() => toast('Default notification')}
				>
					Show Toast
				</button>
				<button
					class="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
					onclick={() => toast.success('Success! Operation completed.')}
				>
					Success
				</button>
				<button
					class="rounded bg-red-600 px-4 py-2 text-sm text-white"
					onclick={() => toast.error('Something went wrong.')}
				>
					Error
				</button>
				<button
					class="rounded bg-amber-500 px-4 py-2 text-sm text-white"
					onclick={() => toast.warning('Warning: Please review.')}
				>
					Warning
				</button>
				<button
					class="rounded bg-blue-500 px-4 py-2 text-sm text-white"
					onclick={() => toast.info('Here is some info.')}
				>
					Info
				</button>
			</div>
		</div>
	{/snippet}
</Story>

<Story
	name="Success Toast"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Trigger Success' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByText('Address copied to clipboard')).toBeInTheDocument();
		});
	}}
>
	{#snippet template()}
		<div class="p-4">
			<Toaster position="bottom-left" />
			<button
				class="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
				onclick={() => toast.success('Address copied to clipboard')}
			>
				Trigger Success
			</button>
		</div>
	{/snippet}
</Story>

<Story
	name="With Description"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Show with Description' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByText('Event Created')).toBeInTheDocument();
			expect(bodyCanvas.getByText('Your event has been scheduled.')).toBeInTheDocument();
		});
	}}
>
	{#snippet template()}
		<div class="p-4">
			<Toaster position="bottom-left" />
			<button
				class="rounded bg-slate-900 px-4 py-2 text-sm text-white"
				onclick={() =>
					toast.success('Event Created', {
						description: 'Your event has been scheduled.',
					})}
			>
				Show with Description
			</button>
		</div>
	{/snippet}
</Story>

<Story
	name="With Action"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Show with Action' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByText('File deleted')).toBeInTheDocument();
			expect(bodyCanvas.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
		});
	}}
>
	{#snippet template()}
		<div class="p-4">
			<Toaster position="bottom-left" />
			<button
				class="rounded bg-slate-900 px-4 py-2 text-sm text-white"
				onclick={() =>
					toast('File deleted', {
						action: {
							label: 'Undo',
							onClick: () => toast.info('Undo clicked'),
						},
					})}
			>
				Show with Action
			</button>
		</div>
	{/snippet}
</Story>

<Story
	name="Persistent"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Show Persistent Toast' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByText('This toast will not auto-close')).toBeInTheDocument();
		});
	}}
>
	{#snippet template()}
		<div class="p-4">
			<Toaster position="bottom-left" />
			<button
				class="rounded bg-slate-900 px-4 py-2 text-sm text-white"
				onclick={() =>
					toast('This toast will not auto-close', {
						duration: Infinity,
					})}
			>
				Show Persistent Toast
			</button>
		</div>
	{/snippet}
</Story>
