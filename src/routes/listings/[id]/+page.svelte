<script lang="ts">
	let { data } = $props();
	let listing = $derived(data.listing);

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
						<a href="/listings" class="hover:text-indigo-600">Listings</a>
						<span>/</span>
						<span class="text-slate-900 font-medium">{listing.category?.replace('_', ' ')}</span>
					</nav>
					<h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-4">{listing.title}</h1>
					<div class="flex flex-wrap items-center gap-6 text-slate-600">
						<div class="flex items-center gap-2">
							<span class="text-indigo-600 text-xl">📍</span>
							<span class="font-medium text-slate-900">{listing.district?.replace('_', ' ')}</span>
						</div>
						<div class="flex items-center gap-2">
							<span>Listed {formattedDate}</span>
						</div>
					</div>
				</div>

				<!-- Main Image -->
				<div
					class="aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative group"
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
				<div class="prose prose-slate lg:prose-xl max-w-none">
					<h2 class="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
						About this item
					</h2>
					<p class="text-slate-600 leading-relaxed whitespace-pre-wrap">
						{listing.description}
					</p>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
						<div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
							<div class="flex items-center gap-3 mb-4 text-indigo-600">
								<h3 class="font-bold text-slate-900 m-0">🛠️ Specifications</h3>
							</div>
							<ul class="space-y-3 text-base list-none p-0 m-0">
								<li class="flex justify-between border-b border-slate-200/50 pb-2">
									<span class="text-slate-500 text-sm">Brand</span>
									<span class="font-semibold text-slate-900"
										>{listing.brand || 'Professional Grade'}</span
									>
								</li>
								<li class="flex justify-between border-b border-slate-200/50 pb-2">
									<span class="text-slate-500 text-sm">Model</span>
									<span class="font-semibold text-slate-900">{listing.modelNumber || 'N/A'}</span>
								</li>
								<li class="flex justify-between border-b border-slate-200/50 pb-2">
									<span class="text-slate-500 text-sm">Condition</span>
									<span class="font-semibold text-slate-900"
										>{listing.condition?.replace('_', ' ') ?? 'GOOD'}</span
									>
								</li>
								<li class="flex justify-between pb-2">
									<span class="text-slate-500 text-sm">Power Source</span>
									<span class="font-semibold text-slate-900"
										>{listing.powerSource?.replace('_', ' ') || 'Manual'}</span
									>
								</li>
							</ul>
						</div>

						<div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
							<div class="flex items-center gap-3 mb-4 text-indigo-600">
								<h3 class="font-bold text-slate-900 m-0">🚚 Logistics</h3>
							</div>
							<ul class="space-y-3 text-base list-none p-0 m-0">
								<li class="flex justify-between border-b border-slate-200/50 pb-2">
									<span class="text-slate-500 text-sm">Transport Size</span>
									<span class="font-semibold text-slate-900"
										>{listing.transportSize?.replace('_', ' ') || 'Any vehicle'}</span
									>
								</li>
								<li class="flex justify-between pb-2">
									<span class="text-slate-500 text-sm">Pickup Point</span>
									<span class="font-semibold text-slate-900"
										>{listing.district?.replace('_', ' ') ?? 'Local'}</span
									>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Booking Card -->
			<div class="lg:col-span-4">
				<div class="sticky top-32 space-y-6">
					<div
						class="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 overflow-hidden relative"
					>
						<!-- Price Header -->
						<div class="flex items-baseline justify-between mb-8">
							<div class="flex items-baseline gap-1">
								<span class="text-4xl font-black text-indigo-600">Rs {listing.pricePerDay}</span>
								<span class="text-slate-400 font-medium italic">/ day</span>
							</div>
						</div>

						<!-- Action Button -->
						<button
							class="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
						>
							Request Booking
						</button>
					</div>

					<!-- Owner Info -->
					<div class="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
						<div
							class="w-16 h-16 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center overflow-hidden text-2xl"
						>
							👤
						</div>
						<div>
							<p class="text-xs font-bold text-indigo-500 uppercase tracking-wider">Lister</p>
							<h4 class="text-lg font-bold text-slate-900">
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
