<script lang="ts">
	import type { Snippet } from 'svelte';

	type SheetProps = {
		snapPoints?: number[];
		collapsedHeight?: number;
		snapIndex?: number;
		handleLabel?: string;
		children?: Snippet;
	};

	let {
		snapPoints = [0.4, 0.8],
		collapsedHeight = 96,
		snapIndex = $bindable(0),
		handleLabel = 'Drag to resize',
		children,
	}: SheetProps = $props();
</script>

<div
	class="rounded-tl-2xl rounded-bl-2xl bg-white p-12
      px-4 max-md:rounded-tr-2xl max-md:rounded-bl-none max-md:p-4
  md:rounded-tr-none md:rounded-br-none"
>
	<!-- Handle only shows on mobile -->
	<div class="hidden w-full items-center justify-center max-md:flex">
		<div class="mb-4 h-[4px] w-[60px] rounded-lg bg-gray-400"></div>
	</div>

	<h1 class="pb-4 text-left font-[DM_Sans] text-[22px] leading-[22px] font-extrabold">
		Storm Shelters Near You
	</h1>

	<div>
		{@render children?.()}
	</div>
</div>
