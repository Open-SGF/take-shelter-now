<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Separator } from '$lib/components/ui/separator';
	import { getShelterStateContext } from '$lib/state/shelter-state.svelte';
	import { formatShelterCategory, type ShelterCategory } from '$lib/shelters/presentation';
	import FilterIcon from '@lucide/svelte/icons/filter';

	const shelterState = getShelterStateContext();

	let open = $state(false);

	const categoryOptions: ShelterCategory[] = ['school', 'church', 'other'];

	const toggleCategory = (category: ShelterCategory) => {
		const current = shelterState.filters.categories;
		const newCategories = current.includes(category)
			? current.filter((c: ShelterCategory) => c !== category)
			: [...current, category];
		shelterState.setFilter('categories', newCategories);
	};

	const totalShelters = $derived(shelterState.sheltersWithDistance.length);
	const filteredCount = $derived(shelterState.filteredShelters.length);
</script>

<Popover bind:open>
	<PopoverTrigger
		class="border-border bg-surface hover:bg-surface-muted inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
		data-testid="filter-trigger"
	>
		<FilterIcon class="text-text-secondary size-4" aria-hidden="true" />
		<span>Filters</span>
		{#if shelterState.hasActiveFilters}
			<Badge
				variant="default"
				class="ml-0.5 h-5 min-w-5 justify-center px-1.5 text-xs"
				data-testid="filter-count-badge"
			>
				{shelterState.activeFilterCount}
			</Badge>
		{/if}
	</PopoverTrigger>
	<PopoverContent align="start" class="w-72" data-testid="filter-popover">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-semibold">Filters</h3>
				{#if shelterState.hasActiveFilters}
					<Button
						variant="ghost"
						size="sm"
						class="text-text-secondary h-auto px-2 py-1 text-xs"
						onclick={() => shelterState.clearFilters()}
						data-testid="clear-filters-button"
					>
						Clear all
					</Button>
				{/if}
			</div>

			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<Checkbox
						id="filter-pets"
						checked={shelterState.filters.petFriendly}
						onCheckedChange={(checked) => shelterState.setFilter('petFriendly', !!checked)}
						data-testid="filter-pets-checkbox"
					/>
					<Label for="filter-pets" class="cursor-pointer text-sm font-normal">Pets Allowed</Label>
				</div>

				<div class="flex items-center gap-2">
					<Checkbox
						id="filter-accessibility"
						checked={shelterState.filters.accessibility}
						onCheckedChange={(checked) => shelterState.setFilter('accessibility', !!checked)}
						data-testid="filter-accessibility-checkbox"
					/>
					<Label for="filter-accessibility" class="cursor-pointer text-sm font-normal">
						Wheelchair Accessible
					</Label>
				</div>

				<div class="flex items-center gap-2">
					<Checkbox
						id="filter-backup-power"
						checked={shelterState.filters.hasBackupPower}
						onCheckedChange={(checked) => shelterState.setFilter('hasBackupPower', !!checked)}
						data-testid="filter-backup-power-checkbox"
					/>
					<Label for="filter-backup-power" class="cursor-pointer text-sm font-normal">
						Backup Power
					</Label>
				</div>
			</div>

			<Separator />

			<div class="space-y-3">
				<p class="text-text-secondary text-xs font-medium tracking-wide uppercase">Category</p>
				{#each categoryOptions as category (category)}
					<div class="flex items-center gap-2">
						<Checkbox
							id="filter-category-{category}"
							checked={shelterState.filters.categories.includes(category)}
							onCheckedChange={() => toggleCategory(category)}
							data-testid="filter-category-{category}-checkbox"
						/>
						<Label for="filter-category-{category}" class="cursor-pointer text-sm font-normal">
							{formatShelterCategory(category)}
						</Label>
					</div>
				{/each}
			</div>

			<Separator />

			<p class="text-text-secondary text-xs" data-testid="filter-match-count">
				{filteredCount} of {totalShelters} shelters match
			</p>
		</div>
	</PopoverContent>
</Popover>
