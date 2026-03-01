<script lang="ts">
	import { onMount } from 'svelte';
	import { Clock } from 'lucide-svelte';

	let { value = $bindable('09:00'), name = undefined, id = undefined, required = false } = $props();

	let isOpen = $state(false);
	let container: HTMLElement | null = $state(null);

	// Parse current value
	let hour = $derived(parseInt(value.split(':')[0]) || 9);
	let minute = $derived(parseInt(value.split(':')[1]) || 0);

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 5-minute intervals for aesthetics

	function selectHour(h: number) {
		const m = minute.toString().padStart(2, '0');
		value = `${h.toString().padStart(2, '0')}:${m}`;
	}

	function selectMinute(m: number) {
		const h = hour.toString().padStart(2, '0');
		value = `${h}:${m.toString().padStart(2, '0')}`;
	}

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (container && !container.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});

	let displayTime = $derived(() => {
		const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
		const ampm = hour >= 12 ? 'PM' : 'AM';
		return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
	});
</script>

<div class="relative w-full" bind:this={container}>
	<input type="hidden" {name} {id} {required} {value} />

	<button
		type="button"
		class="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-primary/30 transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 group"
		onclick={toggleOpen}
	>
		<div class="flex items-center gap-3">
			<Clock size={18} class="text-slate-400 group-hover:text-primary transition-colors" />
			<span>{displayTime()}</span>
		</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-slate-300 transition-transform duration-300 {isOpen
				? 'rotate-180 text-primary'
				: ''}"><path d="m6 9 6 6 6-6" /></svg
		>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
		>
			<div class="flex h-64">
				<!-- Hours Column -->
				<div class="flex-1 overflow-y-auto custom-scrollbar border-r border-slate-50">
					<div class="p-2 space-y-1">
						<div class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
							Hour
						</div>
						{#each hours as h}
							<button
								type="button"
								class="w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors
                                {hour === h
									? 'bg-primary text-white shadow-lg shadow-primary/20'
									: 'text-slate-600 hover:bg-slate-50'}"
								onclick={() => selectHour(h)}
							>
								{h.toString().padStart(2, '0')}
								<span class="text-[10px] opacity-60 ml-1">{h >= 12 ? 'PM' : 'AM'}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Minutes Column -->
				<div class="flex-1 overflow-y-auto custom-scrollbar">
					<div class="p-2 space-y-1">
						<div class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
							Min
						</div>
						{#each minutes as m}
							<button
								type="button"
								class="w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors
                                {minute === m
									? 'bg-primary text-white shadow-lg shadow-primary/20'
									: 'text-slate-600 hover:bg-slate-50'}"
								onclick={() => selectMinute(m)}
							>
								{m.toString().padStart(2, '0')}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
				<div class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Select time</div>
				<button
					type="button"
					class="px-4 py-1.5 bg-secondary text-background rounded-lg text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all"
					onclick={() => (isOpen = false)}
				>
					Done
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #cbd5e1;
	}
</style>
