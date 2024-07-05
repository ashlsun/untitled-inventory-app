<script lang="ts">
  import dayjs from 'dayjs'
  import Item from '$lib/components/item/Item.svelte'
  import { createItemStore } from '$lib/stores/item.svelte'

  // Props
  const { storagePlaceName }: { storagePlaceName: string } = $props()

  // State
  const items = createItemStore()
  let newItemName = $state('')

  // Handlers
  function addItem() {
    items.add(newItemName)
    newItemName = ''
  }

  function editNewItem(event: Event) {
    const target = event.target as HTMLInputElement
    newItemName = target.value
  }

  function handleInputKeypress(event: KeyboardEvent) {
    editNewItem(event)
    if (event.key === 'Enter')
      addItem()
  }
</script>

<div
  class="rounded-sm border m-3 inline-block h-fit min-w-80 max-w-[420px] border-black p-1"
  role="tree"
>
  <h1 class="font-bold">{storagePlaceName} <span class="text-stone-400">({items.list.length})</span></h1>
  <div role="group">
    {#each items.list as item, i (item.id)}
      <Item
        bind:item={items.list[i]}
        isSelected={items.selected === i}
        onSelected={(amount = 0) => {
          items.select(i + amount)
        }}
        onQuantityChange={(quantity) => {
          if (quantity < 1) {
            items.delete(item.id)
            return
          }

          item.quantity = quantity
        }}
        onChangeDate={(date) => {
          try {
            item.dateAdded = dayjs(date).format('YYYY-MM-DD')
          }
          catch {
            console.log('ok')
          }
        }}
        onDelete={items.delete}
      />
    {/each}
  </div>
  {#if items.list.length === 0}
    <div class="text-stone-400">Nothing in the {storagePlaceName}.</div>
  {/if}

  <input
    class="rounded-sm border border-black px-1 transition mt-5 outline-emerald-600 placeholder:text-stone-400"
    value={newItemName}
    onkeypress={handleInputKeypress}
    maxlength="20"
  />
  <button
    class="transition hover:font-bold hover:text-emerald-700"
    onclick={addItem}
  >
    +
  </button>
</div>
