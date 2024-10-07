<script lang="ts">
	import { enhance } from '$app/forms'

	export let form

	let submitting: boolean
</script>

<div class="prose">
	<h1>Sign up</h1>

	<form
		method="post"
		use:enhance={() => {
			submitting = true

			return async ({ update }) => {
				await update()
				submitting = false
			}
		}}
	>
		<fieldset disabled={submitting} class="[&>label]:mb-6">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Name</span>
				</div>
				<input
					name="name"
					type="text"
					placeholder="Enter Your Name"
					class="input input-bordered w-full"
				/>
				{#if form?.errors?.name}
					<div class="label">
						<span class="label-text-alt text-error">{form?.errors?.name.error}</span>
					</div>
				{/if}
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Email</span>
				</div>
				<input
					name="email"
					type="text"
					placeholder="Enter Your Email"
					class="input input-bordered w-full"
				/>
				{#if form?.errors?.email}
					<div class="label">
						<span class="label-text-alt text-error">{form?.errors?.email.error}</span>
					</div>
				{/if}
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Password</span>
				</div>
				<input
					name="password"
					type="password"
					placeholder="Enter Your Password"
					class="input input-bordered w-full"
				/>
				{#if form?.errors?.password}
					<div class="label">
						<span class="label-text-alt text-error">{form?.errors?.password.error}</span>
					</div>
				{/if}
			</label>
			<button class="btn w-full btn-primary">
				{#if submitting}
					<span class="loading loading-spinner"></span> Signing...
				{:else}
					Sign Up
				{/if}
			</button>
		</fieldset>
	</form>
	{#if !submitting}
		<p>
			You already have an account? <a href="login" class="text-primary">Login</a>
		</p>
	{/if}
</div>
