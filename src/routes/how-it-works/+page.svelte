<script lang="ts">
	// No server data needed for this static page
</script>

<svelte:head>
	<title>How does Eke work? – Premium Rental Marketplace</title>
	<meta
		name="description"
		content="Discover how Eke connects renters and owners with a seamless, secure, and beautifully designed marketplace. Learn the booking flow, listing process, and the innovative features that make renting effortless."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-teal-600 via-indigo-700 to-purple-800 text-white font-sans"
	style="font-family: 'Inter', sans-serif;"
>
	<!-- Hero Section -->
	<section
		class="flex flex-col items-center justify-center text-center py-24 px-4 md:px-12 lg:px-24"
	>
		<h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
			How does <span
				class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400">Eke</span
			> work?
		</h1>
		<p class="text-lg md:text-xl max-w-2xl mb-8 opacity-90">
			A premium, glass‑morphed marketplace that lets you list, discover, and book items in a few
			clicks – all wrapped in a sleek, modern UI.
		</p>
		<a
			href="/listings"
			class="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-black/30"
		>
			Explore Listings
		</a>
	</section>

	<!-- Overview Cards -->
	<section class="grid md:grid-cols-3 gap-8 px-4 md:px-12 lg:px-24 mb-16">
		<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transform transition">
			<h2 class="text-2xl font-bold mb-3">🔎 Discover</h2>
			<p class="opacity-80">
				Browse a curated catalog, filter by category, location, or price, and see real‑time
				availability.
			</p>
		</div>
		<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transform transition">
			<h2 class="text-2xl font-bold mb-3">🛠️ List</h2>
			<p class="opacity-80">
				Create a listing in seconds with our custom <code class="bg-white/20 px-1 rounded"
					>TimePicker</code
				> and upload images that animate on hover.
			</p>
		</div>
		<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transform transition">
			<h2 class="text-2xl font-bold mb-3">🚀 Book</h2>
			<p class="opacity-80">
				Select dates, confirm with a single click, and receive instant email notifications.
			</p>
		</div>
	</section>

	<!-- Detailed Flow -->
	<section class="px-4 md:px-12 lg:px-24 mb-24">
		<h2 class="text-4xl font-extrabold text-center mb-12">The Eke Journey</h2>
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div class="space-y-6">
				<h3 class="text-2xl font-bold">1️⃣ Search &amp; Select</h3>
				<p class="opacity-90">
					Use the powerful search bar at the top. Filters slide in with smooth micro‑animations, and
					each result card uses a glass‑morphism hover effect.
				</p>
				<h3 class="text-2xl font-bold">2️⃣ Pick Your Dates</h3>
				<p class="opacity-90">
					Our bespoke <code class="bg-white/20 px-1 rounded">TimePicker</code> replaces native inputs,
					offering a vibrant, accessible UI.
				</p>
				<h3 class="text-2xl font-bold">3️⃣ Confirm &amp; Pay</h3>
				<p class="opacity-90">
					One‑click confirmation opens a modal with a subtle fade‑in animation. Payment is processed
					securely via Stripe (or your chosen gateway).
				</p>
			</div>
			<div class="relative">
				<img
					src="/static/flow-diagram.png"
					alt="Eke booking flow diagram"
					class="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
				/>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="bg-white/5 backdrop-blur-md py-16 px-4 md:px-12 lg:px-24 text-center">
		<h2 class="text-4xl font-extrabold mb-6">Ready to experience premium renting?</h2>
		<a
			href="/register"
			class="inline-block bg-teal-600 hover:bg-teal-700 transition-colors text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-900/30"
		>
			Join Eke Today
		</a>
	</section>
</div>
