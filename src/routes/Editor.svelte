<script lang="ts">
	import { notebooks } from '$lib/stores'
	import { marked } from 'marked'
	import debounce from 'lodash.debounce'

	export let activeNotebook: string

	$: notebook = $notebooks[activeNotebook]

	let editMode = true
	let text = $notebooks[activeNotebook].text

	let textarea: HTMLTextAreaElement

	$: if (editMode && textarea) {
		textarea.focus()
	}

	const onChange = debounce((e) => {
		const { value } = e.target
		console.log('text updatedd1')
		notebooks.updateText({ name: activeNotebook, text: value })
	}, 750)

	function enableEditMode() {
		editMode = true
	}

	function disableEditMode() {
		if (text.length <= 0) return
		editMode = false
	}

	function onTextAreaBlur() {
		disableEditMode()
		if (!text.length) {
			notebooks.clearOmit({ name: activeNotebook })
		}
	}
</script>

<div class="relative flex flex-col flex-1 lg:flex-[0_0_70%] bg-base-300 rounded-box">
	{#if editMode}
		<textarea
			bind:this={textarea}
			bind:value={text}
			on:keydown={onChange}
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
			class="p-4 leading-relaxed lg:p-6 resize-none flex-1 h-fit w-full bg-transparent [&>p]:m-0 [&_code]:bg-primary [&_code]:text-primary hover:[&_code]:bg-transparent {notebook.isOmittedWordsVisible
				? '[&_code]:bg-transparent'
				: ''}"
			on:click={(e) => {
				//@ts-ignore
				if (e.target && e.target.nodeName === 'CODE') return
				enableEditMode()
			}}
		>
			{@html marked(notebook?.text || '')}
		</div>
	{/if}
</div>
