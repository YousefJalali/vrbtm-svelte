<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'

	let popover: HTMLElement
	let notebooksFormModal: HTMLDialogElement
	let selectedNotebookId: null | string = null

	$: activeNotebookId = $page.params.notebookId

	// function clickHandler(notebookName: string) {
	// 	let query = new URLSearchParams()

	// 	query.set('notebook', notebookName)

	// 	goto(`?${query.toString()}`)
	// }

	// function handleNotebookForm(e: SubmitEvent) {
	// 	if (!e.target) return

	// 	const formData = new FormData(e.target as HTMLFormElement)

	// 	const data: { [key: string]: string } = {}

	// 	for (let field of formData) {
	// 		const [key, value] = field
	// 		data[key] = value.toString()
	// 	}

	// 	notebooks.create({ name: data.name })

	// 	notebooksFormModal.close()
	// }

	function openPopover(e: MouseEvent, notebookId: string) {
		selectedNotebookId = notebookId

		const { x, y, height } = (e.target as HTMLButtonElement).getBoundingClientRect()

		popover.style.transform = `translate(${x}px, ${y + height}px)`
		popover.togglePopover()
	}

	function closePopover() {
		selectedNotebookId = ''
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

<div class="flex flex-col flex-1 h-0 drawer md:drawer-open z-[1]">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col items-center justify-center"></div>
	<div class="drawer-side md:rounded-box">
		<label for="nav-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div class="bg-base-200 flex flex-col w-[70vw] md:w-full min-h-screen md:min-h-fit">
			<ul class="menu rounded-box w-full">
				<li>
					<h2 class="menu-title flex items-center justify-between">
						<span>Notebooks</span>
						<button
							class="btn btn-circle btn-outline btn-ghost btn-xs -mr-2"
							on:click={() => notebooks.create()}
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
				</li>
				<ul>
					{#each Object.entries($notebooks) as [id, { title }], i (id)}
						<li class="group">
							<a
								class="p-0 active:!bg-transparent {selectedNotebookId === id
									? 'bg-neutral/10'
									: ''}"
								href={null}
								class:active={id === activeNotebookId}
							>
								<a class="p-2 flex" href="/{id}">
									{title}
								</a>
								<div
									class="{selectedNotebookId === id
										? 'flex'
										: 'hidden group-hover:flex'}  absolute right-0 px-2 top-0 h-full justify-center items-center"
								>
									<button
										class="btn btn-xs btn-circle btn-ghost"
										on:click={(e) => openPopover(e, id)}
									>
										<svg
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
										</svg>
									</button>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</ul>
		</div>
	</div>
</div>

<div
	bind:this={popover}
	popover=""
	id="options"
	class="m-0 p-0 bg-transparent"
	on:toggle={({ newState }) => {
		if (newState === 'closed') {
			closePopover()
		}
	}}
>
	{#if selectedNotebookId}
		<ul class="menu bg-base-100 border border-base-300 rounded-box">
			<li>
				<a href={null}
					><svg
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
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>Rename</a
				>
			</li>
			<li>
				<a href={null} class="text-error">
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
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
					Delete</a
				>
			</li>
		</ul>
	{/if}
</div>

<!-- <dialog
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
			<h3>Create Notebook</h3>
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

			<button class="btn btn-primary" type="submit">Create</button>
		</form>
	</div>
</dialog> -->
