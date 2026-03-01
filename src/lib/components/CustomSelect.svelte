<script lang="ts">
	import { onMount } from 'svelte';

	let {
		value = $bindable(''),
		options = [],
		placeholder = 'Select option',
		name,
		id,
		required = false
	} = $props();

	let isOpen = $state(false);
	let container: HTMLElement | null = $state(null);

	const selectedLabel = $derived(() => {
		const opt = options.find((o: any) => (typeof o === 'string' ? o === value : o.value === value));
		if (!opt) return placeholder;
		return typeof opt === 'string' ? opt.replace(/_/g, ' ') : opt.label;
	});

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function selectOption(opt: any) {
		value = typeof opt === 'string' ? opt : opt.value;
		isOpen = false;
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
</script>

<div class="relative w-full" bind:this={container}>
	<input type="hidden" {name} {id} {required} {value} />

	<button
		type="button"
		class="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-primary/30 transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 group overflow-hidden"
		onclick={toggleOpen}
	>
		<span class="truncate {value ? 'text-slate-900' : 'text-slate-400'}">{selectedLabel()}</span>
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
			class="text-slate-300 transition-transform duration-300 flex-shrink-0 {isOpen
				? 'rotate-180 text-primary'
				: ''}"><path d="m6 9 6 6 6-6" /></svg
		>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 py-2 max-h-60 overflow-y-auto custom-scrollbar"
		>
			{#each options as opt}
				<button
					type="button"
					class="w-full text-left px-5 py-2.5 text-sm font-bold transition-colors
                    {(typeof opt === 'string' ? opt === value : opt.value === value)
						? 'bg-slate-50 text-primary flex items-center justify-between'
						: 'text-slate-600 hover:bg-slate-50'}"
					onclick={() => selectOption(opt)}
				>
					<span>{typeof opt === 'string' ? opt.replace(/_/g, ' ') : opt.label}</span>
					{#if typeof opt === 'string' ? opt === value : opt.value === value}
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
							class="text-primary"><polyline points="20 6 9 17 4 12" /></svg
						>
					{/if}
				</button>
			{/each}
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
</style>
