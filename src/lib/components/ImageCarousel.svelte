<script lang="ts">
	type Props = {
		images: string[];
		alt: string;
		/** Container classes (e.g. aspect ratio, rounding) */
		containerClass?: string;
		/** Image classes (defaults to cover full container) */
		imageClass?: string;
		/** Show dot indicators */
		showDots?: boolean;
		/** Show previous/next arrows */
		showArrows?: boolean;
		/** Only show controls on hover (requires parent `group`) */
		controlsOnHover?: boolean;
	};

	let {
		images,
		alt,
		containerClass = '',
		imageClass = 'w-full h-full object-cover',
		showDots = true,
		showArrows = true,
		controlsOnHover = false
	}: Props = $props();

	let index = $state(0);

	// Reset index if images change
	$effect(() => {
		if (!images || images.length === 0) index = 0;
		else if (index >= images.length) index = 0;
	});

	const hasMany = $derived(images?.length > 1);
	const currentSrc = $derived((images && images.length > 0 ? images[index] : '') as string);

	function prev() {
		if (!images?.length) return;
		index = (index - 1 + images.length) % images.length;
	}
	function next() {
		if (!images?.length) return;
		index = (index + 1) % images.length;
	}
</script>

<div
	class={`relative overflow-hidden ${containerClass}`}
	role={hasMany ? 'group' : undefined}
	aria-roledescription={hasMany ? 'carousel' : undefined}
>
	{#if images?.length > 0}
		<img src={currentSrc} alt={alt} class={imageClass} />

		{#if hasMany && showArrows}
			<button
				type="button"
				aria-label="Previous image"
				onclick={prev}
				class={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 text-white w-10 h-10 grid place-items-center backdrop-blur transition-opacity ${
					controlsOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
				}`}
			>
				<span class="text-xl leading-none select-none">‹</span>
			</button>
			<button
				type="button"
				aria-label="Next image"
				onclick={next}
				class={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 text-white w-10 h-10 grid place-items-center backdrop-blur transition-opacity ${
					controlsOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
				}`}
			>
				<span class="text-xl leading-none select-none">›</span>
			</button>
		{/if}

		{#if hasMany && showDots}
			<div
				class={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur transition-opacity ${
					controlsOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
				}`}
				aria-label="Image navigation"
			>
				{#each images as _img, i}
					<button
						type="button"
						aria-label={`Go to image ${i + 1}`}
						aria-current={i === index ? 'true' : 'false'}
						onclick={() => (index = i)}
						class={`h-2.5 w-2.5 rounded-full transition-all ${
							i === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
						}`}
					/>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="w-full h-full bg-surface flex items-center justify-center text-secondary"></div>
	{/if}
</div>
