<script lang="ts">
  import { enhance } from '$app/forms'

  export let form

  let submitting: boolean
</script>

<div class="prose">
  <h1>New Password</h1>

  {#if form?.success}
    <p>Password Changed Successfully!</p>
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
            <span class="label-text">New Password</span>
          </div>
          <input
            name="password"
            type="password"
            placeholder="Enter Your New Password"
            class="input input-bordered w-full"
          />
          {#if form?.message}
            <div class="label">
              <span class="label-text-alt text-error">{form.message}</span>
            </div>
          {/if}
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Confirm Password</span>
          </div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-Enter Your New Password"
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
            <span class="loading loading-spinner"></span> Updating...
          {:else}
            Update{/if}</button
        >
      </fieldset>
    </form>
  {/if}
</div>
