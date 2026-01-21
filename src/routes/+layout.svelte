<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';

	let { data, children } = $props();
</script>

<div class="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
	<!-- Global Navigation Bar -->
	<header class="bg-indigo-900 text-white sticky top-0 z-50 shadow-lg">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
			<!-- Logo -->
			<a
				href="/"
				class="text-2xl font-black tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
			>
				<span class="bg-sunset p-1.5 rounded-lg">🛠️</span>
				<span>Eski kiken ena</span>
			</a>

			<!-- Desktop Links -->
			<div class="hidden md:flex items-center gap-8">
				<div
					class="flex items-center gap-6 text-sm font-semibold tracking-wide border-r border-white/10 pr-8"
				>
					<a href="/listings" class="text-indigo-100 hover:text-white transition-colors"
						>Browse Gear</a
					>
					<a href="/how-it-works" class="text-indigo-100 hover:text-white transition-colors"
						>How it works</a
					>
				</div>

				<!-- Auth / Actions -->
				<div class="flex items-center gap-4">
					{#if data.user}
						<a
							href="/listings/new"
							class="bg-sunset text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 transform hover:-translate-y-0.5 text-sm"
						>
							List Item
						</a>

						<a href="/profile" class="flex items-center gap-3 ml-2 group">
							<div class="text-right hidden sm:block">
								<span
									class="block text-[10px] font-bold opacity-60 uppercase tracking-widest group-hover:text-sunset transition-colors"
									>Lister</span
								>
								<span
									class="block font-bold text-sm leading-none group-hover:text-sunset transition-colors"
									>{data.user.firstName || 'User'}</span
								>
							</div>

							<div
								class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg border border-white/10 group-hover:border-sunset/50 transition-all"
							>
								👤
							</div>
						</a>

						<form method="POST" action="/logout" use:enhance>
							<button
								class="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-200 transition-all text-white shadow-sm ring-1 ring-white/10 group"
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
							class="px-5 py-2 rounded-xl hover:bg-white/10 transition-all font-bold text-sm border border-white/20"
						>
							Login
						</a>
						<a
							href="/register"
							class="px-5 py-2 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 transition-all font-bold text-sm"
						>
							Sign Up
						</a>
					{/if}
				</div>
			</div>

			<!-- Mobile Menu Button (Icon only for now) -->
			<button class="md:hidden p-2 rounded-lg bg-white/10" aria-label="Toggle Menu">
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
	<footer class="bg-slate-900 text-slate-400 py-12 px-6">
		<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
			<div class="col-span-1 md:col-span-2">
				<h2 class="text-2xl font-black text-white mb-4 italic">Eski kiken ena</h2>
				<p class="max-w-xs text-sm leading-relaxed">
					Mauritius' premier peer-to-peer equipment rental marketplace. Save money, earn extra
					income, and build a stronger community.
				</p>
			</div>
			<div>
				<h3 class="text-white font-bold mb-4 uppercase text-xs tracking-widest">Platform</h3>
				<ul class="space-y-2 text-sm">
					<li>
						<a href="/listings" class="hover:text-white transition-colors">Browse All Gear</a>
					</li>
					<li>
						<a href="/listings/new" class="hover:text-white transition-colors">List Your Item</a>
					</li>
					<li>
						<a href="/how-it-works" class="hover:text-white transition-colors">How it works</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/faqs" class="hover:text-white transition-colors">FAQs</a></li>
					<li><a href="/contact" class="hover:text-white transition-colors">Contact Us</a></li>
					<li><a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
				</ul>
			</div>
		</div>
		<div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
			&copy; {new Date().getFullYear()} Eski kiken ena. Tou drwa rezerve.
		</div>
	</footer>
</div>
