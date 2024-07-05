import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { possibleItems } from '$lib/components/item/itemGenerator'
import { randomIntFromInterval } from '$lib/utils'
import type { StoredItem } from '$lib/types'

export function createItemStore() {
  const list = $state<StoredItem[]>(getRandomItems())
  let selected = $state(-1)

  return {
    get list() {
      return list
    },
    add(name: string) {
      if (name === '')
        return

      const itemList = name.split(' ')
      if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
        list.push({
          id: uuid(),
          dateAdded: dayjs().format('YYYY-MM-DD'),
          name: name.slice(itemList[0].length).trim(),
          quantity: Number(itemList[0]),
          shelfLife: 5,
        })
      }
      else {
        list.push({
          id: uuid(),
          dateAdded: dayjs().format('YYYY-MM-DD'),
          name,
          quantity: 1,
          shelfLife: 5,
        })
      }

      selected = list.length
    },
    delete(id: string) {
      const index = list.findIndex(item => item.id === id)

      if (index !== -1) {
        list.splice(index, 1)
        if (selected >= list.length)
          selected = Math.max(0, list.length - 1)
      }
    },
    get selected() {
      return selected
    },
    select(i: number) {
      if (i < 0)
        selected = 0
      else if (i >= list.length)
        selected = list.length - 1
      else
        selected = i
    },
  }
}

function getRandomItems(
  itemList: StoredItem[] = possibleItems,
  minItems = 3,
  maxItems = 10,
) {
  // Determine the number of items to select
  const numItems = randomIntFromInterval(minItems, maxItems)

  // Array to hold our selected items
  const selectedItems = []

  // Select random items
  for (let i = 0; i < numItems && itemList.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemList.length)
    selectedItems.push(itemList[randomIndex])
    itemList.splice(randomIndex, 1)
  }

  return selectedItems
}
