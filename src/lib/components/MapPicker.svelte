<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		lat?: number | null;
		lng?: number | null;
		onLocationSelect: (lat: number, lng: number) => void;
	}

	let { lat: initialLat, lng: initialLng, onLocationSelect }: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: any;
	let marker: any;
	let isOpen = $state(false);
	let selectedLat = $state<number | null>(initialLat || null);
	let selectedLng = $state<number | null>(initialLng || null);

	onMount(async () => {
		// Dynamically import Leaflet
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		// Fix for default marker icon issue
		delete (L as any).Icon.Default.prototype._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
		});

		// Default to Mauritius center if no initial location
		const defaultLat = initialLat || -20.3484;
		const defaultLng = initialLng || 57.5522;

		// Initialize map
		map = L.map(mapContainer, {
			center: [defaultLat, defaultLng],
			zoom: 13
		});

		// Add tile layer (OpenStreetMap)
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		// Add initial marker if location exists
		if (initialLat && initialLng) {
			marker = L.marker([initialLat, initialLng], {
				draggable: true
			}).addTo(map);

			marker.on('dragend', (e: any) => {
				const position = e.target.getLatLng();
				selectedLat = position.lat;
				selectedLng = position.lng;
			});
		}

		// Add click handler to place/update marker
		map.on('click', (e: any) => {
			const { lat, lng } = e.latlng;
			selectedLat = lat;
			selectedLng = lng;

			if (marker) {
				marker.setLatLng([lat, lng]);
			} else {
				marker = L.marker([lat, lng], {
					draggable: true
				}).addTo(map);

				marker.on('dragend', (e: any) => {
					const position = e.target.getLatLng();
					selectedLat = position.lat;
					selectedLng = position.lng;
				});
			}
		});
	});

	function openMap() {
		isOpen = true;
		// Resize map when modal opens
		setTimeout(() => {
			if (map) {
				map.invalidateSize();
				// Re-center on selected location if available
				if (selectedLat !== null && selectedLng !== null) {
					map.setView([selectedLat, selectedLng], 13);
				}
			}
		}, 100);
	}

	function closeMap() {
		isOpen = false;
	}

	function confirmLocation() {
		if (selectedLat !== null && selectedLng !== null) {
			onLocationSelect(selectedLat, selectedLng);
			closeMap();
		}
	}
</script>

<button
	type="button"
	onclick={openMap}
	class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
>
	🗺️ Select on Map
</button>

{#if isOpen}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeMap();
		}}
		role="dialog"
		aria-modal="true"
	>
		<!-- Modal Content -->
		<div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
			<!-- Header -->
			<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-900">Select Location on Map</h2>
				<button
					type="button"
					onclick={closeMap}
					class="text-slate-400 hover:text-slate-600 transition-colors"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			<!-- Map Container -->
			<div class="flex-1 min-h-[400px] relative">
				<div bind:this={mapContainer} class="w-full h-full rounded-b-2xl"></div>
			</div>

			<!-- Footer with coordinates and actions -->
			<div class="px-6 py-4 border-t border-slate-200 bg-slate-50">
				<div class="flex items-center justify-between gap-4">
					<div class="flex-1 grid grid-cols-2 gap-4">
						<div>
							<label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block"
								>Latitude</label
							>
							<div class="text-sm font-mono text-slate-700">
								{selectedLat !== null ? selectedLat.toFixed(6) : 'Not selected'}
							</div>
						</div>
						<div>
							<label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block"
								>Longitude</label
							>
							<div class="text-sm font-mono text-slate-700">
								{selectedLng !== null ? selectedLng.toFixed(6) : 'Not selected'}
							</div>
						</div>
					</div>
					<div class="flex gap-3">
						<button
							type="button"
							onclick={closeMap}
							class="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onclick={confirmLocation}
							disabled={selectedLat === null || selectedLng === null}
							class="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Confirm Location
						</button>
					</div>
				</div>
				<p class="text-xs text-slate-500 mt-2">
					Click on the map to place a pin, or drag the pin to adjust the location
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.leaflet-container) {
		z-index: 0;
	}
</style>
