<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'

	let popover: HTMLElement
	let selectedNotebookId: null | string = null
	let renameMode = false
	let newTitle = ''
	let newTitleInputEle: HTMLInputElement
	let drawerLabel: HTMLLabelElement
	let notebooksEle: { [notebookId: string]: HTMLLIElement } = {}

	$: activeNotebookId = $page.params.notebookId

	let selectedNotebookEleTop = 1
	$: if (selectedNotebookId && selectedNotebookEleTop) {
		// console.log('called', flashcardsEle[optionsOfFlashcardId].getBoundingClientRect().top)
		const { x, y, width } = notebooksEle[selectedNotebookId].getBoundingClientRect()
		let padding = 16

		popover.style.transform = `translate(${x - padding + width - 16}px, ${y - padding + 48}px)`
		popover.showPopover()
	}

	function openPopover(e: MouseEvent, notebookId: string) {
		selectedNotebookId = notebookId

		// const { x, y, height } = (e.target as HTMLButtonElement).getBoundingClientRect()

		// popover.style.transform = `translate(${x}px, ${y + height}px)`
		// popover.togglePopover()
	}

	function closePopover() {
		selectedNotebookId = ''
	}

	async function deleteNotebookHandler() {
		// if there is only one notebook
		if (
			!selectedNotebookId ||
			(Object.keys($notebooks).length <= 1 &&
				$notebooks[selectedNotebookId].title === 'New notebook')
		)
			return

		if (activeNotebookId === selectedNotebookId) {
			if (Object.keys($notebooks).length <= 1) {
				notebooks.create()
				await goto(`/${Object.keys($notebooks)[0]}`)
			} else {
				let curIndex = Object.keys($notebooks).findIndex((nbId) => nbId === selectedNotebookId)

				if (curIndex === Object.keys($notebooks).length - 1) {
					curIndex--
				} else {
					curIndex++
				}

				const nextNotebookId = Object.keys($notebooks)[curIndex]

				await goto(`/${nextNotebookId}`)
			}
		}

		notebooks.remove({ id: selectedNotebookId })

		selectedNotebookId = ''

		popover.hidePopover()
	}

	function onRename() {
		if (!selectedNotebookId) return

		renameMode = true
		popover.hidePopover()
		newTitle = $notebooks[selectedNotebookId].title
	}

	$: if (newTitleInputEle) {
		newTitleInputEle.focus()
	}

	function renameHandler() {
		renameMode = false
		if (!selectedNotebookId) return

		if (newTitle.trim().length < 1) {
			selectedNotebookId = null
			return
		}

		notebooks.updateTitle({ id: selectedNotebookId, newTitle })
		newTitle = ''
		selectedNotebookId = null
	}

	function createNotebookHandler() {
		notebooks.create()
		const createdNotebookId = Object.keys($notebooks)[0]
		goto(`/${createdNotebookId}`)
		toggleDrawer()
	}

	function toggleDrawer() {
		if (drawerLabel) {
			drawerLabel.click()
		}
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
	<div
		class="drawer-side md:rounded-box"
		on:scroll={() => {
			if (selectedNotebookId) {
				selectedNotebookEleTop = notebooksEle[selectedNotebookId].getBoundingClientRect().top
			}
		}}
	>
		<label
			bind:this={drawerLabel}
			for="nav-drawer"
			aria-label="close sidebar"
			class="drawer-overlay"
		></label>

		<div class="bg-base-200 flex flex-col w-[70vw] md:w-full min-h-screen md:min-h-fit">
			<button class="btn btn-outline m-3" on:click={createNotebookHandler}>
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
				New Notebook
			</button>

			<ul class="menu rounded-box w-full p-3">
				<li>
					<h2 class="menu-title flex items-center gap-4 px-1.5">
						<span class="text-base-content">
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
									d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
								/>
							</svg>
						</span>
						Notebooks
					</h2>
				</li>
				<ul>
					{#each Object.entries($notebooks) as [id, { title }], i (id)}
						<li class="group" bind:this={notebooksEle[id]}>
							<a
								class="flex p-0 active:!bg-transparent {selectedNotebookId === id
									? 'bg-neutral/10'
									: ''}"
								href={null}
								class:active={id === activeNotebookId}
							>
								<a
									class="p-2 flex-1 line-clamp-1 leading-loose"
									href="/{id}"
									on:click={toggleDrawer}
								>
									{title}
								</a>
								<div
									class="{selectedNotebookId === id
										? 'flex'
										: 'flex lg:hidden lg:group-hover:flex'} {renameMode
										? 'inset-0'
										: ''} absolute right-0 px-2 top-0 h-full justify-center items-center"
								>
									{#if renameMode && id === selectedNotebookId}
										<input
											id="rename"
											name="rename notebook"
											bind:this={newTitleInputEle}
											bind:value={newTitle}
											type="text"
											class="input input-primary input-bordered input-xs w-full text-base text-neutral"
											on:blur={renameHandler}
										/>
									{:else}
										<button
											class="btn btn-xs btn-circle btn-ghost backdrop-blur ml-auto"
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
									{/if}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</ul>
		</div>
	</div>
</div>

<!-- Notebook Options -->
<div
	bind:this={popover}
	popover=""
	id="options"
	class="m-0 p-0 bg-transparent"
	on:toggle={({ newState }) => {
		if (newState === 'closed' && !renameMode) {
			closePopover()
		}
	}}
>
	{#if selectedNotebookId}
		<ul class="menu bg-base-100 border border-base-300 rounded-box">
			<li>
				<a href={null} on:click={onRename}
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
				<a href={null} class="text-error" on:click={deleteNotebookHandler}>
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
