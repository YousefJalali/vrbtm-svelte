<script>
	import Logo from '$lib/ui/Logo.svelte'
</script>

<div class="flex flex-col h-dvh max-h-screen">
	<header class="max-w-none border-b flex items-center justify-center p-4">
		<a href="/" class="h-[36px] lg:h-[48px]">
			<Logo />
		</a>
	</header>

	<div class="flex-1 flex justify-center items-center">
		<div class="sm:rounded-xl sm:border-2 w-full md:w-1/2 sm:max-w-xl sm:p-6 mx-6">
			<slot />
		</div>
	</div>
</div>
