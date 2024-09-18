<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'

	let notebooksFormModal: HTMLDialogElement
	let selectedNotebookId: null | string = null

	function clickHandler(notebookName: string) {
		let query = new URLSearchParams()

		query.set('notebook', notebookName)

		goto(`?${query.toString()}`)
	}

	$: activeNotebook = $page.url.searchParams.get('notebook')

	function handleNotebookForm(e: SubmitEvent) {
		if (!e.target) return

		const formData = new FormData(e.target as HTMLFormElement)

		const data: { [key: string]: string } = {}

		for (let field of formData) {
			const [key, value] = field
			data[key] = value.toString()
		}

		notebooks.create({ name: data.name })

		// if (selectedNotebookId) {
		// 	flashcards.edit({ id: selectedCardId, question: data.question, answer: data.answer })
		// } else {
		// 	const notebookName = $page.url.searchParams.get('notebook')
		// 	const notebookId = notebooks.findId(notebookName)
		// 	if (!notebookId) return
		// 	flashcards.create({ notebookId, question: data.question, answer: data.answer })
		// }

		notebooksFormModal.close()
	}
</script>

<!-- <div class="flex justify-between items-center p-4 pb-2">
	<h1 class="text-2xl font-bold">Notebooks</h1>
	<button class="btn btn-ghost btn-circle btn-sm -mr-2" on:click={() => console.log('ha')}>
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
</div> -->

<div class="flex flex-col flex-1 h-0 drawer md:drawer-open z-30">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col items-center justify-center"></div>
	<div class="drawer-side md:rounded-box">
		<label for="nav-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div class="bg-base-200 flex flex-col w-[80vw] md:w-full min-h-screen md:min-h-fit">
			<ul class="menu rounded-box w-full">
				<li>
					<h2 class="menu-title flex items-center justify-between">
						<span>Notebooks</span>
						<button
							class="btn btn-circle btn-outline btn-ghost btn-xs -mr-2"
							on:click={() => notebooksFormModal.showModal()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-4"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</h2>
					<ul>
						{#each Object.keys($notebooks) as notebookName (notebookName)}
							<li>
								<a
									class={notebookName === activeNotebook ? 'active' : ''}
									href={null}
									on:click={() => clickHandler(notebookName)}>{notebookName}</a
								>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		</div>
	</div>
</div>

<dialog
	bind:this={notebooksFormModal}
	id="notebooks_form_modal"
	class="modal modal-bottom sm:modal-middle"
>
	<div class="modal-box">
		<div class="modal-action m-0">
			<form method="dialog">
				<button class="btn btn-sm">x</button>
			</form>
		</div>

		<div class="prose mb-4">
			<h3>{selectedNotebookId ? 'Update' : 'Create'} Notebook</h3>
			<p>Fill in the details below to craft your perfect notebook and make learning a breeze!</p>
		</div>

		<form class="flex flex-col gap-4" on:submit|preventDefault={handleNotebookForm}>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Name</span>
				</div>
				<input
					name="name"
					type="text"
					placeholder="test"
					class="input input-bordered w-full"
					value=""
				/>
			</label>

			<button class="btn btn-primary" type="submit"
				>{selectedNotebookId ? 'Update' : 'Create'}</button
			>
		</form>
	</div>
</dialog>
