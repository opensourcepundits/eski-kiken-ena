<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		lat?: number | null;
		lng?: number | null;
		onLocationSelect: (lat: number, lng: number, address?: string) => void;
	}

	let { lat, lng, onLocationSelect }: Props = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let map: any = $state(null);
	let marker: any = $state(null);
	let isOpen = $state(false);
	let selectedLat = $state<number | null>(null);
	let selectedLng = $state<number | null>(null);
	let leafletLoaded = $state(false);

	// Sync selected coordinates with props - properly reactive
	$effect(() => {
		selectedLat = lat ?? null;
		selectedLng = lng ?? null;
	});

	async function initializeMap() {
		if (!mapContainer) {
			// Wait for container to be available
			setTimeout(() => initializeMap(), 50);
			return;
		}

		if (map) {
			// Map already exists, just resize it
			setTimeout(() => {
				map.invalidateSize();
				if (selectedLat !== null && selectedLng !== null) {
					map.setView([selectedLat, selectedLng], 13);
				}
			}, 100);
			return;
		}

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
				iconRetinaUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
			});

			// Default to Mauritius center if no initial location
			const defaultLat = selectedLat ?? -20.3484;
			const defaultLng = selectedLng ?? 57.5522;

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
			if (selectedLat !== null && selectedLng !== null) {
				marker = L.marker([selectedLat, selectedLng], {
					draggable: true
				}).addTo(map);

				marker.on('dragend', async (e: any) => {
					const position = e.target.getLatLng();
					selectedLat = position.lat;
					selectedLng = position.lng;
					// Auto-update address on drag
					const address = await reverseGeocode(position.lat, position.lng);
					if (address) {
						onLocationSelect(position.lat, position.lng, address);
					}
				});
			}

			// Add click handler to place/update marker
			map.on('click', async (e: any) => {
				const { lat, lng } = e.latlng;
				selectedLat = lat;
				selectedLng = lng;

				if (marker) {
					marker.setLatLng([lat, lng]);
				} else {
					marker = L.marker([lat, lng], {
						draggable: true
					}).addTo(map);

					marker.on('dragend', async (e: any) => {
						const position = e.target.getLatLng();
						selectedLat = position.lat;
						selectedLng = position.lng;
						// Auto-update address on drag
						const address = await reverseGeocode(position.lat, position.lng);
						if (address) {
							onLocationSelect(position.lat, position.lng, address);
						}
					});
				}
			});

			leafletLoaded = true;

			// Invalidate size multiple times to ensure proper rendering
			setTimeout(() => {
				if (map) {
					map.invalidateSize();
				}
			}, 100);

			setTimeout(() => {
				if (map) {
					map.invalidateSize();
				}
			}, 300);

			setTimeout(() => {
				if (map) {
					map.invalidateSize();
				}
			}, 500);
		} catch (error) {
			console.error('Failed to load Leaflet:', error);
		}
	}

	function openMap() {
		isOpen = true;
		// Initialize map when modal opens - wait a bit for DOM to update
		setTimeout(() => {
			initializeMap();
		}, 100);
	}

	function closeMap() {
		isOpen = false;
	}

	function handleOverlayClick(e: MouseEvent | KeyboardEvent) {
		if (e.target === e.currentTarget) {
			closeMap();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeMap();
		} else if (e.key === 'Enter' || e.key === ' ') {
			// Allow closing via Enter/Space on the overlay
			if (e.target === e.currentTarget) {
				closeMap();
			}
		}
	}

	async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
				{
					headers: {
						'User-Agent': 'EKE Rental Platform'
					}
				}
			);
			const data = await response.json();
			if (data.address) {
				const parts = [];
				if (data.address.road) parts.push(data.address.road);
				if (data.address.house_number) parts.push(data.address.house_number);
				if (data.address.suburb || data.address.neighbourhood) {
					parts.push(data.address.suburb || data.address.neighbourhood);
				}
				if (data.address.city || data.address.town || data.address.village) {
					parts.push(data.address.city || data.address.town || data.address.village);
				}
				return parts.length > 0 ? parts.join(', ') : data.display_name || null;
			}
			return data.display_name || null;
		} catch (error) {
			console.error('Reverse geocoding failed:', error);
			return null;
		}
	}

	async function handleLocationSelect(lat: number, lng: number) {
		const address = await reverseGeocode(lat, lng);
		onLocationSelect(lat, lng, address || undefined);
	}

	function confirmLocation() {
		if (selectedLat !== null && selectedLng !== null) {
			handleLocationSelect(selectedLat, selectedLng);
			closeMap();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

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
		onclick={handleOverlayClick}
		onkeydown={handleKeyDown}
		role="button"
		tabindex="0"
		aria-label="Close map dialog by clicking outside"
	>
		<!-- Modal Content -->
		<div
			class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="map-dialog-title"
			tabindex="-1"
		>
			<!-- Header -->
			<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
				<h2 id="map-dialog-title" class="text-xl font-bold text-slate-900">
					Select Location on Map
				</h2>
				<button
					type="button"
					onclick={closeMap}
					class="text-slate-400 hover:text-slate-600 transition-colors"
					aria-label="Close map dialog"
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
			<div class="flex-1 min-h-[400px] relative overflow-hidden">
				<div bind:this={mapContainer} class="w-full h-full absolute inset-0"></div>
				{#if !leafletLoaded}
					<div class="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
						<div class="text-slate-500">Loading map...</div>
					</div>
				{/if}
			</div>

			<!-- Footer with coordinates and actions -->
			<div class="px-6 py-4 border-t border-slate-200 bg-slate-50">
				<div class="flex items-center justify-between gap-4">
					<div class="flex-1 grid grid-cols-2 gap-4">
						<div>
							<div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
								Latitude
							</div>
							<div class="text-sm font-mono text-slate-700" id="lat-display">
								{selectedLat !== null ? selectedLat.toFixed(6) : 'Not selected'}
							</div>
						</div>
						<div>
							<div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
								Longitude
							</div>
							<div class="text-sm font-mono text-slate-700" id="lng-display">
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
