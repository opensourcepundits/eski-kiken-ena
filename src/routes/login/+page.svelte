<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login | Eski Kiken Ena</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 font-sans">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
			<div class="text-center mb-10">
				<div
					class="w-20 h-20 bg-blue-50 rounded-md flex items-center justify-center text-ocean mx-auto mb-6 shadow-sm"
				>
					<!-- LogIn -->
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
						><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline
							points="10 17 15 12 10 7"
						/><line x1="15" x2="3" y1="12" y2="12" /></svg
					>
				</div>
				<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
				<p class="text-slate-500 text-lg">Sign in to your account</p>
			</div>

			<form method="POST" use:enhance class="space-y-6">
				{#if form?.message}
					<div
						class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium flex items-center animate-in fade-in slide-in-from-top-2"
					>
						{form.message}
					</div>
				{/if}

				<div class="space-y-2">
					<label for="email" class="text-sm font-bold text-slate-700 ml-1">Email Address</label>
					<div class="relative group">
						<div
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-ocean transition-colors"
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
							class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-ocean/10 focus:border-ocean transition-all font-medium text-slate-900"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="password" class="text-sm font-bold text-slate-700 ml-1">Password</label>
					<div class="relative group">
						<div
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-ocean transition-colors"
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
							placeholder="••••••••"
							class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-ocean/10 focus:border-ocean transition-all font-medium text-slate-900"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-ocean/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
				>
					Sign In
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
					Don't have an account?
					<a href="/register" class="text-ocean font-bold hover:underline">Sign up</a>
				</p>
			</div>
		</div>
	</div>
</div>
