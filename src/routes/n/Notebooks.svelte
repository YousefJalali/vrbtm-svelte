<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'
	import { Svg, Logo } from '$lib/ui/'

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
				<Svg icon="plus" size={5} />
				New Notebook
			</button>

			<div class="divider"></div>

			<ul class="relative menu rounded-box w-full p-0 pb-6">
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
								<a
									class="p-2 flex items-center gap-1 flex-1"
									href="/n/{id}"
									on:click={toggleDrawer}
								>
									{#if pinned}
										<Svg icon="bookmark" />
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
											<Svg icon="moreHorizontal" />
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
								<Svg icon="archive" size={5} />
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
														<Svg icon="moreHorizontal" />
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
				<a href={null} on:click={onRename}>
					<Svg icon="edit" size={5} />
					Rename
				</a>
			</li>
			<!-- Pin -->
			{#if !$notebooks[selectedNotebookId].archived}
				<li>
					<a href={null} on:click={onPin}>
						{#if $notebooks[selectedNotebookId].pinned}
							<Svg icon="unBookmark" size={5} />
							Unpin
						{:else}
							<Svg icon="bookmark" size={5} />
							Pin
						{/if}
					</a>
				</li>
			{/if}
			<!-- Archive -->
			<li>
				<a href={null} on:click={onArchive}>
					{#if $notebooks[selectedNotebookId].archived}
						<Svg icon="unarchive" size={5} />
						Unarchive
					{:else}
						<Svg icon="archive" size={5} />
						Archive
					{/if}
				</a>
			</li>
			<!-- Delete -->
			<li>
				<a href={null} class="text-error" on:click={deleteNotebookHandler}>
					<Svg icon="delete" size={5} />
					Delete
				</a>
			</li>
		</ul>
	{/if}
</div>
