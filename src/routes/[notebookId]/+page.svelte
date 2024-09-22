<script lang="ts">
	import Flashcards from './Flashcards.svelte'
	import Notebooks from './Notebooks.svelte'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'
	import { marked } from 'marked'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import TextInput from './TextInput.svelte'

	let windowSize: number
	let activeNotebookId: null | string = null
	let omitting = false
	let reOmittingTextIndex: null | number = null
	let editTextIndex: null | number = null
	let activeTextId: null | string = null
	let editor: HTMLDivElement

	onMount(() => {
		let firstNotebookId = Object.keys($notebooks)[0]

		let currentPath: string | null = $page.params.notebookId

		goto(`/${currentPath || firstNotebookId}`)
	})

	$: if (activeNotebookId !== $page.params.notebookId) {
		activeNotebookId = $page.params.notebookId
	}

	async function omitHandler(e: CustomEvent) {
		let text = e.detail.text
		if (!activeNotebookId || !text.length) return

		let temp = text

		omitting = true

		notebooks.addText({ id: activeNotebookId, text: temp })
		const { success } = await notebooks.omit({ id: activeNotebookId, textIndex: 0 })

		omitting = false

		await notebooks.generateTitle({ id: activeNotebookId })

		// if (!success) {
		// 	text = temp
		// }
	}

	async function reOmitHandler(textIndex: number) {
		if (!activeNotebookId) return

		reOmittingTextIndex = textIndex

		await notebooks.omit({ id: activeNotebookId, textIndex })

		reOmittingTextIndex = null
	}

	async function editTextHandler(textIndex: number) {
		if (!editor || !activeNotebookId) return

		let newText = editor.innerText.trim()
		let oldText = $notebooks[activeNotebookId].text[textIndex].original

		if (newText === oldText.trim()) {
			editTextIndex = null
			return
		}

		notebooks.updateText({ id: activeNotebookId, newText, textIndex })

		editTextIndex = null

		await reOmitHandler(textIndex)
	}

	function pasteHandler(e: ClipboardEvent) {
		if (!window) return
		e.preventDefault()

		//@ts-ignore
		const text = (e.originalEvent || e).clipboardData.getData('text')
		const selection = window.getSelection()

		if (selection?.rangeCount) {
			selection.deleteFromDocument()
			selection.getRangeAt(0).insertNode(document.createTextNode(text))
		}
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div
	class="lg:mt-6 md:flex flex-col bg-base-200 md:border md:border-base-300 md:rounded-box md:gap-4 md:basis-0 md:grow-[3] lg:grow-[2.5] md:mt-4 md:ml-4 lg:m-0"
>
	<Notebooks />
</div>

<div class="relative w-full flex flex-col md:gap-4 md:basis-0 md:grow-[5.5] mx-4">
	{#if activeNotebookId}
		<div class="py-4 lg:pt-6 lg:pb-2 flex flex-col-reverse gap-4 flex-1 h-0 overflow-y-scroll">
			{#if omitting}
				<div class="p-1 rounded-box leading-relaxed h-fit w-full [&>p]:m-0 text-center">
					<p class="opacity-80">Scanning text...</p>
				</div>
			{/if}

			{#if !$notebooks[activeNotebookId].text.length}
				<div class="prose flex flex-col flex-1 items-center justify-center text-center p-6">
					<!-- Replace this with your SVG -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-16"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
						/>
					</svg>

					<h3>Nothing here yet</h3>
					<p>Insert some text to be omitted.</p>
				</div>
			{/if}

			{#each $notebooks[activeNotebookId].text as text, index}
				{#if text.omitted.length}
					<div
						class="p-2 rounded-box leading-relaxed h-fit w-full bg-base-200 [&>p]:m-0 [&_code]:bg-primary [&_code]:text-primary hover:[&_code]:bg-transparent {activeTextId ===
						text.id
							? '[&_code]:bg-transparent'
							: ''}"
					>
						<div class="relative">
							{#if reOmittingTextIndex === index}
								<div class="absolute inset-0 flex justify-center items-center bg-base-200/80">
									Re-Omitting the text...
								</div>
							{/if}
							{#if editTextIndex === index}
								<div
									bind:this={editor}
									contenteditable
									class="p-2 bg-base-100 rounded-box w-full resize-none h-fit"
									on:paste={pasteHandler}
								>
									{text.original}
								</div>
							{:else}
								{@html marked(text.omitted)}
							{/if}
						</div>

						<div class="divider my-1"></div>

						{#if editTextIndex === index}
							<div class="flex justify-end gap-2">
								<button class="btn btn-sm" on:click={() => (editTextIndex = null)}>Cancel</button>
								<button class="btn btn-sm btn-primary" on:click={() => editTextHandler(index)}
									>Save</button
								>
							</div>
						{:else}
							<div class="flex">
								<label class="swap btn btn-ghost btn-sm">
									<input
										checked={activeTextId === text.id}
										type="checkbox"
										on:change={() => (activeTextId = activeTextId === text.id ? null : text.id)}
									/>
									<div class="swap-on">
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
												d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
											/>
										</svg>
									</div>
									<div class="swap-off">
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
												d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									</div>
								</label>

								<fieldset
									disabled={reOmittingTextIndex === index}
									class="flex [&>button]:btn [&>button]:btn-ghost [&>button]:btn-sm [&>button]:disabled:bg-base-200"
								>
									<button name="edit" on:click={() => (editTextIndex = index)}>
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
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
									</button>
									<button name="refresh" on:click={() => reOmitHandler(index)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-6 {reOmittingTextIndex === index ? 'animate-spin' : ''}"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
											/>
										</svg>
									</button>
									<button
										name="delete"
										on:click={() => notebooks.removeText({ id: activeNotebookId, textId: text.id })}
									>
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
												d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
											/>
										</svg>
									</button>
								</fieldset>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		<TextInput on:omit={omitHandler} />
	{/if}
</div>

<!-- Flashcards -->
<div
	class="lg:mt-6 flex flex-col lg:bg-base-200 lg:border lg:border-base-300 lg:rounded-box lg:basis-0 lg:grow-[3]"
>
	<Flashcards />
</div>
