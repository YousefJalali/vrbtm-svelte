<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { alerts, notebooks } from '$lib/stores'
	import Logo from '$lib/ui/Logo.svelte'

	let popover: HTMLElement
	let selectedNotebookId: null | string = null
	let renameMode = false
	let newTitle = ''
	let newTitleInputEle: HTMLInputElement
	let drawerLabel: HTMLLabelElement
	let notebooksEle: { [notebookId: string]: HTMLLIElement } = {}
	let windowHeight: number

	$: activeNotebookId = $page.params.notebookId

	let selectedNotebookEleTop = 1
	$: if (selectedNotebookId && selectedNotebookEleTop) {
		const { x, y, width, top } = notebooksEle[selectedNotebookId].getBoundingClientRect()

		let padding = 10
		const popoverHeight = 180
		const popoverWidth = 132

		const translateX = x - padding + width - 16 - popoverWidth
		const translateY =
			top + popoverHeight + 16 > windowHeight ? y - padding - popoverHeight + 48 : y - padding + 36

		popover.style.transform = `translate(${translateX}px, ${translateY}px)`
		popover.showPopover()
	}

	function openPopover(e: MouseEvent, notebookId: string) {
		selectedNotebookId = notebookId
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
		try {
			notebooks.create()
			const createdNotebookId = Object.keys($notebooks)[0]
			goto(`/${createdNotebookId}`)
		} catch (error) {}

		toggleDrawer()
	}

	function toggleDrawer() {
		if (drawerLabel) {
			drawerLabel.click()
		}
	}

	function onPin() {
		if (!selectedNotebookId) return
		notebooks.togglePin({ id: selectedNotebookId })
		selectedNotebookId = null
	}

	function onArchive() {
		if (!selectedNotebookId) return
		notebooks.toggleArchive({ id: selectedNotebookId })
		selectedNotebookId = null
	}
</script>

<svelte:window bind:innerHeight={windowHeight} />

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
			<div class="flex flex-col mb-12 mt-4">
				<a class="btn btn-ghost w-fit h-fit mx-auto [&>svg]:size-24" href="/">
					<Logo />
				</a>
			</div>

			<button class="btn btn-primary btn-sm" on:click={createNotebookHandler}>
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

			<div class="divider"></div>

			<ul class="relative menu rounded-box w-full p-0 pb-6">
				<!-- <li>
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
						<ul></ul>
					</details>
				</li> -->

				{#each Object.entries($notebooks).sort((x, y) => Number(y[1].pinned) - Number(x[1].pinned)) as [id, { title, archived, pinned }], i (id)}
					{#if !archived}
						<li class="group" bind:this={notebooksEle[id]}>
							<a
								class="flex p-0 active:!bg-transparent {selectedNotebookId === id
									? 'bg-neutral/10'
									: ''}"
								href={null}
								class:active={id === activeNotebookId}
							>
								<a class="p-2 flex items-center gap-1 flex-1" href="/{id}" on:click={toggleDrawer}>
									{#if pinned}
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
												d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
											/>
										</svg>
									{/if}

									<span class="line-clamp-1 leading-loose">
										{title}
									</span>
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
					{/if}
				{/each}

				<li class="sticky bottom-0 pb-6 pt-2 bg-base-100 lg:bg-base-200">
					<details>
						<summary class="p-2 after:mr-2">
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
							{#each Object.entries($notebooks) as [id, { title, archived }], i (id)}
								{#if archived}
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
								{/if}
							{/each}
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
			<!-- Rename -->
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
			<!-- Pin -->
			{#if !$notebooks[selectedNotebookId].archived}
				<li>
					<a href={null} on:click={onPin}>
						{#if $notebooks[selectedNotebookId].pinned}
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
									d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
								/>
							</svg>

							Unpin
						{:else}
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
									d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
								/>
							</svg>

							Pin
						{/if}
					</a>
				</li>
			{/if}
			<!-- Archive -->
			<li>
				<a href={null} on:click={onArchive}>
					{#if $notebooks[selectedNotebookId].archived}
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
								d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
							/>
						</svg>

						Unarchive
					{:else}
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
						Archive
					{/if}
				</a>
			</li>
			<!-- Delete -->
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
