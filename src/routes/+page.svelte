<script lang="ts">
  import { v7 as uuid } from 'uuid'
  import type { StoredItem } from '$lib/types'
  import { getRandomItems, possibleItems } from '$lib/components/item/itemGenerator'
  import StoragePlace from '$lib/components/StoragePlace.svelte'
  import { type ItemStore, createItemStore } from '$lib/stores/item.svelte'
  import { encodeImage } from '$lib/imageUtils'
  import { getPromptText } from '$lib/promptText'

  let showTips = $state(false)
  let tips: HTMLDivElement | null = $state(null)

  let fridgeItems: ItemStore | null = $state(null)
  let freezerItems: ItemStore | null = $state(null)

  let numRandomItemsToAdd = $state(3)
  let selectedStoragePlace = $state('fridge')
  let openAiKey = $state('')
  let isOpenAiKeyVisible = $state(false)

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

    // TODO: fix broken accordion on resize
    if (tips)
      tips.style.height = showTips ? `${tips.scrollHeight + 1}px` : '0px'
  })

  let selectedFile: File | null = null
  let isProcessingReceipt = $state(false)
  let errorProcessingReceipt = $state(false)

  async function sendImageToOpenAI(base64Image: string) {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions'
    const api_key = openAiKey

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    }

    const existingInventory = JSON.stringify(fridgeItems?.list)
    const payload = {
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: getPromptText(existingInventory),
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok)
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`)

    console.log(response)
    return response.json()
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length !== 1) {
      console.log('files does not have 1 elem')
      return
    }

    const file = files[0]
    if (!file)
      return

    selectedFile = target.files?.[0] || null
  }

  async function handleUpload() {
    if (!selectedFile)
      return

    try {
      isProcessingReceipt = true
      errorProcessingReceipt = false
      const base64Image = await encodeImage(selectedFile) // Function to encode image to base64

      // Send image data and prompt to OpenAI
      const response = await sendImageToOpenAI(base64Image)

      const content = response.choices[0].message.content
      console.log(content)

      try {
        const json_content = JSON.parse(content)
        console.log(json_content)
        const json_items = json_content.items
        console.log(json_items)
        const itemsWithIdsAdded = json_items.map(
          (extractedItem: { name: string, quantity: number, shelfLife: number }) => {
            console.log('processing', JSON.stringify(extractedItem))
            const processedItem = JSON.parse(JSON.stringify(extractedItem))
            if (processedItem.id === 'to be generated') {
              processedItem.id = uuid()
              console.log('new item', processedItem)
            }
            else {
              console.log('existing item', processedItem)
            }
            processedItem.storage = 'fridge'
            return processedItem
          },
        )

        console.log(itemsWithIdsAdded)
        itemsWithIdsAdded.map((item: StoredItem) => fridgeItems?.importItem(item))
      }
      catch (e) {
        console.log('darn couldn\'t parse', e)
        errorProcessingReceipt = true
      }

      console.log('OpenAI Response:', response) // Example: Log response from OpenAI
      isProcessingReceipt = false
    }
    catch (error) {
      console.error('Error uploading image:', error)
      isProcessingReceipt = false
      errorProcessingReceipt = true
    }
  }

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
        class="transition hover:font-bold hover:text-emerald-600"
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

  <div class="m-2 mt-5 text-sm">
    <b>DEMO FEATURE:</b>
    <i>Add items via a photo of your receipt:</i>
    <div class="ml-4">
      <div>
        <input name="openaikey" class="border border-black border-1 rounded-sm min-w-[200px] px-1 placeholder:text-xs placeholder:italic placeholder:text-stone-400 my-2 outline-emerald-600" type={isOpenAiKeyVisible ? 'text' : 'password'} bind:value={openAiKey} placeholder="Paste your OpenAI key...">
        <button class="hover:text-emerald-600 transition" onclick={() => isOpenAiKeyVisible = !isOpenAiKeyVisible}>{#if isOpenAiKeyVisible}<span class="icon tabler--eye-off" aria-hidden="true"></span>{:else}<span class="icon tabler--eye" aria-hidden="true"></span>{/if}</button>
      </div>
      <div class="flex items-center text-xs mb-2">
        <input type="file" accept="image/*" class="disabled:cursor-not-allowed disabled:text-stone-400" onchange={handleFileSelect} disabled={openAiKey === ''} />
        <button class="transition hover:font-bold disabled:cursor-not-allowed enabled:hover:text-emerald-600 text-base" disabled={openAiKey === ''} onclick={handleUpload}
        >+</button
        >
      </div>
      {#if isProcessingReceipt}
        <div class="italic">One moment while receipt is being processed...</div>
      {:else if errorProcessingReceipt}
        <div class="text-red-800">Dang! An error occurred :(</div>
      {/if}

    </div>

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
