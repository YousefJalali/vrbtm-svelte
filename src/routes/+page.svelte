<script lang="ts">
	import { stopWords } from '$lib/constants'
	import { flashcards } from '$lib/stores/flashcards'
	import { clickOutside, longpress } from '$lib/utils'
	import { marked } from 'marked'
	import type { FormEventHandler } from 'svelte/elements'

	const DIFFICULTIES_SCORE: { [key: string]: number } = {
		easy: 0.8,
		medium: 0.5,
		hard: 0.2
	}
	const DIFFICULTIES = Object.keys(DIFFICULTIES_SCORE)

	let difficultyDropdown: HTMLDetailsElement
	let textarea: HTMLTextAreaElement
	let flashcardsModal: HTMLDialogElement
	let flashcardOptionsDropdown: HTMLDetailsElement

	let selectedDifficulty = DIFFICULTIES[1]
	let windowSize: number
	let showOmittedWords = ''
	let hasOmittedWord = false
	let editMode = true
	let text = ''

	// text =
	// 	"Start by creating a `new` SvelteKit project if you don't have one set up already. The most common approach is outlined in the Getting Started with SvelteKit introduction. Start by creating a `new` SvelteKit project if you don't have one set up already. The most common approach is outlined in the Getting Started with SvelteKit introduction. Start by creating a `new` SvelteKit project if you don't have one set up already. The most common approach is outlined in the Getting Started with SvelteKit introduction. Start by creating a `new` SvelteKit project if you don't have one set up already. The most common approach is outlined in the Getting Started with SvelteKit introduction. Start by creating a `new` SvelteKit project if you don't have one set up already. The most common approach is outlined in the Getting Started with SvelteKit introduction."

	text = `In 2024, the tech industry will see significant changes. For example, consider the breakthrough technologies like Quantum Computing and AI: they’re revolutionizing fields ranging from finance to healthcare. You might encounter various challenges: for instance, data privacy issues, which are critical in the age of ubiquitous connectivity. Companies will have to adapt quickly—especially those dealing with sensitive information. Moreover, the rise of remote work will bring both opportunities and obstacles. Will organizations be able to balance productivity with employee well-being? Time will tell. Don’t forget to check out the latest trends: virtual reality (VR), augmented reality (AR), and blockchain technologies. Remember: staying updated is crucial for staying competitive. 12345!`

	// text = ''

	$: isMobile = windowSize < 1024

	$: if (windowSize >= 1024) {
		showDifficultyDropdown(true)
	} else {
		showDifficultyDropdown(false)
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

	function onOmit() {
		if (text.length < 2) return

		clearOmit()

		text = text
			.split(' ')
			.map((word) => omitWord(word))
			.join(' ')

		showOmittedWords = ''

		if (isMobile) {
			showDifficultyDropdown(false)
		}
	}

	function disableEditMode() {
		if (text.length <= 0) return
		editMode = false
	}
	function enableEditMode() {
		editMode = true
		// if (textarea) textarea.focus()
	}

	$: if (editMode && textarea) {
		textarea.focus()
	}

	function omitWord(word: string) {
		let split = word.match(/[^\s()<>[\]:.,;?!@#*+&=]+|[\s()<>[\]:.,;?!@#*+&=]/g)

		if (!split || word.length <= 1) return word

		let res = ''

		for (let w of split) {
			let temp = ''
			if ((/[A-Za-z]/.test(w) || /^[0-9]+$/.test(w)) && w.length > 1) {
				//a word
				if (!stopWords[w.toLowerCase()] && Math.random() > DIFFICULTIES_SCORE[selectedDifficulty]) {
					temp = '``' + w + '``'
					hasOmittedWord = true
				} else {
					temp = w
				}
			} else {
				temp = w
			}

			res = res + temp
		}

		return res
	}

	function onTextAreaBlur() {
		disableEditMode()
		if (!text.length) {
			hasOmittedWord = false
			showOmittedWords = ''
		}

		// console.log(window.getSelection()?.toString())
	}

	function onCreateFlashcard(e: SubmitEvent) {
		if (!e.target) return

		const formData = new FormData(e.target as HTMLFormElement)

		const data: { [key: string]: string } = {}

		for (let field of formData) {
			const [key, value] = field
			data[key] = value.toString()
		}

		flashcards.create({ question: data.question, answer: data.answer })

		flashcardsModal.close()
	}
</script>

<svelte:window bind:innerWidth={windowSize} />

<div
	class="flex-1 flex flex-col-reverse gap-0 lg:gap-4 p-6 pt-0 lg:p-8 lg:pt-0 justify-center h-0 lg:flex-row"
>
	<div class="relative flex flex-col flex-1 bg-base-300 rounded-box">
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
					if (e.target && e.target.nodeName === 'CODE') return
					enableEditMode()
				}}
			>
				{@html marked(text)}
			</div>
		{/if}
	</div>

	<div
		class="sticky top-0 py-4 bg-base-100 rounded-box flex justify-between lg:flex-[0_0_25%] lg:flex-col-reverse lg:p-0"
	>
		<!-- Random Omit -->
		<details bind:this={difficultyDropdown} class="dropdown lg:dropdown-top mt-auto">
			<summary class="btn btn-sm btn-primary lg:btn-md lg:hidden">Random Omit</summary>

			<div
				class="dropdown-content z-50 w-[calc(100vw-3rem)] lg:w-full bg-base-200 p-4 rounded-box shadow-lg lg:shadow-none"
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

			<button class="btn btn-sm lg:btn-md" on:click={clearOmit}>Reset</button>
		</div>
	</div>

	<!-- Flashcards -->
	<div class="bg-base-200 rounded-box hidden xl:flex lg:flex-[0_0_25%] flex-col">
		<div class="prose flex justify-between p-4">
			<h1 class="m-0">Flashcards</h1>
			<button class="btn btn-ghost -mr-4" on:click={() => flashcardsModal.showModal()}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
			</button>
		</div>
		<ul class="h-full flex-1 px-4 py-6 space-y-4 overflow-y-scroll text-center">
			{#each $flashcards as flashcard (flashcard.id)}
				<li class="relative min-h-[100px] flex">
					<label class="swap swap-flip flex-1 place-content-stretch">
						<input type="checkbox" />

						<div class="swap-on">
							<div class="card bg-base-200 border-4 border-base-100 shadow-md h-full">
								<div class="card-body p-4 flex justify-center items-center">
									<p class="flex-none">{flashcard.answer}</p>
								</div>
							</div>
						</div>
						<div class="swap-off">
							<div class="relative card bg-base-100 shadow-md h-full">
								<div class="card-body p-4 flex justify-center items-center">
									<p class="flex-none">{flashcard.question}</p>
								</div>

								<details
									bind:this={flashcardOptionsDropdown}
									class="dropdown dropdown-left absolute right-1 top-1 z-50"
								>
									<summary class="btn btn-xs btn-circle m-1"
										><svg
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
										</svg></summary
									>
									<ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
										<li>
											<a href={null}
												><svg
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
												Edit</a
											>
										</li>
										<li class="text-error">
											<a href={null}
												><svg
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
												Delete</a
											>
										</li>
									</ul>
								</details>
							</div>
						</div>
					</label>
				</li>
			{/each}
		</ul>

		<dialog
			bind:this={flashcardsModal}
			id="flashcards_modal"
			class="modal modal-bottom sm:modal-middle"
		>
			<div class="modal-box">
				<div class="modal-action m-0">
					<form method="dialog">
						<button class="btn btn-sm">x</button>
					</form>
				</div>

				<div class="prose mb-4">
					<h3>Create Flashcard</h3>
					<p>
						Fill in the details below to craft your perfect flashcard and make learning a breeze!
					</p>
				</div>

				<form class="flex flex-col gap-4" on:submit|preventDefault={onCreateFlashcard}>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Question?</span>
						</div>
						<input
							name="question"
							type="text"
							placeholder="What is the powerhouse of the cell?"
							class="input input-bordered w-full"
						/>
					</label>

					<label class="form-control">
						<div class="label">
							<span class="label-text">Answer</span>
						</div>
						<textarea
							name="answer"
							class="textarea resize-none textarea-bordered h-24"
							placeholder="The powerhouse of the cell is the mitochondrion."
						></textarea>
					</label>

					<button class="btn btn-primary" type="submit">Create</button>
				</form>
			</div>
		</dialog>
	</div>
</div>
