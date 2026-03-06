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
	class={cn('fixed top-0 left-0 z-50 flex h-dvh w-[360px] flex-col bg-white shadow-lg', className)}
>
	<div data-testid="sidebar-content" class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
		{@render children?.()}
	</div>
</aside>
