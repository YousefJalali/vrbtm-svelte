<script>
	import { page } from '$app/stores'
	import Logo from './Logo.svelte'
	import Svg from './Svg.svelte'

	$: isFlashcardsVisible = $page.url.pathname.split('/')[3] === 'f'
</script>

<header
	class="lg:hidden max-w-none border-b flex items-center justify-between lg:justify-center p-4"
>
	<label for="nav-drawer" class="btn btn-ghost btn-circle btn-sm drawer-button lg:hidden">
		<Svg icon="burger" />
	</label>

	<div class="h-[36px] lg:h-[48px]"><Logo /></div>

	<!-- href={`${$page.url.pathname}/f`} -->
	<a
		href={isFlashcardsVisible ? `/n/${$page.params.notebookId}` : `${$page.url.pathname}/f`}
		class="btn btn-ghost btn-circle btn-sm drawer-button lg:hidden"
	>
		<Svg icon="window" />
	</a>
	<!-- <label for="flashcards-drawer" class="btn btn-ghost btn-sm -mr-2 drawer-button lg:hidden">
			{@html card}
		</label> -->
</header>
