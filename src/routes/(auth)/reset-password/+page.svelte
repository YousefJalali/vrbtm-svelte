<script lang="ts">
  import { enhance } from '$app/forms'

  export let form
  let submitting: boolean
</script>

<div class="prose">
  <h1>Reset Password</h1>

  {#if form?.success}
    <p>Reset link is sent to your email</p>
  {:else}
    <form
      method="post"
      use:enhance={() => {
        submitting = true

        return async ({ update }) => {
          await update()
          submitting = false
        }
      }}
    >
      <fieldset class="[&>label]:mb-6" disabled={submitting}>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text"></span>
          </div>
          <input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            class="input input-bordered w-full"
          />
          {#if form?.message}
            <div class="label">
              <span class="label-text-alt text-error">{form.message}</span>
            </div>
          {/if}
        </label>

        <button class="btn w-full btn-primary">
          {#if submitting}
            <span class="loading loading-spinner"></span> Sending...
          {:else}
            Send{/if}
        </button>
      </fieldset>
    </form>
  {/if}
</div>
