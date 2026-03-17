<script lang="ts">
	import { goto } from '$app/navigation';

	let loginEmail = $state('');
	let loginPassword = $state('');
	let loginError = $state('');
	let loginLoading = $state(false);

	function login() {
		loginLoading = true;
		loginError = '';
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
			<h2 class="text-lg font-semibold text-gray-900">Sign In</h2>
		</div>

		<div class="p-8">
			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="login-email">Email</label>
					<input
						id="login-email"
						type="email"
						bind:value={loginEmail}
						class="field-input"
						placeholder="you@example.com"
						autocomplete="email"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for="login-password"
						>Password</label
					>
					<input
						id="login-password"
						type="password"
						bind:value={loginPassword}
						class="field-input"
						placeholder="••••••••"
						autocomplete="current-password"
					/>
				</div>
				{#if loginError}
					<p class="text-sm text-red-600">{loginError}</p>
				{/if}
				<button
					onclick={login}
					disabled={loginLoading}
					class="w-full rounded-lg bg-[#0892d2] py-2.5 text-sm font-semibold text-white hover:bg-[#0778b0] disabled:opacity-60"
				>
					{loginLoading ? 'Signing in…' : 'Sign In'}
				</button>
				<p class="text-center text-xs text-gray-400">
					Don't have an account?
					<a href="/manage/register" class="text-[#0892d2] hover:underline">
						Register your shelter
					</a>
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
