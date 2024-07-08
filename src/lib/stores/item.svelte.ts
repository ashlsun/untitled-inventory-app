import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { possibleItems } from '$lib/components/item/itemGenerator'
import { randomIntFromInterval } from '$lib/utils'
import type { StoredItem } from '$lib/types'
import { addFoodItem, deleteFoodItem, getFoodItems, updateFoodItem } from '$lib/db'

export interface ItemStore { readonly list: StoredItem[], add: (name: string) => void, delete: (id: string) => void, readonly selected: number, select: (i: number) => void }

export async function createItemStore() {
  const foodItems = await getFoodItems('fridge')
  console.log(foodItems)

  const storedFoodItems = foodItems.map(foodItem => ({ id: foodItem.id, name: foodItem.name, quantity: foodItem.quantity, dateAdded: foodItem.date_added, shelfLife: 5 }))
  const list = $state<StoredItem[]>(storedFoodItems)
  let selected = $state(-1)

  return {
    get list() {
      return list
    },
    add(input: string) {
      if (input === '')
        return

      const id = uuid()

      const itemList = input.split(' ')
      let itemName: string
      let itemQuantity: number

      if (itemList.length > 1 && itemList[0].match(/^\d+$/)) {
        itemName = input.slice(itemList[0].length).trim()
        itemQuantity = Math.min(Number(itemList[0]), 99)
      }
      else {
        itemName = input
        itemQuantity = 1
      }

      const newItem = {
        id,
        dateAdded: dayjs().format('YYYY-MM-DD'),
        name: itemName,
        quantity: itemQuantity,
        shelfLife: 5,
      }

      list.push(newItem)
      addFoodItem(id, itemName, itemQuantity, 'fridge')

      selected = list.length
    },
    update(id: string, name: string, quantity: number, dateAdded: string) {
      // currently not connected. not sure how to do it with bindable item?
      updateFoodItem(id, name, quantity, dateAdded)
    },
    delete(id: string) {
      deleteFoodItem(id)
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

// function getRandomItems(
//   itemList: StoredItem[] = possibleItems,
//   minItems = 3,
//   maxItems = 10,
// ) {
//   // Determine the number of items to select
//   const numItems = randomIntFromInterval(minItems, maxItems)

//   // Array to hold our selected items
//   const selectedItems = []

//   // Select random items
//   for (let i = 0; i < numItems && itemList.length > 0; i++) {
//     const randomIndex = Math.floor(Math.random() * itemList.length)
//     selectedItems.push(itemList[randomIndex])
//     itemList.splice(randomIndex, 1)
//   }

//   return selectedItems
// }
