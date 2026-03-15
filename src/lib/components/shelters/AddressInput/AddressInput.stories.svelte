<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
	import AddressInput from './AddressInput.svelte';
	import type { ComponentProps } from 'svelte';

	type AddressInputArgs = ComponentProps<typeof AddressInput>;

	const { Story } = defineMeta({
		title: 'Shelters/AddressInput',
		component: AddressInput,
		args: {
			onLocationSelect: fn(),
		},
	});
</script>

{#snippet StoryShell(args: AddressInputArgs)}
	<div class="w-full bg-white p-4">
		<AddressInput {...args} />
	</div>
{/snippet}

<Story name="Default" template={StoryShell} />

<Story name="Disabled" args={{ disabled: true }} template={StoryShell} />

<Story
	name="Shows Suggestions After Three Characters"
	template={StoryShell}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Enter your address');

		await fireEvent.input(input, { target: { value: '12' } });
		await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();

		await fireEvent.input(input, { target: { value: '123' } });

		await waitFor(
			() => {
				expect(canvas.getByRole('listbox')).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);

		await waitFor(
			() => {
				expect(canvas.getByText('123 Main St, Springfield, MO')).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);
	}}
/>

<Story
	name="Keyboard Navigation"
	template={StoryShell}
	play={async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Enter your address');

		await fireEvent.input(input, { target: { value: 'Springfield' } });

		await waitFor(
			() => {
				expect(canvas.getByRole('listbox')).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await waitFor(() => {
			expect(canvas.getByRole('option', { selected: true })).toBeInTheDocument();
		});

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await fireEvent.keyDown(input, { key: 'ArrowUp' });

		await fireEvent.keyDown(input, { key: 'Escape' });
		await waitFor(() => {
			expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
		});

		await fireEvent.input(input, { target: { value: '' } });
		await fireEvent.input(input, { target: { value: 'Commercial' } });
		await waitFor(
			() => {
				expect(canvas.getByRole('listbox')).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(
			() => {
				expect(args.onLocationSelect).toHaveBeenCalled();
			},
			{ timeout: 5000 },
		);

		const mockFn = args.onLocationSelect as ReturnType<typeof fn>;
		const [location, label] = mockFn.mock.calls[0];
		expect(typeof location.latitude).toBe('number');
		expect(typeof location.longitude).toBe('number');
		expect(label).toBe('415 E Commercial St, Springfield, MO');
	}}
/>

<Story
	name="Click Selects Suggestion"
	template={StoryShell}
	play={async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Enter your address');

		await fireEvent.input(input, { target: { value: 'Walnut' } });

		await waitFor(
			() => {
				expect(canvas.getByRole('listbox')).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);

		const option = canvas.getByText('301 E Walnut St, Springfield, MO');
		await fireEvent.mouseDown(option);
		await fireEvent.click(option);

		await waitFor(
			() => {
				expect(args.onLocationSelect).toHaveBeenCalled();
			},
			{ timeout: 5000 },
		);

		const mockFn = args.onLocationSelect as ReturnType<typeof fn>;
		const [location, label] = mockFn.mock.calls[0];
		expect(typeof location.latitude).toBe('number');
		expect(typeof location.longitude).toBe('number');
		expect(label).toBe('301 E Walnut St, Springfield, MO');
	}}
/>
