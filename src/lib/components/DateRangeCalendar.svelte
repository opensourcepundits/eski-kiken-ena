<script lang="ts">
	export let blockedRanges: Array<{ start: string; end: string }> = [];
	export let startDate: string = '';
	export let endDate: string = '';
	export let hasConflict: boolean = false;

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	// --- Helpers ---

	function getLocalISO(d: Date) {
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// --- State ---

	// Track which month we are viewing
	let viewDate = new Date();
	viewDate.setDate(1); 

	const todayIso = getLocalISO(new Date());

	type Day = { 
		date: Date; 
		iso: string; 
		isBlocked: boolean; 
		isCurrentMonth: boolean; 
	};
	let days: Day[] = [];

	// --- Reactivity ---

	// 1. Re-build grid when month changes or blocked dates load
	$: viewDate, blockedRanges, generateGrid();

	// 2. Check conflicts when selection changes
	$: checkForConflicts(startDate, endDate);

	function generateGrid() {
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();
		const firstDayOfMonth = new Date(year, month, 1);
		const startDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, etc.

		// Backtrack to start of the grid (Sunday)
		const cursor = new Date(firstDayOfMonth);
		cursor.setDate(cursor.getDate() - startDayOfWeek);

		const arr: Day[] = [];
		// 6 rows * 7 days = 42 cells fixed
		for (let i = 0; i < 42; i++) {
			const iso = getLocalISO(cursor);
			const isBlocked = blockedRanges.some((r) => iso >= r.start && iso <= r.end);
			
			arr.push({
				date: new Date(cursor),
				iso,
				isBlocked,
				isCurrentMonth: cursor.getMonth() === month
			});
			cursor.setDate(cursor.getDate() + 1);
		}
		days = arr;
	}

	function changeMonth(offset: number) {
		const newDate = new Date(viewDate);
		newDate.setMonth(newDate.getMonth() + offset);
		viewDate = newDate;
	}

	function onDayClick(day: Day) {
		if (day.isBlocked) return;

		// Jump to month if clicking a ghost day
		if (!day.isCurrentMonth) {
			viewDate = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
		}

		if (!startDate || (startDate && endDate)) {
			// Start new selection
			startDate = day.iso;
			endDate = '';
		} else {
			// Complete selection
			if (day.iso < startDate) {
				startDate = day.iso;
				endDate = '';
			} else {
				endDate = day.iso;
			}
		}
	}

	function checkForConflicts(s: string, e: string) {
		if (s && e) {
			hasConflict = blockedRanges.some(r => s <= r.end && e >= r.start);
		} else {
			hasConflict = false;
		}
	}
</script>

<div class="calendar-container">
	<!-- Header -->
	<div class="header">
		<button type="button" class="nav-btn" on:click={() => changeMonth(-1)}>&lt;</button>
		<span class="month-label">
			{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
		</span>
		<button type="button" class="nav-btn" on:click={() => changeMonth(1)}>&gt;</button>
	</div>

	<!-- Weekdays -->
	<div class="grid days-header">
		{#each weekDays as day}
			<span class="day-name">{day}</span>
		{/each}
	</div>

	<!-- Days Grid -->
	<div class="grid body">
		{#each days as d}
			<!-- 
				LOGIC NOTE: 
				We check conditions inline here to ensure Svelte updates the classes
				immediately when startDate/endDate change.
			-->
			<button
				type="button"
				on:click={() => onDayClick(d)}
				disabled={d.isBlocked}
				class="day-tile"
				class:ghost={!d.isCurrentMonth}
				class:today={d.iso === todayIso}
				class:blocked={d.isBlocked}
				class:selected-start={d.iso === startDate}
				class:selected-end={d.iso === endDate}
				class:in-range={startDate && endDate && d.iso > startDate && d.iso < endDate}
			>
				{d.date.getDate()}
			</button>
		{/each}
	</div>

	{#if hasConflict}
		<div class="error-msg">
			Selected range overlaps with unavailable dates.
		</div>
	{/if}
</div>

<style>
	.calendar-container {
		width: 100%;
		max-width: 350px;
		user-select: none;
		font-family: sans-serif;
	}

	/* --- Header Layout --- */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
	}
	.month-label { font-weight: bold; font-size: 1rem; }
	.nav-btn {
		background: transparent;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		padding: 4px 12px;
		cursor: pointer;
	}
	.nav-btn:hover { background: #f3f4f6; }

	/* --- Grid Layout --- */
	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px; /* Small gap for range continuity */
	}
	.day-name {
		text-align: center;
		font-size: 0.75rem;
		color: #6b7280;
		padding-bottom: 6px;
	}

	/* --- Tile Styling --- */
	.day-tile {
		height: 40px;
		background: #fff;
		border: 1px solid transparent; /* invisible border to prevent layout shift */
		border-radius: 4px;
		color: #111827;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.day-tile:hover:not(:disabled) {
		background-color: #f3f4f6;
		z-index: 10;
	}

	/* 1. Ghost (Prev/Next Month) */
	.day-tile.ghost {
		color: #d1d5db;
	}

	/* 2. Today (Orange Outline) */
	.day-tile.today {
		font-weight: bold;
		color: #e77023;
		border: 1px solid #e77023;
	}

	/* 3. Blocked (Grayed out) */
	.day-tile.blocked {
		background: #f3f4f6;
		color: #9ca3af;
		text-decoration: line-through;
		cursor: not-allowed;
		border-color: transparent;
	}

	/* 4. SELECTION STATES (Must be last to override others) */
	
	/* The range in between start and end */
	.day-tile.in-range {
		background: #e0f2fe; /* Light Blue */
		color: #0284c7;
		border-radius: 0; /* Square corners for flow */
	}

	/* The exact Start and End dates */
	.day-tile.selected-start,
	.day-tile.selected-end {
		background: #0ea5e9 !important; /* Vivid Blue */
		color: #ffffff !important;
		opacity: 1;
		border-color: #0ea5e9;
	}

	/* Round the corners of the range ends */
	.day-tile.selected-start {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	/* If only one day is selected, keep it rounded */
	.day-tile.selected-start:not(.selected-end) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.day-tile.selected-end {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	
	/* Edge Case: Single Day Range (Start == End) */
	.day-tile.selected-start.selected-end {
		border-radius: 4px;
	}

	/* Error Box */
	.error-msg {
		margin-top: 12px;
		color: #b91c1c;
		background-color: #fef2f2;
		border: 1px solid #fecaca;
		padding: 8px;
		border-radius: 4px;
		font-size: 0.85rem;
		text-align: center;
	}
</style>