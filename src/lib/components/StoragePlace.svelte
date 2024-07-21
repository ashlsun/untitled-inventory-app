<script lang="ts">
  import { untrack } from 'svelte'
  import Item from '$lib/components/item/Item.svelte'
  import type { SortBy, StoredItem } from '$lib/types'
  import { sortBy } from '$lib/types'
  import { itemStore } from '$lib/stores/item.svelte'
  import { localDb } from '$lib/db'

  // Props
  type Props = {
    storageName: string
  }

  const {
    storageName,
  }: Props = $props()

  // State
  let newItemInput = $state('')
  let sortOption = $state<SortBy>(localDb.storage.getSort(storageName))
  let previousStorageName = storageName
  const storageOps = $derived(itemStore.storage(storageName))

  // Reactive declarations
  $effect(() => {
    if (localDb.storage.getSort(storageName) !== sortOption)
      localDb.storage.setSort(storageName, sortOption)

    untrack(() => storageOps.sortItems(sortOption))
  })

  // Methods
  function inputItem() {
    if (newItemInput === '')
      return

    let name = newItemInput
    let quantity = 1

    const itemList = newItemInput.split(' ')
    if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
      name = newItemInput.slice(itemList[0].length).trim()
      quantity = Number(itemList[0])
    }
    storageOps.addItem({ name, quantity })
    sortOption = 'none'
    newItemInput = ''
    itemStore.clearSelected()
  }

  // Handlers
  function handleInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter')
      inputItem()
  }

  function handleSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value as SortBy
    console.log('sortOption', value)
    sortOption = value
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter')
      return

    const target = event.target as HTMLElement
    event.preventDefault()
    itemStore.updateStorage(previousStorageName, target.textContent || '')
    localDb.storage.rename(previousStorageName, target.textContent || '')
    previousStorageName = target.textContent || ''
    target.blur()
  }
</script>

<div
  class="rounded-sm border m-3 inline-block h-fit min-w-80 max-w-[420px] border-black p-1"
  role="tree"
>
  <div class="flex w-full justify-between items-center ">
    <h1>
      <span
        contenteditable
        role="textbox"
        aria-label="storage name"
        aria-multiline="false"
        tabindex="0"
        onkeydown={handleEnter}
      >
        <b>{storageName}</b>
      </span>
      <span class="text-stone-400">({itemStore.itemCounts[storageName]})</span>
    </h1>

    <div class="flex items-center">
      <span class="text-sm italic text-stone-500 mr-1">sort:</span>
      <select
        class="text-sm py-1 my-1 italic text-stone-500"
        role="listbox"
        bind:value={sortOption}
        onchange={handleSort}
      >
        {#each sortBy as sort}
          <option value={sort} hidden={sort === 'none'}>{sort}</option>
        {/each}
      </select>
    </div>

  </div>
  <div role="group">
    {#each itemStore.items[storageName] as item, i (item.id)}
      <Item
        bind:item={itemStore.items[storageName][i]}
        isSelected={itemStore.selected.storage === storageName && itemStore.selected.index === i}
        onSelected={(amount = 0) => {
          itemStore.selectItem(storageName, i + amount)
        }}
        onDelete={() => {
          storageOps.deleteItem(item.id)
          if (i === itemStore.items[storageName].length)
            itemStore.selectItem(storageName, i - 1)
        }}
        onUpdate={(updatedItem: StoredItem) => {
          storageOps.updateItem(updatedItem)
        }}
      />
    {/each}
  </div>
  {#if itemStore.itemCounts[storageName] === 0}
    <div class="text-stone-400">Nothing in the {storageName}.</div>
  {/if}
  <input
    class="rounded-sm border border-black px-1 transition mt-5 outline-emerald-600 placeholder:text-stone-400 placeholder:italic placeholder:text-sm"
    bind:value={newItemInput}
    onkeypress={handleInputKeypress}
    maxlength="20"
    placeholder="Add a new item..."
  />
  <button
    class="transition hover:font-bold hover:text-emerald-700"
    onclick={inputItem}
  >
    +
  </button>

</div>
