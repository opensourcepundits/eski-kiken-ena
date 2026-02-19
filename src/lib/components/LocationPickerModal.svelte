<script lang="ts">
	import { onMount, createEventDispatcher, tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		isOpen: boolean;
		initialLat?: number;
		initialLng?: number;
	}

	let { isOpen, initialLat = -20.2, initialLng = 57.5 }: Props = $props();
	const dispatch = createEventDispatcher();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let map: any = $state(null);
	let marker: any = $state(null);
	let leafletLoaded = $state(false);
	let selectedLat = $state(initialLat);
	let selectedLng = $state(initialLng);
	let address = $state('');
	let initError = $state<string | null>(null);

	async function reverseGeocode(lat: number, lng: number) {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			address = data.display_name || 'Selected Location';
		} catch (e) {
			console.error('Geocoding failed', e);
			address = 'Custom Location';
		}
	}

	onMount(async () => {
		if (!isOpen || !mapContainer) return;
		await initMap();
	});

	async function initMap() {
		console.log('Initializing map...', { mapContainer, isOpen });
		if (!mapContainer) {
			console.warn('Map container not found, waiting for tick...');
			await tick();
			if (!mapContainer) {
				console.error('Map container STILL not found after tick.');
				initError = 'Could not find map container.';
				return;
			}
		}

		try {
			const L = await import('leaflet');
			console.log('Leaflet library imported');

			delete (L as any).Icon.Default.prototype._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
			});

			map = L.map(mapContainer).setView([selectedLat, selectedLng], 12);
			console.log('Map instance created');

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			marker = L.marker([selectedLat, selectedLng], { draggable: true }).addTo(map);

			marker.on('dragend', async (e: any) => {
				const pos = e.target.getLatLng();
				selectedLat = pos.lat;
				selectedLng = pos.lng;
				await reverseGeocode(selectedLat, selectedLng);
			});

			map.on('click', async (e: any) => {
				const { lat, lng } = e.latlng;
				selectedLat = lat;
				selectedLng = lng;
				marker.setLatLng([lat, lng]);
				await reverseGeocode(lat, lng);
			});

			await reverseGeocode(selectedLat, selectedLng);
			leafletLoaded = true;
			console.log('Map initialization complete');

			setTimeout(() => {
				if (map) {
					console.log('Invalidating size');
					map.invalidateSize();
				}
			}, 300);
		} catch (e: any) {
			console.error('Map initialization failed:', e);
			initError = e.message || 'Unknown error during map initialization';
		}
	}

	function confirmLocation() {
		dispatch('confirm', {
			lat: selectedLat,
			lng: selectedLng,
			address: address
		});
	}

	$effect(() => {
		if (isOpen) {
			if (!map) {
				initMap();
			}
		} else {
			// Cleanup map instance when modal closes
			if (map) {
				map.remove();
				map = null;
				marker = null;
				leafletLoaded = false;
			}
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin="anonymous"
	/>
</svelte:head>

{#if isOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
			onclick={() => dispatch('close')}
		></div>

		<div
			class="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="p-6 border-b border-slate-100 flex justify-between items-center">
				<div>
					<h2 class="text-2xl font-black text-slate-900">Pin your Delivery Spot</h2>
					<p class="text-sm text-slate-500 font-medium">Drag the marker or click on the map</p>
				</div>
				<button
					onclick={() => dispatch('close')}
					class="p-2 hover:bg-slate-100 rounded-full transition-colors"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-slate-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="flex-grow relative h-96">
				<div bind:this={mapContainer} class="w-full h-full"></div>
				{#if !leafletLoaded}
					<div class="absolute inset-0 flex items-center justify-center bg-slate-50">
						<div class="flex flex-col items-center gap-4 text-center px-6">
							{#if initError}
								<div class="p-3 bg-red-100 rounded-2xl mb-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
								<span class="text-red-600 font-bold uppercase tracking-widest text-xs"
									>Map Load Failed</span
								>
								<p class="text-[10px] text-slate-400 font-medium max-w-xs">{initError}</p>
							{:else}
								<div
									class="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"
								></div>
								<span class="text-slate-400 font-bold uppercase tracking-widest text-xs"
									>Loading Interactive Map...</span
								>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<div class="p-8 bg-slate-50 space-y-6">
				<div class="flex items-start gap-4">
					<div class="p-3 bg-teal-100 rounded-2xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-teal-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div class="flex-grow">
						<span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1"
							>Current Location</span
						>
						<p class="text-slate-900 font-bold leading-tight">
							{address || 'Fetching location...'}
						</p>
					</div>
				</div>

				<button
					onclick={confirmLocation}
					class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-[1.25rem] font-bold text-lg transition-all shadow-xl shadow-teal-100"
				>
					Confirm Delivery Location
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.leaflet-container) {
		z-index: 10;
		height: 100% !important;
	}
</style>
