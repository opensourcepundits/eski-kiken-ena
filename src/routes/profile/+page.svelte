<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = $derived(data.user);
	let userListings = $derived(data.userListings);
	let userBookings = $derived(data.userBookings);
	let ownerBookings = $derived(data.ownerBookings);

	let activeTab = $state('bookings'); // 'bookings', 'listings', 'settings'

	// Delete Modal State
	let isDeleteModalOpen = $state(false);
	let listingToDelete = $state<{ id: string; title: string } | null>(null);

	function openDeleteModal(listing: any) {
		listingToDelete = { id: listing.id, title: listing.title };
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		listingToDelete = null;
	}
</script>

{#if user}
	<div class="min-h-screen bg-slate-50 pb-20">
		<!-- Profile Header -->
		<div class="bg-indigo-900 pt-32 pb-48 px-4 text-white">
			<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
				<div class="relative group">
					<div
						class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden group-hover:border-sunset/50 transition-all"
					>
						👤
						<button
							class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
						>
							<span class="text-xs font-black uppercase tracking-widest">Change</span>
						</button>
					</div>
				</div>
				<div class="text-center md:text-left">
					<h1 class="text-4xl md:text-5xl font-black tracking-tight mb-2">
						{user.firstName}
						{user.lastName}
					</h1>
					<p class="text-indigo-200 text-lg font-medium opacity-80">{user.email}</p>
					<div class="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
						<div
							class="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-sm font-bold backdrop-blur-sm"
						>
							{userListings.length} Listings
						</div>
						<div
							class="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-sm font-bold backdrop-blur-sm"
						>
							{userBookings.length + ownerBookings.length} Bookings
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Section -->
		<main class="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<!-- Sticky Sidebar Navigation -->
				<div class="lg:col-span-3">
					<div
						class="bg-white rounded-3xl shadow-2xl shadow-indigo-900/5 border border-slate-100 p-4 sticky top-32"
					>
						<nav class="space-y-1">
							<button
								onclick={() => (activeTab = 'bookings')}
								class="w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'bookings'
									? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								<span class="text-xl">📅</span> My Bookings
							</button>
							<button
								onclick={() => (activeTab = 'listings')}
								class="w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'listings'
									? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								<span class="text-xl">🛠️</span> My Inventory
							</button>
							<button
								onclick={() => (activeTab = 'settings')}
								class="w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'settings'
									? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								<span class="text-xl">⚙️</span> Account Settings
							</button>
						</nav>
					</div>
				</div>

				<!-- Tabs View -->
				<div class="lg:col-span-9 space-y-8">
					{#if activeTab === 'bookings'}
						<div class="space-y-8">
							<!-- Bookings as Renter -->
							<section>
								<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
									Items I'm Renting
									<span class="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full"
										>{userBookings.length}</span
									>
								</h2>

								{#if userBookings.length === 0}
									<div
										class="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
									>
										<p class="text-slate-400 font-bold italic">You haven't rented any items yet.</p>
										<a
											href="/listings"
											class="mt-4 inline-block text-indigo-600 font-black hover:underline"
											>Explore Marketplace</a
										>
									</div>
								{:else}
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										{#each userBookings as booking}
											<div
												class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 flex gap-6 group hover:scale-[1.01] transition-transform"
											>
												<div
													class="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0"
												>
													{#if (booking.listing.images as string[])?.length > 0}
														<img
															src={(booking.listing.images as string[])[0]}
															alt=""
															class="w-full h-full object-cover"
														/>
													{:else}
														<div class="w-full h-full flex items-center justify-center text-2xl">
															📦
														</div>
													{/if}
												</div>
												<div class="flex-grow">
													<div class="flex justify-between items-start">
														<div>
															<h3 class="font-black text-slate-900 leading-tight mb-1">
																{booking.listing.title}
															</h3>
															<span
																class="text-[10px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 px-2 py-0.5 rounded"
																>{booking.status}</span
															>
														</div>
													</div>
													<div class="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500 font-bold">
														<div>
															<p class="uppercase text-[9px] opacity-60">Total Paid</p>
															<p class="text-slate-900 text-lg">Rs {booking.totalPrice}</p>
														</div>
														<div>
															<p class="uppercase text-[9px] opacity-60">Date Range</p>
															<p class="text-slate-900">
																{new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(
																	booking.endDate
																).toLocaleDateString('en-GB')}
															</p>
														</div>
													</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</section>

							<!-- Bookings for my Items (As Owner) -->
							<section>
								<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
									Rental Requests for My Gear
									<span class="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full"
										>{ownerBookings.length}</span
									>
								</h2>

								{#if ownerBookings.length === 0}
									<div
										class="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
									>
										<p class="text-slate-400 font-bold italic">No requests for your items yet.</p>
									</div>
								{:else}
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										{#each ownerBookings as booking}
											<div
												class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 flex gap-6 group hover:scale-[1.01] transition-transform"
											>
												<div
													class="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0"
												>
													{#if (booking.listing.images as string[])?.length > 0}
														<img
															src={(booking.listing.images as string[])[0]}
															alt=""
															class="w-full h-full object-cover"
														/>
													{:else}
														<div class="w-full h-full flex items-center justify-center text-2xl">
															📦
														</div>
													{/if}
												</div>
												<div class="flex-grow">
													<div class="flex justify-between items-start">
														<div>
															<h3 class="font-black text-slate-900 leading-tight mb-1">
																{booking.listing.title}
															</h3>
															<span
																class="text-[10px] font-black uppercase text-orange-500 tracking-widest bg-orange-50 px-2 py-0.5 rounded"
																>{booking.status}</span
															>
														</div>
													</div>
													<p class="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
														Renter: <span class="text-slate-900"
															>{booking.renter?.firstName} {booking.renter?.lastName}</span
														>
													</p>
													<div class="mt-4 flex gap-2">
														<button
															class="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
															>Approve</button
														>
														<button
															class="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
															>Decline</button
														>
													</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</section>
						</div>
					{:else if activeTab === 'listings'}
						<section>
							<div class="flex justify-between items-center mb-8">
								<h2 class="text-2xl font-black text-slate-900 flex items-center gap-3">
									My Gear
									<span class="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full"
										>{userListings.length}</span
									>
								</h2>
								<a
									href="/listings/new"
									class="bg-sunset text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-orange-900/20 hover:bg-orange-500 transition-all"
									>+ Add Item</a
								>
							</div>

							{#if userListings.length === 0}
								<div
									class="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200"
								>
									<p class="text-slate-400 text-xl font-bold italic mb-6">
										You haven't listed anything yet.
									</p>
									<a
										href="/listings/new"
										class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-indigo-700 transition-all"
										>List Your First Item</a
									>
								</div>
							{:else}
								<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
									{#each userListings as listing}
										<div
											class="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-indigo-900/5 hover:shadow-indigo-900/10 transition-all"
										>
											<div class="h-48 bg-slate-100 relative">
												{#if (listing.images as string[])?.length > 0}
													<img
														src={(listing.images as string[])[0]}
														alt=""
														class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
													/>
												{:else}
													<div class="w-full h-full flex items-center justify-center text-4xl">
														🛠️
													</div>
												{/if}
												<div class="absolute top-4 right-4 flex gap-2">
													<a
														href="/listings/{listing.id}/edit"
														class="bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-sm hover:text-indigo-600 transition-colors"
														title="Edit Item">✏️</a
													>
													<button
														type="button"
														onclick={() => openDeleteModal(listing)}
														class="bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-sm hover:text-red-600 transition-all active:scale-90"
														title="Remove from Inventory">🗑️</button
													>
												</div>
											</div>
											<div class="p-8">
												<div class="flex justify-between items-start mb-2 gap-4">
													<h3 class="text-xl font-black text-slate-900 truncate">
														{listing.title}
													</h3>
												</div>
												<div class="flex items-center gap-2 mb-6">
													<span class="text-indigo-600 font-black">Rs {listing.pricePerDay}</span>
													<span class="text-slate-400 text-sm font-medium italic">/ day</span>
												</div>

												<div class="space-y-4">
													<div class="flex gap-3">
														<div class="flex-1 bg-slate-50 p-4 rounded-2xl text-center">
															<p
																class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1"
															>
																Status
															</p>
															<p class="text-xs font-black text-emerald-600">
																{listing.isActive ? 'Active' : 'Inactive'}
															</p>
														</div>
														<div class="flex-1 bg-slate-50 p-4 rounded-2xl text-center">
															<p
																class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1"
															>
																Earned
															</p>
															<p class="text-xs font-black text-slate-900">Rs 0</p>
														</div>
													</div>

													<a
														href="/profile/inventory/{listing.id}"
														class="block w-full text-center py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors"
													>
														View Details & History
													</a>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</section>
					{:else if activeTab === 'settings'}
						<section class="max-w-2xl">
							<h2 class="text-2xl font-black text-slate-900 mb-8">Account Settings</h2>

							<form
								class="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 p-10 space-y-8"
							>
								<div class="grid grid-cols-2 gap-8">
									<div class="space-y-2">
										<label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
											>First Name</label
										>
										<input
											type="text"
											value={user.firstName}
											class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900"
										/>
									</div>
									<div class="space-y-2">
										<label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
											>Last Name</label
										>
										<input
											type="text"
											value={user.lastName}
											class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
										>Email Address</label
									>
									<input
										type="email"
										value={user.email}
										disabled
										class="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold opacity-60 cursor-not-allowed"
									/>
									<p class="text-[10px] text-slate-400 italic">Email cannot be changed yet.</p>
								</div>

								<div class="pt-4">
									<button
										class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-95"
									>
										Save Profile Changes
									</button>
								</div>
							</form>
						</section>
					{/if}
				</div>
			</div>
		</main>
	</div>

	<!-- Custom Delete Modal -->
	{#if isDeleteModalOpen && listingToDelete}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
		>
			<div
				class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full p-10 space-y-8 animate-in zoom-in-95 duration-300"
			>
				<div class="text-center">
					<div
						class="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6 shadow-sm animate-bounce"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
							/><line x1="12" y1="9" x2="12" y2="13" /><line
								x1="12"
								y1="17"
								x2="12.01"
								y2="17"
							/></svg
						>
					</div>
					<h2 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">Eski ou sir?</h2>
					<p class="text-slate-500 font-medium leading-relaxed">
						Ou pe al retire <span class="text-slate-900 font-black">"{listingToDelete.title}"</span> depi
						ou inventory. Sa aksion la pa kapav sanze apre.
					</p>
				</div>

				<div class="flex flex-col gap-3">
					<form
						method="POST"
						action="?/deleteListing"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update();
								closeDeleteModal();
							};
						}}
					>
						<input type="hidden" name="id" value={listingToDelete.id} />
						<button
							type="submit"
							class="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
						>
							Wi, Retire Li
						</button>
					</form>
					<button
						onclick={closeDeleteModal}
						class="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	/* Custom animations or fixes if needed */
</style>
