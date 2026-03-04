<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type SheetProps = {
		snapPoints?: number[];
		collapsedHeight?: number;
		snapIndex?: number;
		handleLabel?: string;
		children?: Snippet;
	};

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	let {
		snapPoints = [0.4, 0.8],
		collapsedHeight = 96,
		snapIndex = $bindable(0),
		handleLabel = 'Drag to resize',
		children,
	}: SheetProps = $props();

	let viewportHeight = $state(0);
	let dragHeight = $state<number | null>(null);
	let isDragging = $state(false);
	let dragStartY = $state(0);
	let dragStartHeight = $state(0);

	let minHeight = $derived(Math.max(0, collapsedHeight));
	let normalizedSnapPoints = $derived.by((): number[] => {
		if (!snapPoints || snapPoints.length === 0) {
			const fallback = viewportHeight > 0 ? minHeight / viewportHeight : 0;
			return [clamp(fallback, 0, 1)];
		}

		return snapPoints
			.map((point: number) => clamp(point, 0, 1))
			.sort((a: number, b: number) => a - b);
	});
	let snapHeights = $derived.by((): number[] =>
		normalizedSnapPoints.map((point: number) =>
			Math.max(minHeight, Math.round(point * viewportHeight)),
		),
	);
	let effectiveSnapHeights = $derived.by((): number[] =>
		snapHeights.length > 0 ? snapHeights : [minHeight],
	);
	let clampedSnapIndex = $derived.by((): number =>
		clamp(snapIndex, 0, effectiveSnapHeights.length - 1),
	);
	let maxSheetHeight = $derived.by((): number => Math.max(...effectiveSnapHeights));
	let currentHeight = $derived.by(
		(): number => dragHeight ?? effectiveSnapHeights[clampedSnapIndex],
	);
	let translateY = $derived.by((): number => maxSheetHeight - currentHeight);

	const updateViewportHeight = () => {
		viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight;
	};

	const findClosestSnapIndex = (height: number) => {
		const heights = effectiveSnapHeights;
		return heights.reduce((closestIndex: number, candidateHeight: number, index: number) => {
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
		const nextHeight = clamp(dragStartHeight - deltaY, minHeight, maxSheetHeight);
		dragHeight = nextHeight;
	};

	const endDrag = () => {
		if (!isDragging) return;
		isDragging = false;
		if (dragHeight !== null) {
			snapIndex = findClosestSnapIndex(dragHeight);
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
		if (clampedSnapIndex >= effectiveSnapHeights.length - 1) return;
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;
		if (target.scrollTop > 0) {
			snapIndex = effectiveSnapHeights.length - 1;
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
	class="absolute inset-x-0 bottom-0 flex w-full flex-col rounded-tl-2xl rounded-bl-2xl bg-white px-4 pt-4 shadow-lg transition-[transform] duration-200 ease-out max-md:rounded-tr-2xl max-md:rounded-bl-none md:rounded-tr-none md:rounded-br-none"
	style={`height: ${maxSheetHeight}px; transform: translateY(${translateY}px);`}
>
	<button
		type="button"
		data-testid="sheet-handle"
		aria-label={handleLabel}
		class="flex w-full items-center justify-center pt-1 pb-3 text-gray-500"
		style="touch-action: none;"
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
