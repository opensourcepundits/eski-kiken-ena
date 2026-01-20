<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="min-h-screen flex flex-col font-sans text-slate-900">
	<!-- Hero Section -->
	<header class="bg-gradient-to-br from-ocean to-blue-700 text-white pb-24 pt-8 px-6">
		<nav class="max-w-7xl mx-auto flex justify-between items-center mb-20">
			<a href="/" class="text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity"
				>Eski kiken ena</a
			>

			<div class="flex items-center gap-8">
				<!-- Static Navigation Links -->
				<div class="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
					<a
						href="/how-it-works"
						class="text-blue-100 hover:text-white hover:underline decoration-sunset decoration-2 underline-offset-4 transition-all"
						>How this works</a
					>
					<a
						href="/contact"
						class="text-blue-100 hover:text-white hover:underline decoration-sunset decoration-2 underline-offset-4 transition-all"
						>Contact us</a
					>
					<a
						href="/faqs"
						class="text-blue-100 hover:text-white hover:underline decoration-sunset decoration-2 underline-offset-4 transition-all"
						>FAQs</a
					>
				</div>

				<!-- Auth / Actions -->
				<div class="flex items-center gap-5 md:pl-5 md:border-l md:border-white/10">
					{#if data.user}
						<a
							href="/listings/new"
							class="bg-sunset px-5 py-2.5 rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 transform hover:-translate-y-0.5 text-sm"
						>
							List Item
						</a>

						<div class="flex items-center gap-4">
							<div class="text-right hidden sm:block">
								<span class="block text-xs font-medium opacity-80 uppercase tracking-wider"
									>Welcome</span
								>
								<span class="block font-bold text-base leading-none"
									>{data.user.firstName || 'User'}</span
								>
							</div>
							<form method="POST" action="?/logout" use:enhance>
								<button
									class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white shadow-sm ring-1 ring-white/10 group"
									title="Logout"
								>
									<!-- LogOut Icon -->
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="opacity-90 group-hover:opacity-100"
										><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline
											points="16 17 21 12 16 7"
										/><line x1="21" x2="9" y1="12" y2="12" /></svg
									>
								</button>
							</form>
						</div>
					{:else}
						<a
							href="/login"
							class="px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all font-medium text-sm"
							>Login</a
						>
					{/if}
				</div>
			</div>
		</nav>

		<div class="max-w-4xl mx-auto text-center space-y-8">
			<h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight drop-shadow-sm">
				Need a tool for <br class="hidden md:block" />the weekend?
			</h1>
			<p
				class="text-xl md:text-2xl text-blue-50 font-medium max-w-2xl mx-auto leading-relaxed opacity-90"
			>
				Peer-to-peer rental marketplace for power tools & equipment in Mauritius.
			</p>

			<!-- Search Bar -->
			<div class="mt-12 relative max-w-2xl mx-auto group">
				<div
					class="absolute inset-x-0 -inset-y-1 bg-gradient-to-r from-sunset to-orange-400 rounded-full opacity-20 group-hover:opacity-40 blur transition-opacity"
				></div>
				<div class="relative flex items-center bg-white rounded-full p-2 shadow-2xl">
					<div class="pl-6 text-slate-400">
						<!-- Search Icon -->
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
							><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
					</div>
					<input
						type="text"
						placeholder="Eski kiken ena enn drill?"
						class="w-full px-4 py-4 bg-transparent text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
					<button
						class="bg-ocean text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-md"
					>
						Search
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Features / Categories -->
	<main class="flex-1 max-w-7xl mx-auto w-full -mt-16 px-6 pb-20 relative z-10">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Feature 1 -->
			<div
				class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
			>
				<div
					class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-ocean mb-6 group-hover:scale-110 transition-transform duration-300"
				>
					<!-- Hammer Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
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
				<h3 class="text-xl font-bold mb-3 text-slate-900">Rent Tools</h3>
				<p class="text-slate-600 leading-relaxed">
					Find the right equipment nearby without breaking the bank. Professional gear at local
					prices.
				</p>
			</div>

			<!-- Feature 2 -->
			<div
				class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
			>
				<div
					class="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-sunset mb-6 group-hover:scale-110 transition-transform duration-300"
				>
					<!-- MapPin Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
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
				<h3 class="text-xl font-bold mb-3 text-slate-900">Local Community</h3>
				<p class="text-slate-600 leading-relaxed">
					Connect with neighbors in your district. Safe, secure, and built for Mauritians.
				</p>
			</div>

			<!-- Feature 3 -->
			<div
				class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
			>
				<div
					class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300"
				>
					<!-- Banknote Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
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
				<h3 class="text-xl font-bold mb-3 text-slate-900">Earn Money</h3>
				<p class="text-slate-600 leading-relaxed">
					List your idle tools and earn extra income easily. Turn that dusty drill into cash.
				</p>
			</div>
		</div>

		<div class="mt-24 text-center">
			<h2 class="text-3xl font-bold mb-8 text-slate-900">Recent Listings</h2>
			<div
				class="py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4"
			>
				<div class="text-slate-300">
					<!-- Search Icon Large -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
					>
				</div>
				<p class="text-slate-500 text-lg font-medium">
					Pena nanye dan sa l'endroit la. Check enn lot district?
				</p>
			</div>
		</div>
	</main>
</div>
