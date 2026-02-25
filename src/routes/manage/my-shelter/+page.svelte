<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Shelter } from '$lib/stores/global';

	const MOCK_SHELTER: Shelter = {
		id: 1,
		name: 'First Baptist Church',
		address_line1: '525 S Avenue',
		address_line2: null,
		city: 'Springfield',
		state: 'MO',
		zip: '65806',
		latitude: 37.2049,
		longitude: -93.2924,
		capacity: 300,
		category: 'Church',
		shelter_type: 'Post Impact',
		accessibility: 'Yes',
		pet_friendly: 'No',
		has_backup_power: 'Yes',
		hours_as_shelter: 'Non-school hours',
		special_instructions: 'Enter through the side door on Avenue St.',
		verification_status: 'Pending Review',
		availability_status: 'Available',
	};

	function logout() {
		localStorage.removeItem('shelter_token');
		goto('/manage');
	}

	let shelter: Shelter | null = MOCK_SHELTER;
	let isEditing = false;
	let saveSuccess = false;
	let saving = false;
	let form: Partial<Shelter> = {};

	function startEdit() {
		form = { ...shelter };
		isEditing = true;
		saveSuccess = false;
	}

	function cancelEdit() {
		isEditing = false;
	}

	function toggleAvailability() {
		if (!shelter) return;
		shelter = {
			...shelter,
			availability_status: shelter.availability_status === 'Full' ? 'Available' : 'Full',
		};
	}

	function save() {
		saving = true;
		setTimeout(() => {
			shelter = { ...shelter, ...form } as Shelter;
			isEditing = false;
			saving = false;
			saveSuccess = true;
		}, 600);
	}

	const CATEGORIES = ['Church', 'School', 'Other'];
	const SHELTER_TYPES = ['Evac', 'Post Impact', 'Both'];
	const YES_NO = ['Yes', 'No'];

	const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string; label: string }> = {
		Open:               { color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', dot: 'bg-green-500',  label: 'Live on map' },
		'Pending Review':   { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',  dot: 'bg-blue-500',   label: 'Under review' },
		'Temporarily Closed': { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500', label: 'Temporarily closed' },
		'Permanently Closed': { color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',   dot: 'bg-red-500',    label: 'Permanently closed' },
		Unknown:            { color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200',  dot: 'bg-gray-400',   label: 'Pending verification' },
	};

	$: status = STATUS_CONFIG[shelter?.verification_status ?? 'Unknown'] ?? STATUS_CONFIG['Unknown'];
</script>

<!-- Nav -->
<nav class="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
	<div class="flex items-center gap-2">
		<a href="/" class="text-lg font-black text-gray-900 hover:text-[#0892d2]">Take Shelter Now</a>
		<span class="text-gray-300">/</span>
		<span class="text-sm font-medium text-gray-500">My Shelter</span>
	</div>
	<button
		onclick={logout}
		class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
			<polyline points="16 17 21 12 16 7"/>
			<line x1="21" y1="12" x2="9" y2="12"/>
		</svg>
		Sign Out
	</button>
</nav>

<main class="min-h-screen bg-[#f5f5f7]">
	<div class="mx-auto max-w-2xl px-4 py-8">

		{#if !isEditing && shelter}

			<!-- Unverified warning banner -->
			{#if shelter.verification_status !== 'Open' && shelter.verification_status !== 'Temporarily Closed' && shelter.verification_status !== 'Permanently Closed'}
				<div class="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
						<line x1="12" y1="9" x2="12" y2="13"/>
						<line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
					<div>
						<p class="text-sm font-semibold text-amber-800">Your shelter is pending verification</p>
						<p class="mt-0.5 text-sm text-amber-700">
							Your listing is under review by our team and is not yet visible on the public map. You'll be notified once it's approved.
						</p>
					</div>
				</div>
			{/if}

			<!-- Success banner -->
			{#if saveSuccess}
				<div class="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
						<polyline points="22 4 12 14.01 9 11.01"/>
					</svg>
					Your shelter info has been updated and is under review.
				</div>
			{/if}

			<!-- Hero card -->
			<div class="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
				<div class="bg-[#0892d2] px-6 py-5">
					<div class="flex items-start justify-between">
						<div>
							<p class="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Your Shelter</p>
							<h1 class="text-2xl font-black text-white">{shelter.name}</h1>
							<p class="mt-1 text-sm text-blue-100">
								{shelter.address_line1}{shelter.address_line2 ? ', ' + shelter.address_line2 : ''}<br />
								{shelter.city}, {shelter.state} {shelter.zip}
							</p>
						</div>
						<button
							onclick={startEdit}
							class="ml-4 shrink-0 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/30"
						>
							Edit Info
						</button>
					</div>
				</div>

				<!-- Status bar -->
				<div class="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
					<span class="flex h-2 w-2 shrink-0 rounded-full {status.dot}"></span>
					<div>
						<p class="text-sm font-semibold text-gray-800">{shelter.verification_status ?? 'Unknown'}</p>
						<p class="text-xs text-gray-400">{status.label}</p>
					</div>
					<a
						href="/"
						class="ml-auto text-xs font-medium text-[#0892d2] hover:underline"
					>
						View on map →
					</a>
				</div>
			</div>

			<!-- Availability toggle -->
		<div class="mb-4 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
			<div>
				<p class="text-sm font-semibold text-gray-800">Current Availability</p>
				<p class="text-xs text-gray-400">Visible to the public on shelter cards</p>
			</div>
			<button
				onclick={toggleAvailability}
				class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors
					{shelter.availability_status === 'Full'
					? 'bg-red-100 text-red-700 hover:bg-red-200'
					: 'bg-green-100 text-green-700 hover:bg-green-200'}"
			>
				<span class="h-2 w-2 rounded-full {shelter.availability_status === 'Full' ? 'bg-red-500' : 'bg-green-500'}"></span>
				{shelter.availability_status === 'Full' ? 'Full — Mark as Available' : 'Available — Mark as Full'}
			</button>
		</div>

		<!-- At a glance chips -->
			<div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="mb-1.5 h-5 w-5 text-[#0892d2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
						<circle cx="9" cy="7" r="4"/>
						<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
						<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
					</svg>
					<p class="text-lg font-black text-gray-900">{shelter.capacity ?? '—'}</p>
					<p class="text-xs text-gray-400">Capacity</p>
				</div>
				<div class="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="mb-1.5 h-5 w-5 {shelter.accessibility === 'Yes' ? 'text-green-500' : 'text-gray-300'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 8v4l3 3"/>
					</svg>
					<p class="text-sm font-bold text-gray-900">{shelter.accessibility ?? '—'}</p>
					<p class="text-xs text-gray-400">Accessible</p>
				</div>
				<div class="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="mb-1.5 h-5 w-5 {shelter.pet_friendly === 'Yes' ? 'text-green-500' : 'text-gray-300'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.best-1.6 1.best-3" />
						<path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.844-1.6-1.844-3"/>
						<path d="M8 14v.5"/>
						<path d="M16 14v.5"/>
						<path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
						<path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
					</svg>
					<p class="text-sm font-bold text-gray-900">{shelter.pet_friendly ?? '—'}</p>
					<p class="text-xs text-gray-400">Pet Friendly</p>
				</div>
				<div class="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="mb-1.5 h-5 w-5 {shelter.has_backup_power === 'Yes' ? 'text-green-500' : 'text-gray-300'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
					</svg>
					<p class="text-sm font-bold text-gray-900">{shelter.has_backup_power ?? '—'}</p>
					<p class="text-xs text-gray-400">Backup Power</p>
				</div>
			</div>

			<!-- Details card -->
			<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Details</h2>
				<div class="grid grid-cols-2 gap-y-4 text-sm">
					<div>
						<p class="text-xs text-gray-400">Category</p>
						<p class="font-semibold text-gray-800">{shelter.category ?? '—'}</p>
					</div>
					<div>
						<p class="text-xs text-gray-400">Shelter Type</p>
						<p class="font-semibold text-gray-800">{shelter.shelter_type ?? '—'}</p>
					</div>
					{#if shelter.hours_as_shelter}
						<div class="col-span-2 border-t border-gray-50 pt-4">
							<p class="text-xs text-gray-400">Hours Available</p>
							<p class="font-semibold text-gray-800">{shelter.hours_as_shelter}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Special instructions -->
			{#if shelter.special_instructions}
				<div class="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
					<div class="flex gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<line x1="12" y1="8" x2="12" y2="12"/>
							<line x1="12" y1="16" x2="12.01" y2="16"/>
						</svg>
						<div>
							<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">Special Instructions</p>
							<p class="text-sm text-yellow-800">{shelter.special_instructions}</p>
						</div>
					</div>
				</div>
			{/if}

		{:else}
			<!-- Edit / Create form -->
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-black text-gray-900">
						{shelter ? 'Update Your Shelter' : 'Add Your Shelter'}
					</h1>
					<p class="mt-0.5 text-sm text-gray-400">
						{shelter ? 'Changes go under review before going live.' : 'Your listing will be reviewed before appearing on the map.'}
					</p>
				</div>
				{#if shelter}
					<button onclick={cancelEdit} class="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
				{/if}
			</div>

			<div class="space-y-4">
				<!-- Basic Info -->
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Basic Info</h2>
					<div class="space-y-4">
						<div>
							<label class="field-label" for="name">Shelter Name *</label>
							<input id="name" type="text" bind:value={form.name} class="field-input" placeholder="e.g. First Baptist Church" />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="field-label" for="category">Category</label>
								<select id="category" bind:value={form.category} class="field-input">
									<option value="">— Select —</option>
									{#each CATEGORIES as c}<option>{c}</option>{/each}
								</select>
							</div>
							<div>
								<label class="field-label" for="shelter_type">Shelter Type</label>
								<select id="shelter_type" bind:value={form.shelter_type} class="field-input">
									<option value="">— Select —</option>
									{#each SHELTER_TYPES as t}<option>{t}</option>{/each}
								</select>
							</div>
						</div>
						<div>
							<label class="field-label" for="capacity">Capacity (people)</label>
							<input id="capacity" type="number" bind:value={form.capacity} class="field-input" placeholder="0" min="0" />
						</div>
					</div>
				</div>

				<!-- Address -->
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Address</h2>
					<div class="space-y-4">
						<div>
							<label class="field-label" for="addr1">Street Address *</label>
							<input id="addr1" type="text" bind:value={form.address_line1} class="field-input" placeholder="123 Main St" />
						</div>
						<div>
							<label class="field-label" for="addr2">Address Line 2</label>
							<input id="addr2" type="text" bind:value={form.address_line2} class="field-input" placeholder="Suite, building, etc. (optional)" />
						</div>
						<div class="grid grid-cols-3 gap-3">
							<div class="col-span-1">
								<label class="field-label" for="city">City *</label>
								<input id="city" type="text" bind:value={form.city} class="field-input" />
							</div>
							<div>
								<label class="field-label" for="state">State *</label>
								<input id="state" type="text" bind:value={form.state} class="field-input" maxlength="2" placeholder="MO" />
							</div>
							<div>
								<label class="field-label" for="zip">Zip *</label>
								<input id="zip" type="text" bind:value={form.zip} class="field-input" />
							</div>
						</div>
					</div>
				</div>

				<!-- Map Location -->
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Map Location</h2>
					<p class="mb-4 text-xs text-gray-400">
						Right-click your location on
						<a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" class="text-[#0892d2] hover:underline">Google Maps</a>
						to copy coordinates.
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="field-label" for="lat">Latitude *</label>
							<input id="lat" type="number" step="any" bind:value={form.latitude} class="field-input" placeholder="37.2090" />
						</div>
						<div>
							<label class="field-label" for="lng">Longitude *</label>
							<input id="lng" type="number" step="any" bind:value={form.longitude} class="field-input" placeholder="-93.2923" />
						</div>
					</div>
				</div>

				<!-- Amenities -->
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Amenities & Access</h2>
					<div class="space-y-4">
						<div class="grid grid-cols-3 gap-3">
							<div>
								<label class="field-label" for="access">ADA Accessible</label>
								<select id="access" bind:value={form.accessibility} class="field-input">
									<option value={null}>Unknown</option>
									{#each YES_NO as v}<option>{v}</option>{/each}
								</select>
							</div>
							<div>
								<label class="field-label" for="pets">Pet Friendly</label>
								<select id="pets" bind:value={form.pet_friendly} class="field-input">
									<option value={null}>Unknown</option>
									{#each YES_NO as v}<option>{v}</option>{/each}
								</select>
							</div>
							<div>
								<label class="field-label" for="power">Backup Power</label>
								<select id="power" bind:value={form.has_backup_power} class="field-input">
									<option value={null}>Unknown</option>
									{#each YES_NO as v}<option>{v}</option>{/each}
								</select>
							</div>
						</div>
						<div>
							<label class="field-label" for="hours">Hours Available</label>
							<input id="hours" type="text" bind:value={form.hours_as_shelter} class="field-input" placeholder="e.g. 24 hours, Non-school hours, 8am–5pm" />
						</div>
						<div>
							<label class="field-label" for="instructions">Special Instructions</label>
							<textarea
								id="instructions"
								bind:value={form.special_instructions}
								class="field-input"
								rows="3"
								placeholder="Entry instructions, which door to use, any restrictions, etc."
							></textarea>
						</div>
					</div>
				</div>

				<!-- Save -->
				<button
					onclick={save}
					disabled={saving}
					class="w-full rounded-2xl bg-[#0892d2] py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0778b0] disabled:opacity-60"
				>
					{saving ? 'Saving…' : shelter ? 'Save Changes' : 'Submit My Shelter'}
				</button>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(.field-label) {
		display: block;
		margin-bottom: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
	}
	:global(.field-input) {
		display: block;
		width: 100%;
		border-radius: 0.625rem;
		border: 1.5px solid #e5e7eb;
		padding: 0.6rem 0.875rem;
		font-size: 0.875rem;
		color: #111827;
		background: #fafafa;
		transition: border-color 0.15s, background 0.15s;
	}
	:global(.field-input:focus) {
		outline: none;
		border-color: #0892d2;
		background: white;
		box-shadow: 0 0 0 3px rgba(8, 146, 210, 0.1);
	}
</style>
