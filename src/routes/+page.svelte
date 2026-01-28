<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	const recentListings = $derived((data?.recentListings ?? []) as any[]);

	function formatRating(listing: any) {
		const rating = Number(listing?.rating ?? 0);
		const reviewCount = Number(listing?.reviewCount ?? 0);
		if (!reviewCount) return 'No ratings yet';
		return `★ ${rating.toFixed(1)} (${reviewCount})`;
	}
</script>

<div class="min-h-screen flex flex-col font-sans text-slate-900 overflow-hidden">
	<!-- Hero Section -->
	<header class="bg-secondary text-background pb-32 pt-20 px-6 relative">
		<!-- Background pattern -->
		<div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
			<svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
				<defs>
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" />
					</pattern>
				</defs>
				<rect width="100" height="100" fill="url(#grid)" />
			</svg>
		</div>

		<div class="max-w-4xl mx-auto text-center space-y-8 relative z-10">
			<h1
				class="text-5xl md:text-8xl font-black tracking-tighter leading-none drop-shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700"
			>
				Need a tool for the <span class="text-primary underline decoration-4 underline-offset-8"
					>weekend</span
				>?
			</h1>

			<!-- Search Bar -->
			<form
				action="/listings"
				method="GET"
				class="mt-12 relative max-w-2xl mx-auto group delay-300 animate-in fade-in slide-in-from-bottom-2 duration-700"
			>
				<div
					class="relative flex items-center bg-background rounded-full p-2 shadow-2xl ring-1 ring-background/20"
				>
					<div class="pl-6 text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
					</div>
					<input
						type="text"
						name="q"
						placeholder="Eski Kiken Ena enn drill?"
						class="w-full px-4 py-4 bg-transparent text-lg text-secondary placeholder:text-surface focus:outline-none"
					/>
					<button
						type="submit"
						class="bg-primary text-background px-8 py-3.5 rounded-full font-black hover:bg-primary/80 transition-all shadow-lg shadow-secondary/40 transform active:scale-95 text-lg"
					>
						Search
					</button>
				</div>
				<div class="mt-4 flex flex-wrap justify-center gap-2 text-sm text-background/80 font-bold">
					<span>Popular:</span>
					<a
						href="/listings?q=drill"
						class="hover:text-background underline decoration-accent underline-offset-4">Drills</a
					>
					<a
						href="/listings?q=ladder"
						class="hover:text-background underline decoration-accent underline-offset-4">Ladders</a
					>
					<a
						href="/listings?q=generator"
						class="hover:text-background underline decoration-accent underline-offset-4"
						>Generators</a
					>
				</div>
			</form>
			<p
				class="text-xl md:text-2xl text-background/80 font-medium max-w-2xl mx-auto leading-relaxed opacity-90 delay-150 animate-in fade-in slide-in-from-bottom-4 duration-700"
			>
				Mauritius' trusted peer-to-peer rental marketplace for power tools & pro equipment. Built
				for neighbors, by neighbors.
			</p>
		</div>
	</header>

	<!-- Features / Categories -->
	<main class="flex-1 max-w-7xl mx-auto w-full -mt-20 px-6 pb-20 relative z-10">
		<div class="mt-32">
			<div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
				<div>
					<h2 class="text-4xl font-black text-secondary tracking-tight">Recent Gear</h2>
					<p class="text-surface font-bold mt-2 italic">Nouvo zafer kinn mete sa ban zour la.</p>
				</div>
				<a
					href="/listings"
					class="text-accent font-black hover:underline underline-offset-4 flex items-center gap-2 group"
				>
					Check All Listings
					<span class="group-hover:translate-x-1 transition-transform">→</span>
				</a>
			</div>

			{#if recentListings.length > 0}
				<!-- Card carousel (horizontal) -->
				<div class="relative">
					<div
						class="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none]"
					>
						<!-- hide scrollbar (webkit) -->
						<div class="hidden [::-webkit-scrollbar]:hidden"></div>

						{#each recentListings as listing (listing.id)}
							<a
								href={`/listings/${listing.id}`}
								class="snap-start min-w-[18rem] max-w-[18rem] sm:min-w-[20rem] sm:max-w-[20rem] bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-surface flex flex-col group"
							>
								<div class="h-44 bg-surface overflow-hidden relative">
									{#if (listing.images as string[])?.length > 0}
										<img
											src={(listing.images as string[])[0]}
											alt={listing.title}
											class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>
									{:else}
										<div class="w-full h-full bg-surface"></div>
									{/if}
									<div
										class="absolute top-4 left-4 bg-background/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-accent shadow-sm"
									>
										{listing.category?.replace(/_/g, ' ') ?? 'General'}
									</div>
								</div>

								<div class="p-6 flex-grow flex flex-col">
									<h3 class="text-lg font-black text-secondary line-clamp-1">{listing.title}</h3>

									<div class="mt-2 flex items-center justify-between gap-3">
										<div
											class="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"
										>
											{listing.condition?.replace(/_/g, ' ') ?? 'GOOD'}
										</div>
										<div class="text-[11px] font-black text-slate-500">{formatRating(listing)}</div>
									</div>

									<div class="mt-3 text-sm font-bold text-slate-600">
										{listing.district?.replace(/_/g, ' ') ?? 'Unknown'}
									</div>

									<div
										class="mt-auto pt-5 border-t border-surface flex items-center justify-between"
									>
										<div>
											<span class="text-2xl font-black text-accent">Rs {listing.pricePerDay}</span>
											<span class="text-surface text-sm">/ day</span>
										</div>
										<div
											class="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-secondary group-hover:bg-accent group-hover:text-background transition-all"
										>
											→
										</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{:else}
				<div
					class="py-32 bg-background rounded-[3rem] border-2 border-dashed border-surface flex flex-col items-center justify-center gap-6 shadow-sm"
				>
					<div class="text-slate-200 transform hover:scale-110 transition-transform">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="80"
							height="80"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
					</div>
					<div class="text-center space-y-2">
						<p class="text-surface text-xl font-bold italic">
							Pena nanye dan sa l'endroit la pour ler.
						</p>
						<p class="text-accent text-sm font-medium uppercase tracking-widest">
							Check enn lot district?
						</p>
					</div>
					<a
						href="/listings"
						class="mt-4 bg-secondary text-background px-10 py-4 rounded-md font-black shadow-xl hover:bg-accent transition-all"
						>Browse all Districts</a
					>
				</div>
			{/if}
		</div>
	</main>
</div>
