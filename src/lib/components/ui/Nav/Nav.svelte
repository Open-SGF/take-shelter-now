<script lang="ts">
	import { cn } from '$lib/utils.js';

	type NavProps = {
		class?: string;
	};

	let { class: className }: NavProps = $props();
</script>

<header
	data-testid="nav"
	class={cn(
		'z-50 flex h-[72px] w-full items-center justify-center rounded-b-2xl bg-white p-8 md:justify-start',
		className,
	)}
>
	<nav aria-label="Primary" class="flex w-full items-center justify-center md:justify-start">
		<img class="w-[218px]" src="/images/logo-dark.png" alt="Take Shelter Now Logo" />
	</nav>
</header>
