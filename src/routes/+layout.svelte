<script lang="ts">
	import '../app.css'

	export let data: {
		user: {
			id: string
			email: string
			name: string
			emailVerified: boolean
		} | null
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if data.user && !data.user.emailVerified}
	<div class="w-full h-fit bg-warning text-center text-sm py-2">
		Your email is not verified. <a class="link" href="/email-verification">Verify you email</a>
	</div>
{/if}

<slot />
