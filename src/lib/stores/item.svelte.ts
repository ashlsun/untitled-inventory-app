import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { possibleItems } from '$lib/components/item/itemGenerator'
import type { StoredItem } from '$lib/types'
import { db } from '$lib/db'

export interface ItemStore {
  readonly list: StoredItem[]
  add: (name: string) => void
  delete: (id: string) => void
  readonly selected: number
  select: (i: number) => void
  update: (id: string, item: StoredItem) => void
  importItem: (item: StoredItem) => void
}

export async function createItemStore(storagePlaceName: string) {
  const items = await db.foodItems.where('storage').equals(storagePlaceName).toArray()

  const list = $state<StoredItem[]>(items)
  let selected = $state(-1)

  return {
    get list() {
      return list
    },
    add(input: string) {
      if (input === '')
        return

      let name = input
      let quantity = 1

      const itemList = input.split(' ')
      if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
        name = input.slice(itemList[0].length).trim()
        quantity = Math.min(Number(itemList[0]), 99)
      }

      const newItem: StoredItem = {
        id: uuid(), // Generate UUID here
        name,
        quantity,
        dateAdded: dayjs().format('YYYY-MM-DD'),
        shelfLife: 5,
        storage: storagePlaceName,
      }

      db.foodItems.add(newItem)
      list.push(newItem)
      selected = list.length
    },
    importItem(item: StoredItem) {
      if (item.storage !== storagePlaceName)
        throw new Error(`Imported item's storage ${item.storage} did not match destination ${storagePlaceName}`)

      db.foodItems.add(item)
      list.push(item)
      selected = list.length
    },
    delete(id: string) {
      db.foodItems.delete(id)

      const index = list.findIndex(item => item.id === id)
      if (index !== -1) {
        list.splice(index, 1)
        if (selected >= list.length)
          selected = Math.max(0, list.length - 1)
      }
    },
    update(id: string, item: StoredItem) {
      db.foodItems.update(item.id, item)
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
