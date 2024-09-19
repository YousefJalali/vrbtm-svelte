<script lang="ts">
	import Flashcards from './Flashcards.svelte'
	import Notebooks from './Notebooks.svelte'
	import { page } from '$app/stores'
	// import Editor from './Editor.svelte'
	// import RandomOmit from './RandomOmit.svelte'
	// import Tools from './Tools.svelte'
	// import debounce from 'lodash.debounce'
	import { notebooks } from '$lib/stores'
	import { marked } from 'marked'
	import { goto } from '$app/navigation'
	import { onMount, type DispatchOptions, type EventDispatcher } from 'svelte'
	import TextInput from './TextInput.svelte'

	let windowSize: number

	let activeNotebook: null | string = null

	onMount(() => {
		let query = new URLSearchParams()
		let firstNotebook = Object.keys($notebooks)[0]

		let notebook: string | null = $page.url.searchParams.get('notebook')

		query.set('notebook', notebook || firstNotebook)

		goto(`?${query.toString()}`)
	})

	$: if (activeNotebook !== $page.url.searchParams.get('notebook')) {
		// console.log('navigate')
		activeNotebook = $page.url.searchParams.get('notebook')
	}

	// let text = ''
	let omitting = false

	async function omitHandler(e: CustomEvent) {
		let text = e.detail.text
		if (!activeNotebook || !text.length) return

		let temp = text

		omitting = true

		notebooks.addText({ name: activeNotebook, text: temp })
		const { success } = await notebooks.omit({ name: activeNotebook, textIndex: 0 })

		omitting = false

		await notebooks.generateTitle({ name: activeNotebook })

		// if (!success) {
		// 	text = temp
		// }
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div
	class=" md:flex flex-col bg-base-200 md:border md:border-base-300 md:rounded-box md:gap-4 md:basis-0 md:grow-[3] lg:grow-[2.5] md:mt-4 md:ml-4 lg:m-0"
>
	<Notebooks />
</div>

<div class="relative w-full flex flex-col md:gap-4 md:basis-0 md:grow-[5.5] mx-4">
	{#if activeNotebook}
		<div class="pb-4 flex flex-col-reverse gap-4 flex-1 h-0 overflow-y-scroll">
			{#if omitting}
				<div class="p-1 rounded-xl leading-relaxed h-fit w-full [&>p]:m-0 text-center">
					<p class="opacity-80">Scanning text...</p>
				</div>
			{/if}

			{#each $notebooks[activeNotebook].text as text}
				{@const notebook = $notebooks[activeNotebook]}
				{#if text.omitted.length}
					<div
						class="p-2 rounded-xl leading-relaxed h-fit w-full bg-base-200 [&>p]:m-0 [&_code]:bg-primary [&_code]:text-primary hover:[&_code]:bg-transparent {notebook.isOmittedWordsVisible
							? '[&_code]:bg-transparent'
							: ''}"
					>
						{@html marked(text.omitted)}

						<div class="divider my-1"></div>

						<div class="flex [&>button]:btn [&>button]:btn-ghost [&>button]:btn-sm">
							<button name="edit">
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
							<button name="refresh">
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
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
							</button>
							<button name="delete">
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
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<TextInput on:omit={omitHandler} />
	{/if}
</div>

<!-- Flashcards -->
<div
	class="flex flex-col lg:bg-base-200 lg:border lg:border-base-300 lg:rounded-box lg:basis-0 lg:grow-[3]"
>
	<Flashcards />
</div>
