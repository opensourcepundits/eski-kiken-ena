<script lang="ts">
	import { fade } from 'svelte/transition';

	let { userFullName, onComplete } = $props<{ userFullName: string; onComplete: () => void }>();

	let currentStep = $state(0);
	let signature = $state('');
	let loading = $state(false);
	let error = $state('');

	const steps = [
		{
			title: '1. The Nature of Our Service',
			content:
				'[Platform Name] (the "Company", "we", or "us") provides an online marketplace that connects Owners of personal property with Renters. You acknowledge and agree that [Platform Name] is acting solely as an intermediary and payment facilitator. We are not a party to any rental agreement between users. We do not own, sell, resell, provide, rent, re-rent, manage, or physically control any items listed on the platform.'
		},
		{
			title: '2. User Responsibilities & Assumption of Risk',
			content:
				'For Owners: You acknowledge that lending your property involves inherent risks, including theft, loss, or damage. You are strongly advised to verify that your personal insurance policies cover commercial or peer-to-peer rental activities.\n\nFor Renters: You acknowledge that the use of rented items, particularly power tools and machinery, involves inherent risks of physical injury, death, or property damage. You agree to carefully inspect all items upon receipt, use them entirely at your own risk, and warrant that you possess the necessary competence to operate the equipment safely.'
		},
		{
			title: '3. The Rental Contract Between Users & Renter Liability',
			content:
				'When a rental transaction is confirmed through the platform, a legally binding contract is automatically formed directly between the Owner and the Renter. By entering into this transaction, both parties agree to the following terms:\n\nOwner’s Obligation (Condition of Item): The Owner warrants that the item is well-maintained, in good and safe working order, and fit for its intended use at the time of handover.\n\nRenter’s Obligation (Care of Item): The Renter agrees to operate the item strictly in accordance with manufacturer instructions, treat the item with care, and return it to the Owner at the agreed-upon time in the exact same condition it was received, excluding normal wear and tear.\n\nRenter Liability for Damage: The Renter is strictly and fully liable for any damage, loss, or theft of the item that occurs during the rental period. If an item is returned damaged (beyond normal wear and tear) or is not returned at all, the Renter agrees to pay for the full cost of repair or the fair market replacement value of the item.'
		},
		{
			title: '4. Payments, Fees, and Enforcement of Liability',
			content:
				'Facilitation: All payments must be processed through [Platform Name]’s designated third-party payment processor. Attempting to bypass the platform for payment violates these Terms.\n\nSecurity Deposits & Damage Charges: Owners may require a security deposit. Furthermore, by accepting these terms, the Renter authorizes [Platform Name] to charge their payment method on file for repair or replacement costs in the event the Renter damages, loses, or fails to return an item, subject to our dispute resolution process.'
		},
		{
			title: '5. Dispute Resolution Between Users',
			content:
				'Marketplace trust is our priority. If a dispute arises regarding the condition of an item, damage, late returns, or theft:\n\nGood Faith Effort: The Owner and Renter must first attempt to resolve the issue directly in good faith.\n\nPlatform Mediation: If a resolution cannot be reached within [e.g., 48 hours], either party may escalate the issue to [Platform Name] by providing photographic evidence and statements.\n\nFinal Decision: We reserve the right, but not the obligation, to mediate the dispute, review evidence, and make a final determination regarding the release of funds, security deposits, or additional damage charges. However, we cannot guarantee the recovery of stolen or damaged property.'
		},
		{
			title: '6. Limitation of Liability & Disclaimer of Warranties',
			content:
				'"As-Is" Provision: All items on the platform are provided by Owners "as-is." To the maximum extent permitted by law, [Platform Name] expressly disclaims all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and safety of the listed items.\n\nLimitation of Liability: Except in cases of gross negligence or willful misconduct by the Company, [Platform Name], its officers, and employees shall NOT be liable for:\nAny direct, indirect, incidental, or consequential damages resulting from a rental transaction.\nPhysical injury, death, or property damage caused by a rented item.\nTheft, disappearance, or "no-show" of any item or user.\nFinancial losses due to technical malfunctions, system downtime, or payment processing delays.\n\nIn no event shall the Company\'s total liability to you exceed the total platform fees you have paid to us in the twelve (12) months prior to the event giving rise to the liability.'
		},
		{
			title: '7. Indemnification',
			content:
				'You agree to indemnify, defend, and hold harmless [Platform Name] and its affiliates from any claims, suits, demands, damages, or legal fees made by any third party due to or arising out of: (a) your breach of these Terms; (b) your violation of any law or the rights of a third party; or (c) any interaction, dispute, or injury resulting from your rental or listing of an item.'
		},
		{
			title: '8. Independent Contractors',
			content:
				'Nothing in these Terms creates a partnership, joint venture, agency, or employer-employee relationship between you and [Platform Name]. Owners and Renters act exclusively as independent contractors.'
		}
	];

	async function finish() {
		if (signature.trim().toLowerCase() !== userFullName.toLowerCase()) {
			error = `Please type your full name exactly as: ${userFullName}`;
			return;
		}
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/accept-tnc', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ signature })
			});
			if (res.ok) {
				onComplete();
			} else {
				error = 'Something went wrong. Please try again.';
			}
		} catch (e) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
>
	<div
		class="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
		transition:fade={{ duration: 200 }}
	>
		<div class="p-6 bg-slate-50 border-b border-slate-100">
			<h2 class="text-xl font-black text-secondary tracking-tight">Terms and Conditions</h2>
			<div class="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
				<div
					class="bg-primary h-full transition-all duration-300"
					style="width: {((currentStep + 1) / steps.length) * 100}%"
				></div>
			</div>
			<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
				Step {currentStep + 1} of {steps.length}
			</p>
		</div>

		<div class="p-6 flex-grow overflow-y-auto max-h-[50vh] text-secondary">
			{#key currentStep}
				<div in:fade={{ duration: 200, delay: 100 }}>
					<h3 class="text-lg font-bold mb-4">{steps[currentStep].title}</h3>
					<div class="space-y-4 text-sm leading-relaxed whitespace-pre-line text-slate-700">
						{steps[currentStep].content.replace(/\[Platform Name\]/g, 'Eski Kiken Ena')}
					</div>

					{#if currentStep === steps.length - 1}
						<div class="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
							<label for="signature" class="block text-sm font-bold mb-2">
								Type your full name to agree: <span class="text-primary">{userFullName}</span>
							</label>
							<input
								id="signature"
								type="text"
								bind:value={signature}
								placeholder="e.g. {userFullName}"
								class="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
								onkeydown={(e) => e.key === 'Enter' && finish()}
							/>
							{#if error}
								<p class="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
									<span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
									{error}
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/key}
		</div>

		<div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
			{#if currentStep < steps.length - 1}
				<button
					class="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
					onclick={() => currentStep++}
				>
					I understand
				</button>
			{:else}
				<button
					class="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
					onclick={finish}
					disabled={loading}
				>
					{#if loading}
						<div
							class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
						></div>
					{/if}
					Agree & Continue
				</button>
			{/if}
		</div>
	</div>
</div>
