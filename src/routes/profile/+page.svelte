<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = $derived(data.user);
	let userListings = $derived(data.userListings);
	let userBookings = $derived(data.userBookings);
	let ownerBookings = $derived(data.ownerBookings);

	let activeTab = $state('bookings'); // 'bookings', 'listings', 'settings'

	// --- Booking Details Modal State ---
	let selectedBooking = $state<any>(null);

	// --- Review Form State ---
	let reviewRating = $state(0);
	let reviewComment = $state('');
	let isReviewSubmitted = $state(false);

	function openBookingModal(booking: any) {
		selectedBooking = booking;
		// Reset review state when opening a new modal
		reviewRating = 0;
		reviewComment = '';
		isReviewSubmitted = false;
	}

	function closeBookingModal() {
		selectedBooking = null;
	}

	function getDays(start: string | Date, end: string | Date) {
		const diff = new Date(end).getTime() - new Date(start).getTime();
		return Math.ceil(diff / (1000 * 3600 * 24));
	}

	function getDisplayStatus(status: string, startDate: string | Date, endDate: string | Date) {
		if (status === 'CANCELLED') return 'CANCELLED';
		if (status === 'PENDING') return 'PENDING';

		const now = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);

		// Normalize time to ensure accurate day comparison
		now.setHours(0, 0, 0, 0);
		start.setHours(0, 0, 0, 0);
		end.setHours(23, 59, 59, 999); // End date includes the full day

		if (now > end) return 'COMPLETED';
		if (now < start) return 'CONFIRMED: UPCOMING';
		return 'CONFIRMED: ONGOING';
	}
	// -----------------------------------

	// --- Cancel Booking State (Two-Step Verification) ---
	let bookingToCancel = $state<{ id: string; title: string } | null>(null);

	function openCancelModal(event: Event, booking: any) {
		event.stopPropagation();
		bookingToCancel = { id: booking.id, title: booking.listing.title };
	}

	function closeCancelModal() {
		bookingToCancel = null;
	}
	// ----------------------------------------------------

	// --- Delete Listing State ---
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
		<div class="bg-teal-900 pt-32 pb-48 px-4 text-white">
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
						class="bg-white rounded-3xl shadow-2xl shadow-teal-900/5 border border-slate-100 p-4 sticky top-32"
					>
						<nav class="space-y-1">
							<button
								onclick={() => (activeTab = 'bookings')}
								class="w-full text-left px-6 py-4 rounded-md font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'bookings'
									? 'bg-teal-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								My Bookings
							</button>
							<button
								onclick={() => (activeTab = 'listings')}
								class="w-full text-left px-6 py-4 rounded-md font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'listings'
									? 'bg-teal-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								My Listings
							</button>
							<button
								onclick={() => (activeTab = 'settings')}
								class="w-full text-left px-6 py-4 rounded-md font-black text-sm transition-all flex items-center gap-3 {activeTab ===
								'settings'
									? 'bg-teal-600 text-white shadow-xl shadow-indigo-200'
									: 'text-slate-500 hover:bg-slate-50'}"
							>
								Account Settings
							</button>
						</nav>
					</div>
				</div>

				<!-- Tabs View -->
				<div class="lg:col-span-9 space-y-8">
					{#if activeTab === 'bookings'}
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
							<!-- Bookings as Renter -->
							<section>
								<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
									My rentals
									<span class="text-xs bg-indigo-100 text-teal-600 px-3 py-1 rounded-full"
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
											class="mt-4 inline-block text-teal-600 font-black hover:underline"
											>Explore Marketplace</a
										>
									</div>
								{:else}
									<div class="space-y-6">
										{#each userBookings as booking}
											{@const displayStatus = getDisplayStatus(
												booking.status,
												booking.startDate,
												booking.endDate
											)}
											<button
												type="button"
												onclick={() => openBookingModal(booking)}
												class="w-full text-left bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 flex gap-6 group hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden"
											>
												<!-- Hover Highlight -->
												<div
													class="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-50 transition-opacity"
												></div>

												<div class="relative z-10 flex gap-6 w-full">
													<div
														class="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 shadow-inner"
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
																<h3
																	class="font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-700 transition-colors"
																>
																	{booking.listing.title}
																</h3>
																<div class="flex items-center gap-2">
																	<span
																		class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap
                                                                        {displayStatus.includes(
																			'CONFIRMED'
																		)
																			? 'bg-emerald-100 text-emerald-700'
																			: displayStatus === 'COMPLETED'
																				? 'bg-slate-100 text-slate-500'
																				: displayStatus === 'CANCELLED'
																					? 'bg-red-100 text-red-700'
																					: 'bg-indigo-100 text-indigo-700'}">{displayStatus}</span
																	>

																	<!-- Cancel Button (List View) -->
																	{#if displayStatus !== 'CANCELLED' && displayStatus !== 'COMPLETED'}
																		<button
																			onclick={(e) => openCancelModal(e, booking)}
																			class="p-1 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all z-20"
																			title="Cancel Booking"
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				width="14"
																				height="14"
																				viewBox="0 0 24 24"
																				fill="none"
																				stroke="currentColor"
																				stroke-width="3"
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				><line x1="18" y1="6" x2="6" y2="18" /><line
																					x1="6"
																					y1="6"
																					x2="18"
																					y2="18"
																				/></svg
																			>
																		</button>
																	{/if}
																</div>
															</div>
															<div class="text-slate-300 group-hover:text-indigo-400">
																<!-- Info Icon -->
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
																	><circle cx="12" cy="12" r="10" /><line
																		x1="12"
																		y1="16"
																		x2="12"
																		y2="12"
																	/><line x1="12" y1="8" x2="12.01" y2="8" /></svg
																>
															</div>
														</div>
														<div
															class="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 font-bold"
														>
															<div>
																<p class="uppercase text-[9px] opacity-60">Total Paid</p>
																<p class="text-slate-900 text-base">Rs {booking.totalPrice}</p>
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
											</button>
										{/each}
									</div>
								{/if}
							</section>

							<!-- Bookings for my Items (As Owner) -->
							<section>
								<h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
									Request for listings
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
									<div class="space-y-6">
										{#each ownerBookings as booking}
											{@const displayStatus = getDisplayStatus(
												booking.status,
												booking.startDate,
												booking.endDate
											)}
											<div
												class="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 flex gap-6 group hover:scale-[1.01] transition-transform"
											>
												<div
													class="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0"
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
																class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap
                                                                {displayStatus.includes('CONFIRMED')
																	? 'bg-emerald-50 text-emerald-600'
																	: displayStatus === 'COMPLETED'
																		? 'bg-slate-100 text-slate-500'
																		: displayStatus === 'CANCELLED'
																			? 'bg-red-50 text-red-600'
																			: 'bg-orange-50 text-orange-600'}"
															>
																{displayStatus}
															</span>
														</div>
													</div>
													<p class="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
														Renter: <span class="text-slate-900"
															>{booking.renter?.firstName} {booking.renter?.lastName}</span
														>
													</p>
													<div class="mt-2 text-xs text-slate-500 font-bold">
														<p class="uppercase text-[9px] opacity-60">Dates</p>
														<p class="text-slate-900">
															{new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(
																booking.endDate
															).toLocaleDateString('en-GB')}
														</p>
													</div>
													{#if booking.status === 'PENDING'}
														<div class="mt-4 flex gap-2">
															<form
																method="POST"
																action="?/updateBookingStatus"
																use:enhance
																class="flex-1"
															>
																<input type="hidden" name="bookingId" value={booking.id} />
																<input type="hidden" name="status" value="CONFIRMED" />
																<button
																	class="w-full py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-sm"
																	>Approve</button
																>
															</form>
															<form
																method="POST"
																action="?/updateBookingStatus"
																use:enhance
																class="flex-1"
															>
																<input type="hidden" name="bookingId" value={booking.id} />
																<input type="hidden" name="status" value="CANCELLED" />
																<button
																	class="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
																	>Decline</button
																>
															</form>
														</div>
													{:else}
														<div class="mt-4 pt-4 border-t border-slate-50">
															<p
																class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic"
															>
																Processed on {new Date(
																	booking.createdAt ?? new Date()
																).toLocaleDateString('en-GB')}
															</p>
														</div>
													{/if}
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
									<span class="text-xs bg-indigo-100 text-teal-600 px-3 py-1 rounded-full"
										>{userListings.length}</span
									>
								</h2>
								<a
									href="/listings/new"
									class="bg-sunset text-white px-6 py-3 rounded-md font-black text-sm shadow-xl shadow-orange-900/20 hover:bg-orange-500 transition-all"
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
										class="bg-teal-600 text-white px-10 py-4 rounded-md font-black shadow-2xl hover:bg-indigo-700 transition-all"
										>List Your First Item</a
									>
								</div>
							{:else}
								<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
									{#each userListings as listing}
										<div
											class="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-teal-900/5 hover:shadow-teal-900/10 transition-all"
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
														class="bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-sm hover:text-teal-600 transition-colors"
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
													<span class="text-teal-600 font-black">Rs {listing.pricePerDay}</span>
													<span class="text-slate-400 text-sm font-medium italic">/ day</span>
												</div>

												<div class="space-y-4">
													<div class="flex gap-3">
														<div class="flex-1 bg-slate-50 p-4 rounded-md text-center">
															<p
																class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1"
															>
																Status
															</p>
															<p class="text-xs font-black text-emerald-600">
																{listing.isActive ? 'Active' : 'Inactive'}
															</p>
														</div>
														<div class="flex-1 bg-slate-50 p-4 rounded-md text-center">
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
														class="block w-full text-center py-4 bg-indigo-50 text-teal-600 rounded-md font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors"
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
								class="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-slate-100 p-10 space-y-8"
							>
								<div class="grid grid-cols-2 gap-8">
									<div class="space-y-2">
										<label
											for="firstName"
											class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
											>First Name</label
										>
										<input
											type="text"
											id="firstName"
											value={user.firstName}
											class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900"
										/>
									</div>
									<div class="space-y-2">
										<label
											for="lastName"
											class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
											>Last Name</label
										>
										<input
											type="text"
											id="lastName"
											value={user.lastName}
											class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label
										for="email"
										class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1"
										>Email Address</label
									>
									<input
										type="email"
										id="email"
										value={user.email}
										disabled
										class="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-md text-slate-500 font-bold opacity-60 cursor-not-allowed"
									/>
									<p class="text-[10px] text-slate-400 italic">Email cannot be changed yet.</p>
								</div>

								<div class="pt-4">
									<button
										class="w-full py-5 bg-teal-600 text-white rounded-md font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-95"
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

	<!-- Booking Details Modal -->
	{#if selectedBooking}
		<!-- Ensure @const is the immediate child of #if -->
		{@const displayStatus = getDisplayStatus(
			selectedBooking.status,
			selectedBooking.startDate,
			selectedBooking.endDate
		)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
			onclick={closeBookingModal}
			role="presentation"
		>
			<div
				class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
				onclick={(e) => e.stopPropagation()}
				role="dialog"
			>
				<!-- Modal Header / Image -->
				<div class="relative h-48 bg-slate-100 flex-shrink-0">
					{#if (selectedBooking.listing.images as string[])?.length > 0}
						<img
							src={(selectedBooking.listing.images as string[])[0]}
							alt={selectedBooking.listing.title}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center text-6xl">📦</div>
					{/if}

					<!-- Close Button -->
					<button
						onclick={closeBookingModal}
						class="absolute top-4 right-4 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white text-slate-900 transition-all"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
						>
					</button>

					<!-- Status and Cancel Button -->
					<div class="absolute bottom-4 left-4 flex items-center gap-2">
						<span
							class="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm
                            {displayStatus.includes('CONFIRMED')
								? 'text-emerald-600'
								: displayStatus === 'COMPLETED'
									? 'text-slate-500'
									: displayStatus === 'CANCELLED'
										? 'text-red-600'
										: 'text-teal-600'}"
						>
							{displayStatus}
						</span>

						<!-- Cancel Button (Modal View) -->
						{#if displayStatus !== 'CANCELLED' && displayStatus !== 'COMPLETED'}
							<button
								onclick={(e) => openCancelModal(e, selectedBooking)}
								class="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-all shadow-sm"
								title="Cancel Booking"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
								>
							</button>
						{/if}
					</div>
				</div>

				<!-- Modal Content -->
				<div class="p-8 overflow-y-auto">
					<h2 class="text-2xl font-black text-slate-900 mb-2 leading-tight">
						{selectedBooking.listing.title}
					</h2>
					<div class="flex items-center gap-2 mb-6">
						<p class="text-sm font-bold text-slate-400">Listed for</p>
						<p class="text-sm font-black text-teal-600">
							Rs {selectedBooking.listing.pricePerDay} / day
						</p>
					</div>

					<!-- Receipt / Breakdown Card -->
					<div class="bg-slate-50 rounded-md p-6 border border-slate-100 space-y-4 mb-6">
						<div
							class="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed"
						>
							<div>
								<p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
									Start Date
								</p>
								<p class="font-bold text-slate-700">
									{new Date(selectedBooking.startDate).toLocaleDateString('en-GB')}
								</p>
							</div>
							<div class="text-right">
								<p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
									End Date
								</p>
								<p class="font-bold text-slate-700">
									{new Date(selectedBooking.endDate).toLocaleDateString('en-GB')}
								</p>
							</div>
						</div>

						<div class="flex justify-between items-center text-sm">
							<span class="text-slate-500 font-medium">Duration</span>
							<span class="font-bold text-slate-900">
								{getDays(selectedBooking.startDate, selectedBooking.endDate)} days
							</span>
						</div>

						<div class="flex justify-between items-center pt-2">
							<span class="text-slate-900 font-black text-lg">Total Paid</span>
							<span class="text-teal-600 font-black text-2xl">Rs {selectedBooking.totalPrice}</span>
						</div>
					</div>

					<!-- [NEW] Review Section -->
					{#if displayStatus === 'COMPLETED' || displayStatus === 'CONFIRMED: ONGOING'}
						<div class="mb-6 bg-slate-50 rounded-md p-6 border border-slate-100">
							<h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
								Rate this Item
							</h3>

							<form
								method="POST"
								action="?/submitReview"
								use:enhance={() => {
									return async ({ update }) => {
										isReviewSubmitted = true;
										await update();
									};
								}}
								class="space-y-4"
							>
								<input type="hidden" name="listingId" value={selectedBooking.listing.id} />
								<input type="hidden" name="bookingId" value={selectedBooking.id} />

								<!-- Star Input -->
								<input type="hidden" name="rating" value={reviewRating} />
								<div class="flex gap-2 justify-center py-2">
									{#each [1, 2, 3, 4, 5] as star}
										<button
											type="button"
											onclick={() => (reviewRating = star)}
											class="text-3xl transition-transform hover:scale-110 focus:outline-none"
										>
											<span class={reviewRating >= star ? 'text-yellow-400' : 'text-slate-200'}>
												★
											</span>
										</button>
									{/each}
								</div>

								<!-- Comment Input -->
								<div>
									<textarea
										name="comment"
										bind:value={reviewComment}
										placeholder="How was your experience with this gear?"
										class="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 outline-none resize-none h-20"
									></textarea>
								</div>

								<button
									disabled={reviewRating === 0 || isReviewSubmitted}
									class="w-full py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isReviewSubmitted ? 'Submitting...' : 'Submit Review'}
								</button>
							</form>
						</div>
					{/if}

					<!-- Footer Actions -->
					<div class="grid grid-cols-1 gap-3">
						{#if selectedBooking.status === 'PENDING'}
							<p class="text-center text-xs text-orange-500 font-bold bg-orange-50 py-3 rounded-xl">
								Waiting for owner approval
							</p>
						{/if}
						<button
							onclick={closeBookingModal}
							class="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]"
						>
							Close Details
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Cancellation Confirmation Modal (Two-Step Verification) -->
	{#if bookingToCancel}
		<div
			class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
		>
			<div
				class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full p-10 space-y-8 animate-in zoom-in-95 duration-300"
			>
				<div class="text-center">
					<div
						class="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 mx-auto mb-6 shadow-sm"
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
							><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line
								x1="9"
								y1="9"
								x2="15"
								y2="15"
							/></svg
						>
					</div>
					<h2 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">Cancel Booking?</h2>
					<p class="text-slate-500 font-medium leading-relaxed">
						Are you sure you want to cancel your reservation for <span
							class="text-slate-900 font-black">"{bookingToCancel.title}"</span
						>?
					</p>
				</div>

				<div class="flex flex-col gap-3">
					<form
						method="POST"
						action="?/updateBookingStatus"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								closeCancelModal();
							};
						}}
					>
						<input type="hidden" name="bookingId" value={bookingToCancel.id} />
						<input type="hidden" name="status" value="CANCELLED" />
						<button
							type="submit"
							class="w-full py-4 bg-red-600 text-white rounded-md font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
						>
							Yes, Cancel Booking
						</button>
					</form>
					<button
						onclick={closeCancelModal}
						class="w-full py-4 bg-slate-50 text-slate-500 rounded-md font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
					>
						No, Keep it
					</button>
				</div>
			</div>
		</div>
	{/if}

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
							class="w-full py-4 bg-red-600 text-white rounded-md font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
						>
							Wi, Retire Li
						</button>
					</form>
					<button
						onclick={closeDeleteModal}
						class="w-full py-4 bg-slate-50 text-slate-500 rounded-md font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
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
