<script lang="ts">
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'
	import { Svg } from '$lib/ui'
	import { marked } from 'marked'
	import { flip } from 'svelte/animate'
	import { v4 as uuid } from 'uuid'

	$: notebookId = $page.params.notebookId
	$: textId = $page.params.textId
	$: text = notebooks.getText({ notebookId, textId })

	let draggedItemId: string | null = null
	let dragOver: string | null = null
	let draggableItems: { [id: string]: HTMLSpanElement } = {}
	let dropZones: { [id: string]: HTMLSpanElement } = {}
	let answers: string[] = []
	let wrongAnswersIndex: number[] = []
	let scorePercentage: string | null = null
	const result = {
		80: {
			color: 'text-success',
			title: 'Excellent!',
			description: "You're a master!"
		},
		50: {
			color: 'text-warning',
			title: 'Almost There!',
			description: 'Missed a few? Don’t worry—practice makes perfect. Try again!'
		},
		0: {
			color: 'text-error',
			title: 'Keep Trying!',
			description: 'Struggled a bit? No worries—come back and improve next time!'
		}
	}

	function clampScore(score: string) {
		return +score >= 80 ? 80 : +score >= 50 ? 50 : 0
	}

	function dragstartHandler(ev: DragEvent) {
		if (!ev.target || !ev.dataTransfer) return

		const id = (ev.target as HTMLDivElement).id

		ev.dataTransfer.setData('itemId', id)
		ev.dataTransfer.effectAllowed = 'move'
	}

	function dragHandler(ev: DragEvent) {
		const id = (ev.target as HTMLDivElement).id

		draggedItemId = id
	}

	function dragendHandler(ev: DragEvent, id: string) {
		draggedItemId = null
		dragOver = null
	}

	function dragoverHandler(ev: DragEvent) {
		ev.preventDefault()
		if (!ev.target || !ev.dataTransfer) return

		dragOver = (ev.target as HTMLDivElement).id

		ev.dataTransfer.dropEffect = 'move'
	}

	function dragleaveHandler(ev: DragEvent) {
		ev.preventDefault()
		dragOver = null
	}

	function dropHandler(ev: DragEvent, id: string, index: number) {
		if (!ev.dataTransfer) return

		ev.preventDefault()

		//init wrong answers
		wrongAnswersIndex = []

		const itemId = ev.dataTransfer.getData('itemId')

		if (!itemId || itemId === 'undefined') {
			dragOver = null
			return
		}

		if (!dropZones[id].children.length) {
			dropZones[id].appendChild(draggableItems[itemId])
			answers[index] = draggableItems[itemId].innerText.trim()

			console.log(answers)
			return
		}

		const oldItemId = dropZones[id].children[0].id

		answers[index] = draggableItems[itemId].innerText.trim()

		console.log(answers)

		dropZones['main'].appendChild(draggableItems[oldItemId])
		dropZones[id].appendChild(draggableItems[itemId])
	}

	function submitHandler() {
		if (!text) return

		wrongAnswersIndex = []

		for (let i = 0; i < text.keywords.length; i++) {
			if (text.keywords[i] !== answers[i + 1]) {
				wrongAnswersIndex.push(i + 1)
			}
		}

		wrongAnswersIndex = wrongAnswersIndex

		scorePercentage =
			'' +
			(((text.keywords.length - wrongAnswersIndex.length) * 100) / text.keywords.length).toFixed(0)
	}

	function reset() {
		scorePercentage = null
		wrongAnswersIndex = []
	}
</script>

<div class="flex flex-col flex-1 p-6">
	<div class="flex prose">
		<a href={`/n/${$page.params.notebookId}`} class="btn btn-ghost btn-circle btn-sm mb-6">
			<Svg icon="back" size={5} />
		</a>
		<!-- <h1>Improve Your Vocabulary!</h1> -->
	</div>

	<div class="flex-1 h-0 overflow-y-scroll">
		<div class="prose">
			<h2>How to Play</h2>
			<ol>
				<li>Drag the words from the list below.</li>
				<li>Drop them in the appropriate gaps.</li>
				<li>Once you're done, click the "Submit" button to see your results!</li>
			</ol>
		</div>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="relative mt-12"
			on:drop|preventDefault={(e) => dropHandler(e, 'main', Infinity)}
			on:dragover={dragoverHandler}
			on:dragleave={dragleaveHandler}
		>
			{#if scorePercentage}
				<div class="cursor-not-allowed absolute inset-0"></div>
			{/if}
			{#if text}
				<p class="leading-loose">
					{#each text.omitted.split(/`.*?`/g) as word, i}
						{@const id = word + i}
						{#if i !== 0}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<span
								{id}
								class="bg-base-200/50 border rounded-box min-h-6 h-fit px-12 py-0.5 has-[span]:px-0 mx-1 {dragOver ===
								id
									? 'border-primary'
									: ''} {wrongAnswersIndex.includes(i)
									? 'bg-error/30'
									: wrongAnswersIndex.length
										? 'bg-success/30'
										: ''}"
								bind:this={dropZones[id]}
								on:drop|stopPropagation={(e) => dropHandler(e, id, i)}
								on:dragover={dragoverHandler}
								on:dragleave={dragleaveHandler}
							></span>
						{/if}
						{word}
					{/each}
					<!-- {@html marked(text.omitted.replace(/`.*?`/g, '<span></span>'))} -->
				</p>

				<div class="mt-8 flex flex-wrap gap-4 w-fit" bind:this={dropZones['main']}>
					{#each text.keywords as keyword, i (keyword + i)}
						{@const id = keyword + i}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- bind:this={draggableItems[id]} -->
						<!-- animate:flip={{ duration: 300 }} -->
						<span
							{id}
							bind:this={draggableItems[id]}
							class="prose bg-primary/10 text-primary text-center cursor-grab text-sm px-2 py-1 rounded-box overflow-hidden {draggedItemId ===
							id
								? 'hidden'
								: ''}"
							draggable="true"
							on:dragstart={dragstartHandler}
							on:drag={dragHandler}
							on:dragend={(e) => dragendHandler(e, id)}
						>
							{keyword}
						</span>
					{/each}
				</div>
			{/if}
		</div>

		{#if !scorePercentage}
			<div class="flex mt-10">
				<button on:click={submitHandler} class="btn btn-lg btn-primary w-fit mx-auto"
					>Reveal My Score</button
				>
			</div>
		{:else}
			<div class="mt-12 mx-auto max-w-5xl w-fit text-center">
				<div
					class="radial-progress text-primary"
					style="--value:{+scorePercentage};"
					role="progressbar"
				>
					{scorePercentage}%
				</div>
				<!-- <h3 class="text-3xl font-bold text-center text-gray-700">What Your Results Reveal</h3> -->

				<div class="prose mt-8 flex flex-col justify-center">
					<h4 class="text-xl font-semibold {`${result[clampScore(scorePercentage)].color}`}">
						{result[clampScore(scorePercentage)].title}
					</h4>
					<p class="text-gray-600 mt-2">
						{result[clampScore(scorePercentage)].description}
					</p>
				</div>
			</div>

			<div class="flex mt-10">
				<button on:click={reset} class="btn btn-lg btn-primary w-fit mx-auto">Play Again</button>
			</div>

			<div class="prose mt-12">
				<p class="opacity-70">
					Tip: Practice daily to improve your language and communication skills!
				</p>
			</div>
		{/if}
	</div>
</div>
