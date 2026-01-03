<script lang="ts">
  import type { AuthStore } from '$lib/stores/auth.svelte'

  type Props = {
    auth: AuthStore
  }

  const { auth }: Props = $props()

  let emailInput = $state('')
  let otpInput = $state('')
  let isSubmitting = $state(false)

  async function handleSendOtp(event: Event) {
    event.preventDefault()
    if (!emailInput || isSubmitting)
      return

    isSubmitting = true
    await auth.sendOtp(emailInput)
    isSubmitting = false
  }

  async function handleVerifyOtp(event: Event) {
    event.preventDefault()
    if (!otpInput || isSubmitting)
      return

    isSubmitting = true
    await auth.verifyOtp(otpInput)
    isSubmitting = false
  }
</script>

<div class="m-3 max-w-sm">
  {#if auth.state === 'loading'}
    <p class="text-stone-400 italic">Loading...</p>
  {:else if auth.state === 'unauthenticated'}
    <form onsubmit={handleSendOtp}>
      <h1 class="mb-2"><b>Sign in</b></h1>
      <p class="text-sm text-stone-500 mb-3">Enter your email to receive a one-time code.</p>
      <div class="flex items-center gap-2">
        <input
          type="email"
          bind:value={emailInput}
          placeholder="you@example.com"
          required
          class="border border-black rounded-sm px-2 py-1 min-w-[200px] outline-emerald-600 placeholder:text-stone-400 placeholder:italic placeholder:text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting || !emailInput}
          class="transition hover:font-bold hover:text-emerald-600 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '...' : 'send code'}
        </button>
      </div>
      {#if auth.error}
        <p class="text-red-600 text-sm mt-2">{auth.error}</p>
      {/if}
    </form>
  {:else if auth.state === 'awaiting_otp'}
    <form onsubmit={handleVerifyOtp}>
      <h1 class="mb-2"><b>Enter code</b></h1>
      <p class="text-sm text-stone-500 mb-3">
        We sent a 6-digit code to <span class="italic">{auth.email}</span>
      </p>
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={otpInput}
          placeholder="123456"
          maxlength="6"
          pattern="[0-9]*"
          inputmode="numeric"
          required
          class="border border-black rounded-sm px-2 py-1 w-24 text-center tracking-widest outline-emerald-600 placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={isSubmitting || otpInput.length !== 6}
          class="transition hover:font-bold hover:text-emerald-600 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '...' : 'verify'}
        </button>
      </div>
      {#if auth.error}
        <p class="text-red-600 text-sm mt-2">{auth.error}</p>
      {/if}
      <button
        type="button"
        onclick={() => { otpInput = ''; emailInput = ''; auth.signOut() }}
        class="text-sm text-stone-400 hover:text-stone-600 mt-3 underline underline-offset-2 decoration-1"
      >
        use a different email
      </button>
    </form>
  {/if}
</div>
