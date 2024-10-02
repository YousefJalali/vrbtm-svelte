<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte'
	import { onMount } from 'svelte'
	import Notebooks from './Notebooks.svelte'
	import { notebooks } from '$lib/stores'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Header from '$lib/ui/Header.svelte'

	// $: isFlashcardsVisible = $page.url.pathname.split('/')[3] === 'f'

	// onMount(() => {
	// 	let firstNotebookId = Object.keys($notebooks)[0]

	// 	let currentPath: string | null = $page.params.notebookId

	// 	goto(`/n/${currentPath || firstNotebookId}${isFlashcardsVisible ? '/f' : ''}`)
	// })
</script>

<div class="flex flex-col h-dvh max-h-screen">
	<Header />

	<!-- max-w-[90rem] mx-auto -->
	<div class="relative flex flex-1 h-0 bg-base-200">
		<div class="md:flex flex-col md:max-w-72 md:gap-4 md:basis-0 lg:grow-[2] lg:ml-4">
			<Notebooks />
		</div>

		<div
			class="relative flex w-full bg-base-100 border lg:rounded-box lg:m-4 lg:basis-0 lg:grow-[6]"
		>
			<slot />
		</div>

		<Alert />
	</div>
</div>
