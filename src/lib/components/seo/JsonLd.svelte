<script lang="ts">
	import { jsonLdScript, type JsonLdValue } from '$lib/seo';

	let { value }: { value: JsonLdValue } = $props();
	let script = $derived(jsonLdScript(value));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags JSON-LD is serialized and escaped for script context. -->
	{@html script}
</svelte:head>
