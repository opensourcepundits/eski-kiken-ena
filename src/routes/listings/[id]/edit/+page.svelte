<script lang="ts">
	import { enhance } from '$app/forms';
	import MapPicker from '$lib/components/MapPicker.svelte';

	let { data, form } = $props();
	let listing = $derived(data.listing);

	let latValue = $state<string>('');
	let lngValue = $state<string>('');
	let pickupAddressValue = $state<string>('');
	let dispatchValue = $state<string>('PICKUP_ONLY');
	let deliveryAreasValue = $state<string>('');
	let replacementValue = $state<string>('');

	$effect(() => {
		latValue = data.listing.lat?.toString() || '';
		lngValue = data.listing.lng?.toString() || '';
		pickupAddressValue = data.listing.pickupAddress || '';
		dispatchValue = data.listing.dispatch || 'PICKUP_ONLY';
		deliveryAreasValue = data.listing.deliveryAreas || 'Quatre Bornes, Rose Hill, Trianon, ...';
		replacementValue = data.listing.replacementValue || '';
	});

	const dispatchOptions = [
		{ value: 'DELIVER_ONLY', label: 'Delivery only' },
		{ value: 'PICKUP_ONLY', label: 'Pick up only' },
		{ value: 'PICKUP_OR_DELIVERY', label: 'Pick up or Delivery' }
	];

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
	const transportSizes = ['BACKPACK', 'CAR_TRUNK', 'BACKSEAT', 'PICKUP_TRUCK', 'VAN_REQUIRED'];
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto">
		<a
			href="/profile"
			class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-teal-600 mb-8 transition-colors group"
		>
			<span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
			Back to Profile
		</a>

		<div class="bg-white rounded-md shadow-xl overflow-hidden border border-slate-200">
			<div class="bg-teal-600 px-8 py-10 text-white">
				<h1 class="text-3xl font-extrabold">Edit Your Listing</h1>
				<p class="mt-2 text-indigo-100 italic opacity-80">
					Update your item details, logistics, and financials.
				</p>
			</div>

			<form method="POST" use:enhance class="p-8 space-y-8">
				{#if form?.message}
					<div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">
						{form.message}
					</div>
				{/if}

				<!-- Core Information -->
				<section>
					<div class="flex items-center gap-2 mb-4">
						<h2 class="text-xl font-semibold text-slate-800">Core Information</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="sm:col-span-2">
							<label for="title" class="block text-sm font-medium text-slate-700"
								>Item Title *</label
							>
							<input
								type="text"
								name="title"
								id="title"
								required
								value={listing.title}
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
								placeholder="e.g. Makita Cordless Drill HP457D"
							/>
						</div>

						<div class="sm:col-span-2">
							<label for="description" class="block text-sm font-medium text-slate-700"
								>Description</label
							>
							<textarea
								name="description"
								id="description"
								rows="3"
								required
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
								placeholder="Describe the item, its condition, and what's included..."
								>{listing.description}</textarea
							>
						</div>

						<div>
							<label for="brand" class="block text-sm font-medium text-slate-700">Brand</label>
							<input
								type="text"
								name="brand"
								id="brand"
								value={listing.brand || ''}
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
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
								value={listing.modelNumber || ''}
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
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
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border bg-white"
							>
								{#each categories as cat}
									<option value={cat} selected={listing.category === cat}
										>{cat.replace('_', ' ')}</option
									>
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
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border bg-white"
							>
								{#each conditions as cond}
									<option value={cond} selected={listing.condition === cond}
										>{cond.replace('_', ' ')}</option
									>
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
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">None / Manual</option>
								{#each powerSources as source}
									<option value={source} selected={listing.powerSource === source}
										>{source.replace('_', ' ')}</option
									>
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
							<label for="dispatch" class="block text-sm font-medium text-slate-700"
								>Dispatch *</label
							>
							<select
								id="dispatch"
								name="dispatch"
								bind:value={dispatchValue}
								required
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border bg-white"
							>
								{#each dispatchOptions as option}
									<option value={option.value}>{option.label}</option>
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
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border bg-white"
							>
								<option value="">Not Specified</option>
								{#each transportSizes as size}
									<option value={size} selected={listing.transportSize === size}
										>{size.replace('_', ' ')}</option
									>
								{/each}
							</select>
						</div>

						{#if dispatchValue === 'DELIVER_ONLY' || dispatchValue === 'PICKUP_OR_DELIVERY'}
							<div class="sm:col-span-1">
								<label for="deliveryAreas" class="block text-sm font-medium text-slate-700"
									>Delivery applicable for: *</label
								>
								<input
									type="text"
									id="deliveryAreas"
									name="deliveryAreas"
									bind:value={deliveryAreasValue}
									required
									class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
								/>
							</div>
						{/if}

						<div class="sm:col-span-2 space-y-4">
							<label for="pickupAddress" class="block text-sm font-medium text-slate-700"
								>Pickup Address {dispatchValue === 'PICKUP_OR_DELIVERY' ? '*' : '(Optional)'}</label
							>
							<div class="flex gap-2">
								<input
									type="text"
									name="pickupAddress"
									id="pickupAddress"
									bind:value={pickupAddressValue}
									required={dispatchValue === 'PICKUP_OR_DELIVERY'}
									class="flex-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
									placeholder="e.g. 12, Rue de la Paix, Port Louis"
								/>
								<MapPicker
									lat={latValue ? parseFloat(latValue) : null}
									lng={lngValue ? parseFloat(lngValue) : null}
									onLocationSelect={(lat, lng, address) => {
										latValue = lat.toString();
										lngValue = lng.toString();
										if (address) {
											pickupAddressValue = address;
										}
									}}
								/>
							</div>
							{#if dispatchValue === 'PICKUP_OR_DELIVERY' && (!latValue || !lngValue)}
								<p class="text-sm text-red-600">
									⚠️ Please select a location on the map (required)
								</p>
							{/if}
						</div>
					</div>

					<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="flex-1">
							<h3 class="block text-sm font-medium text-slate-700 mb-2">
								Operating Hours (For Pickup/Return)
							</h3>
							<div class="flex gap-4 items-center">
								<div class="flex-1">
									<label for="operatingHoursStart" class="block text-xs text-slate-500 mb-1"
										>Start Time</label
									>
									<input
										type="time"
										name="operatingHoursStart"
										id="operatingHoursStart"
										value={listing.operatingHours?.start || '09:00'}
										required
										class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
									/>
								</div>
								<span class="text-slate-400">to</span>
								<div class="flex-1">
									<label for="operatingHoursEnd" class="block text-xs text-slate-500 mb-1"
										>End Time</label
									>
									<input
										type="time"
										name="operatingHoursEnd"
										id="operatingHoursEnd"
										value={listing.operatingHours?.end || '17:00'}
										required
										class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="flex-1">
							<label
								for="bufferDays"
								class="flex items-center gap-2 text-sm font-medium text-slate-700"
							>
								Buffer Days between listings
								<div class="group relative inline-block">
									<span
										class="cursor-help bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
										>i</span
									>
									<div
										class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-50 normal-case leading-tight font-normal"
									>
										This can be used for checking the quality of the item before renting it out
										again.
									</div>
								</div>
							</label>
							<input
								type="number"
								name="bufferDays"
								id="bufferDays"
								min="0"
								value={listing.bufferDays || 0}
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border h-[42px]"
							/>
						</div>

						<div class="flex-1">
							<label
								for="headsUpDays"
								class="flex items-center gap-2 text-sm font-medium text-slate-700"
							>
								Heads up days before booking
								<div class="group relative inline-block">
									<span
										class="cursor-help bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
										>i</span
									>
									<div
										class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-50 normal-case leading-tight font-normal"
									>
										The minimum number of days of heads up the lister needs to prepare the item
										before renting it out.
									</div>
								</div>
							</label>
							<input
								type="number"
								name="headsUpDays"
								id="headsUpDays"
								min="0"
								value={listing.headsUpDays || 0}
								class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border h-[42px]"
							/>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Financials -->
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
									value={listing.pricePerDay}
									class="block w-full pl-10 rounded-lg border-slate-300 focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
								/>
							</div>
						</div>

						<div>
							<label for="replacementValue" class="block text-sm font-medium text-slate-700"
								>Item's Value (Rs)</label
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
									bind:value={replacementValue}
									class="block w-full pl-10 rounded-lg border-slate-300 focus:border-teal-600 focus:ring-teal-600 sm:text-sm p-2.5 border"
								/>
							</div>
						</div>
					</div>
				</section>

				<!-- Hidden inputs for lat/lng and district -->
				<input type="hidden" name="lat" value={latValue} />
				<input type="hidden" name="lng" value={lngValue} />

				<div class="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
					<a
						href="/profile"
						class="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
					>
						Cancel
					</a>
					<button
						type="submit"
						disabled={dispatchValue === 'PICKUP_OR_DELIVERY' && (!latValue || !lngValue)}
						class="px-10 py-2.5 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-black tracking-widest"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
