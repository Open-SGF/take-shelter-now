<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/components/utils';
	import type { Snippet } from 'svelte';

	type DialogTriggerProps = DialogPrimitive.TriggerProps & {
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: DialogTriggerProps = $props();
</script>

<DialogPrimitive.Trigger bind:ref class={cn(className)} {...restProps}>
	{@render children?.()}
</DialogPrimitive.Trigger>
