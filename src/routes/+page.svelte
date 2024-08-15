<script lang="ts">
	import { stopWords } from '$lib/constants'
	import { clickOutside } from '$lib/utils'
	import { marked } from 'marked'
	import Flashcards from './Flashcards.svelte'

	const DIFFICULTIES_SCORE: { [key: string]: number } = {
		easy: 0.8,
		medium: 0.5,
		hard: 0.2
	}
	const DIFFICULTIES = Object.keys(DIFFICULTIES_SCORE)

	let difficultyDropdown: HTMLDetailsElement
	let textarea: HTMLTextAreaElement

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
				class="dropdown-content z-50 w-[calc(100vw-3rem)] sm:w-56 bg-base-200 p-4 rounded-box shadow-lg lg:shadow-none"
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
	<div class="flex flex-col bg-base-200 rounded-box lg:flex-[0_0_25%] w-fit">
		<Flashcards />
	</div>
</div>
