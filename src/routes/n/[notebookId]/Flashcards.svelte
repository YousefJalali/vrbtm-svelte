<script lang="ts">
	import { page } from '$app/stores'
	import { flashcards, notebooks } from '$lib/stores'
	import { alerts } from '$lib/stores/alerts'
	import { getErrorMessage } from '$lib/utils'

	let flashcardsFormModal: HTMLDialogElement
	let popover: HTMLElement
	let flashcardsEle: { [cardId: string]: HTMLLIElement } = {}
	let selectedCardId: null | string = null
	let generatingFlashcard = false
	let selectedFlashcardEleTop = 1
	let editCardId: null | string = null

	$: activeNotebookId = $page.params.notebookId
	$: notebookHasText = $notebooks[$page.params.notebookId]?.text?.length || 0
	$: if (selectedCardId && selectedFlashcardEleTop) {
		const { x, y, width } = flashcardsEle[selectedCardId].getBoundingClientRect()
		let padding = 16

		popover.style.transform = `translate(${x - padding + width - 140}px, ${y - padding + 24}px)`
		popover.showPopover()
	}

	function openPopover(e: MouseEvent, flashcardId: string) {
		selectedCardId = flashcardId
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
			const notebookId = $page.params.notebookId
			if (!notebookId) return
			flashcards.create({ notebookId, question: data.question, answer: data.answer })
		}

		flashcardsFormModal.close()
	}

	function onDelete() {
		if (!selectedCardId) return
		flashcards.remove(selectedCardId)

		selectedCardId = ''
		popover.hidePopover()
	}

	function onEdit() {
		if (!selectedCardId) return
		editCardId = selectedCardId

		popover.hidePopover()
		flashcardsFormModal.showModal()
	}

	async function generateFlashcard() {
		generatingFlashcard = true
		try {
			await flashcards.generate({ notebookId: activeNotebookId })
			generatingFlashcard = false
		} catch (error) {
			generatingFlashcard = false
			alerts.add({
				type: 'error',
				message: getErrorMessage(error)
			})
		}
	}
</script>

<div class="flex flex-col flex-1 h-0 drawer drawer-end md:drawer-open z-10">
	<!-- checked={$page.url.pathname.split('/')[3] === 'f'} -->
	<input id="flashcards-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col items-center justify-center"></div>
	<div
		class="drawer-side"
		on:scroll={() => {
			if (selectedCardId) {
				selectedFlashcardEleTop = flashcardsEle[selectedCardId].getBoundingClientRect().top
			}
		}}
	>
		<label for="flashcards-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<!-- <a href={`/n/${$page.params.notebookId}`} aria-label="close sidebar" class="drawer-overlay"></a> -->

		<div
			class="bg-base-100 md:bg-transparent md:rounded-box flex flex-col w-[80vw] md:w-full min-h-screen md:min-h-fit"
		>
			<div
				class="sticky rounded-se-box overflow-hidden border-b top-0 z-50 bg-base-100 flex justify-between items-center p-4"
			>
				<h1 class="text-2xl font-bold font-heading">Flashcards</h1>
				<div class="flex flex-row-reverse gap-2">
					<!-- CreateFlashcard -->
					<button
						name="create"
						class="btn btn-ghost btn-circle btn-sm"
						on:click={() => flashcardsFormModal.showModal()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</button>

					<!-- Generate Flashcard -->
					{#if notebookHasText}
						<button
							name="generate"
							class="btn btn-ghost btn-circle btn-sm"
							on:click={generateFlashcard}
							disabled={generatingFlashcard}
						>
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
									d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<ul class="h-full flex-1 p-4 space-y-4 text-center">
				{#if generatingFlashcard && !$flashcards.length}
					<li
						class="relative min-h-[100px] card bg-base-100 shadow-md flex justify-center items-center"
					>
						<span class="loading loading-infinity mb-2"></span>
						<span class="opacity-80 text-sm">Generating Flashcard...</span>
					</li>
				{:else if !$flashcards.filter((f) => f.notebookId === activeNotebookId).length}
					<div class="prose my-6 prose-sm flex flex-col items-center justify-center text-center">
						<h3 class="">No Flashcards Found</h3>
						<p class="">It looks like you don't have any flashcards yet.</p>

						<div class="flex flex-col justify-center">
							<button
								class="btn btn-primary btn-sm"
								on:click={() => flashcardsFormModal.showModal()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>

								Create Flashcard
							</button>
							<div class="divider">or</div>
							{#if !notebookHasText}
								<p class="m-0">
									Add some text to get started, and we'll generate flashcards for you!
								</p>
							{:else}
								<button class="btn btn-secondary btn-sm" on:click={generateFlashcard}>
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
											d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
										/>
									</svg> Generate Flashcard
								</button>
							{/if}
						</div>
					</div>
				{:else}
					{#if generatingFlashcard}
						<li
							class="relative min-h-[100px] card bg-base-100 shadow-md flex justify-center items-center"
						>
							<span class="loading loading-infinity mb-2"></span>
							<span class="opacity-80 text-sm">Generating Flashcard...</span>
						</li>
					{/if}
					{#each $flashcards as flashcard (flashcard.id)}
						{#if flashcard.notebookId === activeNotebookId}
							<li class="relative min-h-[100px] flex" bind:this={flashcardsEle[flashcard.id]}>
								<label class="swap swap-flip flex-1 place-content-stretch">
									<input type="checkbox" />

									<div class="swap-on">
										<div
											class="card bg-base-100 border-4 border-primary/40 text-primary/80 shadow-md h-full"
										>
											<div class="card-body p-4 flex justify-center items-center">
												<p class="flex-none">{flashcard.answer}</p>
											</div>
										</div>
									</div>
									<div class="group swap-off">
										<div
											class="relative card bg-secondary/40 hover:border-primary/50 border border-primary/20 text-primary/80 shadow-md h-full"
										>
											<div class="card-body p-4 flex justify-center items-center">
												<p class="flex-none">{flashcard.question}</p>
											</div>

											<button
												on:click={(e) => openPopover(e, flashcard.id)}
												class="lg:hidden lg:group-hover:flex btn btn-xs btn-ghost btn-circle absolute top-1 right-1"
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

<!-- Options -->
<div
	bind:this={popover}
	popover=""
	id="options"
	class="m-4 bg-transparent"
	on:toggle={({ newState }) => {
		if (newState === 'closed') {
			selectedCardId = ''
		}
	}}
>
	{#if selectedCardId}
		<ul class="menu dropdown-content border border-base-300 bg-base-100 rounded-box z-[1] p-2">
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
	{/if}
</div>

<!-- flashcardsModal -->
<dialog
	bind:this={flashcardsFormModal}
	id="flashcards_modal"
	class="modal modal-bottom sm:modal-middle"
>
	<div class="modal-box">
		<div class="modal-action m-0">
			<form method="dialog">
				<button class="btn btn-sm" on:click={() => (editCardId = '')}>x</button>
			</form>
		</div>

		<div class="prose mb-4">
			<h3>{editCardId ? 'Edit' : 'New'} Flashcard</h3>
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
					value={$flashcards.find((f) => f.id === editCardId)?.question || ''}
					required
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Answer</span>
				</div>
				<textarea
					name="answer"
					class="textarea resize-none textarea-bordered h-24 text-base"
					placeholder="The powerhouse of the cell is the mitochondrion."
					value={$flashcards.find((f) => f.id === editCardId)?.answer || ''}
					required
				></textarea>
			</label>

			<button class="btn btn-primary" type="submit"
				>{editCardId ? 'Update' : 'Create'} Flashcard</button
			>
		</form>
	</div>
</dialog>
