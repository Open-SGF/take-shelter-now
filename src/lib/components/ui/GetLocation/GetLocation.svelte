<script>
    import { hasLocation } from '$lib/stores/global';
  	import { onMount } from 'svelte';

	let locationEnabled = false;
	
	// Subscribe to the store
	const unsubscribe = hasLocation.subscribe(value => {
		locationEnabled = value;
	});

	onMount(() => {
    	return () => unsubscribe(); 
  	});

  function enableLocation() {
    hasLocation.set(true);
  }
	
</script>
<style>
    .getLocationButton{
        background-color: #0892D2;
        height: 58px;
        width: 100%;
        border-radius: 8px;
        display: flex;
        flex-direction: center;
        align-items: center;
        justify-content: center;
        color: #FFF;
    }
    .locationIcon{
        height: 24px;
        width: 24px;
        margin-right: 8px;
    }
    
</style>

<div>
    <button class="getLocationButton" on:click={() => enableLocation()}>
        <img 
            src="https://res.cloudinary.com/du9tnv8ss/image/upload/v1756782708/navigation_bgtfde.png"
            class="locationIcon"
        />
        Current Location</button>
</div>