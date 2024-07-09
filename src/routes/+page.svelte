<script lang="ts">
  import StoragePlace from '$lib/components/StoragePlace.svelte'

  let showTips = $state(false)
  let tips: HTMLDivElement | null = $state(null)

  $effect(() => {
    if (tips)
      tips.style.height = showTips ? `${tips.scrollHeight + 1}px` : '0px'
  })

// TODO: fix broken accordion on resize
</script>

<div class="m-2">
  <div class="flex w-full">
    <StoragePlace storagePlaceName="fridge" />

  </div>

  <div class="m-2 mt-12 max-w-sm">
    <h1>
      <b>Tips for users:</b>
      <span class="transition text-stone-400 hover:text-stone-500">
        (<button
          aria-label="{showTips ? 'Hide' : 'Show'} tips"
          class="decoration-1 underline-offset-2 underline"
          onclick={() => showTips = !showTips}>{showTips ? 'hide' : 'show'}
        </button>)
      </span>
    </h1>

    <div
      bind:this={tips}
      class="text-sm overflow-hidden text-stone-500 transition-all"
    >
      <p>This is a demo, so nothing here is saved.</p>
      <li>Click on an item to select it.</li>
      <li class="ml-5">
        Double click or press
        [<span class="icon tabler--arrow-back" aria-hidden="true"></span> <b>Enter</b>] to expand.
      </li>
      <li class="ml-5">
        [<span class="icon tabler--backspace" aria-hidden="true"></span> <b>Backspace</b>] to delete.
      </li>
      <li class="ml-5">
        [<span class="icon tabler--arrow-up" aria-hidden="true"></span> <b>Up</b>] or
        [<span class="icon tabler--arrow-down" aria-hidden="true"></span> <b>Down</b>] to select a different item.
      </li>
      <li class="ml-5">
        [<span class="icon tabler--arrow-left" aria-hidden="true"></span> <b>Left</b>] or
        [<span class="icon tabler--arrow-right" aria-hidden="true"></span> <b>Right</b>] to change the quantity.
      </li>

      <li>Click on an item's name to edit it.</li>
      <li class="ml-5">
        When editing, press
        [<span class="icon tabler--arrow-back" aria-hidden="true"></span> <b>Enter</b>] to save,
        [<b>Esc</b>] to cancel.
      </li>
    </div>
  </div>
</div>
