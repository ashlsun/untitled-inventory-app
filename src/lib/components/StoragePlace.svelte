<script lang="ts">
  import Item from '$lib/components/item/Item.svelte'
  import type { SortBy, StoredItem } from '$lib/types'
  import { itemStore } from '$lib/stores/item.svelte'

  // Props
  type Props = {
    storageName: string
  }

  const {
    storageName,
  }: Props = $props()

  // State
  let newItemName = $state('')
  let sortOption = $state<SortBy>('oldest')
  const storageOps = itemStore.storage(storageName)

  // Methods
  function addItem() {
    storageOps.importItem(newItemName)
    newItemName = ''
  }

  // Handlers
  function handleInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter')
      addItem()
  }

  function handleSort() {
    storageOps.sortItems(sortOption)
  }
</script>

<div
  class="rounded-sm border m-3 inline-block h-fit min-w-80 max-w-[420px] border-black p-1"
  role="tree"
>
  <div class="flex w-full justify-between items-center ">
    <h1>
      <b>{storageName}</b>
      <span class="text-stone-400">({storageOps.itemCount})</span>
    </h1>

    <div class="flex items-center">
      <span class="text-sm italic text-stone-500 mr-1">sort:</span>
      <select
        class="text-sm py-1 my-1 italic text-stone-500"
        bind:value={sortOption}
        onchange={handleSort}
      >
        <option value="oldest">oldest</option>
        <option value="newest">newest</option>
        <option value="a to z">a to z</option>
        <option value="z to a">z to a</option>
        <option value="quantity">quantity</option>
      </select>
    </div>

  </div>
  <div role="group">
    {#key sortOption}
      {#each itemStore.items[storageName] as item, i (item.id)}
        <Item
          bind:item={itemStore.items[storageName][i]}
          isSelected={itemStore.selected.storage === storageName && itemStore.selected.index === i}
          onSelected={(amount = 0) => {
            itemStore.selectItem(storageName, i + amount)
          }}
          onDelete={() => {
            storageOps.deleteItem(item.id)
          }}
          onUpdate={(updatedItem: StoredItem) => {
            storageOps.updateItem(updatedItem)
          }}
        />
      {/each}
    {/key}
  </div>
  {#if storageOps.itemCount === 0}
    <div class="text-stone-400">Nothing in the {storageName}.</div>
  {/if}
  <input
    class="rounded-sm border border-black px-1 transition mt-5 outline-emerald-600 placeholder:text-stone-400 placeholder:italic placeholder:text-sm"
    bind:value={newItemName}
    onkeypress={handleInputKeypress}
    maxlength="20"
    placeholder="Add a new item..."
  />
  <button
    class="transition hover:font-bold hover:text-emerald-700"
    onclick={addItem}
  >
    +
  </button>

</div>
