<script lang="ts">
	import { alerts } from '$lib/stores/alerts'

	const icons = {
		error: `<svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
	}
</script>

{#if alerts}
	<div class="absolute w-full md:w-fit px-4 top-2 left-1/2 -translate-x-1/2 z-50">
		<ul>
			{#each $alerts as alert (alert.id)}
				<li role="alert" class="alert alert-error flex">
					{@html icons.error}
					<span>{alert.message}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
