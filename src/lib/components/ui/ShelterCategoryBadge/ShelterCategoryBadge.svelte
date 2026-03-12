<script lang="ts">
	import { type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import ChurchIcon from '@lucide/svelte/icons/church';
	import SchoolIcon from '@lucide/svelte/icons/school';
	import { Badge } from '$lib/components/ui/badge';
	import { formatShelterCategory, type ShelterCategory } from '$lib/shelters/presentation';

	type ShelterCategoryBadgeProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		category?: ShelterCategory;
	};

	let { category, ...restProps }: ShelterCategoryBadgeProps = $props();

	const categoryMeta: Record<ShelterCategory, { icon: typeof SchoolIcon }> = {
		school: { icon: SchoolIcon },
		church: { icon: ChurchIcon },
		other: { icon: Building2Icon },
	} as const;

	let normalizedCategory = $derived(category ?? 'other') as ShelterCategory;
	let CategoryIcon = $derived(categoryMeta[normalizedCategory].icon);
	let label = $derived(formatShelterCategory(category));
</script>

<Badge
	variant="secondary"
	class="h-5 gap-1 bg-slate-100 px-2 text-[11px] font-semibold text-slate-700"
	data-testid="shelter-category-badge"
	{...restProps}
>
	<CategoryIcon class="size-3.5" aria-hidden="true" />
	{label}
</Badge>
