<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';

	import { Search, LogOut, Menu, Bell } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	let showNavbarSearch = $state(true);
	let isMobileMenuOpen = $state(false);
	let isNotificationsOpen = $state(false);
	let hasViewedNotifications = $state(false);

	let notificationsContainer: HTMLElement | null = $state(null);

	function handleWindowClick(event: MouseEvent) {
		if (
			isNotificationsOpen &&
			notificationsContainer &&
			!notificationsContainer.contains(event.target as Node)
		) {
			isNotificationsOpen = false;
		}
	}

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

<svelte:window onclick={handleWindowClick} />

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
							placeholder="Search for items..."
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
						>How eke works</a
					>
				</div>

				<div class="h-6 w-px bg-background/10"></div>

				<div class="flex items-center gap-3">
					{#if data.user}
						<div class="relative" bind:this={notificationsContainer}>
							<button
								class="p-2 rounded-full bg-background/5 hover:bg-background/10 transition-colors text-background/80 border border-background/10 relative"
								onclick={() => {
									isNotificationsOpen = !isNotificationsOpen;
									if (isNotificationsOpen) hasViewedNotifications = true;
								}}
							>
								<Bell size={18} />
								{#await data.notifications}
									<!-- Loading state or nothing -->
								{:then notifications}
									{#if notifications && notifications.length > 0 && !hasViewedNotifications}
										<span
											class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-secondary shadow-sm"
										></span>
									{/if}
								{/await}
							</button>

							{#if isNotificationsOpen}
								<div
									class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 text-slate-800"
								>
									{#await data.notifications}
										<div class="p-6 text-center">
											<div
												class="inline-block w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"
											></div>
											<p class="text-xs text-slate-400 mt-2 font-bold tracking-widest uppercase">
												Loading...
											</p>
										</div>
									{:then notifications}
										<div
											class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center"
										>
											<h3 class="font-bold text-sm">Notifications</h3>
											<span
												class="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
												>{notifications?.length || 0} New</span
											>
										</div>
										<div class="max-h-96 overflow-y-auto">
											{#if !notifications || notifications.length === 0}
												<div class="p-6 text-center text-slate-400 text-sm italic">
													No new notifications.
												</div>
											{:else}
												{#each notifications as notif}
													<a
														href={notif.href}
														class="block border-b border-slate-50 p-4 hover:bg-slate-50 transition-colors"
														onclick={() => (isNotificationsOpen = false)}
													>
														<div class="flex gap-3 items-start">
															<div
																class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 {notif.type ===
																'REQUEST_RECEIVED'
																	? 'bg-orange-500'
																	: notif.type === 'REQUEST_ACCEPTED'
																		? 'bg-emerald-500'
																		: 'bg-red-500'}"
															></div>
															<div>
																<p class="text-sm font-medium text-slate-700 leading-tight">
																	{notif.message}
																</p>
																<p
																	class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold"
																>
																	{new Date(notif.date).toLocaleDateString()}
																	{new Date(notif.date).toLocaleTimeString([], {
																		hour: '2-digit',
																		minute: '2-digit'
																	})}
																</p>
															</div>
														</div>
													</a>
												{/each}
											{/if}
										</div>
									{/await}
								</div>
							{/if}
						</div>

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
							class="px-4 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary/90 transition-all font-bold text-xs border border-primary-600/30"
						>
							Login
						</a>
						<a
							href="/register"
							class="px-4 py-1.5 rounded-full bg-primary-800 text-white hover:bg-primary/90 transition-all font-bold text-xs"
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
				onclick={() => {
					isMobileMenuOpen = !isMobileMenuOpen;
				}}
			>
				<Menu size={20} />
			</button>
		</nav>

		<!-- Mobile Dropdown Menu -->
		{#if isMobileMenuOpen}
			<div
				class="md:hidden bg-secondary text-background border-t border-background/10 absolute top-16 left-0 right-0 z-40 shadow-2xl"
			>
				<div class="px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
					<form action="/listings" method="GET" class="flex w-full mt-2">
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
								placeholder="Search for items..."
								class="block w-full pl-9 pr-4 py-2 bg-background/5 border border-background/10 rounded-full text-sm text-background placeholder:text-background/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-background/10 transition-all border-none"
							/>
						</div>
					</form>
					<div class="flex flex-col space-y-1 font-bold text-lg">
						<a
							href="/listings"
							class="text-background/80 hover:text-background py-3 border-b border-background/10"
							onclick={() => (isMobileMenuOpen = false)}>Browse items</a
						>
						<a
							href="/how-it-works"
							class="text-background/80 hover:text-background py-3 border-b border-background/10"
							onclick={() => (isMobileMenuOpen = false)}>How it works</a
						>
					</div>
					<div class="pt-4 flex flex-col space-y-3">
						{#if data.user}
							<a
								href="/profile"
								class="flex items-center gap-3 py-2 bg-background/5 rounded-lg px-3"
								onclick={() => (isMobileMenuOpen = false)}
							>
								<div
									class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background text-sm"
								>
									{data.user.firstName ? data.user.firstName.charAt(0).toUpperCase() : 'U'}
								</div>
								<div class="font-bold text-base">
									{data.user.firstName || 'User'}
									<div class="text-xs opacity-60 font-normal">View Profile</div>
								</div>
							</a>
							<a
								href="/listings/new"
								class="bg-primary text-background px-4 py-3 rounded-full font-bold hover:bg-primary/90 transition-all text-center text-base shadow-sm"
								onclick={() => (isMobileMenuOpen = false)}
							>
								List an Item
							</a>
							<form method="POST" action="/logout" use:enhance class="w-full mt-2">
								<button
									class="w-full py-3 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors"
									title="Logout"
									onclick={() => (isMobileMenuOpen = false)}
								>
									Logout
								</button>
							</form>
						{:else}
							<a
								href="/login"
								class="block text-center px-4 py-3 rounded-full border border-background/20 text-background font-bold text-base hover:bg-background/10 transition-colors"
								onclick={() => (isMobileMenuOpen = false)}
							>
								Login
							</a>
							<a
								href="/register"
								class="block text-center px-4 py-3 rounded-full bg-primary text-background font-bold text-base hover:bg-primary/90 transition-colors shadow-sm"
								onclick={() => (isMobileMenuOpen = false)}
							>
								Sign Up
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/if}
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
						<a href="/listings" class="hover:text-background transition-colors">Browse All items</a>
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
