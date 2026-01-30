<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import Chart from 'chart.js/auto';

	let { userListings, ownerBookings } = $props();

	let kpis = $derived.by(() => {
		const totalEarnings = userListings.reduce(
			(acc: number, l: any) => acc + Number(l.totalEarnings || 0),
			0
		);
		const totalRentals = userListings.reduce(
			(acc: number, l: any) => acc + Number(l.count || 0),
			0
		);
		const activeCount = userListings.filter((l: any) => l.isActive).length;
		const avgRating =
			userListings.length > 0
				? userListings.reduce((acc: number, l: any) => acc + Number(l.rating || 0), 0) /
					userListings.length
				: 0;

		return { totalEarnings, totalRentals, activeCount, avgRating };
	});

	// Charts references
	let revenueChartCanvas: HTMLCanvasElement;
	let statusChartCanvas: HTMLCanvasElement;
	let revenueChart: any;
	let statusChart: any;

	$effect(() => {
		if (revenueChartCanvas && !revenueChart) {
			renderRevenueChart();
		}
		if (statusChartCanvas && !statusChart) {
			renderStatusChart();
		}
	});

	function renderRevenueChart() {
		// Group bookings by month for earnings
		const monthlyEarnings: Record<string, number> = {};
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		// Initialize current year months
		const currentYear = new Date().getFullYear();
		months.forEach((m) => (monthlyEarnings[`${m} ${currentYear}`] = 0));

		ownerBookings.forEach((b: any) => {
			if (['CONFIRMED', 'COMPLETED', 'PAID'].includes(b.status)) {
				const date = new Date(b.startDate);
				const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
				if (monthlyEarnings[monthYear] !== undefined) {
					monthlyEarnings[monthYear] += Number(b.totalPrice);
				}
			}
		});

		const labels = Object.keys(monthlyEarnings);
		const data = Object.values(monthlyEarnings);

		const ctx = revenueChartCanvas.getContext('2d');
		if (ctx) {
			revenueChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'Earnings (Rs)',
							data,
							borderColor: '#0d9488', // teal-600
							backgroundColor: 'rgba(13, 148, 136, 0.1)',
							tension: 0.4,
							fill: true
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								display: false
							}
						},
						x: {
							grid: {
								display: false
							}
						}
					}
				}
			});
		}
	}

	function renderStatusChart() {
		const statusCounts: Record<string, number> = {
			CONFIRMED: 0,
			PENDING: 0,
			CANCELLED: 0,
			COMPLETED: 0
		};

		ownerBookings.forEach((b: any) => {
			const status = b.status || 'PENDING';
			if (statusCounts[status] !== undefined) {
				statusCounts[status]++;
			} else {
				// Group unknowns into PENDING for simplification or ignore
			}
		});

		// Manual mapping for clean chart
		// Map actual status to chart categories
		let confirmed = 0;
		let pending = 0;
		let cancelled = 0;
		let completed = 0;

		ownerBookings.forEach((b: any) => {
			const s = b.status;
			if (s === 'CONFIRMED') confirmed++;
			else if (s === 'PENDING') pending++;
			else if (s === 'CANCELLED') cancelled++;
			else if (s === 'COMPLETED') completed++;
		});

		const ctx = statusChartCanvas.getContext('2d');
		if (ctx) {
			statusChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
					datasets: [
						{
							data: [confirmed, pending, cancelled, completed],
							backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
							borderWidth: 0
						}
					]
				},
				options: {
					responsive: true,
					cutout: '70%',
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								usePointStyle: true,
								padding: 20
							}
						}
					}
				}
			});
		}
	}
</script>

<div class="space-y-8">
	<h2 class="text-2xl font-black text-teal-50">Performance Dashboard</h2>

	<!-- KPI Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
			<p class="text-3xl font-black text-emerald-600">Rs {kpis.totalEarnings.toFixed(0)}</p>
		</div>
		<div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Rentals</p>
			<p class="text-3xl font-black text-indigo-600">{kpis.totalRentals}</p>
		</div>
		<div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
				Active Listings
			</p>
			<p class="text-3xl font-black text-teal-600">{kpis.activeCount}</p>
		</div>
		<div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg Rating</p>
			<p class="text-3xl font-black text-orange-400">{kpis.avgRating.toFixed(1)} ★</p>
		</div>
	</div>

	<!-- Charts Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Revenue Chart -->
		<div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<h3 class="text-lg font-black text-slate-900 mb-6">Earnings Overview</h3>
			<div class="h-64 relative w-full">
				<canvas bind:this={revenueChartCanvas}></canvas>
			</div>
		</div>

		<!-- Status Chart -->
		<div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-teal-900/5">
			<h3 class="text-lg font-black text-slate-900 mb-6">Booking Statuses</h3>
			<div class="h-64 relative flex items-center justify-center">
				<canvas bind:this={statusChartCanvas}></canvas>
			</div>
		</div>
	</div>

	<!-- Top Listings -->
	<div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-teal-900/5">
		<h3 class="text-lg font-black text-slate-900 mb-6">Top Performing Items</h3>
		<div class="space-y-4">
			{#each userListings
				.sort((a: any, b: any) => Number(b.totalEarnings) - Number(a.totalEarnings))
				.slice(0, 5) as listing, i}
				<div class="flex items-center gap-4 border-b border-slate-50 last:border-0 pb-4 last:pb-0">
					<span class="text-lg font-black text-slate-300 w-6">#{i + 1}</span>
					<div class="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
						{#if listing.images && listing.images.length > 0}
							<img src={listing.images[0]} alt="" class="w-full h-full object-cover" />
						{/if}
					</div>
					<div class="flex-grow">
						<h4 class="font-bold text-slate-900 text-sm">{listing.title}</h4>
						<p class="text-xs text-slate-500">{listing.count || 0} rentals</p>
					</div>
					<div class="text-right">
						<p class="font-black text-emerald-600 text-sm">Rs {listing.totalEarnings || 0}</p>
					</div>
				</div>
			{/each}
			{#if userListings.length === 0}
				<p class="text-slate-400 italic text-sm">No listings yet.</p>
			{/if}
		</div>
	</div>
</div>
