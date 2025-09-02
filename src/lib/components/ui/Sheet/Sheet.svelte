<div class="sheet">
	<div class="handleContainer">
		<div class="handle"></div>
	</div>
	<h1>Storm Shelters Near You</h1>
	<div>
		<slot></slot>
	</div>
</div>

<style>
	.sheet {
		position: fixed;
		right: 0px;
		height: 100vh;
		width: 30vw;
		background-color: #fff;
		padding: 48px 16px;
		border-top-left-radius: 16px;
		border-bottom-left-radius: 16px;
		overflow-y: auto;
	}

	h1 {
		font-size: 22px;
		line-height: 22px;
		font-weight: 800;
		text-align: left;
		font-family: 'DM Sans', sans-serif;
		padding-bottom: 16px;
	}

	/* Mobile Styles */
	@media (max-width: 768px) {
		.sheet {
			bottom: 0px;
			width: 100vw;
			height: 50vh;
			padding: 16px 16px;
			border-top-right-radius: 16px;
			border-bottom-left-radius: 0px;
		}
		.handleContainer {
			display: flex;
			width: 100%;
			align-content: center;
			justify-content: center;
		}
		.handle {
			width: 60px;
			height: 4px;
			border-radius: 8px;
			align-self: center;
			background-color: gray;
			margin-bottom: 16px;
		}
	}
</style>
