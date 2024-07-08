<script lang="ts">
  import Item from '$lib/components/item/Item.svelte'
  import { type ItemStore, createItemStore } from '$lib/stores/item.svelte'

  // Props
  const { storagePlaceName }: { storagePlaceName: string } = $props()

  // State
  let items = $state< ItemStore | null>()
  let newItemName = $state('')
  let isLoading = $state(true)

  $effect(() => {
    createItemStore().then((itemStore) => {
      items = itemStore
      isLoading = false
    })
  })

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
  <h1 class="font-bold">{storagePlaceName}
    {#if items}
      <span class="text-stone-400">({items.list.length})</span>
    {/if}
  </h1>
  {#if isLoading || !items}
    <p>Loading</p>
  {:else}
    <div role="group">
      {#each items.list as item, i (item.id)}
        <Item
          bind:item={items.list[i]}
          isSelected={items.selected === i}
          onSelected={(amount = 0) => {
            if (items)
              items.select(i + amount)
          }}
          onDelete={items.delete}
        />
      {/each}
    </div>

    {#if items.list.length === 0}
      <div class="text-stone-400">Nothing in the {storagePlaceName}.</div>
    {/if}
  {/if}

  <input
    class="rounded-sm border border-black px-1 transition mt-5 outline-emerald-600 placeholder:text-stone-400"
    bind:value={newItemName}
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
