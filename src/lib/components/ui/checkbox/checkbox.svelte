<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { Snippet } from 'svelte';

	type CheckboxProps = CheckboxPrimitive.RootProps & {
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		children,
		...restProps
	}: CheckboxProps = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	bind:checked
	class={cn(
		'peer border-primary h-4 w-4 shrink-0 rounded-sm border',
		'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
		className,
	)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		<span class="flex items-center justify-center text-current">
			<CheckIcon class="size-3" />
		</span>
	{/if}
</CheckboxPrimitive.Root>
