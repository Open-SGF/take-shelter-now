<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type DialogProps = DialogPrimitive.RootProps & {
		children?: Snippet;
	};

	let { open = $bindable(false), children, ...restProps }: DialogProps = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps}>
	{@render children?.()}
</DialogPrimitive.Root>
