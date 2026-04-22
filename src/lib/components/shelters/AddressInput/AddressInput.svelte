<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		searchAddresses,
		getPlaceDetails,
		type AutocompleteSuggestion,
		type GeoPoint,
	} from '$lib/geo';
	import { cn } from '$lib/components/utils';

	type AddressInputProps = {
		onLocationSelect: (location: GeoPoint, label: string) => void;
		disabled?: boolean;
		class?: string;
	};

	let { onLocationSelect, disabled = false, class: className }: AddressInputProps = $props();
	const uid = $props.id();
	const inputId = `${uid}-address`;
	const suggestionsId = `${uid}-suggestions`;

	let inputValue = $state('');
	let suggestions = $state<AutocompleteSuggestion[]>([]);
	let isOpen = $state(false);
	let isLoading = $state(false);
	let selectedIndex = $state(-1);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	async function handleInput() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		if (inputValue.length < 3) {
			suggestions = [];
			isOpen = false;
			return;
		}

		debounceTimer = setTimeout(async () => {
			isLoading = true;
			isOpen = true;
			selectedIndex = -1;

			const results = await searchAddresses(inputValue);
			suggestions = results;
			isLoading = false;

			if (results.length === 0) {
				isOpen = false;
			}
		}, 300);
	}

	async function handleSelect(suggestion: AutocompleteSuggestion) {
		inputValue = suggestion.label;
		isOpen = false;
		suggestions = [];
		isLoading = true;

		const result = await getPlaceDetails(suggestion.gid);
		isLoading = false;

		if (result) {
			onLocationSelect(result.location, result.label);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen || suggestions.length === 0) {
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSelect(suggestions[selectedIndex]);
				}
				break;
			case 'Escape':
				event.preventDefault();
				isOpen = false;
				break;
		}
	}

	function handleFocus() {
		if (inputValue.length >= 3 && suggestions.length > 0) {
			isOpen = true;
		}
	}

	function handleBlur() {
		setTimeout(() => {
			isOpen = false;
		}, 200);
	}
</script>

<div class={cn('space-y-1.5', className)}>
	<Label for={inputId}>Enter an address</Label>
	<div class="relative">
		<Input
			id={inputId}
			bind:value={inputValue}
			type="text"
			placeholder="123 Main St, Springfield, MO"
			{disabled}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={handleFocus}
			onblur={handleBlur}
			aria-autocomplete="list"
			aria-expanded={isOpen}
			aria-controls={suggestionsId}
			aria-activedescendant={selectedIndex >= 0 ? `${suggestionsId}-${selectedIndex}` : undefined}
			class="pr-10"
		/>

		{#if isLoading}
			<div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
				<svg
					class="text-muted-foreground h-4 w-4 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		{/if}

		{#if isOpen && suggestions.length > 0}
			<ul
				id={suggestionsId}
				class="border-border bg-surface z-float absolute top-full right-0 left-0 mt-1 max-h-60 overflow-auto rounded-md border py-1 shadow-lg"
				role="listbox"
			>
				{#each suggestions as suggestion, index (suggestion.gid)}
					<li
						id={`${suggestionsId}-${index}`}
						role="option"
						aria-selected={index === selectedIndex}
						class={cn(
							'cursor-pointer px-3 py-2 text-sm',
							index === selectedIndex
								? 'bg-suggestion-hover-bg text-suggestion-hover-text'
								: 'hover:bg-muted',
						)}
						onclick={() => handleSelect(suggestion)}
						onkeydown={() => handleSelect(suggestion)}
					>
						<div class="font-medium">{suggestion.label}</div>
						{#if suggestion.address !== suggestion.label}
							<div class="text-muted-foreground text-xs">{suggestion.address}</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
