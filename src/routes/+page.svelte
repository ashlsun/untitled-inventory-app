<script lang="ts">
  import { getRandomItems, possibleItems } from '$lib/components/item/itemGenerator'
  import StoragePlace from '$lib/components/StoragePlace.svelte'
  import { type ItemStore, createItemStore } from '$lib/stores/item.svelte'

  let showTips = $state(false)
  let tips: HTMLDivElement | null = $state(null)

  let fridgeItems: ItemStore | null = $state(null)
  let freezerItems: ItemStore | null = $state(null)

  let numRandomItemsToAdd = $state(3)
  let selectedStoragePlace = $state('fridge')

  $effect(() => {
    createItemStore('fridge').then(
      (itemStore) => {
        fridgeItems = itemStore
      },
    )

    createItemStore('freezer').then(
      (itemStore) => {
        freezerItems = itemStore
      },
    )

    if (tips)
      tips.style.height = showTips ? `${tips.scrollHeight + 1}px` : '0px'
  })

// TODO: fix broken accordion on resize
</script>

<div class="m-2">
  <div class="flex w-full">
    <StoragePlace storagePlaceName="fridge"
                  items={fridgeItems} />
    <StoragePlace storagePlaceName="freezer"
                  items={freezerItems} />

  </div>
  <div class="m-2 text-sm">
    <b>DEMO FEATURE:</b>
    <span class="italic">
      Add
      <input type="number" min="1" max="5" bind:value={numRandomItemsToAdd} class="max-w-8 italic always-display-spinner" />
      random item{numRandomItemsToAdd !== 1 ? 's' : ''} to the

      <select name="storage place" id="storageplaceselect" bind:value={selectedStoragePlace}>
        <option value="fridge">fridge</option>
        <option value="freezer">freezer</option>
      </select>
      <button
        class="transition hover:font-bold hover:text-emerald-700"
        onclick={() => {
          // TODO: broken when adding more items after everything has already been added once
          const randomItemList = getRandomItems(possibleItems.filter(item => (item.storage === selectedStoragePlace)), numRandomItemsToAdd, numRandomItemsToAdd)
          if (selectedStoragePlace === 'fridge')
            randomItemList.map(item => fridgeItems?.importItem(item))
          else if (selectedStoragePlace === 'freezer')
            randomItemList.map(item => freezerItems?.importItem(item))
        }}
      >
        +
      </button>
    </span>
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
      <p>This is a demo. Nothing is saved on a server. </p>
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
