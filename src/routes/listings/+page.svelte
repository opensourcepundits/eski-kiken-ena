<script lang="ts">
	import { goto } from '$app/navigation';
	import ImageCarousel from '$lib/components/ImageCarousel.svelte';

	let { data } = $props();
	let filters = $derived(data.filters || {});

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

	let searchQuery = $state(data.filters?.searchQuery || '');
	let showFilters = $state(false);

	// Filter state
	let selectedCategory = $state(data.filters?.category || '');
	let selectedCondition = $state(data.filters?.condition || '');
	let selectedPowerSource = $state(data.filters?.powerSource || '');

	let selectedTransportSize = $state(data.filters?.transportSize || '');
	let minPrice = $state(data.filters?.minPrice || '');
	let maxPrice = $state(data.filters?.maxPrice || '');
	let sortBy = $state(data.filters?.sortBy || 'newest');

	$effect(() => {
		searchQuery = data.filters?.searchQuery || '';
		selectedCategory = data.filters?.category || '';
		selectedCondition = data.filters?.condition || '';
		selectedPowerSource = data.filters?.powerSource || '';
		selectedTransportSize = data.filters?.transportSize || '';
		minPrice = data.filters?.minPrice || '';
		maxPrice = data.filters?.maxPrice || '';
		sortBy = data.filters?.sortBy || 'newest';
	});

	function updateFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (selectedCondition) params.set('condition', selectedCondition);
		if (selectedPowerSource) params.set('powerSource', selectedPowerSource);

		if (selectedTransportSize) params.set('transportSize', selectedTransportSize);
		if (minPrice) params.set('minPrice', minPrice);
		if (maxPrice) params.set('maxPrice', maxPrice);
		if (sortBy) params.set('sortBy', sortBy);

		goto(`/listings?${params.toString()}`, { noScroll: false });
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		selectedCondition = '';
		selectedPowerSource = '';

		selectedTransportSize = '';
		minPrice = '';
		maxPrice = '';
		sortBy = 'newest';
		goto('/listings', { noScroll: false });
	}

	function handleSearch() {
		updateFilters();
	}

	function formatRating(listing: any) {
		const rating = Number(listing?.rating ?? 0);
		const reviewCount = Number(listing?.reviewCount ?? 0);
		if (!reviewCount) return 'No ratings yet';
		return `★ ${rating.toFixed(1)} (${reviewCount})`;
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Hero Section -->
	<div class="bg-secondary text-background pt-24 pb-32 px-4 shadow-inner relative overflow-hidden">
		<div class="absolute inset-0 bg-accent opacity-20"></div>
		<div class="max-w-7xl mx-auto relative z-10 text-center">
			<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">Rent Anything, Anywhere.</h1>
			<p class="text-xl text-background/80 max-w-2xl mx-auto mb-10">
				High-quality tools and equipment available for rent from your local community.
			</p>

			<!-- Search Bar -->
			<form
				id="big-search-bar"
				onsubmit={(e) => {
					e.preventDefault();
					handleSearch();
				}}
				class="max-w-3xl mx-auto relative flex flex-col sm:block gap-3"
			>
				<input
					type="text"
					placeholder="Search for tools, equipment..."
					bind:value={searchQuery}
					class="w-full pl-6 sm:pr-32 py-4 sm:py-5 rounded-full text-secondary bg-white text-secondary placeholder-slate-500 shadow-2xl focus:ring-4 focus:ring-accent/50 transition-all border-none"
				/>
				<button
					type="submit"
					class="sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 bg-accent hover:bg-surface text-background px-8 py-4 sm:py-3 rounded-full font-semibold transition-colors w-full sm:w-auto mt-2 sm:mt-0"
				>
					Find items
				</button>
			</form>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
		<div class="flex flex-col lg:flex-row gap-6">
			<!-- Filter Sidebar -->
			<aside
				class="{showFilters
					? 'block'
					: 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 bg-background rounded-lg border border-surface p-6 h-fit lg:sticky lg:top-4"
			>
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-lg font-bold text-secondary">Filters</h2>
					<button
						type="button"
						onclick={clearFilters}
						class="text-xs text-accent hover:underline font-medium"
					>
						Clear all
					</button>
				</div>

				<div class="space-y-6">
					<!-- Category Filter -->
					<div>
						<h3 class="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">Category</h3>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="category"
									value=""
									bind:group={selectedCategory}
									onchange={updateFilters}
									class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
								/>
								<span class="text-sm text-slate-500 italic">All Categories</span>
							</label>
							{#each categories as cat}
								<label class="flex items-center gap-2 cursor-pointer group">
									<input
										type="radio"
										name="category"
										value={cat}
										bind:group={selectedCategory}
										onchange={updateFilters}
										class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
									/>
									<span class="text-sm text-slate-700 group-hover:text-accent"
										>{cat.replace(/_/g, ' ')}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<!-- Condition Filter -->
					<div>
						<h3 class="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
							Condition
						</h3>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="condition"
									value=""
									bind:group={selectedCondition}
									onchange={updateFilters}
									class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
								/>
								<span class="text-sm text-slate-500 italic">All Conditions</span>
							</label>
							{#each conditions as cond}
								<label class="flex items-center gap-2 cursor-pointer group">
									<input
										type="radio"
										name="condition"
										value={cond}
										bind:group={selectedCondition}
										onchange={updateFilters}
										class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
									/>
									<span class="text-sm text-slate-700 group-hover:text-accent"
										>{cond.replace(/_/g, ' ')}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<!-- Power Source Filter -->
					<div>
						<h3 class="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
							Power Source
						</h3>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="powerSource"
									value=""
									bind:group={selectedPowerSource}
									onchange={updateFilters}
									class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
								/>
								<span class="text-sm text-slate-500 italic">All Power Sources</span>
							</label>
							{#each powerSources as source}
								<label class="flex items-center gap-2 cursor-pointer group">
									<input
										type="radio"
										name="powerSource"
										value={source}
										bind:group={selectedPowerSource}
										onchange={updateFilters}
										class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
									/>
									<span class="text-sm text-slate-700 group-hover:text-accent"
										>{source.replace(/_/g, ' ')}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<!-- Transport Size Filter -->
					<div>
						<h3 class="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
							Transport Size
						</h3>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="transportSize"
									value=""
									bind:group={selectedTransportSize}
									onchange={updateFilters}
									class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
								/>
								<span class="text-sm text-slate-500 italic">All Sizes</span>
							</label>
							{#each transportSizes as size}
								<label class="flex items-center gap-2 cursor-pointer group">
									<input
										type="radio"
										name="transportSize"
										value={size}
										bind:group={selectedTransportSize}
										onchange={updateFilters}
										class="w-4 h-4 text-accent focus:ring-accent border-slate-300"
									/>
									<span class="text-sm text-slate-700 group-hover:text-accent"
										>{size.replace(/_/g, ' ')}</span
									>
								</label>
							{/each}
						</div>
					</div>

					<!-- Price Range Filter -->
					<div>
						<h3 class="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
							Price Range
						</h3>
						<div class="space-y-3">
							<div>
								<label for="minPrice" class="block text-xs text-slate-600 mb-1"
									>Min Price (Rs)</label
								>
								<input
									id="minPrice"
									type="number"
									bind:value={minPrice}
									onchange={updateFilters}
									placeholder="0"
									class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
								/>
							</div>
							<div>
								<label for="maxPrice" class="block text-xs text-slate-600 mb-1"
									>Max Price (Rs)</label
								>
								<input
									id="maxPrice"
									type="number"
									bind:value={maxPrice}
									onchange={updateFilters}
									placeholder="No limit"
									class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
								/>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<!-- Main Content Area -->
			<div class="flex-1">
				<!-- Action Bar -->
				<div class="flex justify-between items-center mb-8">
					<div class="flex gap-4">
						<button
							type="button"
							onclick={() => (showFilters = !showFilters)}
							class="lg:hidden flex-shrink-0 flex items-center gap-2 bg-background px-5 py-2.5 rounded-lg border border-surface shadow-sm font-medium text-secondary hover:bg-surface transition-all"
						>
							Filters
						</button>
						<select
							bind:value={sortBy}
							onchange={updateFilters}
							class="w-full lg:w-auto bg-background px-5 py-2.5 rounded-lg border border-surface shadow-sm font-medium text-secondary hover:bg-surface transition-all appearance-none pr-10"
						>
							<option value="newest">Sort by: Newest</option>
							<option value="price-low">Price: Low to High</option>
							<option value="price-high">Price: High to Low</option>
						</select>
					</div>
					<a
						href="/listings/new"
						class="hidden md:flex flex-shrink-0 items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-teal-600/30 transition-all hover:scale-105 active:scale-95"
					>
						List Your items
					</a>
				</div>

				<a
					href="/listings/new"
					class="md:hidden w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-teal-600/30 transition-all active:scale-95 mb-6"
				>
					List Your items
				</a>

				{#await data.streamed.listings}
					<!-- Skeleton UI -->
					<div class="mb-6 h-5 w-32 bg-slate-100 animate-pulse rounded"></div>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{#each Array(6) as _}
							<div class="bg-white rounded-md border border-slate-100 h-96 animate-pulse">
								<div class="h-48 bg-slate-50"></div>
								<div class="p-6 space-y-4">
									<div class="h-6 bg-slate-50 w-3/4 rounded"></div>
									<div class="h-4 bg-slate-50 w-1/2 rounded"></div>
									<div class="h-10 bg-slate-50 w-full rounded mt-auto"></div>
								</div>
							</div>
						{/each}
					</div>
				{:then listings}
					<!-- Results Count -->
					<div class="mb-6 text-sm text-slate-600">
						<span class="font-semibold">{listings.length}</span> listing{listings.length !== 1
							? 's'
							: ''} found
					</div>

					<!-- Grid -->
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{#each listings as listing}
							<div
								class="group bg-background rounded-md overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-surface flex flex-col"
							>
								<!-- Image Placeholder -->
								<div class="h-48 bg-surface overflow-hidden relative">
									<ImageCarousel
										images={(listing.images as string[]) || []}
										alt={listing.title}
										containerClass="h-48 bg-surface"
										imageClass="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										showDots={false}
										controlsOnHover={true}
									/>
									<div
										class="absolute top-4 left-4 bg-background/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-accent shadow-sm"
									>
										{listing.category?.replace(/_/g, ' ') ?? 'General'}
									</div>
								</div>

								<!-- Details -->
								<div class="p-6 flex-grow flex flex-col">
									<div class="flex justify-between items-start mb-2">
										<h3
											class="text-xl font-bold text-secondary group-hover:text-accent transition-colors line-clamp-1"
										>
											{listing.title}
										</h3>
									</div>

									<div class="flex items-center justify-between gap-3 mb-4">
										<div
											class="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"
										>
											{listing.condition?.replace(/_/g, ' ') ?? 'GOOD'}
										</div>
										<div class="text-xs font-black text-slate-500">{formatRating(listing)}</div>
									</div>

									<div class="flex items-center justify-between text-surface text-sm mb-2">
										<span></span>
										{#if Number(listing.avgDays ?? 0) > 0}
											<div
												class="flex items-center gap-1 text-indigo-600 text-[10px] uppercase font-black tracking-wider"
											>
												<span>Avg. {listing.avgDays} days</span>
											</div>
										{/if}
									</div>

									{#if listing.operatingHours}
										<div
											class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4"
										>
											<span
												>🕒 {(listing.operatingHours as any).start} - {(
													listing.operatingHours as any
												).end}</span
											>
										</div>
									{/if}

									<div
										class="mt-auto pt-4 border-t border-surface flex items-center justify-between"
									>
										<div>
											<span class="text-2xl font-black text-accent">Rs {listing.pricePerDay}</span>
											<span class="text-surface text-sm">/ day</span>
										</div>
										<a
											href="/listings/{listing.id}"
											class="relative z-20 w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white hover:bg-teal-700 transition-all shadow-sm shadow-teal-600/20"
										>
											<span class="text-lg leading-none">→</span>
										</a>
									</div>
								</div>
							</div>
						{/each}
					</div>

					{#if listings.length === 0}
						<div class="py-20 text-center">
							<div
								class="bg-background inline-flex p-8 rounded-3xl shadow-sm border border-surface mb-6"
							></div>
							<h3 class="text-2xl font-bold text-secondary mb-2">No listings found</h3>
							<p class="text-surface">Try adjusting your filters or search query</p>
							<button
								type="button"
								onclick={clearFilters}
								class="mt-8 inline-block text-accent font-bold hover:underline"
							>
								Clear all filters &rarr;
							</button>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</main>
</div>
