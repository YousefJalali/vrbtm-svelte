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

	$: isFlashcardsVisible = $page.url.pathname.split('/')[3] === 'f'

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

<div class="relative flex flex-col lg:basis-0 lg:grow-[5]">
	{#if activeNotebookId}
		<!-- Notebook Title -->
		<div
			class="hidden lg:flex justify-between absolute top-0 inset-x-0 p-4 rounded-box h-[64px] z-10 prose max-w-none bg-gradient-to-b from-85% from-base-100 to-transparent"
		>
			<h2 class="line-clamp-1 h-fit">{$notebooks[activeNotebookId].title}</h2>

			{#if !isFlashcardsVisible}
				<a href={`${$page.url.pathname}/f`}>
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
							d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
						/>
					</svg>
				</a>
			{/if}
		</div>

		<TextList {activeNotebookId} {omitting} />

		<TextInput on:omit={omitHandler} bind:this={input} />
	{/if}
</div>

<slot />
