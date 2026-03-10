<script>
	import { Button } from '$lib/components/ui/button';
	import { getAppStateContext } from '$lib/state/app-state-context';

	const appState = getAppStateContext();

	function enableLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					appState.setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.error('Error getting location:', error);
				},
			);
		}
	}
</script>

<div>
	<Button
		onclick={enableLocation}
		class="flex h-[58px] w-full items-center justify-center rounded-lg bg-[#0892d2] text-white"
	>
		<img
			src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1756782708/navigation_bgtfde.png"
			alt=""
			class="mr-2 h-6 w-6"
		/>
		Current Location
	</Button>
</div>
