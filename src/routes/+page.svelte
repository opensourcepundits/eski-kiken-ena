<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
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
			<p
				class="text-xl md:text-2xl text-background/80 font-medium max-w-2xl mx-auto leading-relaxed opacity-90 delay-150 animate-in fade-in slide-in-from-bottom-4 duration-700"
			>
				Mauritius' trusted peer-to-peer rental marketplace for power tools & pro equipment. Built
				for neighbors, by neighbors.
			</p>

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
		</div>
	</header>

	<!-- Features / Categories -->
	<main class="flex-1 max-w-7xl mx-auto w-full -mt-20 px-6 pb-20 relative z-10">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Feature 1 -->
			<div
				class="bg-background p-10 rounded-3xl shadow-2xl shadow-secondary/10 border border-surface hover:shadow-accent/10 transition-all duration-500 group"
			>
				<div
					class="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-8 shadow-sm group-hover:bg-accent group-hover:text-background transition-all duration-300 transform group-hover:-rotate-6"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" /><path d="m18 15 4-4" /><path
							d="m21.5 11.5-1.914-1.914a2 2 0 0 1 0-2.828l2.828-2.828a1 1 0 0 0-1.414-1.414L18.172 5.344a2 2 0 0 1-2.828 0l-2.828-2.828a1 1 0 0 0-1.414 1.414L13.016 5.916a2 2 0 0 1 0 2.828l7.07 7.07a2 2 0 0 1 2.828 0Z"
						/></svg
					>
				</div>
				<h3 class="text-2xl font-black mb-4 text-secondary">Rent Tools</h3>
				<p class="text-surface leading-relaxed font-medium">
					Access high-end equipment you only need once. Professional gear at local, affordable
					prices.
				</p>
			</div>

			<!-- Feature 2 -->
			<div
				class="bg-background p-10 rounded-3xl shadow-2xl shadow-secondary/10 border border-surface hover:shadow-accent/10 transition-all duration-500 group"
			>
				<div
					class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm group-hover:bg-primary group-hover:text-background transition-all duration-300 transform group-hover:rotate-6"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
							cx="12"
							cy="10"
							r="3"
						/></svg
					>
				</div>
				<h3 class="text-2xl font-black mb-4 text-secondary">Local Community</h3>
				<p class="text-surface leading-relaxed font-medium">
					Direct rentals between verified neighbors in your district. Safe, secure, and rooted in
					trust.
				</p>
			</div>

			<!-- Feature 3 -->
			<div
				class="bg-background p-10 rounded-3xl shadow-2xl shadow-secondary/10 border border-surface hover:shadow-accent/10 transition-all duration-500 group"
			>
				<div
					class="w-16 h-16 bg-surface/50 rounded-2xl flex items-center justify-center text-secondary mb-8 shadow-sm group-hover:bg-secondary group-hover:text-background transition-all duration-300 transform group-hover:-rotate-12"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path
							d="M6 12h.01M18 12h.01"
						/></svg
					>
				</div>
				<h3 class="text-2xl font-black mb-4 text-secondary">Earn Extra</h3>
				<p class="text-surface leading-relaxed font-medium">
					Turn your underutilized workshop into a second paycheck. List your gear and start earning
					today.
				</p>
			</div>
		</div>

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
						stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
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
					class="mt-4 bg-secondary text-background px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-accent transition-all"
					>Browse all Districts</a
				>
			</div>
		</div>
	</main>
</div>
