<script lang="ts">
	let { data } = $props();
	let listings = $derived(data.listings);

	let searchQuery = $state('');
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Hero Section -->
	<div class="bg-indigo-900 text-white pt-24 pb-32 px-4 shadow-inner relative overflow-hidden">
		<div class="absolute inset-0 bg-slate-800 opacity-20"></div>
		<div class="max-w-7xl mx-auto relative z-10 text-center">
			<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">Rent Anything, Anywhere.</h1>
			<p class="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
				High-quality tools and equipment available for rent from your local community.
			</p>

			<!-- Search Bar -->
			<div class="max-w-3xl mx-auto relative">
				<input
					type="text"
					placeholder="Search for tools, equipment, or categories..."
					bind:value={searchQuery}
					class="w-full pl-6 pr-32 py-5 rounded-full text-slate-900 text-lg shadow-2xl focus:ring-4 focus:ring-indigo-500/50 transition-all border-none"
				/>
				<button
					class="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
				>
					Find Gear
				</button>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
		<!-- Action Cards -->
		<div class="flex justify-between items-center mb-8">
			<div class="flex gap-4">
				<button
					class="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg border border-slate-200 shadow-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
				>
					Filters
				</button>
				<select
					class="bg-white px-5 py-2.5 rounded-lg border border-slate-200 shadow-sm font-medium text-slate-700 hover:bg-slate-50 transition-all appearance-none pr-10 relative"
				>
					<option>Sort by: Newest</option>
					<option>Price: Low to High</option>
					<option>Price: High to Low</option>
				</select>
			</div>
			<a
				href="/listings/new"
				class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
			>
				List Your Gear
			</a>
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{#each listings as listing}
				<div
					class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col"
				>
					<!-- Image Placeholder -->
					<div class="h-48 bg-slate-100 overflow-hidden relative">
						{#if (listing.images as string[])?.length > 0}
							<img
								src={(listing.images as string[])[0]}
								alt={listing.title}
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
							/>
						{:else}
							<div
								class="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-100 to-slate-200"
							>
								📦
							</div>
						{/if}
						<div
							class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm"
						>
							{listing.category?.replace('_', ' ') ?? 'General'}
						</div>
					</div>

					<!-- Details -->
					<div class="p-6 flex-grow flex flex-col">
						<div class="flex justify-between items-start mb-2">
							<h3
								class="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
							>
								{listing.title}
							</h3>
						</div>

						<div class="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
							<span>📍 {listing.district?.replace('_', ' ') ?? 'Unknown'}</span>
						</div>

						<div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
							<div>
								<span class="text-2xl font-black text-indigo-600">Rs {listing.pricePerDay}</span>
								<span class="text-slate-400 text-sm">/ day</span>
							</div>
							<a
								href="/listings/{listing.id}"
								class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all"
							>
								→
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if listings.length === 0}
			<div class="py-20 text-center">
				<div class="bg-white inline-flex p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
					<span class="text-6xl">🏷️</span>
				</div>
				<h3 class="text-2xl font-bold text-slate-900 mb-2">No listings found</h3>
				<p class="text-slate-500">Be the first to list something in this category!</p>
				<a href="/listings/new" class="mt-8 inline-block text-indigo-600 font-bold hover:underline"
					>Start listing today &rarr;</a
				>
			</div>
		{/if}
	</main>
</div>
