<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import {
		Item,
		ItemHeader,
		ItemTitle,
		ItemDescription,
		ItemContent,
		ItemActions,
		ItemMedia,
		ItemFooter,
		ItemSeparator,
	} from './index';

	const { Story } = defineMeta({
		title: 'UI/Item',
		component: Item,
	});
</script>

<Story name="Default">
	<Item class="w-80">
		<ItemHeader>
			<ItemTitle>Item Title</ItemTitle>
			<ItemDescription>Item description text</ItemDescription>
		</ItemHeader>
		<ItemContent>
			<p class="text-sm">Main content goes here</p>
		</ItemContent>
		<ItemActions>
			<button class="text-primary text-sm">Action</button>
		</ItemActions>
	</Item>
</Story>

<Story name="Outline Variant">
	<Item variant="outline" class="w-80">
		<ItemHeader>
			<ItemTitle>Outline Item</ItemTitle>
			<ItemDescription>With border</ItemDescription>
		</ItemHeader>
	</Item>
</Story>

<Story name="Muted Variant">
	<Item variant="muted" class="w-80">
		<ItemHeader>
			<ItemTitle>Muted Item</ItemTitle>
			<ItemDescription>With background</ItemDescription>
		</ItemHeader>
	</Item>
</Story>

<Story name="Small Size">
	<Item size="sm" class="w-80">
		<ItemHeader>
			<ItemTitle>Small Item</ItemTitle>
			<ItemDescription>Compact size</ItemDescription>
		</ItemHeader>
	</Item>
</Story>

<Story name="With Media">
	<Item class="w-80">
		<ItemMedia class="bg-muted size-12 rounded" />
		<ItemHeader>
			<ItemTitle>Item with Media</ItemTitle>
			<ItemDescription>Media on the left</ItemDescription>
		</ItemHeader>
		<ItemActions>
			<button class="text-primary text-sm">View</button>
		</ItemActions>
	</Item>
</Story>

<Story name="With Footer">
	<Item class="w-80">
		<ItemHeader>
			<ItemTitle>Item with Footer</ItemTitle>
			<ItemDescription>Footer at the bottom</ItemDescription>
		</ItemHeader>
		<ItemContent>
			<p class="text-sm">Main content</p>
		</ItemContent>
		<ItemFooter>
			<span class="text-muted-foreground text-xs">Footer text</span>
		</ItemFooter>
	</Item>
</Story>

<Story name="With Separator">
	<Item class="w-80">
		<ItemHeader>
			<ItemTitle>First Section</ItemTitle>
		</ItemHeader>
		<ItemSeparator />
		<ItemContent>
			<p class="text-sm">Separated content</p>
		</ItemContent>
	</Item>
</Story>
