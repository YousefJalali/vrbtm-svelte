<script lang="ts">
	import { notebooks } from '$lib/stores'

	export let activeNotebook: string

	function clearOmit() {
		notebooks.clearOmit({ name: activeNotebook })
	}

	function toggleOmittedWordsVisibility() {
		if ($notebooks[activeNotebook].isOmittedWordsVisible) {
			notebooks.hideOmittedWords({ name: activeNotebook })
		} else {
			notebooks.showOmittedWords({ name: activeNotebook })
		}
	}
</script>

<div class="flex lg:flex-col gap-2 lg:gap-6 lg:border-2 lg:border-base-300 lg:p-4 lg:rounded-box">
	<label class="label cursor-pointer p-0 h-fit">
		<span class="label-text hidden lg:block">Show Omitted Words</span>
		<input
			type="checkbox"
			class="toggle toggle-primary toggle-lg lg:toggle-md"
			checked={$notebooks[activeNotebook].isOmittedWordsVisible}
			on:change={toggleOmittedWordsVisibility}
			disabled={!$notebooks[activeNotebook].isOmitted}
		/>
	</label>

	<button class="btn btn-sm btn-outline" on:click={clearOmit}>Reset</button>
</div>
