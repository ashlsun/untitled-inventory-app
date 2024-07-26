import Dexie, { type Table } from 'dexie'
import type { SortBy, StoredItem } from './types'

export interface CommonItem {
  id: string
  name: string
}

export interface ShelfLife {
  id: string
  itemId: number
  storage: string
  duration: number
  durationUnit: string
}

class FoodInventoryDatabase extends Dexie {
  foodItems!: Table<StoredItem>
  commonItems!: Table<CommonItem>
  shelfLives!: Table<ShelfLife>

  constructor() {
    super('FoodInventoryDatabase')
    this.version(1).stores({
      foodItems: 'id, name, storage, dateAdded',
      commonItems: 'id, name',
      shelfLives: 'id, itemId, storage',
    })
  }
}

type SortStorage = {
  storage: string
  sortBy: SortBy
}[]

class LocalStorageDatabase {
  private getTable<T>(tableName: string): T {
    const tableJson = localStorage.getItem(tableName)
    return tableJson ? JSON.parse(tableJson) : []
  }

  private setTable<T>(tableName: string, data: T) {
    localStorage.setItem(tableName, JSON.stringify(data))
  }

  constructor() {
    if (!localStorage.getItem('sortOptions'))
      this.setTable<SortStorage>('sortOptions', [])
  }

  public storage = {
    add: (storage: string) => {
      const sortOptions = this.getTable<SortStorage>('sortOptions')
      sortOptions.push({ storage, sortBy: 'none' })
      this.setTable('sortOptions', sortOptions)
    },
    getSort: (storage: string) => {
      const sortOptions = this.getTable<SortStorage>('sortOptions')
      const storageSort = sortOptions.find(sort => sort.storage === storage)
      return storageSort ? storageSort.sortBy : 'none'
    },
    setSort: (storage: string, sortBy: SortBy) => {
      const sortOptions = this.getTable<SortStorage>('sortOptions')
      const storageSort = sortOptions.find(sort => sort.storage === storage)
      if (storageSort)
        storageSort.sortBy = sortBy
      else
        sortOptions.push({ storage, sortBy })

      this.setTable('sortOptions', sortOptions)
    },
    rename: (oldName: string, newName: string) => {
      const sortOptions = this.getTable<SortStorage>('sortOptions')
      const storageSort = sortOptions.find(sort => sort.storage === oldName)
      if (storageSort)
        storageSort.storage = newName

      this.setTable('sortOptions', sortOptions)
    },
  }
}

export const db = new FoodInventoryDatabase()
export const localDb = new LocalStorageDatabase()
