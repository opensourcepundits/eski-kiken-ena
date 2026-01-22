<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';

	let { data, children } = $props();
</script>

<div class="min-h-screen flex flex-col font-sans text-secondary bg-background">
	<!-- Global Navigation Bar -->
	<header class="bg-secondary text-background sticky top-0 z-50 shadow-lg">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
			<!-- Logo -->
			<a
				href="/"
				class="text-2xl font-black tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
			>
				<span class="bg-primary p-1.5 rounded-lg"></span>
				<span>Eski Kiken Ena</span>
			</a>

			<!-- Desktop Links -->
			<div class="hidden md:flex items-center gap-8">
				<div
					class="flex items-center gap-6 text-sm font-semibold tracking-wide border-r border-background/10 pr-8"
				>
					<a href="/listings" class="text-background/80 hover:text-background transition-colors"
						>Browse</a
					>
					<a href="/how-it-works" class="text-background/80 hover:text-background transition-colors"
						>How it works</a
					>
				</div>

				<!-- Auth / Actions -->
				<div class="flex items-center gap-4">
					{#if data.user}
						<a
							href="/listings/new"
							class="bg-primary text-background px-5 py-2 rounded-xl font-bold hover:bg-primary/80 transition-all shadow-lg shadow-secondary/20 transform hover:-translate-y-0.5 text-sm"
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

							<div
								class="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-lg border border-background/10 group-hover:border-primary/50 transition-all"
							></div>
						</a>

						<form method="POST" action="/logout" use:enhance>
							<button
								class="p-2 rounded-xl bg-background/10 hover:bg-primary/20 hover:text-background transition-all text-background shadow-sm ring-1 ring-background/10 group"
								title="Logout"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="opacity-90 group-hover:opacity-100"
								>
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
									<polyline points="16 17 21 12 16 7" />
									<line x1="21" x2="9" y1="12" y2="12" />
								</svg>
							</button>
						</form>
					{:else}
						<a
							href="/login"
							class="px-5 py-2 rounded-xl hover:bg-background/10 transition-all font-bold text-sm border border-background/20"
						>
							Login
						</a>
						<a
							href="/register"
							class="px-5 py-2 rounded-xl bg-background text-secondary hover:bg-surface transition-all font-bold text-sm"
						>
							Sign Up
						</a>
					{/if}
				</div>
			</div>

			<!-- Mobile Menu Button (Icon only for now) -->
			<button class="md:hidden p-2 rounded-lg bg-background/10" aria-label="Toggle Menu">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
						x1="4"
						x2="20"
						y1="18"
						y2="18"
					/></svg
				></button
			>
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
