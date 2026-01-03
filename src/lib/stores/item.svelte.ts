import dayjs from 'dayjs'
import type { StoredItem } from '$lib/types'
import { supabase, type FoodItemRow, type FoodItemInsert, type FoodItemUpdate } from '$lib/supabase'

export interface ItemStore {
  readonly list: StoredItem[]
  readonly loading: boolean
  add: (name: string) => Promise<void>
  delete: (id: string) => Promise<void>
  readonly selected: number
  select: (i: number) => void
  update: (id: string, item: StoredItem) => Promise<void>
  importItem: (item: StoredItem) => Promise<void>
}

// Map from Supabase snake_case to our camelCase
function mapFromDb(row: FoodItemRow): StoredItem {
  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    dateAdded: row.date_added,
    storage: row.storage,
    shelfLife: row.shelf_life,
  }
}

export async function createItemStore(storagePlaceName: string, userId: string): Promise<ItemStore> {
  const list = $state<StoredItem[]>([])
  let selected = $state(-1)
  let loading = $state(true)

  // Initial fetch
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('storage', storagePlaceName)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching items:', error)
  }
  else if (data) {
    list.push(...data.map(mapFromDb))
  }
  loading = false

  // Subscribe to real-time changes
  const channel = supabase
    .channel(`food_items_${storagePlaceName}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'food_items',
        filter: `storage=eq.${storagePlaceName}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newItem = mapFromDb(payload.new as Parameters<typeof mapFromDb>[0])
          // Only add if not already in list (we may have optimistically added it)
          if (!list.find(item => item.id === newItem.id)) {
            list.push(newItem)
          }
        }
        else if (payload.eventType === 'UPDATE') {
          const updatedItem = mapFromDb(payload.new as Parameters<typeof mapFromDb>[0])
          const index = list.findIndex(item => item.id === updatedItem.id)
          if (index !== -1) {
            list[index] = updatedItem
          }
        }
        else if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as { id: string }).id
          const index = list.findIndex(item => item.id === deletedId)
          if (index !== -1) {
            list.splice(index, 1)
            if (selected >= list.length) {
              selected = Math.max(0, list.length - 1)
            }
          }
        }
      },
    )
    .subscribe()

  return {
    get list() {
      return list
    },
    get loading() {
      return loading
    },
    async add(input: string) {
      if (input === '')
        return

      let name = input
      let quantity = 1

      const itemList = input.split(' ')
      if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
        name = input.slice(itemList[0].length).trim()
        quantity = Math.min(Number(itemList[0]), 99)
      }

      const insertData: FoodItemInsert = {
        user_id: userId,
        name,
        quantity,
        date_added: dayjs().format('YYYY-MM-DD'),
        shelf_life: 5,
        storage: storagePlaceName,
      }

      const { data, error } = await supabase
        .from('food_items')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error adding item:', error)
        return
      }

      // Optimistically add to list (real-time will dedupe)
      if (data) {
        const newItem = mapFromDb(data)
        if (!list.find(item => item.id === newItem.id)) {
          list.push(newItem)
        }
        selected = list.length - 1
      }
    },

    async importItem(item: StoredItem) {
      if (item.storage !== storagePlaceName)
        throw new Error(`Imported item's storage ${item.storage} did not match destination ${storagePlaceName}`)

      const insertData: FoodItemInsert = {
        user_id: userId,
        name: item.name,
        quantity: item.quantity,
        date_added: item.dateAdded,
        shelf_life: item.shelfLife,
        storage: item.storage,
      }

      const { data, error } = await supabase
        .from('food_items')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error importing item:', error)
        return
      }

      if (data) {
        const newItem = mapFromDb(data)
        if (!list.find(i => i.id === newItem.id)) {
          list.push(newItem)
        }
        selected = list.length - 1
      }
    },

    async delete(id: string) {
      // Optimistically remove from list
      const index = list.findIndex(item => item.id === id)
      if (index !== -1) {
        list.splice(index, 1)
        if (selected >= list.length) {
          selected = Math.max(0, list.length - 1)
        }
      }

      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting item:', error)
      }
    },

    async update(id: string, item: StoredItem) {
      // Optimistically update in list
      const index = list.findIndex(i => i.id === id)
      if (index !== -1) {
        list[index] = item
      }

      const updateData: FoodItemUpdate = {
        name: item.name,
        quantity: item.quantity,
        date_added: item.dateAdded,
        shelf_life: item.shelfLife,
        storage: item.storage,
      }

      const { error } = await supabase
        .from('food_items')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating item:', error)
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
