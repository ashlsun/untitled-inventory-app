<script lang="ts" context="module">
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import updateLocale from 'dayjs/plugin/updateLocale'
  import { stopPropagation } from '$lib/utils'
  import { type StoredItem } from '$lib/types'

  export type Props = {
    item: StoredItem
    isSelected: boolean
  }

  export type Events = {
    onSelected: (index?: number) => void
    onDelete: () => void
    onUpdate: (item: StoredItem) => void
  }
</script>

<script lang="ts">
  const {
    item = $bindable(),
    isSelected,
    onSelected,
    onDelete,
    onUpdate,
  }: Props & Events = $props()

  // State
  let isExpanded = $state(false)
  let isEditingName = $state(false)
  let draftName = $state(item.name)
  let draftShelfLife = $state(item.shelfLife)
  let draftDateAdded = $state(item.dateAdded)

  // DOM nodes
  let itemDiv: HTMLDivElement
  let itemNameInput: HTMLSpanElement
  let childrenDiv: HTMLDivElement
  let dateAddedInput: HTMLInputElement

  // Reactive declarations
  const daysTilSpoil = $derived(
    dayjs(item.dateAdded).add(item.shelfLife, 'day').diff(dayjs(), 'day'),
  )

  $effect(() => {
    if (isSelected)
      itemDiv.focus()
    else
      isExpanded = false
  })

  // Dayjs configuration
  dayjs.extend(relativeTime)
  dayjs.extend(updateLocale)
  dayjs.updateLocale('en', {
    relativeTime: {
      future: '%s',
      past: '%s',
      s: 'now',
      m: 'now',
      mm: 'now',
      h: 'today',
      hh: 'today',
      d: '1d',
      dd: '%dd',
      M: '1mo',
      MM: '%dmo',
      y: '1yr',
      yy: '%dyrs',
    },
  })

  // Methods
  function changeDate() {
    item.dateAdded = dayjs(draftDateAdded).format('YYYY-MM-DD')
    onUpdate(item)
  }

  function changeQuantity(quantity: number) {
    if (quantity < 1) {
      onDelete()
      return
    }

    item.quantity = quantity
    onUpdate(item)
  }

  // Handlers
  function handleKeyDownOnName(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      item.name = draftName
      onUpdate(item)
      isEditingName = false
      itemNameInput.blur()
    }
    else if (event.key === 'Escape') {
      draftName = item.name
      isEditingName = false
      itemNameInput.blur()
    }
    else if (
      // enforce 20 character maximum
      draftName.length >= 20
      && event.key !== 'Backspace'
      && event.key !== 'Delete'
      && event.key !== 'ArrowUp'
      && event.key !== 'ArrowDown'
      && event.key !== 'ArrowRight'
      && event.key !== 'ArrowLeft'
      && !document.getSelection()?.toString()
    ) {
      event.preventDefault()
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const clipboardText = event.clipboardData?.getData('text') || ''
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const contentBefore = itemNameInput.textContent?.slice(0, range.startOffset) ?? ''
    const contentAfter = itemNameInput.textContent?.slice(range.endOffset) ?? ''

    const spaceAvailable = 20 - (contentBefore.length + contentAfter.length)
    const textToInsert = clipboardText.slice(0, spaceAvailable)
    range.deleteContents()

    const textNode = document.createTextNode(textToInsert)
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.setEndAfter(textNode)
    selection.removeAllRanges()
    selection.addRange(range)

    draftName = (contentBefore + textToInsert + contentAfter).slice(0, 20)
  }

  function handleKeyDownOnItem(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      return

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (isExpanded) {
        isExpanded = false
        setTimeout(() => onDelete(), 70)
      }
      else {
        onDelete()
      }
    }
    else if (event.key === 'Enter') {
      isExpanded = !isExpanded
    }
    else if (event.key === 'ArrowUp') {
      onSelected(-1)
    }
    else if (event.key === 'ArrowDown') {
      onSelected(1)
    }
    else if (event.key === 'ArrowRight') {
      changeQuantity(item.quantity + 1)
    }
    else if (event.key === 'ArrowLeft') {
      changeQuantity(item.quantity - 1)
    }
    else {
      console.log(event)
    }
  }

  function handleDateAddedKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      changeDate()
    }
    else if (event.key === 'Escape') {
      draftDateAdded = item.dateAdded
      dateAddedInput.blur()
    }
  }

  function handleQuantityInputChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.value === '0')
      setTimeout(() => onDelete(), 100)

    if (target.value === '') {
      target.value = '0'
      setTimeout(() => onDelete(), 300)
    }
    changeQuantity(Number(target.value))
  }
</script>

<div
  bind:this={itemDiv}
  id={item.id}
  data-testid="item-{item.id}"
  class="transition select-none rounded-sm px-2 pt-[0.5px] focus:outline-none
    {isSelected ? 'bg-yellow-200' : ''}
    {isExpanded ? 'pb-2' : ''}"
  tabindex="-1"
  role="treeitem"
  aria-selected={isSelected}
  aria-expanded={isExpanded}
  onfocus={() => onSelected()}
  onkeydown={event => handleKeyDownOnItem(event)}
  onclick={(event) => {
    // to remove the caret/selection inserted at itemNameInput
    if (event.target !== itemNameInput)
      itemNameInput.blur()
  }}
  ondblclick={() => {
    isExpanded = !isExpanded
  }}
  onblur={() => {
    draftName = item?.name
    isEditingName = false
  }}
>
  <div class="flex justify-between">
    <span>
      <input
        bind:value={item.quantity}
        type="number"
        min="0"
        max="99"
        class="focus:outline-none decoration-1 stealth max-w-12 text-center underline-offset-1 focus:underline"
        onkeydown={stopPropagation()}
        ondblclick={stopPropagation()}
        onchange={handleQuantityInputChange}
      />

      <span
        bind:this={itemNameInput}
        bind:textContent={draftName}
        role="textbox"
        tabindex="-1"
        contenteditable
        class="rounded-sm decoration-1 focus:outline-none underline-offset-2
          {isEditingName && 'underline'}"
        onkeydown={stopPropagation(handleKeyDownOnName)}
        onpaste={handlePaste}
        onclick={() => {
          isEditingName = true
        }}
        ondblclick={stopPropagation()}
      >
        {isEditingName ? draftName : item.name}
      </span>
    </span>

    <span>
      <span
        class="italic mix-blend-multiply
          {daysTilSpoil < 1
            ? 'text-red-500'
            : daysTilSpoil < 2
            ? 'text-orange-500'
            : daysTilSpoil < 3
            ? 'text-yellow-500'
            : ' text-stone-400'}">{dayjs(item.dateAdded).fromNow()}
      </span>
      <button
        class="transition items-end hover:text-red-600"
        onclick={() => {
          onDelete()
        }}
      >delete
      </button>
    </span>
  </div>
  <div
    bind:this={childrenDiv}
    role="group"
    aria-hidden={!isExpanded}
    class="mix-blend-multiply text-sm overflow-y-hidden bg-[#f3f1fd] px-3
      {isExpanded ? 'rounded-sm border-dashed border-stone-400' : ''}"
    style="transition: all 0.1s ease-in-out;
      height: {isExpanded ? `${childrenDiv?.scrollHeight + 1}px` : '0px'};"
  >
    <div role="treeitem" aria-selected="false">
      Edit date added:
      <input
        bind:this={dateAddedInput}
        type="date"
        class="rounded-sm border-1 my-1 border border-dashed border-stone-400 px-1"
        bind:value={draftDateAdded}
        onkeydown={stopPropagation(handleDateAddedKeydown)}
        ondblclick={stopPropagation()}
        onblur={changeDate}
      />
    </div>
    <div role="treeitem" aria-selected="false">
      Edit shelf life:
      <input
        type="number"
        class="border-1 max-w-12 border border-dashed border-stone-400 text-center always-display-spinner sm mb-1 ml-3 w-fit rounded"
        bind:value={draftShelfLife}
        onkeydown={stopPropagation()}
        ondblclick={stopPropagation()}
        onblur={() => {
          item.shelfLife = draftShelfLife
          onUpdate(item)
        }}
      />
      days
    </div>
  </div>
</div>
