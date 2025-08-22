<script lang="ts">
	import { Header  } from '$lib/components/ui/Header'
	import { ShelterCard } from '$lib/components/ui/ShelterCard'
	import { Sheet } from '$lib/components/ui/Sheet'
</script>

<style>
	.container{
		height: 100vh;
		overflow: none;
		background-color: #e2e0e1;
	}
	.brand-logo{
		height: 100px;
		width: auto;
	}
</style>

<div class="container">
	<Header/>
	<Sheet>
		<ShelterCard/>
		<ShelterCard/>
		<ShelterCard/>
		<ShelterCard/>
	</Sheet>

</div>





