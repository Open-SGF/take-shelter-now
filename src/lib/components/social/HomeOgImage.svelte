<script lang="ts">
	import logoLightSvg from '../../../../static/images/logo-light.svg?raw';

	const logoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(logoLightSvg)}`;
</script>

<div class="flex h-full w-full flex-col bg-white text-slate-900">
	<div class="flex flex-1 flex-col items-center justify-center p-10">
		<img
			src={logoSrc}
			alt="Take Shelter Now"
			width="580"
			height="96"
			style="width: 580px; height: 96px"
		/>
		<p class="mt-12 text-center text-5xl leading-tight font-bold text-[#58585a]">
			Find storm shelters nearby in weather emergencies
		</p>
	</div>
	<div class="flex h-2.5 w-full bg-[#e62647]"></div>
</div>
