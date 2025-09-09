<script lang="ts">
	// Props
	export let title: string = 'Central High School';
	export let distance: number = 0.4;
	export let address: string = '423 East Central, Springfield, MO 65802';
</script>

<div class="mb-4 flex flex-row rounded-2xl bg-[#f4f4f4] shadow-md">
	<!-- Distance view -->
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<p class="font-[DM_Sans] text-[22px] leading-[18px] font-black text-[#c91c1c]">
			{distance}
		</p>
		<p class="font-[DM_Sans] text-[6px] leading-[18px] text-[#c91c1c]">Miles Away</p>
	</div>

	<!-- Text view -->
	<div class="p-4">
		<h2 class="text-[16px] font-extrabold">{title}</h2>
		<p class="font-[DM_Sans] text-[12px] font-normal">{address}</p>
	</div>
</div>
