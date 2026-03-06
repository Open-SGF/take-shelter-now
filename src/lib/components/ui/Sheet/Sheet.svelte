<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	type SheetProps = {
		snapPoints?: number[];
		collapsedHeight?: number;
		snapIndex?: number;
		handleLabel?: string;
		class?: string;
		children?: Snippet;
	};

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	let {
		snapPoints = [0.4, 0.8],
		collapsedHeight = 96,
		snapIndex = $bindable(0),
		handleLabel = 'Drag to resize',
		class: className,
		children,
	}: SheetProps = $props();

	let viewportHeight = $state(0);
	let dragHeight = $state<number | null>(null);
	let isDragging = $state(false);
	let dragStartY = $state(0);
	let dragStartHeight = $state(0);

	let minHeight = $derived(Math.max(0, collapsedHeight));
	let normalizedSnapPoints = $derived.by(() => {
		if (!snapPoints || snapPoints.length === 0) return [];

		return snapPoints.map((point) => clamp(point, 0, 1)).sort((a, b) => a - b);
	});
	let pointSnapHeights = $derived(
		normalizedSnapPoints.map((point) => Math.max(minHeight, Math.round(point * viewportHeight))),
	);
	let effectiveSnapHeights = $derived([minHeight, ...pointSnapHeights]);
	let maxExternalSnapIndex = $derived(effectiveSnapHeights.length - 2);
	let clampedSnapIndex = $derived(clamp(snapIndex, -1, maxExternalSnapIndex));
	let clampedInternalSnapIndex = $derived(clampedSnapIndex + 1);
	let maxSheetHeight = $derived(Math.max(...effectiveSnapHeights));
	let currentHeight = $derived(dragHeight ?? effectiveSnapHeights[clampedInternalSnapIndex]);
	let translateY = $derived(maxSheetHeight - currentHeight);

	const updateViewportHeight = () => {
		viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight;
	};

	const findClosestSnapIndex = (height: number) => {
		const heights = effectiveSnapHeights;
		return heights.reduce((closestIndex, candidateHeight, index) => {
			const closestHeight = heights[closestIndex];
			if (Math.abs(candidateHeight - height) < Math.abs(closestHeight - height)) {
				return index;
			}
			return closestIndex;
		}, 0);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!isDragging) return;
		const deltaY = event.clientY - dragStartY;
		dragHeight = clamp(dragStartHeight - deltaY, minHeight, maxSheetHeight);
	};

	const endDrag = () => {
		if (!isDragging) return;
		isDragging = false;
		if (dragHeight !== null) {
			snapIndex = findClosestSnapIndex(dragHeight) - 1;
		}
		dragHeight = null;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', endDrag);
	};

	const onPointerDown = (event: PointerEvent) => {
		event.preventDefault();
		isDragging = true;
		dragStartY = event.clientY;
		dragStartHeight = currentHeight;
		dragHeight = currentHeight;
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', endDrag);
	};

	const onContentScroll = (event: Event) => {
		if (isDragging) return;
		if (clampedSnapIndex >= maxExternalSnapIndex) return;
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;
		if (target.scrollTop > 0) {
			snapIndex = maxExternalSnapIndex;
		}
	};

	$effect(() => {
		if (snapIndex !== clampedSnapIndex) {
			snapIndex = clampedSnapIndex;
		}
	});

	onMount(() => {
		updateViewportHeight();
		window.addEventListener('resize', updateViewportHeight);

		return () => {
			window.removeEventListener('resize', updateViewportHeight);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', endDrag);
		};
	});
</script>

<div
	data-testid="sheet"
	data-snap-index={snapIndex}
	class={cn(
		'absolute inset-x-0 bottom-0 flex w-full flex-col',
		'rounded-tl-2xl rounded-bl-2xl bg-white px-4 pt-4 shadow-lg',
		'transition-[transform] duration-200 ease-out',
		'max-md:rounded-tr-2xl max-md:rounded-bl-none md:rounded-tr-none md:rounded-br-none',
		className,
	)}
	style={`height: ${maxSheetHeight}px; transform: translateY(${translateY}px);`}
>
	<button
		type="button"
		data-testid="sheet-handle"
		aria-label={handleLabel}
		class="flex w-full touch-none items-center justify-center pt-1 pb-3 text-gray-500"
		onpointerdown={onPointerDown}
	>
		<span class="h-[4px] w-[60px] rounded-lg bg-gray-400"></span>
	</button>

	<div
		data-testid="sheet-content"
		class="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4"
		onscroll={onContentScroll}
	>
		{@render children?.()}
	</div>
</div>
