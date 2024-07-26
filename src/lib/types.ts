export interface StoredItem {
  id: string
  name: string
  quantity: number
  dateAdded: string
  shelfLife: number
  storage: string
}

export const sortBy = [
  'oldest',
  'newest',
  'a to z',
  'z to a',
  'quantity',
  'none',
] as const

export type SortBy = typeof sortBy[number]
