<script lang="ts">
	import { enhance } from '$app/forms'
	export let form

	$: error = form
</script>

<div class="prose">
	<h1>Login</h1>

	{#if form?.message}
		<p class="text-error">{form?.message}</p>
	{/if}

	<form method="POST" action="?/login" class="[&>label]:mb-6" use:enhance>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input
				name="email"
				type="text"
				value={form?.errors?.email?.value ?? ''}
				placeholder="Enter Your Email"
				class="input input-bordered w-full"
				on:keydown={() => {
					console.log('error', error)
					error = null
				}}
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
				<span class="label-text-alt"><a href="/reset-password">Forgot your password?</a></span>
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

		<button class="btn btn-primary w-full">Login</button>
	</form>

	<p>
		You don't have an account? <a href="signup" class="text-primary">Sign Up</a>
	</p>
</div>
