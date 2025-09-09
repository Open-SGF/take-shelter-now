<script>
	import { hasLocation } from '$lib/stores/global';
	import { Button } from '$lib/components/ui/Button'

	function enableLocation() {
		hasLocation.set(true);
	}
</script>

<div>
	<Button 
		onclick={() => {enableLocation()}}
		class="flex items-center justify-center w-full h-[58px] rounded-lg bg-[#0892d2] text-white"
	>		
		<img
			src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1756782708/navigation_bgtfde.png"
			alt=""
			class="w-6 h-6 mr-2"
		/>
		Current Location
	</Button>
</div>
