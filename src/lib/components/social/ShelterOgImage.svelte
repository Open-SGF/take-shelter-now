<script lang="ts">
	import logoLightSvg from '../../../../static/images/logo-light.svg?raw';

	type Props = {
		title?: string;
		address?: string;
	};

	const logoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(logoLightSvg)}`;

	let {
		title = 'Find shelter fast during weather emergencies.',
		address = 'Nearby shelters, hours, and access details.',
	}: Props = $props();
</script>

<div class="flex h-full w-full flex-col bg-white text-slate-900">
	<div class="flex flex-1 p-10">
		<div class="flex flex-1 flex-col bg-white px-14 py-12">
			<div class="flex flex-row items-center justify-between">
				<img
					src={logoSrc}
					alt="Take Shelter Now"
					width="260"
					height="43"
					style="width: 260px; height: 43px"
				/>
				<div class="flex text-lg font-semibold text-slate-400">takeshelternow.org</div>
			</div>

			<div class="mt-auto flex flex-col justify-center pt-16">
				<h1 class="flex max-w-[44rem] text-7xl leading-none font-black text-slate-900">
					{title}
				</h1>
				<p class="mt-6 flex max-w-[42rem] text-3xl leading-tight font-medium text-slate-500">
					{address}
				</p>
			</div>
		</div>
	</div>
	<div class="flex h-2.5 w-full bg-[#e62647]"></div>
</div>
