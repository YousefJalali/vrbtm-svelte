<script lang="ts">
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'
	import { Svg } from '$lib/ui'
	import { marked } from 'marked'

	export let activeNotebookId: string
	export let omitting: boolean

	let activeTextId: null | string = null
	let reOmittingTextIndex: null | number = null
	let editTextIndex: null | number = null
	let textareaEle: HTMLTextAreaElement
	let editedText = ''

	$: textareaContainerText = editedText.trim() + '\n'
	$: if (textareaEle) {
		textareaEle.focus()
	}

	function onEdit(textIndex: number) {
		editTextIndex = textIndex
		editedText = $notebooks[activeNotebookId].text[textIndex].original
	}

	async function editTextHandler(textIndex: number) {
		if (!editedText.length || !activeNotebookId) return

		let newText = editedText
		let oldText = $notebooks[activeNotebookId].text[textIndex].original

		if (newText === oldText.trim()) {
			editTextIndex = null
			editedText = ''
			return
		}

		notebooks.updateText({ id: activeNotebookId, newText, textIndex })

		editTextIndex = null
		editedText = ''

		await reOmitHandler(textIndex)
	}

	async function reOmitHandler(textIndex: number) {
		if (!activeNotebookId) return

		reOmittingTextIndex = textIndex

		await notebooks.omit({ id: activeNotebookId, textIndex })

		reOmittingTextIndex = null
	}
</script>

<div
	title={$notebooks[activeNotebookId].title}
	class="mx-4 py-6 md:pt-[48px] flex flex-col-reverse gap-3 flex-1 h-0 overflow-y-scroll"
>
	<!-- Scanning text... -->
	{#if omitting}
		<div class="p-1 rounded-box leading-relaxed h-fit w-full [&>p]:m-0 text-center">
			<p class="opacity-80">Scanning text...</p>
		</div>
	{/if}

	<!-- Nothing here yet -->
	{#if !$notebooks[activeNotebookId].text.length}
		<div class="prose max-w-none flex flex-col flex-1 items-center justify-center text-center p-6">
			<!-- Replace this with your SVG -->
			<Svg icon="chat" classes="size-16" />

			<h3>Nothing here yet</h3>
			<p>Insert some text to be omitted.</p>
		</div>
	{/if}

	{#each $notebooks[activeNotebookId].text as text, index}
		{#if text.omitted.length}
			{#if index !== 0}
				<div class="divider m-0"></div>
			{/if}
			<article
				class="rounded-box leading-loose h-fit w-full bg-base-100 [&>p]:m-0 [&_code]:inline-block [&_code]:leading-5 [&_code]:bg-primary [&_code]:text-transparent hover:[&_code]:bg-transparent hover:[&_code]:text-primary {activeTextId ===
				text.id
					? '[&_code]:bg-transparent [&_code]:!text-primary'
					: ''}"
			>
				<div class="relative">
					{#if reOmittingTextIndex === index}
						<div
							class="absolute rounded-box inset-0 flex justify-center items-center bg-base-200/90"
						>
							Re-Omitting the text...
						</div>
					{/if}
					{#if editTextIndex === index}
						<div class="overflow-hidden relative bg-base-100 rounded-box w-full">
							<!-- on:paste={pasteHandler} -->
							<div
								bind:innerText={textareaContainerText}
								contenteditable
								class="flex h-fit w-full opacity-0 max-h-[calc(100vh*0.3)]"
							></div>
							<textarea
								bind:this={textareaEle}
								bind:value={editedText}
								class="absolute inset-0 z-10 resize-none rounded-box p-2 bg-base-200"
							></textarea>
						</div>
					{:else}
						<div class="p-2">
							{@html marked(text.omitted)}
						</div>
					{/if}
				</div>

				{#if editTextIndex === index}
					<div class="flex justify-end gap-2 mt-4 max-w-full overflow-hidden">
						<button class="btn btn-sm" on:click={() => (editTextIndex = null)}>Cancel</button>
						<button class="btn btn-sm btn-primary" on:click={() => editTextHandler(index)}
							>Save</button
						>
					</div>
				{:else}
					<!-- Text Actions -->
					<div class="flex mt-2 gap-2">
						<label class="swap text-neutral/60 btn btn-sm btn-ghost btn-circle">
							<input
								checked={activeTextId === text.id}
								type="checkbox"
								on:change={() => (activeTextId = activeTextId === text.id ? null : text.id)}
							/>
							<div class="swap-on">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
									/>
								</svg>
							</div>
							<div class="swap-off">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							</div>
						</label>

						<fieldset
							disabled={reOmittingTextIndex === index}
							class="flex gap-2 text-neutral/60 [&>button]:disabled:bg-base-200"
						>
							<button
								class="btn btn-sm btn-ghost btn-circle"
								name="edit"
								on:click={() => onEdit(index)}
							>
								<Svg icon="edit" size={5} />
							</button>
							<button
								class="btn btn-sm btn-ghost btn-circle"
								name="refresh"
								on:click={() => reOmitHandler(index)}
							>
								<Svg
									icon="refresh"
									size={5}
									classes={reOmittingTextIndex === index ? 'animate-spin' : ''}
								/>
							</button>
							<button
								class="btn btn-sm btn-ghost btn-circle"
								name="delete"
								on:click={() => notebooks.removeText({ id: activeNotebookId, textId: text.id })}
							>
								<Svg icon="delete" size={5} />
							</button>
						</fieldset>

						<a
							class="ml-auto btn btn-sm btn-secondary"
							href={`/n/${$page.params.notebookId}/${text.id}`}
						>
							Quiz
						</a>
					</div>
				{/if}
			</article>
		{/if}
	{/each}
</div>
