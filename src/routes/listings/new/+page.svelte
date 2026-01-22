<script lang="ts">
	import { enhance } from '$app/forms';
	import MapPicker from '$lib/components/MapPicker.svelte';

	let { form } = $props();

	let latValue = $state<string>('');
	let lngValue = $state<string>('');

	const categories = [
		'POWER_TOOLS',
		'GARDENING',
		'CONSTRUCTION',
		'CLEANING',
		'AUTOMOTIVE',
		'GENERATORS',
		'LADDERS',
		'SCAFFOLDING',
		'OTHER'
	];

	const conditions = ['LIKE_NEW', 'GOOD', 'FUNCTIONAL', 'HEAVY_WEAR'];

	const powerSources = ['BATTERY', 'CORDED_220V', 'PETROL', 'DIESEL', 'MANUAL'];

	const districts = [
		'PORT_LOUIS',
		'PAMPLEMOUSSES',
		'RIVIERE_DU_REMPART',
		'FLACQ',
		'GRAND_PORT',
		'SAVANNE',
		'PLAINES_WILHEMS',
		'MOKA',
		'BLACK_RIVER',
		'RODRIGUES'
	];

	const transportSizes = ['BACKPACK', 'CAR_TRUNK', 'BACKSEAT', 'PICKUP_TRUCK', 'VAN_REQUIRED'];
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto">
		<div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
			<div class="bg-primary px-8 py-10">
				<h1 class="text-3xl font-extrabold text-background">List Your Item</h1>
				<p class="mt-2 text-background/70 italic">
					Share your tools and earn while helping others finish their projects.
				</p>
			</div>

			<form method="POST" action="/listings/new" use:enhance class="p-8 space-y-8">
				{#if form?.message}
					<div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
						{form.message}
					</div>
				{/if}

				<!-- Core Information -->
				<section>
					<div class="flex items-center gap-2 mb-4">
						<span class="text-accent text-xl"></span>
						<h2 class="text-xl font-semibold text-secondary">Core Information</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="sm:col-span-2">
							<label for="title" class="block text-sm font-medium text-secondary"
								>Item Title *</label
							>
							<input
								type="text"
								name="title"
								id="title"
								required
								class="mt-1 block w-full rounded-lg border-surface shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2.5 border"
								placeholder="e.g. Makita Cordless Drill HP457D"
							/>
						</div>

						<div class="sm:col-span-2">
							<label for="description" class="block text-sm font-medium text-secondary"
								>Description</label
							>
							<textarea
								name="description"
								id="description"
								rows="3"
								class="mt-1 block w-full rounded-lg border-surface shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2.5 border"
								placeholder="Describe the item, its condition, and what's included..."
							></textarea>
						</div>

						<div>
							<label for="brand" class="block text-sm font-medium text-secondary">Brand</label>
							<input
								type="text"
								name="brand"
								id="brand"
								class="mt-1 block w-full rounded-lg border-surface shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2.5 border"
							/>
						</div>

						<div>
							<label for="modelNumber" class="block text-sm font-medium text-slate-700"
								>Model Number</label
							>
							<input
								type="text"
								name="modelNumber"
								id="modelNumber"
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
							/>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Classification -->
				<section>
					<div class="flex items-center gap-2 mb-4">
						<h2 class="text-xl font-semibold text-slate-800">Classification</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<div>
							<label for="category" class="block text-sm font-medium text-slate-700"
								>Category *</label
							>
							<select
								id="category"
								name="category"
								required
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">Select Category</option>
								{#each categories as cat}
									<option value={cat}>{cat.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="condition" class="block text-sm font-medium text-slate-700"
								>Condition</label
							>
							<select
								id="condition"
								name="condition"
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white"
							>
								{#each conditions as cond}
									<option value={cond} selected={cond === 'GOOD'}>{cond.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="powerSource" class="block text-sm font-medium text-slate-700"
								>Power Source</label
							>
							<select
								id="powerSource"
								name="powerSource"
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">None / Manual</option>
								{#each powerSources as source}
									<option value={source}>{source.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Logistics -->
				<section>
					<div class="flex items-center gap-2 mb-4">
						<h2 class="text-xl font-semibold text-slate-800">Logistics</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="district" class="block text-sm font-medium text-slate-700"
								>District *</label
							>
							<select
								id="district"
								name="district"
								required
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">Select District</option>
								{#each districts as dist}
									<option value={dist}>{dist.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="transportSize" class="block text-sm font-medium text-slate-700"
								>Transport Requirements</label
							>
							<select
								id="transportSize"
								name="transportSize"
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">Not Specified</option>
								{#each transportSizes as size}
									<option value={size}>{size.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div class="sm:col-span-2 space-y-4">
							<label for="pickupAddress" class="block text-sm font-medium text-slate-700"
								>Pickup Address</label
							>
							<div class="flex gap-2">
								<input
									type="text"
									name="pickupAddress"
									id="pickupAddress"
									class="flex-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
									placeholder="e.g. 12, Rue de la Paix, Port Louis"
								/>
								<MapPicker
									lat={latValue ? parseFloat(latValue) : null}
									lng={lngValue ? parseFloat(lngValue) : null}
									onLocationSelect={(lat, lng) => {
										latValue = lat.toString();
										lngValue = lng.toString();
									}}
								/>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-1">
									<label
										for="lat"
										class="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1"
										>Latitude</label
									>
									<input
										type="text"
										id="lat"
										name="lat"
										bind:value={latValue}
										readonly
										class="block w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 text-xs p-2 border"
										placeholder="Select on map"
									/>
								</div>
								<div class="space-y-1">
									<label
										for="lng"
										class="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1"
										>Longitude</label
									>
									<input
										type="text"
										id="lng"
										name="lng"
										bind:value={lngValue}
										readonly
										class="block w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 text-xs p-2 border"
										placeholder="Select on map"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<section>
					<div class="flex items-center gap-2 mb-4">
						<h2 class="text-xl font-semibold text-slate-800">Financials</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<div>
							<label for="pricePerDay" class="block text-sm font-medium text-slate-700"
								>Price / Day (Rs) *</label
							>
							<div class="mt-1 relative rounded-lg shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-slate-500 sm:text-sm">Rs</span>
								</div>
								<input
									type="number"
									step="0.01"
									name="pricePerDay"
									id="pricePerDay"
									required
									class="block w-full pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
								/>
							</div>
						</div>

						<div>
							<label for="deposit" class="block text-sm font-medium text-slate-700"
								>Security Deposit (Rs)</label
							>
							<div class="mt-1 relative rounded-lg shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-slate-500 sm:text-sm">Rs</span>
								</div>
								<input
									type="number"
									step="0.01"
									name="deposit"
									id="deposit"
									class="block w-full pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
								/>
							</div>
						</div>

						<div>
							<label for="replacementValue" class="block text-sm font-medium text-slate-700"
								>Replacement Value (Rs)</label
							>
							<div class="mt-1 relative rounded-lg shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-slate-500 sm:text-sm">Rs</span>
								</div>
								<input
									type="number"
									step="0.01"
									name="replacementValue"
									id="replacementValue"
									class="block w-full pl-10 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
								/>
							</div>
						</div>
					</div>
				</section>

				<div class="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
					<button
						type="button"
						class="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-10 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-indigo-200"
					>
						Create Listing
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
