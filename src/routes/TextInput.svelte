<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	let text = ''

	const dispatch = createEventDispatcher()

	function onOmit() {
		dispatch('omit', { text })
		text = ''
	}
</script>

<div class="border-2 focus-within:border-primary mt-4 p-4 lg:m-0 rounded-box overflow-hidden">
	<textarea
		style="field-sizing: content;"
		class="w-full h-fit max-h-[calc(100vh*0.2)] resize-none focus:outline-0"
		bind:value={text}
		placeholder="Add Text..."
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
		<button class="btn btn-sm btn-primary w-fit" on:click={onOmit}>Omit</button>
	</div>
</div>
