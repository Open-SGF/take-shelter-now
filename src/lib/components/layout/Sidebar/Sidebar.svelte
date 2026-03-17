<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type SidebarProps = {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children }: SidebarProps = $props();
</script>

<aside
	data-testid="sidebar"
	class={cn('bg-surface flex h-full w-[432px] flex-col shadow-lg', className)}
>
	<div data-testid="sidebar-content" class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
		{@render children?.()}
	</div>
</aside>
