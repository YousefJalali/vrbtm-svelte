<script lang="ts">
	import { notebooks } from '$lib/stores'
	import { clickOutside } from '$lib/utils'

	export let activeNotebook: string
	export let windowSize: number

	$: notebook = $notebooks[activeNotebook]

	const DIFFICULTIES_SCORE: { [key: string]: number } = {
		easy: 0.8,
		medium: 0.5,
		hard: 0.2
	}
	const DIFFICULTIES = Object.keys(DIFFICULTIES_SCORE)

	let difficultyDropdown: HTMLDetailsElement
	let omitting = false
	let selectedDifficulty = DIFFICULTIES[1]

	$: isMobile = windowSize < 1024

	$: if (windowSize >= 1024) {
		showDifficultyDropdown(true)
	} else {
		showDifficultyDropdown(false)
	}

	async function onOmit() {
		if (notebook.text.length < 2) return

		omitting = true

		await notebooks.omit({ name: activeNotebook })

		if (isMobile) {
			showDifficultyDropdown(false)
		}

		omitting = false
	}

	function showDifficultyDropdown(state: boolean) {
		if (!difficultyDropdown) return
		if (state) {
			difficultyDropdown.setAttribute('open', 'true')
		} else {
			difficultyDropdown.removeAttribute('open')
		}
	}
</script>

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
			disabled={!notebook.text.length}
			class="btn btn-sm lg:btn-md btn-primary mt-3 w-full"
		>
			{#if omitting}
				<span class="loading loading-spinner"></span>
			{/if}
			Omit
		</button>
	</div>
</details>
