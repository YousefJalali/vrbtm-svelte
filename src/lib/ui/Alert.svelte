<script lang="ts">
	import { alerts } from '$lib/stores/alerts'
	import Svg from './Svg.svelte'
</script>

{#if alerts}
	<div class="absolute w-full md:w-fit px-4 top-2 left-1/2 -translate-x-1/2 z-50">
		<ul>
			{#each $alerts as alert (alert.id)}
				<li role="alert" class="alert alert-error flex">
					<Svg icon="error" />
					<span>{alert.message}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
