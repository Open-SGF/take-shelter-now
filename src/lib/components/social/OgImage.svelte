<svelte:options css="injected" />

<script lang="ts">
	type Props = {
		title: string;
		subtitle?: string;
		label?: string;
	};

	let { title, subtitle = 'Find a safe place fast during weather emergencies.', label = 'Take Shelter Now' }: Props =
		$props();
</script>

<div class="card">
	<div class="glow glow-primary"></div>
	<div class="glow glow-secondary"></div>
	<div class="frame"></div>

	<div class="content">
		<div class="eyebrow">{label}</div>
		<h1>{title}</h1>
		<p>{subtitle}</p>
		<div class="footer">
			<span>OpenSGF</span>
			<span>takeshelternow.org</span>
		</div>
	</div>
</div>

<style>
	.card {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #08111f;
		color: #f8fafc;
		font-family: Arial, Helvetica, sans-serif;
	}

	.frame {
		position: absolute;
		display: flex;
		inset: 36px;
		border: 2px solid rgba(148, 163, 184, 0.24);
		border-radius: 44px;
	}

	.glow {
		position: absolute;
		display: flex;
		width: 560px;
		height: 560px;
		border-radius: 999px;
		filter: blur(12px);
		opacity: 0.9;
	}

	.glow-primary {
		top: -220px;
		right: -120px;
		background: #0ea5e9;
	}

	.glow-secondary {
		bottom: -260px;
		left: -160px;
		background: #f97316;
	}

	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 86px 96px;
		box-sizing: border-box;
	}

	.eyebrow {
		display: flex;
		align-self: flex-start;
		margin-bottom: 32px;
		padding: 13px 20px;
		border: 1px solid rgba(248, 250, 252, 0.34);
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.74);
		color: #bae6fd;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 960px;
		margin: 0;
		color: #ffffff;
		font-size: 82px;
		font-weight: 900;
		letter-spacing: -0.055em;
		line-height: 0.94;
	}

	p {
		max-width: 880px;
		margin: 30px 0 0;
		color: #cbd5e1;
		font-size: 36px;
		font-weight: 600;
		line-height: 1.18;
	}

	.footer {
		position: absolute;
		right: 96px;
		bottom: 70px;
		left: 96px;
		display: flex;
		justify-content: space-between;
		color: #e2e8f0;
		font-size: 25px;
		font-weight: 700;
		letter-spacing: 0.02em;
	}
</style>
