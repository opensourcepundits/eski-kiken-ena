<script lang="ts">
	let {
		isOpen = false,
		type = 'success',
		title = '',
		message = '',
		buttonText = 'Okay',
		onClose = () => {}
	} = $props<{
		isOpen: boolean;
		type?: 'success' | 'error' | 'info';
		title: string;
		message: string;
		buttonText?: string;
		onClose: () => void;
	}>();
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
	>
		<div
			class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full p-10 space-y-8 animate-in zoom-in-95 duration-300"
		>
			<div class="text-center">
				<div
					class="w-20 h-20 {type === 'success'
						? 'bg-emerald-50 text-emerald-600'
						: 'bg-red-50 text-red-600'} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"
				>
					{#if type === 'success'}
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
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
								points="22 4 12 14.01 9 11.01"
							/></svg
						>
					{:else}
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
					{/if}
				</div>
				<h2 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">
					{title}
				</h2>
				<p class="text-slate-500 font-medium leading-relaxed">
					{message}
				</p>
			</div>

			<button
				onclick={onClose}
				class="w-full py-4 text-white rounded-md font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] {type ===
				'success'
					? 'bg-teal-600 hover:bg-teal-700'
					: 'bg-red-600 hover:bg-red-700'}"
			>
				{buttonText}
			</button>
		</div>
	</div>
{/if}
