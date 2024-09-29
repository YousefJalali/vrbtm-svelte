<script lang="ts">
	import { page } from '$app/stores'
	import { getErrorMessage } from '$lib/utils'
	import { notebooks, alerts } from '$lib/stores'
	import TextInput from './TextInput.svelte'
	import TextList from './TextList.svelte'

	// let windowSize: number
	let activeNotebookId: null | string = null
	let omitting = false
	let input: TextInput

	$: if (activeNotebookId !== $page.params.notebookId) {
		activeNotebookId = $page.params.notebookId
	}

	async function omitHandler(e: CustomEvent) {
		let text = e.detail.text
		if (!activeNotebookId || !text.length) return

		let temp = text

		const textId = notebooks.addText({ id: activeNotebookId, text: temp })
		if (!textId) return

		omitting = true

		try {
			await notebooks.omit({ id: activeNotebookId, textIndex: 0 })
			omitting = false

			try {
				await notebooks.generateTitle({ id: activeNotebookId })
			} catch (error) {
				//do nothing
			}
		} catch (error) {
			omitting = false
			notebooks.removeText({ id: activeNotebookId, textId })
			input.setText(temp)

			alerts.add({
				type: 'error',
				message: getErrorMessage(error)
			})
		}

		omitting = false
	}
</script>

<!-- <svelte:window bind:innerWidth={windowSize} /> -->

<!-- <div class="md:flex flex-col md:max-w-72 md:gap-4 md:basis-0 md:grow-[3] lg:grow-[2.5] lg:ml-4">
	<Notebooks />
</div> -->

<!-- <div
	class="bg-base-100 lg:m-4 lg:mr-0 lg:rounded-s-box border-r lg:border lg:border-r-0 relative w-full flex flex-col lg:basis-0 lg:grow-[5.5]"
> -->
<div class="relative flex flex-col lg:basis-0 lg:grow-[5]">
	{#if activeNotebookId}
		<!-- Notebook Title -->
		<div
			class="hidden lg:flex justify-between absolute top-0 inset-x-0 p-4 rounded-box h-[64px] z-10 prose max-w-none bg-gradient-to-b from-85% from-base-100 to-transparent"
		>
			<h2>{$notebooks[activeNotebookId].title}</h2>
			<!-- <button class="btn btn-ghost btn-circle btn-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
						/>
					</svg></button
				> -->
		</div>

		<TextList {activeNotebookId} {omitting} />

		<TextInput on:omit={omitHandler} bind:this={input} />
	{/if}
</div>

<slot />
<!-- </div> -->

<!-- Flashcards -->
<!-- <div
	class="flex flex-col bg-base-100 md:max-w-96 lg:m-4 lg:ml-0 lg:border border-l-0 lg:rounded-e-box lg:basis-0 lg:grow-[3]"
>
	<Flashcards />
</div> -->
