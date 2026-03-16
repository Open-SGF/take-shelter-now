<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, waitFor, within } from 'storybook/test';
	import { Dialog, DialogContent, DialogTrigger } from './index';

	const { Story } = defineMeta({
		title: 'UI/Dialog',
		component: Dialog,
	});
</script>

<Story
	name="Default"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Open Dialog' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('dialog-content')).toBeInTheDocument();
		});
	}}
>
	<div class="p-4">
		<Dialog>
			<DialogTrigger class="bg-primary text-primary-foreground rounded px-4 py-2">
				Open Dialog
			</DialogTrigger>
			<DialogContent data-testid="dialog-content">
				<div class="space-y-4">
					<h2 class="text-lg font-semibold">Dialog Title</h2>
					<p class="text-muted-foreground text-sm">
						This is the dialog content. Click outside or the X to close.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	</div>
</Story>

<Story
	name="With Form"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Open Form' });
		await fireEvent.click(button);

		const bodyCanvas = within(document.body);
		await waitFor(() => {
			expect(bodyCanvas.getByTestId('dialog-content')).toBeInTheDocument();
		});
	}}
>
	<div class="p-4">
		<Dialog>
			<DialogTrigger class="rounded border px-4 py-2">Open Form</DialogTrigger>
			<DialogContent data-testid="dialog-content">
				<div class="space-y-4">
					<h2 class="text-lg font-semibold">Edit Profile</h2>
					<div class="space-y-3">
						<label class="block">
							<span class="text-sm font-medium">Name</span>
							<input
								type="text"
								class="mt-1 w-full rounded border px-3 py-2"
								placeholder="Enter name"
							/>
						</label>
						<label class="block">
							<span class="text-sm font-medium">Email</span>
							<input
								type="email"
								class="mt-1 w-full rounded border px-3 py-2"
								placeholder="Enter email"
							/>
						</label>
					</div>
					<div class="flex justify-end gap-2">
						<button class="rounded px-4 py-2 text-sm">Cancel</button>
						<button class="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
							>Save</button
						>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</div>
</Story>
