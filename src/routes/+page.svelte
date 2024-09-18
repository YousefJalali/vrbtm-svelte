<script lang="ts">
	import Flashcards from './Flashcards.svelte'
	import Notebooks from './Notebooks.svelte'
	import { page } from '$app/stores'
	import Editor from './Editor.svelte'
	import RandomOmit from './RandomOmit.svelte'
	import Tools from './Tools.svelte'
	import debounce from 'lodash.debounce'
	import { notebooks } from '$lib/stores'
	import { marked } from 'marked'

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

	let text = ''
	let omitting = false

	// const onType = debounce((e) => {
	// 	const { value } = e.target
	// 	console.log('text updatedd1')
	// 	// notebooks.updateText({ name: activeNotebook, text: value })
	// }, 750)

	async function omitHandler() {
		if (!activeNotebook) return

		let temp = text
		text = ''

		omitting = true

		notebooks.addText({ name: activeNotebook, text: temp })
		const { success } = await notebooks.omit({ name: activeNotebook, textIndex: 0 })
		omitting = false

		if (!success) {
			text = temp
		}
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div class="flex-1 flex gap-0 lg:gap-4 p-4 pt-0 lg:p-6 lg:pt-0 justify-center h-0 lg:flex-row">
	<div
		class="hidden lg:flex flex-col lg:bg-base-200 lg:border lg:border-base-300 lg:rounded-box lg:gap-4 lg:flex-[0_0_20%]"
	>
		<Notebooks />
	</div>

	{#if activeNotebook}
		<div class="relative w-full flex flex-col max-h-[calc(100vh-84px)] lg:gap-4 lg:flex-[0_0_55%]">
			<div class="flex flex-col-reverse gap-4 flex-1 h-0 overflow-y-scroll">
				{#if omitting}
					<div
						class="p-2 rounded-xl leading-relaxed h-fit w-full bg-base-200 [&>p]:m-0 text-center"
					>
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

			<div class="mt-4 lg:m-0 w-full min-h-fit flex flex-col textarea textarea-bordered">
				<textarea
					bind:value={text}
					class=" flex-1 resize-none h-fit"
					placeholder="Add your text..."
					cols="1"
					rows="2"
				></textarea>
				<div class="divider my-1"></div>

				<div class="flex justify-between items-center">
					<button class="btn btn-sm btn-ghost w-fit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							class="size-4"
							><path
								fill-rule="evenodd"
								d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
								clip-rule="evenodd"
							></path></svg
						>
						Attach a file</button
					>
					<button class="btn btn-sm btn-primary w-fit" on:click={omitHandler}>Omit</button>
				</div>
			</div>
			<!-- <Editor {activeNotebook} />

			
			<div
				class="sticky top-0 py-4 lg:bg-base-100 rounded-box flex justify-between lg:flex-1 lg:flex-col-reverse lg:p-0"
			>
				<RandomOmit {activeNotebook} {windowSize} />

				<Tools {activeNotebook} />
			</div> -->
		</div>
	{/if}

	<!-- Flashcards -->
	<div
		class="flex flex-col lg:bg-base-200 lg:border lg:border-base-300 rounded-box lg:flex-[0_0_25%] w-fit"
	>
		<Flashcards />
	</div>
</div>
