<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		lat: number;
		lng: number;
		title?: string;
	}

	let { lat, lng, title }: Props = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let map: any = $state(null);
	let marker: any = $state(null);
	let leafletLoaded = $state(false);

	onMount(async () => {
		if (!mapContainer) return;

		try {
			// Dynamically import Leaflet
			const L = await import('leaflet');

			// Import CSS dynamically
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
			document.head.appendChild(link);

			// Fix for default marker icon issue
			delete (L as any).Icon.Default.prototype._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
			});

			// Initialize map
			map = L.map(mapContainer, {
				center: [lat, lng],
				zoom: 13
			});

			// Add tile layer (OpenStreetMap)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 19
			}).addTo(map);

			// Add marker
			marker = L.marker([lat, lng]).addTo(map);

			// Add popup if title provided
			if (title) {
				marker.bindPopup(title).openPopup();
			}

			leafletLoaded = true;

			// Invalidate size to ensure proper rendering
			setTimeout(() => {
				if (map) {
					map.invalidateSize();
				}
			}, 100);
		} catch (error) {
			console.error('Failed to load Leaflet:', error);
		}
	});
</script>

<div class="w-full h-full relative rounded-3xl overflow-hidden">
	<div bind:this={mapContainer} class="w-full h-full absolute inset-0"></div>
	{#if !leafletLoaded}
		<div class="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
			<div class="text-slate-500">Loading map...</div>
		</div>
	{/if}
</div>

<style>
	:global(.leaflet-container) {
		z-index: 0;
		height: 100% !important;
		width: 100% !important;
	}

	:global(.leaflet-tile-pane) {
		z-index: 2;
	}

	:global(.leaflet-overlay-pane) {
		z-index: 4;
	}

	:global(.leaflet-marker-pane) {
		z-index: 6;
	}
</style>
