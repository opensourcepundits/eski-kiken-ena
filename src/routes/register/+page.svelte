<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Register | Eski Kiken Ena</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 font-sans">
	<div class="w-full max-w-lg">
		<div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
			<div class="text-center mb-10">
				<div
					class="w-20 h-20 bg-orange-50 rounded-md flex items-center justify-center text-sunset mx-auto mb-6 shadow-sm"
				>
					<!-- UserPlus -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle
							cx="9"
							cy="7"
							r="4"
						/><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg
					>
				</div>
				<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create Account</h1>
				<p class="text-slate-500 text-lg">Join the Mauritian rental community</p>
			</div>

			<form method="POST" use:enhance class="space-y-5">
				{#if form?.message}
					<div
						class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium flex items-center animate-in fade-in slide-in-from-top-2"
					>
						{form.message}
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="firstName" class="text-sm font-bold text-slate-700 ml-1">First Name</label>
						<div class="relative group">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sunset transition-colors"
							>
								<!-- User -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
										cx="12"
										cy="7"
										r="4"
									/></svg
								>
							</div>
							<input
								type="text"
								id="firstName"
								name="firstName"
								required
								placeholder="Jean"
								class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sunset/10 focus:border-sunset transition-all font-medium text-slate-900 text-sm"
							/>
						</div>
					</div>
					<div class="space-y-2">
						<label for="lastName" class="text-sm font-bold text-slate-700 ml-1">Last Name</label>
						<div class="relative group">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sunset transition-colors"
							>
								<!-- User -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
										cx="12"
										cy="7"
										r="4"
									/></svg
								>
							</div>
							<input
								type="text"
								id="lastName"
								name="lastName"
								required
								placeholder="Dupont"
								class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sunset/10 focus:border-sunset transition-all font-medium text-slate-900 text-sm"
							/>
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<label for="email" class="text-sm font-bold text-slate-700 ml-1">Email Address</label>
					<div class="relative group">
						<div
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sunset transition-colors"
						>
							<!-- Mail -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="20" height="16" x="2" y="4" rx="2" /><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								/></svg
							>
						</div>
						<input
							type="email"
							id="email"
							name="email"
							required
							placeholder="you@example.com"
							class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sunset/10 focus:border-sunset transition-all font-medium text-slate-900"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="phone" class="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
					<div class="relative group">
						<div
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sunset transition-colors"
						>
							<!-- Phone -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/></svg
							>
						</div>
						<input
							type="tel"
							id="phone"
							name="phone"
							placeholder="5 123 4567"
							class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sunset/10 focus:border-sunset transition-all font-medium text-slate-900"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="password" class="text-sm font-bold text-slate-700 ml-1">Password</label>
					<div class="relative group">
						<div
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sunset transition-colors"
						>
							<!-- Lock -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
									d="M7 11V7a5 5 0 0 1 10 0v4"
								/></svg
							>
						</div>
						<input
							type="password"
							id="password"
							name="password"
							required
							placeholder="At least 6 characters"
							class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sunset/10 focus:border-sunset transition-all font-medium text-slate-900"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-sunset text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-sunset/20 flex items-center justify-center gap-2 group mt-4 hover:scale-[1.02] active:scale-[0.98]"
				>
					Create Account
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="group-hover:translate-x-1 transition-transform"
					>
						<path d="M5 12h14" />
						<path d="m12 5 7 7-7 7" />
					</svg>
				</button>
			</form>

			<div class="mt-8 pt-8 border-t border-slate-100 text-center">
				<p class="text-slate-600 font-medium">
					Already have an account?
					<a href="/login" class="text-ocean font-bold hover:underline">Sign in</a>
				</p>
			</div>
		</div>
	</div>
</div>
