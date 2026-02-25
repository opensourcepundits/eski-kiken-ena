<script lang="ts">
	import { enhance } from '$app/forms';
	import MapPicker from '$lib/components/MapPicker.svelte';
	import { fly } from 'svelte/transition';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ResultModal from '$lib/components/ResultModal.svelte';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let isSubmitting = $state(false);
	let showSuccessModal = $state(false);

	let latValue = $state<string>('');
	let lngValue = $state<string>('');
	let pickupAddressValue = $state<string>('');
	let dispatchValue = $state<string>('PICKUP_ONLY');
	let deliveryAreasValue = $state<string>('');

	let replacementValue = $state<string>('');

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

	let images = $state<FileList | null>(null);
	let previewUrls = $state<string[]>([]);

	function handleImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			images = target.files;
			previewUrls = Array.from(target.files).map((file) => URL.createObjectURL(file));
		}
	}
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto">
		<a
			href="/listings"
			class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors group"
		>
			<span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
			Back to Browse
		</a>

		<div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
			<div class="bg-secondary px-8 py-10 text-background">
				<h1 class="text-3xl font-black">List Your Gear</h1>
				<p class="mt-2 text-background/70 italic">
					Save money, earn extra income, and build a stronger community.
				</p>
			</div>

			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							showSuccessModal = true;
						} else {
							await update();
						}
					};
				}}
				enctype="multipart/form-data"
				class="p-8 space-y-8"
			>
				{#if form?.message}
					<div
						class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold"
						in:fly={{ y: -20 }}
					>
						{form.message}
					</div>
				{/if}

				<!-- Core Information -->
				<section>
					<h2 class="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
						<span class="w-1.5 h-6 bg-primary rounded-full"></span>
						Core Information
					</h2>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="sm:col-span-2">
							<label for="title" class="block text-sm font-bold text-slate-700 mb-1"
								>Item Title *</label
							>
							<input
								type="text"
								name="title"
								id="title"
								required
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
								placeholder="e.g. Makita Cordless Drill HP457D"
							/>
						</div>

						<div class="sm:col-span-2">
							<label for="description" class="block text-sm font-bold text-slate-700 mb-1"
								>Description *</label
							>
							<textarea
								name="description"
								id="description"
								rows="4"
								required
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
								placeholder="Describe the item, its condition, and what's included..."
							></textarea>
						</div>

						<div>
							<label for="brand" class="block text-sm font-bold text-slate-700 mb-1">Brand</label>
							<input
								type="text"
								name="brand"
								id="brand"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
								placeholder="e.g. Makita"
							/>
						</div>

						<div>
							<label for="modelNumber" class="block text-sm font-bold text-slate-700 mb-1"
								>Model Number</label
							>
							<input
								type="text"
								name="modelNumber"
								id="modelNumber"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
								placeholder="e.g. HP457D"
							/>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Images -->
				<section>
					<h2 class="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
						<span class="w-1.5 h-6 bg-primary rounded-full"></span>
						Images
					</h2>
					<div class="space-y-4">
						<label for="images" class="block text-sm font-bold text-slate-700 mb-1">
							Upload Images (Max 5, first one is cover) *
						</label>
						<div
							class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-colors bg-slate-50/50 cursor-pointer relative"
						>
							<input
								type="file"
								id="images"
								name="images"
								multiple
								accept="image/*"
								onchange={handleImageChange}
								class="absolute inset-0 opacity-0 cursor-pointer"
							/>
							<div class="space-y-2">
								<svg
									class="mx-auto h-12 w-12 text-slate-400"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 48 48"
									aria-hidden="true"
								>
									<path
										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<p class="text-sm text-slate-600">
									<span class="text-primary font-bold">Click to upload</span> or drag and drop
								</p>
								<p class="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
							</div>
						</div>

						{#if previewUrls.length > 0}
							<div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
								{#each previewUrls as url, i}
									<div
										class="relative aspect-square rounded-xl overflow-hidden border border-slate-100"
									>
										<img src={url} alt="Preview {i + 1}" class="w-full h-full object-cover" />
										{#if i === 0}
											<span
												class="absolute top-2 left-2 bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
												>Cover</span
											>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
						<input type="hidden" name="imageCount" value={previewUrls.length} />
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Classification -->
				<section>
					<h2 class="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
						<span class="w-1.5 h-6 bg-primary rounded-full"></span>
						Classification
					</h2>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<div>
							<label for="category" class="block text-sm font-bold text-slate-700 mb-1"
								>Category *</label
							>
							<select
								id="category"
								name="category"
								required
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							>
								<option value="" disabled selected>Select category</option>
								{#each categories as cat}
									<option value={cat}>{cat.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="condition" class="block text-sm font-bold text-slate-700 mb-1"
								>Condition *</label
							>
							<select
								id="condition"
								name="condition"
								required
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							>
								{#each conditions as cond}
									<option value={cond}>{cond.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="powerSource" class="block text-sm font-bold text-slate-700 mb-1"
								>Power Source</label
							>
							<select
								id="powerSource"
								name="powerSource"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
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
					<h2 class="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
						<span class="w-1.5 h-6 bg-primary rounded-full"></span>
						Logistics
					</h2>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="dispatch" class="block text-sm font-bold text-slate-700 mb-1"
								>Dispatch *</label
							>
							<select
								id="dispatch"
								name="dispatch"
								bind:value={dispatchValue}
								required
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							>
								{#each dispatchOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="transportSize" class="block text-sm font-bold text-slate-700 mb-1"
								>Transport Requirements</label
							>
							<select
								id="transportSize"
								name="transportSize"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							>
								<option value="">Not Specified</option>
								{#each transportSizes as size}
									<option value={size}>{size.replace('_', ' ')}</option>
								{/each}
							</select>
						</div>

						{#if dispatchValue === 'DELIVER_ONLY' || dispatchValue === 'PICKUP_OR_DELIVERY'}
							<div class="sm:col-span-1" in:fly={{ y: 20 }}>
								<label for="deliveryAreas" class="block text-sm font-bold text-slate-700 mb-1"
									>Delivery applicable for: *</label
								>
								<input
									type="text"
									id="deliveryAreas"
									name="deliveryAreas"
									bind:value={deliveryAreasValue}
									required
									placeholder="e.g. Port Louis, Vacaos, Ebene"
									class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
								/>
							</div>
						{/if}

						<div class="sm:col-span-2 space-y-4">
							<label for="pickupAddress" class="block text-sm font-bold text-slate-700"
								>Pickup Location {dispatchValue === 'PICKUP_OR_DELIVERY'
									? '*'
									: '(Optional)'}</label
							>
							<div class="flex gap-2">
								<input
									type="text"
									name="pickupAddress"
									id="pickupAddress"
									bind:value={pickupAddressValue}
									required={dispatchValue === 'PICKUP_OR_DELIVERY'}
									class="flex-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
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
								<p class="text-xs text-red-500 font-bold italic">
									⚠️ Please select a location on the map
								</p>
							{/if}
						</div>
					</div>

					<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="flex-1">
							<h3 class="block text-sm font-bold text-slate-700 mb-2">
								Operating Hours (For Pickup/Return)
							</h3>
							<div class="flex gap-4 items-center">
								<div class="flex-1">
									<label
										for="operatingHoursStart"
										class="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1"
										>Start</label
									>
									<input
										type="time"
										name="operatingHoursStart"
										id="operatingHoursStart"
										value="09:00"
										required
										class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
									/>
								</div>
								<span class="text-slate-300 mt-5">to</span>
								<div class="flex-1">
									<label
										for="operatingHoursEnd"
										class="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1"
										>End</label
									>
									<input
										type="time"
										name="operatingHoursEnd"
										id="operatingHoursEnd"
										value="17:00"
										required
										class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="flex-1">
							<label
								for="bufferDays"
								class="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1"
							>
								Buffer Days between listings
								<div class="group relative inline-block">
									<span
										class="cursor-help bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
										>i</span
									>
									<div
										class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 p-3 bg-secondary text-background text-xs rounded-xl shadow-2xl z-50 leading-relaxed"
									>
										Time needed to check equipment quality before the next rental.
									</div>
								</div>
							</label>
							<input
								type="number"
								name="bufferDays"
								id="bufferDays"
								min="0"
								value="0"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							/>
						</div>

						<div class="flex-1">
							<label
								for="headsUpDays"
								class="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1"
							>
								Heads up days before booking
								<div class="group relative inline-block">
									<span
										class="cursor-help bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
										>i</span
									>
									<div
										class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 p-3 bg-secondary text-background text-xs rounded-xl shadow-2xl z-50 leading-relaxed"
									>
										Minimum notice period required before a booking starts.
									</div>
								</div>
							</label>
							<input
								type="number"
								name="headsUpDays"
								id="headsUpDays"
								min="0"
								value="0"
								class="block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-50/50"
							/>
						</div>
					</div>
				</section>

				<hr class="border-slate-100" />

				<!-- Financials -->
				<section>
					<h2 class="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
						<span class="w-1.5 h-6 bg-primary rounded-full"></span>
						Financials
					</h2>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<div>
							<label for="pricePerDay" class="block text-sm font-bold text-slate-700 mb-1"
								>Price / Day *</label
							>
							<div class="relative rounded-xl shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<span class="text-slate-400 sm:text-sm font-bold">Rs</span>
								</div>
								<input
									type="number"
									step="1"
									name="pricePerDay"
									id="pricePerDay"
									required
									placeholder="0"
									class="block w-full pl-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-100/30"
								/>
							</div>
						</div>

						<div>
							<label for="replacementValue" class="block text-sm font-bold text-slate-700 mb-1"
								>Item's Value</label
							>
							<div class="relative rounded-xl shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<span class="text-slate-400 sm:text-sm font-bold">Rs</span>
								</div>
								<input
									type="number"
									step="1"
									name="replacementValue"
									id="replacementValue"
									bind:value={replacementValue}
									placeholder="e.g. 5000"
									class="block w-full pl-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary sm:text-sm p-3 border bg-slate-100/30"
								/>
							</div>
						</div>
					</div>
				</section>

				<!-- Hidden inputs for lat/lng -->
				<input type="hidden" name="lat" value={latValue} />
				<input type="hidden" name="lng" value={lngValue} />

				<div
					class="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4"
				>
					<a
						href="/listings"
						class="w-full sm:w-auto text-center px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
					>
						Cancel
					</a>
					<button
						type="submit"
						disabled={(dispatchValue === 'PICKUP_OR_DELIVERY' && (!latValue || !lngValue)) ||
							isSubmitting}
						class="w-full sm:w-auto px-12 py-3 rounded-xl text-sm font-black text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<LoadingSpinner />
							Listing Item...
						{:else}
							Submit Listing
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<ResultModal
	isOpen={showSuccessModal}
	title="Listing Created Successfully!"
	message="Your item is now live and ready for rentals. Track its performance in your dashboard."
	buttonText="Go to Listings"
	onClose={() => goto('/listings')}
/>
