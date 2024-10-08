<script lang="ts">
	import { page } from '$app/stores'
	import { flashcards, notebooks } from '$lib/stores'
	import { alerts } from '$lib/stores/alerts'
	import { Svg } from '$lib/ui'
	import { getErrorMessage } from '$lib/utils'

	let flashcardsFormModal: HTMLDialogElement
	let popover: HTMLElement
	let newFlashcardPopover: HTMLElement
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

		if (editCardId) {
			flashcards.edit({ id: editCardId, question: data.question, answer: data.answer })
			editCardId = null
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
		newFlashcardPopover.hidePopover()

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

	function newFlashcardPopoverHandler(e: MouseEvent) {
		// if(!e.target) return

		const { x, y, width } = (e.target as HTMLElement).getBoundingClientRect()
		let padding = 16

		let popoverWidth = 200

		newFlashcardPopover.style.transform = `translate(${x - padding + width - popoverWidth - 20}px, ${y - padding + 20}px)`
		newFlashcardPopover.showPopover()
	}
</script>

<div class="flex flex-col flex-1 h-0 drawer drawer-end md:drawer-open z-10">
	<input
		id="flashcards-drawer"
		type="checkbox"
		class="drawer-toggle"
		checked={$page.url.pathname.split('/')[3] === 'f'}
	/>

	<div class="drawer-content flex flex-col items-center justify-center"></div>
	<div
		class="drawer-side"
		on:scroll={() => {
			if (selectedCardId) {
				selectedFlashcardEleTop = flashcardsEle[selectedCardId].getBoundingClientRect().top
			}
		}}
	>
		<!-- <label for="flashcards-drawer" aria-label="close sidebar" class="drawer-overlay"></label> -->
		<a href={`/n/${$page.params.notebookId}`} aria-label="close sidebar" class="drawer-overlay"></a>

		<div
			class="bg-base-100 md:bg-transparent md:rounded-box flex flex-col w-[80vw] md:w-full min-h-screen md:min-h-fit"
		>
			<div
				class="sticky rounded-se-box overflow-hidden border-b top-0 z-50 bg-base-100 flex justify-between items-center p-4"
			>
				<h1 class="text-2xl font-bold font-heading">Flashcards</h1>
				<div class="flex flex-row-reverse gap-2">
					<a
						href={`/n/${$page.params.notebookId}`}
						class="hidden lg:flex btn btn-ghost btn-circle btn-sm"
					>
						<Svg icon="window" />
					</a>

					<!-- CreateFlashcard -->
					<button
						name="create"
						class="btn btn-ghost btn-circle btn-sm"
						on:click={newFlashcardPopoverHandler}
					>
						<Svg icon="plus" />
					</button>
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
								class="btn btn-primary btn-sm w-fit mx-auto"
								on:click={() => flashcardsFormModal.showModal()}
							>
								<Svg icon="plus" size={5} />
								Create Flashcard
							</button>
							<div class="divider">or</div>
							{#if !notebookHasText}
								<p class="m-0">
									Add some text to get started, and we'll generate flashcards for you!
								</p>
							{:else}
								<button class="btn btn-secondary btn-sm" on:click={generateFlashcard}>
									<Svg icon="generate" size={5} />
									Generate Flashcard
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
											>
												<Svg icon="moreHorizontal" />
											</button>
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

<!-- New flashcard Popover -->
<div bind:this={newFlashcardPopover} popover="" id="new-flashcard" class="m-4 bg-transparent">
	<ul class="menu dropdown-content border border-base-300 bg-base-100 rounded-box z-[1] p-2">
		<li>
			<a href={null} on:click={() => flashcardsFormModal.showModal()}>
				<Svg icon="plus" size={5} />
				Create Flashcard
			</a>
		</li>
		{#if notebookHasText}
			<li class="text-primary">
				<a href={null} on:click={generateFlashcard}>
					<Svg icon="generate" size={5} />
					Generate Flashcard
				</a>
			</li>
		{/if}
	</ul>
</div>

<!-- Options Popover -->
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
				<a href={null} on:click={onEdit}>
					<Svg icon="edit" size={5} />
					Edit
				</a>
			</li>
			<li class="text-error">
				<a href={null} on:click={onDelete}>
					<Svg icon="delete" size={5} />
					Delete
				</a>
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
				>{editCardId ? 'Update' : 'Create'} Flashcard
			</button>
		</form>
	</div>
</dialog>
