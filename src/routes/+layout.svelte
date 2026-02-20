<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';

	import { Search, LogOut, Menu } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	let showNavbarSearch = $state(true);

	let observer: IntersectionObserver | null = null;

	onMount(() => {
		observer = new IntersectionObserver(
			([entry]) => {
				showNavbarSearch = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);

		return () => observer?.disconnect();
	});

	// Re-run observer logic when page changes
	$effect(() => {
		// This will trigger on navigation
		const _ = page.url.pathname;

		// Wait for the DOM to update
		setTimeout(() => {
			if (observer) {
				observer.disconnect();
				const bigSearch = document.getElementById('big-search-bar');
				if (bigSearch) {
					showNavbarSearch = false; // Initially hide if it exists
					observer.observe(bigSearch);
				} else {
					showNavbarSearch = true;
				}
			}
		}, 100);
	});
</script>

<div class="min-h-screen flex flex-col font-sans text-secondary bg-background">
	<!-- Global Navigation Bar -->
	<header class="bg-secondary text-background sticky top-0 z-50 shadow-md">
		<nav
			class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4"
		>
			<!-- Logo -->
			<a
				href="/"
				class="text-xl font-black tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0"
			>
				<span class="bg-primary w-6 h-6 rounded-md flex-shrink-0"></span>
				<span class="hidden lg:inline">Eski Kiken Ena</span>
				<span class="lg:hidden">EKE</span>
			</a>

			<!-- Search Bar -->
			{#if showNavbarSearch}
				<form
					action="/listings"
					method="GET"
					class="hidden sm:flex flex-1 max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
				>
					<div class="relative w-full group">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search
								size={16}
								class="text-background/40 group-focus-within:text-primary transition-colors"
							/>
						</div>
						<input
							type="text"
							name="q"
							placeholder="Search for gear..."
							class="block w-full pl-9 pr-4 py-1.5 bg-background/5 border border-background/10 rounded-full text-sm text-background placeholder:text-background/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-background/10 transition-all border-none bg-white/5"
						/>
					</div>
				</form>
			{:else}
				<div class="flex-1 max-w-md mx-4"></div>
			{/if}

			<!-- Desktop Links & Auth -->
			<div class="hidden md:flex items-center gap-6">
				<div class="flex items-center gap-5 text-xs font-bold tracking-wider uppercase">
					<a href="/listings" class="text-background/70 hover:text-background transition-colors"
						>Browse</a
					>
					<a href="/how-it-works" class="text-background/70 hover:text-background transition-colors"
						>How it works</a
					>
				</div>

				<div class="h-6 w-px bg-background/10"></div>

				<div class="flex items-center gap-3">
					{#if data.user}
						<a
							href="/listings/new"
							class="bg-primary text-background px-4 py-1.5 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md transform hover:-translate-y-0.5 text-xs"
						>
							List Item
						</a>

						<a href="/profile" class="flex items-center gap-3 ml-2 group">
							<div class="text-right hidden sm:block">
								<span
									class="block text-[10px] font-bold opacity-60 uppercase tracking-widest group-hover:text-primary transition-colors"
									>Lister</span
								>
								<span
									class="block font-bold text-sm leading-none group-hover:text-primary transition-colors"
									>{data.user.firstName || 'User'}</span
								>
							</div>
						</a>

						<form method="POST" action="/logout" use:enhance>
							<button
								class="p-2 rounded-full bg-background/5 hover:bg-red-500/20 hover:text-red-400 transition-all text-background/60 border border-background/10 group"
								title="Logout"
							>
								<LogOut size={16} />
							</button>
						</form>
					{:else}
						<a
							href="/login"
							class="px-4 py-1.5 rounded-full hover:bg-white/10 transition-all font-bold text-xs border border-white/20 text-white"
						>
							Login
						</a>
						<a
							href="/register"
							class="px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-all font-bold text-xs"
						>
							Sign Up
						</a>
					{/if}
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden p-2 rounded-full bg-background/5 border border-background/10 text-background/80 hover:bg-background/10 transition-colors"
				aria-label="Toggle Menu"
			>
				<Menu size={20} />
			</button>
		</nav>
	</header>

	<!-- Main Content Area -->
	<main class="flex-grow">
		{@render children()}
	</main>

	<!-- Global Footer -->
	<footer class="bg-secondary text-surface py-12 px-6">
		<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
			<div class="col-span-1 md:col-span-2">
				<h2 class="text-2xl font-black text-background mb-4 italic">Eski Kiken Ena</h2>
				<p class="max-w-xs text-sm leading-relaxed">
					Mauritius' premier peer-to-peer equipment rental marketplace. Save money, earn extra
					income, and build a stronger community.
				</p>
			</div>
			<div>
				<h3 class="text-background font-bold mb-4 uppercase text-xs tracking-widest">Platform</h3>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/listings" class="hover:text-background transition-colors">Browse All Gear</a>
					</li>
					<li>
						<a href="/listings/new" class="hover:text-background transition-colors"
							>List Your Item</a
						>
					</li>
					<li>
						<a href="/how-it-works" class="hover:text-background transition-colors">How it works</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="text-background font-bold mb-4 uppercase text-xs tracking-widest">Support</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/faqs" class="hover:text-background transition-colors">FAQs</a></li>
					<li><a href="/contact" class="hover:text-background transition-colors">Contact Us</a></li>
					<li>
						<a href="/privacy" class="hover:text-background transition-colors">Privacy Policy</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-surface text-center text-xs">
			&copy; {new Date().getFullYear()} Eski Kiken Ena. Tou drwa rezerve.
		</div>
	</footer>
</div>
