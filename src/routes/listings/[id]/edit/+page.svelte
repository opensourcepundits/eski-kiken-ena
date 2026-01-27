<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let listing = $derived(data.listing);

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

	const districts = [
		'PORT_LOUIS',
		'PAMPLEMOUSSES',
		'RIVIERE_DU_REMPART',
		'FLACQ',
		'GRAND_PORT',
		'SAVANNE',
		'PLAINES_WILHEMS',
		'MOKA',
		'BLACK_RIVER'
	];
</script>

<div class="min-h-screen bg-slate-50 pb-20 pt-32 px-4">
	<div class="max-w-3xl mx-auto">
		<a
			href="/profile"
			class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-teal-600 mb-8 transition-colors group"
		>
			<span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
			Back to Profile
		</a>

		<div
			class="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-slate-100 overflow-hidden"
		>
			<div class="p-10 border-b border-slate-50 bg-teal-600 text-white">
				<h1 class="text-3xl font-black tracking-tight mb-2">Edit Item</h1>
				<p class="text-indigo-100 font-medium opacity-80 text-sm uppercase tracking-widest">
					Update your listing information
				</p>
			</div>

			<form method="POST" use:enhance class="p-10 space-y-8">
				{#if form?.message}
					<div
						class="bg-red-50 text-red-600 p-4 rounded-md text-sm font-bold border border-red-100"
					>
						{form.message}
					</div>
				{/if}

				<div class="space-y-6">
					<div class="space-y-2">
						<label
							for="title"
							class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
							>Item Title</label
						>
						<input
							type="text"
							id="title"
							name="title"
							required
							value={listing.title}
							placeholder="e.g. Heavy Duty Rotary Hammer Drill"
							class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 focus:border-teal-600 transition-all font-bold text-slate-900"
						/>
					</div>

					<div class="grid grid-cols-2 gap-6">
						<div class="space-y-2">
							<label
								for="category"
								class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
								>Category</label
							>
							<select
								id="category"
								name="category"
								required
								class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 focus:border-teal-600 transition-all font-bold text-slate-900 appearance-none"
							>
								{#each categories as cat}
									<option value={cat} selected={listing.category === cat}
										>{cat.replace('_', ' ')}</option
									>
								{/each}
							</select>
						</div>

						<div class="space-y-2">
							<label
								for="pricePerDay"
								class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
								>Price per Day (Rs)</label
							>
							<input
								type="number"
								id="pricePerDay"
								name="pricePerDay"
								required
								value={listing.pricePerDay}
								class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 focus:border-teal-600 transition-all font-bold text-slate-900"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label
							for="district"
							class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
							>Pickup District</label
						>
						<select
							id="district"
							name="district"
							required
							class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 focus:border-teal-600 transition-all font-bold text-slate-900 appearance-none"
						>
							{#each districts as dist}
								<option value={dist} selected={listing.district === dist}
									>{dist.replace('_', ' ')}</option
								>
							{/each}
						</select>
					</div>

					<div class="space-y-2">
						<label
							for="description"
							class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
							>Description</label
						>
						<textarea
							id="description"
							name="description"
							required
							rows="5"
							class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 focus:border-teal-600 transition-all font-bold text-slate-900"
							>{listing.description}</textarea
						>
					</div>
				</div>

				<div class="pt-6">
					<button
						type="submit"
						class="w-full py-5 bg-teal-600 text-white rounded-md font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
