import type { Dayjs } from 'dayjs'

export interface StoredItem {
  id: string
  name: string
  quantity: number
  dateAdded: Dayjs
  shelfLife: number
}
