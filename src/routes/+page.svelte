<script lang="ts">
	import { stopWords } from '$lib/constants'
	import { clickOutside } from '$lib/utils'
	import { marked } from 'marked'
	import Flashcards from './Flashcards.svelte'
	import Notebooks from './Notebooks.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { notebooks } from '$lib/stores'

	const DIFFICULTIES_SCORE: { [key: string]: number } = {
		easy: 0.8,
		medium: 0.5,
		hard: 0.2
	}
	const DIFFICULTIES = Object.keys(DIFFICULTIES_SCORE)

	let difficultyDropdown: HTMLDetailsElement
	let textarea: HTMLTextAreaElement

	let omitting = false
	let selectedDifficulty = DIFFICULTIES[1]
	let windowSize: number
	let showOmittedWords = ''
	let hasOmittedWord = false
	let editMode = true
	let activeNotebook = $page.url.searchParams.get('notebook')
	let text = $notebooks[activeNotebook || ''] || ''

	// onMount(async () => {
	// 	let query = new URLSearchParams()

	// 	let notebookName = Object.keys($notebooks)[0]

	// 	query.set('notebook', notebookName)

	// 	goto(`?${query.toString()}`)

	// 	text = $notebooks[notebookName]
	// })

	const handleChatCompletion = async () => {
		try {
			const res = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: text
				})
			})

			const data = await res.json()

			return data
		} catch (error) {
			console.log('err', error)
		}
	}

	$: if (activeNotebook !== $page.url.searchParams.get('notebook')) {
		console.log('navigate')
		activeNotebook = $page.url.searchParams.get('notebook')

		if (activeNotebook) {
			text = $notebooks[activeNotebook]
		}
	}

	$: if (text) {
		if (text !== $notebooks[activeNotebook || '']) {
			console.log('text changed')
			notebooks.updateText({ name: activeNotebook, text })
		}
	}

	// $: if (text && text !== ($notebooks[activeNotebook || ''] || '')) {
	// 	console.log('text changed')

	// 	if (activeNotebook) {
	// 		console.log(activeNotebook, { text })
	// 		notebooks.updateText({ name: activeNotebook, text })
	// 	}
	// }

	$: isMobile = windowSize < 1024

	$: if (windowSize >= 1024) {
		showDifficultyDropdown(true)
	} else {
		showDifficultyDropdown(false)
	}

	$: if (editMode && textarea) {
		textarea.focus()
	}

	function showDifficultyDropdown(state: boolean) {
		if (!difficultyDropdown) return
		if (state) {
			difficultyDropdown.setAttribute('open', 'true')
		} else {
			difficultyDropdown.removeAttribute('open')
		}
	}

	function clearOmit() {
		text = text.replaceAll('`', '')
		hasOmittedWord = false
		showOmittedWords = ''
	}

	async function onOmit() {
		if (text.length < 2) return

		omitting = true

		const omitted = await handleChatCompletion()

		// console.log(omitted, omitted.choices[0].message.content)

		text = omitted.choices[0].message.content
		hasOmittedWord = true

		// clearOmit()

		// text = text
		// 	.split(' ')
		// 	.map((word) => omitWord(word))
		// 	.join(' ')

		showOmittedWords = ''

		if (isMobile) {
			showDifficultyDropdown(false)
		}

		omitting = false
	}

	function disableEditMode() {
		if (text.length <= 0) return
		editMode = false
	}
	function enableEditMode() {
		editMode = true
		// if (textarea) textarea.focus()
	}

	// function omitWord(word: string) {
	// 	let split = word.match(/[^\s()<>[\]:.,;?!@#*+&=]+|[\s()<>[\]:.,;?!@#*+&=]/g)

	// 	if (!split || word.length <= 1) return word

	// 	let res = ''

	// 	for (let w of split) {
	// 		let temp = ''
	// 		if ((/[A-Za-z]/.test(w) || /^[0-9]+$/.test(w)) && w.length > 1) {
	// 			//a word
	// 			if (!stopWords[w.toLowerCase()] && Math.random() > DIFFICULTIES_SCORE[selectedDifficulty]) {
	// 				temp = '``' + w + '``'
	// 				hasOmittedWord = true
	// 			} else {
	// 				temp = w
	// 			}
	// 		} else {
	// 			temp = w
	// 		}

	// 		res = res + temp
	// 	}

	// 	return res
	// }

	function onTextAreaBlur() {
		disableEditMode()
		if (!text.length) {
			hasOmittedWord = false
			showOmittedWords = ''
		}

		// console.log(window.getSelection()?.toString())
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div class="flex-1 flex gap-0 lg:gap-4 p-6 pt-0 lg:p-8 lg:pt-0 justify-center h-0 lg:flex-row">
	<div class="hidden lg:flex flex-col lg:bg-base-200 lg:rounded-box lg:gap-4 lg:flex-[0_0_20%]">
		<Notebooks />
	</div>

	<div
		class="flex flex-col-reverse lg:bg-base-200 lg:p-4 lg:rounded-box lg:gap-4 lg:flex-row lg:flex-[0_0_55%]"
	>
		<div class="relative flex flex-col flex-1 lg:flex-[0_0_70%] bg-base-300 rounded-box">
			{#if editMode}
				<textarea
					bind:this={textarea}
					bind:value={text}
					on:blur={onTextAreaBlur}
					placeholder="type here..."
					class="p-4 leading-relaxed lg:p-6 resize-none flex-1 h-fit w-full bg-transparent fields"
					style="field-sizing: content;"
				></textarea>
			{:else}
				<!-- Markdown -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div
					tabindex={0}
					class="p-4 leading-relaxed lg:p-6 resize-none flex-1 h-fit w-full bg-transparent [&>p]:m-0 [&_code]:bg-primary [&_code]:text-primary hover:[&_code]:bg-transparent {showOmittedWords}"
					on:click={(e) => {
						//@ts-ignore
						if (e.target && e.target.nodeName === 'CODE') return
						enableEditMode()
					}}
				>
					{@html marked($notebooks[activeNotebook || ''] || '')}
				</div>
			{/if}
		</div>

		<div
			class="sticky top-0 py-4 lg:bg-base-200 rounded-box flex justify-between lg:flex-1 lg:flex-col-reverse lg:p-0"
		>
			<!-- Random Omit -->
			<details bind:this={difficultyDropdown} class="dropdown lg:dropdown-top mt-auto">
				<summary class="btn btn-sm btn-primary lg:btn-md lg:hidden">Random Omit</summary>

				<div
					class="dropdown-content z-50 w-[calc(100vw-3rem)] sm:w-56 lg:w-full bg-base-200 border-2 border-base-300 p-4 rounded-box shadow-lg lg:shadow-none"
					use:clickOutside
					on:outclick={() => {
						if (isMobile) {
							showDifficultyDropdown(false)
						}
					}}
				>
					<h3 class="text-xl font-bold mb-4 hidden lg:block">Random Omit</h3>
					<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">
						select difficulty
					</span>
					<ul>
						{#each DIFFICULTIES as difficulty}
							<li>
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text capitalize">{difficulty}</span>
										<input
											type="radio"
											class="radio checked:bg-primary"
											bind:group={selectedDifficulty}
											value={difficulty}
											checked={difficulty === selectedDifficulty}
										/>
									</label>
								</div>
							</li>
						{/each}
					</ul>
					<button
						on:click={onOmit}
						disabled={!text.length}
						class="btn btn-sm lg:btn-md btn-primary mt-3 w-full"
					>
						{#if omitting}
							<span class="loading loading-spinner"></span>
						{/if}
						Omit
					</button>
				</div>
			</details>

			<!-- Text Tools -->
			<div
				class="flex lg:flex-col gap-2 lg:gap-6 lg:border-2 lg:border-base-300 lg:p-4 lg:rounded-box"
			>
				<label class="label cursor-pointer p-0 h-fit">
					<span class="label-text hidden lg:block">Show Omitted Words</span>
					<input
						type="checkbox"
						class="toggle toggle-primary toggle-lg lg:toggle-md"
						checked={showOmittedWords.length > 0}
						on:change={() =>
							(showOmittedWords = showOmittedWords.length > 0 ? '' : '[&_code]:bg-transparent')}
						disabled={!hasOmittedWord}
					/>
				</label>

				<button class="btn btn-sm btn-outline" on:click={clearOmit}>Reset</button>
			</div>
		</div>
	</div>

	<!-- Flashcards -->
	<div class="flex flex-col bg-base-200 rounded-box lg:flex-[0_0_25%] w-fit">
		<Flashcards />
	</div>
</div>
