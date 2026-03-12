<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import XIcon from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';

	type DialogContentProps = DialogPrimitive.ContentProps & {
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: DialogContentProps = $props();
</script>

<DialogPrimitive.Portal>
	<DialogPrimitive.Overlay
		class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[1300] bg-black/50 backdrop-blur-sm"
	/>
	<DialogPrimitive.Content
		bind:ref
		class={cn(
			'fixed top-1/2 left-1/2 z-[1301] grid w-full max-w-md -translate-x-1/2 -translate-y-1/2',
			'rounded-xl bg-white p-6 shadow-xl',
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
			'duration-200',
			className,
		)}
		{...restProps}
	>
		{@render children?.()}
		<DialogPrimitive.Close
			class="focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
		>
			<XIcon class="size-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</DialogPrimitive.Portal>
