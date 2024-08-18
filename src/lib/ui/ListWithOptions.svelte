<!-- <script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let list

	let OptionsModal: HTMLDialogElement
	let items: { [itemId: string]: HTMLLIElement }
	let selectedItemId: null | string = null
	let selectedItemPos: null | { x: number; y: number } = null

	let optionsStyle = ''
	$: if (selectedItemPos) {
		optionsStyle = `position: absolute; width: 208px; top: ${selectedItemPos.y + 24}px; left: ${selectedItemPos.x - 208 - 24}px`
	}

	function onClose() {
		dispatch('close')
		OptionsModal.close()
	}

	function onShowOptions(itemId: string) {
		dispatch('showOptions')

		selectedItemId = itemId

		OptionsModal.showModal()

		const { x, y, width, right } = items[itemId].getBoundingClientRect()

		if (right < 600) return //return if mobile

		selectedItemPos = {
			x: x + width,
			y: y
		}
	}
</script>

{#each list as item (item.id)}
	<li bind:this={items[item.id]}>
		<slot {item} />
	</li>
{/each}

<dialog
	bind:this={OptionsModal}
	id="flashcards_options_modal"
	class="modal modal-bottom sm:modal-middle sm:backdrop:bg-transparent"
>
	<form method="dialog" class="modal-backdrop">
		<button on:click={onClose}>close</button>
	</form>
	<div class="modal-box p-0" style={optionsStyle}>
		<ul class="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
			<slot name="options" />
		</ul>
	</div>
</dialog> -->
