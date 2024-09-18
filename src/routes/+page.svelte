<script lang="ts">
	import Flashcards from './Flashcards.svelte'
	import Notebooks from './Notebooks.svelte'
	import { page } from '$app/stores'
	import Editor from './Editor.svelte'
	import RandomOmit from './RandomOmit.svelte'
	import Tools from './Tools.svelte'

	let windowSize: number

	let activeNotebook: null | string = null

	// onMount(async () => {
	// 	let query = new URLSearchParams()

	// 	let notebookName = Object.keys($notebooks)[0]

	// 	query.set('notebook', notebookName)

	// 	goto(`?${query.toString()}`)

	// 	text = $notebooks[notebookName]
	// })

	$: if (activeNotebook !== $page.url.searchParams.get('notebook')) {
		console.log('navigate')
		activeNotebook = $page.url.searchParams.get('notebook')
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div class="flex-1 flex gap-0 lg:gap-4 p-6 pt-0 lg:p-8 lg:pt-0 justify-center h-0 lg:flex-row">
	<div class="hidden lg:flex flex-col lg:bg-base-200 lg:rounded-box lg:gap-4 lg:flex-[0_0_20%]">
		<Notebooks />
	</div>

	{#if activeNotebook}
		<div
			class="w-full flex flex-col-reverse lg:bg-base-200 lg:p-4 lg:rounded-box lg:gap-4 lg:flex-row lg:flex-[0_0_55%]"
		>
			<Editor {activeNotebook} />

			<!-- Side -->
			<div
				class="sticky top-0 py-4 lg:bg-base-200 rounded-box flex justify-between lg:flex-1 lg:flex-col-reverse lg:p-0"
			>
				<RandomOmit {activeNotebook} {windowSize} />

				<Tools {activeNotebook} />
			</div>
		</div>
	{/if}

	<!-- Flashcards -->
	<div class="flex flex-col bg-base-200 rounded-box lg:flex-[0_0_25%] w-fit">
		<Flashcards />
	</div>
</div>
