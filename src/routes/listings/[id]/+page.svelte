<script lang="ts">
	import { enhance } from '$app/forms';
	import ListingMap from '$lib/components/ListingMap.svelte';
	import ImageCarousel from '$lib/components/ImageCarousel.svelte';
	import DateRangeCalendar from '$lib/components/DateRangeCalendar.svelte';

	let { data, form } = $props<{ data: any; form: any }>();
	let listing = $derived(data.listing);

	let startDate = $state('');
	let endDate = $state('');
	let hasConflict = false;

	let totalPrice = $derived.by(() => {
		if (!startDate || !endDate) return 0;
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (end <= start) return 0;
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const rentalCost = Number(listing.pricePerDay) * diffDays;
		const deposit = Number(listing.deposit || 0);
		return rentalCost + deposit;
	});

	let occupiedDates = $derived(
		listing.bookings
			?.filter((b: any) => b.status === 'CONFIRMED')
			.map((b: any) => ({
				start: new Date(b.startDate),
				end: new Date(b.endDate)
			})) || []
	);

	let formattedDate = $derived(
		new Intl.DateTimeFormat('en-GB', {
			month: 'long',
			year: 'numeric'
		}).format(new Date(listing?.createdAt ?? new Date()))
	);
</script>

<div class="min-h-screen bg-white">
	<!-- Top Padding for UI Clarity -->
	<div class="h-20 bg-slate-900"></div>

	<main class="max-w-7xl mx-auto px-4 py-12 lg:py-20">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
			<!-- Left Column: Gallery & Details -->
			<div class="lg:col-span-8 space-y-12">
				<!-- Breadcrumbs & Header -->
				<div>
					<nav class="flex text-sm text-slate-500 mb-6 gap-2">
						<a href="/listings" class="hover:text-indigo-600 font-bold">Listings</a>
						<span>/</span>
						<span class="text-slate-900 font-medium">{listing.category?.replace('_', ' ')}</span>
					</nav>
					<h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
						{listing.title}
					</h1>
					<div class="flex flex-wrap items-center gap-6 text-slate-600">
						<div class="flex items-center gap-2">
							<span class="text-indigo-600 text-xl">📍</span>
							<span class="font-bold text-slate-900">{listing.district?.replace('_', ' ')}</span>
						</div>
						<div class="flex items-center gap-2">
							<span>Listed {formattedDate}</span>
						</div>
					</div>
				</div>

				<!-- Main Image -->
				<ImageCarousel
					images={(listing.images as string[]) || []}
					alt={listing.title}
					containerClass="aspect-[16/9] bg-slate-100 rounded-[2.5rem] shadow-2xl"
				/>

				<!-- Description & Features -->
				<div class="prose prose-slate max-w-none">
					<h2 class="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
						About this item
					</h2>
					<p class="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg font-medium">
						{listing.description}
					</p>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
						<div class="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
							<div class="flex items-center gap-3 mb-6 text-indigo-600">
								<h3 class="font-black text-slate-900 m-0 uppercase tracking-widest text-xs">
									🛠️ Specifications
								</h3>
							</div>
							<ul class="space-y-4 text-base list-none p-0 m-0">
								<li class="flex justify-between border-b border-slate-200/50 pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>Brand</span
									>
									<span class="font-black text-slate-900"
										>{listing.brand || 'Professional Grade'}</span
									>
								</li>
								<li class="flex justify-between border-b border-slate-200/50 pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>Model</span
									>
									<span class="font-black text-slate-900">{listing.modelNumber || 'N/A'}</span>
								</li>
								<li class="flex justify-between border-b border-slate-200/50 pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>Condition</span
									>
									<span class="font-black text-slate-900"
										>{listing.condition?.replace('_', ' ') ?? 'GOOD'}</span
									>
								</li>
								<li class="flex justify-between pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>Power</span
									>
									<span class="font-black text-slate-900"
										>{listing.powerSource?.replace('_', ' ') || 'Manual'}</span
									>
								</li>
							</ul>
						</div>

						<div class="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
							<div class="flex items-center gap-3 mb-6 text-indigo-600">
								<h3 class="font-black text-slate-900 m-0 uppercase tracking-widest text-xs">
									🚚 Logistics
								</h3>
							</div>
							<ul class="space-y-4 text-base list-none p-0 m-0 font-bold">
								{#if listing.transportSize}
									<li class="flex justify-between border-b border-slate-200/50 pb-3">
										<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
											>Size</span
										>
										<span class="text-slate-900">{listing.transportSize.replace('_', ' ')}</span>
									</li>
								{/if}
								{#if listing.district}
									<li class="flex justify-between pb-3">
										<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
											>District</span
										>
										<span class="text-slate-900">{listing.district.replace('_', ' ')}</span>
									</li>
								{/if}
							</ul>
						</div>
					</div>

					<!-- Location Detail -->
					{#if listing.lat && listing.lng}
						<div class="mt-12">
							<h2 class="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
								Location
							</h2>
							<div
								class="bg-slate-100 rounded-3xl h-96 w-full overflow-hidden border border-slate-200 shadow-lg"
							>
								<ListingMap lat={listing.lat} lng={listing.lng} title={listing.title} />
							</div>
							{#if listing.pickupAddress}
								<div class="mt-4 flex items-center gap-2 text-slate-600">
									<span class="text-indigo-600">📍</span>
									<span class="font-medium">{listing.pickupAddress}</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Dispatch & Delivery Information -->
					<div class="mt-12">
						<h2 class="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
							Delivery & Pickup
						</h2>
						<div class="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
							<div class="space-y-4">
								<div class="flex items-start gap-3">
									<div>
										<div class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
											Dispatch Method
										</div>
										<div class="font-bold text-slate-900">
											{#if listing.dispatch === 'DELIVER_ONLY'}
												Delivery only
											{:else if listing.dispatch === 'PICKUP_ONLY'}
												Pick up only
											{:else if listing.dispatch === 'PICKUP_OR_DELIVERY'}
												Pick up or Delivery
											{:else}
												Not specified
											{/if}
										</div>
									</div>
								</div>
								{#if listing.deliveryAreas}
									<div class="flex items-start gap-3 pt-4 border-t border-slate-200">
										<div>
											<div class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
												Delivery applicable for
											</div>
											<div class="font-medium text-slate-700">{listing.deliveryAreas}</div>
										</div>
									</div>
								{/if}
								{#if listing.transportSize}
									<div class="flex items-start gap-3 pt-4 border-t border-slate-200">
										<div>
											<div class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
												Transport Requirements
											</div>
											<div class="font-medium text-slate-700">
												{listing.transportSize.replace(/_/g, ' ')}
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Booking Card -->
			<div class="lg:col-span-4">
				<div class="sticky top-32 space-y-6">
					<div
						class="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 overflow-hidden relative"
					>
						<!-- Price Header -->
						<div class="flex items-baseline justify-between mb-8">
							<div class="flex items-baseline gap-1">
								<span class="text-4xl font-black text-indigo-600">Rs {listing.pricePerDay}</span>
								<span class="text-slate-400 font-medium italic">/ day</span>
							</div>
						</div>

						<form method="POST" action="?/book" use:enhance class="space-y-6">
							{#if form?.message}
								<div
									class="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2"
								>
									{form.message}
								</div>
							{/if}

							<DateRangeCalendar
								bind:startDate
								bind:endDate
								blockedRanges={data.blockedRanges}
								bind:hasConflict
							/>
							<!-- Hidden fields to submit selected date range with the form -->
							<input type="hidden" name="startDate" value={startDate} />
							<input type="hidden" name="endDate" value={endDate} />

							{#if occupiedDates.length > 0}
								<div class="space-y-3">
									<h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
										📅 Occupied Dates
									</h4>
									<div class="flex flex-wrap gap-2">
										{#each occupiedDates as range}
											<div
												class="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-black border border-red-100"
											>
												{range.start.toLocaleDateString('en-GB')} - {range.end.toLocaleDateString(
													'en-GB'
												)}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if totalPrice > 0}
								<div
									class="bg-indigo-50 p-6 rounded-3xl space-y-4 border border-indigo-100 animate-in zoom-in-95"
								>
									<div class="space-y-2 pb-3 border-b border-indigo-200/30">
										<div
											class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"
										>
											<span
												>Rental ({Math.ceil(
													Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) /
														(1000 * 60 * 60 * 24)
												)} days)</span
											>
											<span
												>Rs {Number(listing.pricePerDay) *
													Math.ceil(
														Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) /
															(1000 * 60 * 60 * 24)
													)}</span
											>
										</div>
										<div
											class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"
										>
											<span>Security Deposit</span>
											<span>Rs {listing.deposit || 0}</span>
										</div>
									</div>
									<div
										class="flex justify-between items-center text-sm font-bold text-slate-600 uppercase tracking-widest"
									>
										<span>Total to Pay</span>
										<span class="text-indigo-600 text-xl font-black">Rs {totalPrice}</span>
									</div>
								</div>
							{/if}

							<!-- Action Button -->
							<button
								type="submit"
								class="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transform"
							>
								Request Booking
							</button>
						</form>
					</div>

					<!-- Owner Info -->
					<div
						class="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex items-center gap-4 group"
					>
						<div
							class="w-16 h-16 rounded-2xl bg-white border-2 border-indigo-50 flex items-center justify-center overflow-hidden text-2xl shadow-sm group-hover:scale-110 transition-transform"
						>
							👤
						</div>
						<div>
							<p
								class="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 leading-none"
							>
								Property of
							</p>
							<h4 class="text-lg font-black text-slate-900 leading-tight">
								{listing.owner?.firstName}
								{listing.owner?.lastName}
							</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
