<script lang="ts">
	import { enhance } from '$app/forms'
	import Timer from './Timer.svelte'

	export let data
	export let form

	let sendingCode: boolean

	let now = new Date().getTime()
	let { expiresAt } = data
	$: leftTime = expiresAt instanceof Date ? expiresAt.getTime() - now : 0
</script>

<div class="prose">
	<h1>Email Verification</h1>

	<form method="post" action="?/verify" use:enhance class="[&>label]:mb-6">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text"></span>
			</div>
			<input
				name="code"
				type="text"
				placeholder="Enter Verification Code"
				class="input input-bordered w-full"
			/>
			{#if form?.message}
				<div class="label">
					<span class="label-text-alt text-error">{form.message}</span>
				</div>
			{/if}
		</label>

		<button class="btn w-full btn-primary">Verify</button>
	</form>

	<div class="mt-4 flex flex-col items-center justify-center">
		{#if leftTime > 0 && expiresAt && !sendingCode}
			<div><span>Resend after <Timer {now} {expiresAt} /></span></div>
		{/if}
		<form
			method="post"
			action="?/sendCode"
			use:enhance={() => {
				sendingCode = true

				return async ({ update }) => {
					await update()
					// invalidateAll()
					sendingCode = false
				}
			}}
		>
			<button class="btn btn-ghost text-primary mt-2 btn-sm" disabled={sendingCode || leftTime > 0}>
				{#if sendingCode}
					<span class="loading loading-spinner"></span> Sending...
				{:else}
					Send Code
				{/if}
			</button>
		</form>
		{#if form?.success}
			<span class="text-success mt-6"> Email Sent. Check your inbox </span>
		{/if}
	</div>
</div>
