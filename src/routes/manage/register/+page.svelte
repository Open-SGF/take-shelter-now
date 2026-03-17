<script lang="ts">
	import { goto } from '$app/navigation';

	let regName = $state('');
	let regEmail = $state('');
	let regPhone = $state('');
	let regPassword = $state('');
	let regPasswordConfirm = $state('');
	let regError = $state('');
	let regLoading = $state(false);

	function register() {
		regError = '';
		if (regPassword !== regPasswordConfirm) {
			regError = 'Passwords do not match.';
			return;
		}
		regLoading = true;
		goto('/manage/my-shelter');
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
	<div class="mb-6 text-center">
		<h1 class="text-3xl font-black text-gray-900">Take Shelter Now</h1>
		<p class="mt-1 text-gray-500">Shelter Manager Portal</p>
	</div>

	<div class="w-full max-w-md rounded-2xl bg-white shadow-lg">
		<div class="border-b px-8 py-5">
			<h2 class="text-lg font-semibold text-gray-900">Register Your Shelter</h2>
			<p class="mt-1 text-sm text-gray-500">
				Create an account to add your shelter to the map. Your listing will be reviewed before going
				live.
			</p>
		</div>

		<div class="p-8">
			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="reg-name"
						>Your Name *</label
					>
					<input
						id="reg-name"
						type="text"
						bind:value={regName}
						class="field-input"
						placeholder="Jane Smith"
						autocomplete="name"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="reg-email">Email *</label>
					<input
						id="reg-email"
						type="email"
						bind:value={regEmail}
						class="field-input"
						placeholder="you@example.com"
						autocomplete="email"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="reg-phone"
						>Phone (optional)</label
					>
					<input
						id="reg-phone"
						type="tel"
						bind:value={regPhone}
						class="field-input"
						placeholder="(417) 555-0100"
						autocomplete="tel"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="reg-password"
						>Password *</label
					>
					<input
						id="reg-password"
						type="password"
						bind:value={regPassword}
						class="field-input"
						placeholder="Min. 8 characters"
						autocomplete="new-password"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="reg-confirm"
						>Confirm Password *</label
					>
					<input
						id="reg-confirm"
						type="password"
						bind:value={regPasswordConfirm}
						class="field-input"
						placeholder="••••••••"
						autocomplete="new-password"
					/>
				</div>
				{#if regError}
					<p class="text-sm text-red-600">{regError}</p>
				{/if}
				<button
					onclick={register}
					disabled={regLoading}
					class="w-full rounded-lg bg-[#0892d2] py-2.5 text-sm font-semibold text-white hover:bg-[#0778b0] disabled:opacity-60"
				>
					{regLoading ? 'Creating account…' : 'Create Account & Continue'}
				</button>
				<p class="text-center text-xs text-gray-400">
					Already have an account?
					<a href="/manage" class="text-[#0892d2] hover:underline">Sign in</a>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.field-input) {
		display: block;
		width: 100%;
		border-radius: 0.5rem;
		border: 1px solid #d1d5db;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		color: #111827;
	}
	:global(.field-input:focus) {
		outline: none;
		border-color: #0892d2;
		box-shadow: 0 0 0 1px #0892d2;
	}
</style>
