<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'
	import Logo from '$lib/ui/Logo.svelte'

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

<div class="flex flex-col flex-1 h-0 drawer lg:drawer-open z-50">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" />

	<!-- <div class="drawer-content flex flex-col items-center justify-center"></div> -->
	<div
		class="drawer-side"
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

		<div
			class="bg-base-100 lg:bg-base-200 p-4 lg:p-0 flex flex-col w-[80vw] md:max-w-96 lg:w-full min-h-screen lg:min-h-fit"
		>
			<div class="flex flex-col mb-12">
				<!-- <button
					class="hidden lg:flex btn btn-ghost btn-sm btn-square ml-auto"
					on:click={() => (shrinkMode = !shrinkMode)}
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="size-6"
						><path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
							fill="currentColor"
						></path></svg
					>
				</button> -->

				<a class="btn btn-ghost w-fit h-fit mx-auto [&>svg]:size-24" href="/">
					<Logo />
				</a>
			</div>

			<button class="btn btn-primary btn-sm mb-8" on:click={createNotebookHandler}>
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

			<ul class="menu rounded-box w-full p-0">
				<li>
					<details open>
						<summary>
							<span>
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
										d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
									/>
								</svg>
							</span>
							Notebooks</summary
						>
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
					</details>
				</li>
				<li>
					<details>
						<summary>
							<span>
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
										d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
									/>
								</svg>
							</span>
							Favorite</summary
						>
						<ul>
							<li></li>
						</ul>
					</details>
				</li>
				<li>
					<details>
						<summary>
							<span>
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
										d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
									/>
								</svg>
							</span>
							Archived</summary
						>
						<ul>
							<li></li>
						</ul>
					</details>
				</li>
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
