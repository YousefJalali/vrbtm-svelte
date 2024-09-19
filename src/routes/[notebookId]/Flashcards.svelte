<script lang="ts">
	import { page } from '$app/stores'
	import { flashcards, notebooks } from '$lib/stores'
	import ListWithOptions from '$lib/ui/ListWithOptions.svelte'

	let flashcardsFormModal: HTMLDialogElement
	let flashcardsOptionsModal: HTMLDialogElement
	let cards: { [cardId: string]: HTMLLIElement } = {}
	let selectedCardId: null | string = null
	let selectedCardPos: null | { x: number; y: number } = null

	let optionsStyle = ''
	$: if (selectedCardPos) {
		optionsStyle = `position: absolute; width: 208px; top: ${selectedCardPos.y + 24}px; left: ${selectedCardPos.x - 208 - 24}px`
	}

	$: activeNotebook = $page.url.searchParams.get('notebook')

	function onShowOptions(cardId: string) {
		if (!cards[cardId]) return

		selectedCardId = cardId

		flashcardsOptionsModal.showModal()

		const { x, y, width, right } = cards[cardId].getBoundingClientRect()

		if (right < 600) return //return if mobile

		selectedCardPos = {
			x: x + width,
			y: y
		}
	}

	function handleFlashcardForm(e: SubmitEvent) {
		if (!e.target) return

		const formData = new FormData(e.target as HTMLFormElement)

		const data: { [key: string]: string } = {}

		for (let field of formData) {
			const [key, value] = field
			data[key] = value.toString()
		}

		if (selectedCardId) {
			flashcards.edit({ id: selectedCardId, question: data.question, answer: data.answer })
		} else {
			const notebookName = $page.url.searchParams.get('notebook')
			if (!notebookName) return
			flashcards.create({ notebookName, question: data.question, answer: data.answer })
		}

		flashcardsFormModal.close()
	}

	function onDelete() {
		if (!selectedCardId) return
		flashcards.remove(selectedCardId)

		flashcardsOptionsModal.close()
	}

	function onEdit() {
		flashcardsOptionsModal.close()
		flashcardsFormModal.showModal()
	}

	function onOptionsModalClose() {
		selectedCardId = null
		selectedCardPos = null
	}
</script>

<div class="flex flex-col flex-1 h-0 drawer drawer-end lg:drawer-open z-10">
	<input id="flashcards-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col items-center justify-center"></div>
	<div class="drawer-side lg:rounded-box">
		<label for="flashcards-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div class="bg-base-200 flex flex-col w-[80vw] md:w-[40vw] lg:w-full min-h-screen lg:min-h-fit">
			<div class="sticky top-0 z-50 flex justify-between items-center p-4 pb-2">
				<h1 class="text-2xl font-bold">Flashcards</h1>
				<button
					class="btn btn-ghost btn-circle btn-sm -mr-2"
					on:click={() => flashcardsFormModal.showModal()}
				>
					<svg
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

			<ul class="h-full flex-1 px-4 py-6 space-y-4 text-center">
				{#if !!$flashcards.length}
					<div class="prose prose-sm flex flex-col items-center justify-center text-center">
						<h3 class="">No Flashcards Found</h3>
						<p class="">It looks like you don't have any flashcards yet.</p>

						<div class="flex flex-col justify-center">
							<button
								class="btn btn-primary btn-sm"
								on:click={() => flashcardsFormModal.showModal()}
							>
								Create Flashcard
							</button>
							<div class="divider">or</div>
							<button class="btn btn-secondary btn-sm"> Generate with AI </button>
						</div>
					</div>
				{:else}
					{#each $flashcards as flashcard (flashcard.id)}
						{#if flashcard.notebookName === activeNotebook}
							<li class="relative min-h-[100px] flex" bind:this={cards[flashcard.id]}>
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

											<button
												on:click={() => onShowOptions(flashcard.id)}
												class="btn btn-xs btn-circle absolute top-1 right-1"
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
												</svg></button
											>
										</div>
									</div>
								</label>
							</li>
						{/if}
					{/each}
				{/if}
			</ul>
		</div>
	</div>
</div>

<!-- flashcardsOptionsModal -->
<dialog
	bind:this={flashcardsOptionsModal}
	id="flashcards_options_modal"
	class="modal modal-bottom sm:modal-middle sm:backdrop:bg-transparent"
>
	<form method="dialog" class="modal-backdrop">
		<button on:click={onOptionsModalClose}>close</button>
	</form>
	<div class="modal-box p-0" style={optionsStyle}>
		<ul class="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
			<li>
				<a href={null} on:click={onEdit}
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
				<a href={null} on:click={onDelete}
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
	</div>
</dialog>

<!-- flashcardsModal -->
<dialog
	bind:this={flashcardsFormModal}
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
			<h3>{selectedCardId ? 'Update' : 'Create'} Flashcard</h3>
			<p>Fill in the details below to craft your perfect flashcard and make learning a breeze!</p>
		</div>

		<form class="flex flex-col gap-4" on:submit|preventDefault={handleFlashcardForm}>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Question?</span>
				</div>
				<input
					name="question"
					type="text"
					placeholder="What is the powerhouse of the cell?"
					class="input input-bordered w-full"
					value={$flashcards.find((f) => f.id === selectedCardId)?.question || ''}
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
					value={$flashcards.find((f) => f.id === selectedCardId)?.answer || ''}
				></textarea>
			</label>

			<button class="btn btn-primary" type="submit">{selectedCardId ? 'Update' : 'Create'}</button>
		</form>
	</div>
</dialog>
