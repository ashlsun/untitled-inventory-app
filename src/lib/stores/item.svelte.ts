import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import type { SortBy, StoredItem } from '$lib/types'
import { db } from '$lib/db'

type AddItem = Pick<StoredItem, 'name'> & Partial<Omit<StoredItem, 'name'>>
type UpdateItem = Pick<StoredItem, 'id'> & Partial<Omit<StoredItem, 'id'>>

export interface ItemStore {
  items: Record<string, StoredItem[]>
  storages: string[]
  itemCounts: Record<string, number>
  storageCount: number
  selected: { storage: string, index: number }
  addStorage: (storage: string) => Promise<void>
  removeStorage: (storage: string) => Promise<void>
  updateStorage: (storage: string, newStorage: string) => Promise<void>
  moveItem: (fromStorage: string, toStorage: string, id: string) => Promise<void>
  selectItem: (storage: string, index: number) => void
  storage: (storageName: string) => StorageOperations
}

interface StorageOperations {
  getItemById: (id: string) => StoredItem | undefined
  getItemByName: (name: string) => StoredItem | undefined
  addItem: (item: AddItem) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  updateItem: (item: UpdateItem) => Promise<void>
  sortItems: (sortBy: SortBy) => void
}

export const itemStore = createItemStore()

function createItemStore(): ItemStore {
  const items = $state<Record<string, StoredItem[]>>({})
  const storages = $derived(Object.keys(items))
  const itemCounts = $derived.by(() => {
    const counts: Record<string, number> = {}
    for (const storage of storages)
      counts[storage] = items[storage]?.length ?? 0
    return counts
  })
  const storageCount = $derived(storages.length)
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

  const store: ItemStore = {
    get items() { return items },
    get storages() { return storages },
    get itemCounts() { return itemCounts },
    get storageCount() { return storageCount },
    get selected() { return selected },
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
    async updateStorage(storage: string, newStorage: string) {
      const storageItems = items[storage]
      for (const item of storageItems) {
        item.storage = newStorage
        await db.foodItems.update(item.id, item)
      }
      items[newStorage] = items[storage]
      delete items[storage]
    },
    async moveItem(fromStorage: string, toStorage: string, id: string) {
      const item = this.storage(fromStorage).getItemById(id)
      if (item) {
        await this.storage(fromStorage).deleteItem(id)
        item.storage = toStorage
        await this.storage(toStorage).addItem(item)
      }
    },
    selectItem(storage: string, index: number) {
      const storageIndex = storages.indexOf(storage)
      if (index < 0) {
        const newStorageIndex = storageIndex - 1 < 0 ? storages.length - 1 : storageIndex - 1
        const newStorage = storages[newStorageIndex]
        selected = { storage: newStorage, index: items[newStorage].length - 1 }
      }
      else if (index >= items[storage].length) {
        const newStorageIndex = (storageIndex + 1) % storages.length
        const newStorage = storages[newStorageIndex]
        selected = { storage: newStorage, index: 0 }
      }
      else {
        selected = { storage, index }
      }
    },
    storage(storageName: string): StorageOperations {
      return {
        getItemById: (id: string) => items[storageName]?.find(item => item.id === id),
        getItemByName: (name: string) => items[storageName]?.find(item => item.name === name),
        async addItem(item: AddItem) {
          if (!storages.includes(storageName))
            await store.addStorage(storageName)

          const existing = this.getItemByName(item.name)
          if (existing) {
            existing.quantity = Math.min(99, existing.quantity + (item.quantity ?? 0))
            await this.updateItem(existing)
          }
          else {
            const newItem: StoredItem = {
              ...item,
              id: uuid(),
              quantity: Math.min(99, item.quantity ?? 1),
              dateAdded: item.dateAdded ?? dayjs().format('YYYY-MM-DD'),
              shelfLife: item.shelfLife ?? 1,
              storage: storageName,
            }

            await db.foodItems.add(newItem)
            items[storageName].push(newItem)
          }
        },
        async deleteItem(id: string) {
          if (items[storageName]) {
            const index = items[storageName].findIndex(item => item.id === id)
            if (index === -1)
              return

            items[storageName].splice(index, 1)

            if (items[storageName].length === 0)
              items[storageName] = []

            await db.foodItems.delete(id)
          }
        },
        async updateItem(item: UpdateItem) {
          if (items[storageName]) {
            const existing = this.getItemById(item.id)
            if (existing) {
              Object.assign(existing, item)
              await db.foodItems.update(item.id, item)
            }
          }
        },
        sortItems(sortBy: SortBy) {
          if (items[storageName]) {
            let selectedId: string | undefined

            if (selected.index !== -1)
              selectedId = items[storageName][selected.index]?.id

            items[storageName].sort((a, b) => {
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

            if (selected.index !== -1) {
              const selectedIndex = items[storageName].findIndex(item => item.id === selectedId)
              selected = { storage: storageName, index: selectedIndex }
            }
          }
        },
      }
    },
  }

  return store
}
