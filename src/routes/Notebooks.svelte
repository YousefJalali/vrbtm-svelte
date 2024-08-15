<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { notebooks } from '$lib/stores'

	function clickHandler(notebookName: string) {
		let query = new URLSearchParams()

		query.set('notebook', notebookName)

		goto(`?${query.toString()}`)
	}

	$: activeNotebook = $page.url.searchParams.get('notebook')
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

<ul class="menu bg-base-200 rounded-box w-full">
	<li>
		<h2 class="menu-title flex items-center justify-between">
			<span>Notebooks</span>
			<button
				class="btn btn-circle btn-outline btn-ghost btn-xs -mr-2"
				on:click={() => console.log('ha')}
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
			{#each Object.keys($notebooks) as notebookId (notebookId)}
				<li>
					<a
						class={$notebooks[notebookId].name === activeNotebook ? 'active' : ''}
						href={null}
						on:click={() => clickHandler($notebooks[notebookId].name)}
						>{$notebooks[notebookId].name}</a
					>
				</li>
			{/each}
		</ul>
	</li>
</ul>

<!-- <ul class="px-6">
	{#each $notebooks as notebook (notebook.id)}
		<li><a>{notebook.name}</a></li>
	{/each}
</ul> -->
