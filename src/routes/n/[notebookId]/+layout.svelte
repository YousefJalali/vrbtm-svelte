<script lang="ts">
	import { page } from '$app/stores'
	import { getErrorMessage } from '$lib/utils'
	import { notebooks, alerts } from '$lib/stores'
	import TextInput from './TextInput.svelte'
	import TextList from './TextList.svelte'
	import { Svg } from '$lib/ui'

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

<div class="relative flex flex-col lg:basis-0 lg:grow-[5] lg:pt-8">
	{#if activeNotebookId}
		<!-- Notebook Title -->
		<div
			class="hidden lg:flex justify-between absolute top-0 inset-x-0 p-4 pb-8 rounded-box z-10 prose max-w-none bg-gradient-to-b from-60% from-base-100 to-transparent"
		>
			<h2 class="line-clamp-1 h-fit">{$notebooks[activeNotebookId].title}</h2>

			{#if !isFlashcardsVisible}
				<a href={`${$page.url.pathname}/f`} class="btn btn-ghost btn-circle btn-sm">
					<Svg icon="window" />
				</a>
			{/if}
		</div>

		<TextList {activeNotebookId} {omitting} />

		<TextInput on:omit={omitHandler} bind:this={input} />
	{/if}
</div>

<slot />
