import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import type { SortBy, StoredItem } from '$lib/types'
import { db } from '$lib/db'

type AddItem = Pick<StoredItem, 'name'> & Partial<Omit<StoredItem, 'name'>>
type UpdateItem = Pick<StoredItem, 'id'> & Partial<Omit<StoredItem, 'id'>>

export interface ItemStore {
  storages: string[]
  items: Record<string, StoredItem[]>
  selected: { storage: string, index: number }
  storageCount: number
  itemCount: (storage: string) => number
  getItemById: (storage: string, id: string) => StoredItem | undefined
  getItemByName: (storage: string, name: string) => StoredItem | undefined
  addStorage: (storage: string) => Promise<void>
  removeStorage: (storage: string) => Promise<void>
  addItem: (storage: string, item: AddItem) => Promise<void>
  deleteItem: (storage: string, id: string) => Promise<void>
  updateItem: (storage: string, item: UpdateItem) => Promise<void>
  importItem: (storage: string, input: string) => Promise<void>
  moveItem: (fromStorage: string, toStorage: string, id: string) => Promise<void>
  selectItem: (storage: string, index: number) => void
  sortItems: (storage: string, sortBy: SortBy) => void
}

export const itemStore = createItemStore()

function createItemStore(): ItemStore {
  const items = $state<Record<string, StoredItem[]>>({})
  const storages = $derived(Object.keys(items))
  let selected = $state<{ storage: string, index: number }>({ storage: '', index: -1 })

  async function loadInitialData() {
    const storedItems = await db.foodItems.toArray()

    storedItems.forEach((item) => {
      if (!items[item.storage])
        items[item.storage] = []

      items[item.storage].push(item)
    })
  }

  loadInitialData()

  return {
    get storages() {
      return storages
    },
    get items() {
      return items
    },
    get selected() {
      return selected
    },
    get storageCount() {
      return storages.length
    },
    itemCount(storage: string) {
      return items[storage]?.length ?? 0
    },
    getItemById(storage: string, id: string) {
      return items[storage]?.find(item => item.id === id)
    },
    getItemByName(storage: string, name: string) {
      return items[storage]?.find(item => item.name === name)
    },
    async addStorage(storage: string) {
      if (!storages.includes(storage)) {
        storages.push(storage)
        items[storage] = []
        await db.foodItems.where('storage').equals(storage).toArray()
      }
    },
    async removeStorage(storage: string) {
      const index = storages.indexOf(storage)
      if (index !== -1) {
        storages.splice(index, 1)
        delete items[storage]
        await db.foodItems.where('storage').equals(storage).delete()
      }
    },
    async addItem(storage: string, item: AddItem) {
      if (!storages.includes(storage))
        await this.addStorage(storage)

      const existing = this.getItemByName(storage, item.name)
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + (item.quantity ?? 0))
        await this.updateItem(storage, existing)
      }
      else {
        const newItem: StoredItem = {
          ...item,
          id: uuid(),
          quantity: Math.min(99, item.quantity ?? 1),
          dateAdded: item.dateAdded ?? dayjs().format('YYYY-MM-DD'),
          shelfLife: item.shelfLife ?? 1,
          storage: item.storage ?? storage,
        }

        await db.foodItems.add(newItem)
        items[storage].push(newItem)
      }
    },
    async updateItem(storage: string, item: UpdateItem) {
      if (items[storage]) {
        const existing = this.getItemById(storage, item.id)
        if (existing) {
          Object.assign(existing, item)
          await db.foodItems.update(item.id, item)
        }
      }
    },
    async importItem(storage: string, input: string) {
      if (input === '')
        return

      let name = input
      let quantity = 1

      const itemList = input.split(' ')
      if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
        name = input.slice(itemList[0].length).trim()
        quantity = Number(itemList[0])
      }

      await this.addItem(storage, { name, quantity })
    },
    async deleteItem(storage: string, id: string) {
      if (items[storage]) {
        const index = items[storage].findIndex(item => item.id === id)
        if (index !== -1) {
          items[storage].splice(index, 1)
          await db.foodItems.delete(id)
        }
      }
    },
    async moveItem(fromStorage: string, toStorage: string, id: string) {
      const item = this.getItemById(fromStorage, id)
      if (item) {
        await this.deleteItem(fromStorage, id)
        item.storage = toStorage
        await this.addItem(toStorage, item)
      }
    },
    selectItem(storage: string, index: number) {
      const storageIndex = storages.indexOf(storage)
      if (index < 0) {
        // Move to the previous storage or to the last storage if it's the first one
        const newStorageIndex = storageIndex - 1 < 0 ? storages.length - 1 : storageIndex - 1
        const newStorage = storages[newStorageIndex]
        selected = { storage: newStorage, index: items[newStorage].length - 1 }
      }
      else if (index >= items[storage].length) {
        // Move to the next storage or to the first storage if it's the last one
        const newStorageIndex = (storageIndex + 1) % storages.length
        const newStorage = storages[newStorageIndex]
        selected = { storage: newStorage, index: 0 }
      }
      else {
        // Stay within the current storage
        selected = { storage, index }
      }
    },
    sortItems(storage: string, sortBy: SortBy) {
      if (items[storage]) {
        items[storage].sort((a, b) => {
          switch (sortBy) {
            case 'a to z':
              return a.name.localeCompare(b.name)
            case 'z to a':
              return b.name.localeCompare(a.name)
            case 'quantity':
              return b.quantity - a.quantity
            case 'oldest':
              return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            case 'newest':
              return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            default:
              return 0
          }
        })
      }
    },
  }
}
