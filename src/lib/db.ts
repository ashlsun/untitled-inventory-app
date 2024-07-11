import Dexie, { type Table } from 'dexie'
import type { StoredItem } from './types'

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

export const db = new FoodInventoryDatabase()
