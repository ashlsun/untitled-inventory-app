<script lang="ts">
  import Item from '$lib/components/item/Item.svelte'
  import { type StoredItem } from '$lib/db'
  import { type ItemStore } from '$lib/stores/item.svelte'

  // Props
  type Props = {
    storagePlaceName: string
    items: ItemStore | null
  }

  const {
    storagePlaceName,
    items,
  }: Props = $props()

  // State
  let newItemName = $state('')
  let sortOption = $state('oldest')

  // Methods
  function addItem() {
    if (items)
      items.add(newItemName)
    newItemName = ''
  }

  // Handlers
  function handleInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter')
      addItem()
  }
</script>

<div
  class="rounded-sm border m-3 inline-block h-fit min-w-80 max-w-[420px] border-black p-1"
  role="tree"
>
  <div class="flex w-full justify-between items-center ">
    <h1><b>{storagePlaceName}</b>
      {#if items} <span class="text-stone-400">({items.list.length})</span> {/if}
    </h1>

    <div class="flex items-center">
      <span class="text-sm italic text-stone-500 mr-1">sort:</span>
      <select
        class="text-sm py-1 my-1 italic text-stone-500"
        bind:value={sortOption}
        onchange={() => {
          console.log(sortOption)
          if (items)
            items.sortBy(sortOption)
        }}
      >
        <option value="oldest">oldest</option>
        <option value="newest">newest</option>
        <option value="a to z">a to z</option>
        <option value="z to a">z to a</option>

      </select>
    </div>

  </div> {#if items}
    {@const store = items}
    <div role="group">
      {#each items.list as item, i (item.id)}
        <Item
          bind:item={items.list[i]}
          isSelected={items.selected === i}
          onSelected={(amount = 0) => {
            store.select(i + amount)
          }}
          onDelete={() => {
            store.delete(item.id)
          }}
          onUpdate={(updatedItem: StoredItem) => {
            store.update(item.id, updatedItem)
          }}
        />
      {/each}
    </div>
    {#if items.list.length === 0}
      <div class="text-stone-400">Nothing in the {storagePlaceName}.</div>
    {/if}
  {:else}
    <p class="text-stone-400">Loading...</p>
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
