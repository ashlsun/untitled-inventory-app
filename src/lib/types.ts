export interface StoredItem {
  id: string
  name: string
  quantity: number
  dateAdded: string
  shelfLife: number
  storage: string
}

export type SortBy = 'oldest' | 'newest' | 'a to z' | 'z to a' | 'quantity'
