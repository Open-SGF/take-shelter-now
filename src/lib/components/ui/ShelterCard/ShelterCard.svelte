<script lang="ts">
	// Props
	export let title: string = 'Central High School';
	export let distance: number = 0.4;
	export let address: string = '423 East Central, Springfield, MO 65802';
</script>

<div class="card">
	<div class="distance-view">
		<p class="distance-number">{distance}</p>
		<p class="miles-away">Miles Away</p>
	</div>
	<div class="text-view">
		<h2>{title}</h2>
		<p class="address-text">
			{address}
		</p>
	</div>

	<!-- <button on:click={increment}>Increment</button> -->
</div>

<style>
	.card {
		border-radius: 16px;
		background-color: #f4f4f4;
		/* border: 1px solid #ccc; */
		margin-bottom: 16px;
		display: flex;
		flex-direction: row;
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 22%);
	}
	.distance-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 16px;
	}
	.distance-number {
		font-family: 'DM Sans', sans-serif;
		color: #c91c1c;
		font-size: 22px;
		line-height: 18px;
		font-weight: 900;
	}
	.miles-away {
		font-family: 'DM Sans', sans-serif;
		color: #c91c1c;
		font-size: 6px;
		line-height: 18px;
	}

	h2 {
		/* margin-bottom: 16px; */
		font-size: 16px;
		font-weight: 800;
	}
	.address-text {
		font-family: 'DM Sans', sans-serif;
		font-size: 12px;
		font-weight: 400;
	}

	.text-view {
		padding: 16px;
	}
</style>
