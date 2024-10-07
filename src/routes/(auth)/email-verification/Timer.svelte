<script lang="ts">
  import { addZero } from '$lib/utils'
  import { onMount } from 'svelte'

  export let now
  export let expiresAt: Date

  let diff = 0
  $: minutes =
    diff > 0 ? Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) : 0
  $: seconds = diff > 0 ? Math.floor((diff % (1000 * 60)) / 1000) : 0

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date().getTime()
      diff = expiresAt.getTime() - now

      if (diff <= 0) {
        console.log('interval cleared')
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<span>
  {#if minutes === 0 && seconds === 0}
    --:--
  {:else}
    {addZero(minutes)}:{addZero(seconds)}
  {/if}
</span>
