<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
	let listing = $derived(data.listing);
	let listingBookings = $derived(data.listingBookings);

	let upcomingBookings = $derived(
		listingBookings.filter((b: any) => new Date(b.startDate) >= new Date())
	);
	let pastBookings = $derived(
		listingBookings.filter((b: any) => new Date(b.startDate) < new Date())
	);
</script>

<div class="min-h-screen bg-slate-50 pb-20 pt-32 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Back to Profile -->
		<a
			href="/profile"
			class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-teal-600 mb-8 transition-colors group"
		>
			<span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
			Back to Profile
		</a>

		<div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
			<div>
				<h1 class="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
					{listing.title}
				</h1>
				<div class="flex items-center gap-4 text-slate-500">
					<span
						class="bg-indigo-50 text-teal-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
						>{listing.category.replace('_', ' ')}</span
					>
					<span class="font-bold">Rs {listing.pricePerDay} / day</span>
					<div class="h-4 w-px bg-slate-200"></div>
					<div class="flex flex-col md:flex-row gap-4 md:gap-8 bg-slate-100 px-4 py-2 rounded-xl">
						<span class="text-sm font-bold text-slate-600"
							>Avg. Booking: <span class="font-black text-indigo-600"
								>{listing.avgDays || 0} days</span
							></span
						>
						<span class="text-sm font-bold text-slate-600"
							>Total Earned: <span class="font-black text-emerald-600"
								>Rs {listing.totalEarnings || 0}</span
							></span
						>
						<span class="text-sm font-bold text-slate-600"
							>Avg. / Rental: <span class="font-black text-emerald-600"
								>Rs {listing.avgEarnings || 0}</span
							></span
						>
					</div>
				</div>
			</div>

			<div class="flex gap-4">
				<a
					href="/listings/{listing.id}/edit"
					class="bg-white px-6 py-3 rounded-md font-black text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
				>
					✏️ Edit Information
				</a>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
			<!-- Upcoming Bookings -->
			<div class="lg:col-span-12">
				<div
					class="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-slate-100 overflow-hidden"
				>
					<div class="p-8 border-b border-slate-50">
						<h2 class="text-2xl font-black text-slate-900">Upcoming & Active Bookings</h2>
						<p class="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
							Direct from your schedule
						</p>
					</div>

					<div class="p-8">
						{#if upcomingBookings.length === 0}
							<div class="py-12 text-center">
								<p class="text-slate-400 font-bold italic">No upcoming bookings scheduled.</p>
							</div>
						{:else}
							<div class="overflow-x-auto">
								<table class="w-full text-left">
									<thead>
										<tr class="text-xs font-black uppercase tracking-widest text-slate-400">
											<th class="pb-6">Renter</th>
											<th class="pb-6">Dates</th>
											<th class="pb-6">Total Earned</th>
											<th class="pb-6">Status</th>
											<th class="pb-6 text-right">Actions</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-slate-50">
										{#each upcomingBookings as booking}
											<tr class="group">
												<td class="py-6">
													<div class="flex items-center gap-3">
														<div
															class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-teal-600"
														>
															{booking.renter.firstName?.[0]}{booking.renter.lastName?.[0]}
														</div>
														<div>
															<p class="font-bold text-slate-900">
																{booking.renter.firstName}
																{booking.renter.lastName}
															</p>
															<p class="text-xs text-slate-400 font-medium">
																{booking.renter.email}
															</p>
														</div>
													</div>
												</td>
												<td class="py-6">
													<p class="font-black text-slate-900">
														{new Date(booking.startDate).toLocaleDateString('en-GB')}
													</p>
													<p class="text-[10px] text-slate-400 font-bold">
														UNTIL {new Date(booking.endDate).toLocaleDateString('en-GB')}
													</p>
												</td>
												<td class="py-6">
													<p class="font-black text-emerald-600">Rs {booking.totalPrice}</p>
												</td>
												<td class="py-6">
													<span
														class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full {booking.status ===
														'CONFIRMED'
															? 'bg-emerald-50 text-emerald-600'
															: booking.status === 'CANCELLED'
																? 'bg-red-50 text-red-600'
																: 'bg-orange-50 text-orange-600'}"
													>
														{booking.status}
													</span>
												</td>
												<td class="py-6 text-right">
													{#if booking.status === 'PENDING'}
														<div class="flex justify-end gap-2">
															<form method="POST" action="?/updateBookingStatus" use:enhance>
																<input type="hidden" name="bookingId" value={booking.id} />
																<input type="hidden" name="status" value="CONFIRMED" />
																<button
																	class="bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50"
																	>Approve</button
																>
															</form>
															<form method="POST" action="?/updateBookingStatus" use:enhance>
																<input type="hidden" name="bookingId" value={booking.id} />
																<input type="hidden" name="status" value="CANCELLED" />
																<button
																	class="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors disabled:opacity-50"
																	>Decline</button
																>
															</form>
														</div>
													{:else}
														<span
															class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
															>No actions</span
														>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Booking History -->
			<div class="lg:col-span-12 mt-12">
				<h2 class="text-2xl font-black text-slate-900 mb-8 border-l-4 border-teal-600 pl-4">
					Booking History
				</h2>

				{#if pastBookings.length === 0}
					<div
						class="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200"
					>
						<p class="text-slate-400 font-bold italic">No past booking history found.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						{#each pastBookings as booking}
							<div
								class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6 border-b-4 border-b-slate-200"
							>
								<div class="flex justify-between items-start mb-6">
									<div class="text-xs text-slate-400 font-black uppercase tracking-widest">
										Completed
									</div>
									<div class="font-black text-emerald-600">Rs {booking.totalPrice}</div>
								</div>
								<p class="font-bold text-slate-900">
									{booking.renter.firstName}
									{booking.renter.lastName}
								</p>
								<p class="text-sm text-slate-500 mb-4">
									{new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(
										booking.endDate
									).toLocaleDateString('en-GB')}
								</p>
								<div class="pt-4 border-t border-slate-50">
									<p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
										Feedback
									</p>
									<p class="text-xs italic text-slate-500">
										"Good transaction, item was returned in perfect condition."
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
