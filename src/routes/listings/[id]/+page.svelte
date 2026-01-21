<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props<{ data: any; form: any }>();
	let listing = $derived(data.listing);

	let startDate = $state('');
	let endDate = $state('');

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
		listing.bookings?.map((b: any) => ({
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
				<div
					class="aspect-[16/9] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
				>
					{#if (listing.images as string[]).length > 0}
						<img
							src={(listing.images as string[])[0]}
							alt={listing.title}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div
							class="w-full h-full flex items-center justify-center text-slate-200 bg-gradient-to-br from-slate-50 to-slate-200 text-6xl"
						>
							📦
						</div>
					{/if}
				</div>

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
								<li class="flex justify-between border-b border-slate-200/50 pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>Size</span
									>
									<span class="text-slate-900"
										>{listing.transportSize?.replace('_', ' ') || 'Any vehicle'}</span
									>
								</li>
								<li class="flex justify-between pb-3">
									<span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
										>District</span
									>
									<span class="text-slate-900"
										>{listing.district?.replace('_', ' ') ?? 'Local'}</span
									>
								</li>
							</ul>
						</div>
					</div>

					<!-- Location Detail -->
					<div class="mt-12">
						<h2 class="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
							Location details
						</h2>
						<div
							class="bg-slate-100 rounded-3xl h-64 w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 text-slate-400 relative overflow-hidden group"
						>
							<span class="text-4xl group-hover:scale-110 transition-transform">🗺️</span>
							<p class="font-bold italic">
								Approximate location in {listing.district?.replace('_', ' ')}
							</p>
							{#if listing.pickupAddress}
								<p
									class="text-xs uppercase tracking-widest font-black text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm"
								>
									{listing.pickupAddress}
								</p>
							{/if}
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

							<div class="grid grid-cols-1 gap-4">
								<div class="space-y-2">
									<label
										for="startDate"
										class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
										>L'entrer</label
									>
									<input
										type="date"
										id="startDate"
										name="startDate"
										bind:value={startDate}
										required
										class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-slate-900 appearance-none"
									/>
								</div>
								<div class="space-y-2">
									<label
										for="endDate"
										class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
										>Sortie</label
									>
									<input
										type="date"
										id="endDate"
										name="endDate"
										bind:value={endDate}
										required
										class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-slate-900 appearance-none"
									/>
								</div>
							</div>

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
