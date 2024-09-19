<script lang="ts">
	import { goto } from '$app/navigation'
	import { notebooks } from '$lib/stores'
	import { onMount } from 'svelte'

	onMount(() => {
		goto(`/${Object.keys($notebooks)[0]}`)
	})
</script>
