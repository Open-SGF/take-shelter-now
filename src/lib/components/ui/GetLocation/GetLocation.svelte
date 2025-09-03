<script>
	import { hasLocation } from '$lib/stores/global';

	function enableLocation() {
		hasLocation.set(true);
	}
</script>

<div>
	<button class="getLocationButton" on:click={() => enableLocation()}>
		<img
			src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1756782708/navigation_bgtfde.png"
			class="locationIcon"
		/>
		Current Location</button
	>
</div>

<style>
	.getLocationButton {
		background-color: #0892d2;
		height: 58px;
		width: 100%;
		border-radius: 8px;
		display: flex;
		flex-direction: center;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	.locationIcon {
		height: 24px;
		width: 24px;
		margin-right: 8px;
	}
</style>
