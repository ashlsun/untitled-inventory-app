import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import type { StoredItem } from '$lib/types'
import { randomIntFromInterval } from '$lib/utils'

export const possibleItems = [
  {
    id: uuid(),
    name: 'milk',
    quantity: 1,
    dateAdded: dayjs().subtract(100, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',
  },
  {
    id: uuid(),
    name: 'eggs',
    quantity: 12,
    dateAdded: dayjs().subtract(16, 'day').format('YYYY-MM-DD'),
    shelfLife: 35,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'choy sum',
    quantity: 2,
    dateAdded: dayjs().subtract(12, 'day').format('YYYY-MM-DD'),
    shelfLife: 5,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'bananas',
    quantity: 6,
    dateAdded: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'apples',
    quantity: 4,
    dateAdded: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    shelfLife: 14,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'tomatoes',
    quantity: 5,
    dateAdded: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'lettuce',
    quantity: 1,
    dateAdded: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'carrots',
    quantity: 8,
    dateAdded: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    shelfLife: 21,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'broccoli',
    quantity: 2,
    dateAdded: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'cucumber',
    quantity: 3,
    dateAdded: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'strawberries',
    quantity: 1,
    dateAdded: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    shelfLife: 5,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'potatoes',
    quantity: 6,
    dateAdded: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
    shelfLife: 28,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'onions',
    quantity: 4,
    dateAdded: dayjs().subtract(20, 'day').format('YYYY-MM-DD'),
    shelfLife: 30,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'bell peppers',
    quantity: 3,
    dateAdded: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'grapes',
    quantity: 1,
    dateAdded: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'avocados',
    quantity: 2,
    dateAdded: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    shelfLife: 5,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'mushrooms',
    quantity: 8,
    dateAdded: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'zucchini',
    quantity: 2,
    dateAdded: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'oranges',
    quantity: 6,
    dateAdded: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
    shelfLife: 14,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'spinach',
    quantity: 1,
    dateAdded: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    shelfLife: 5,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'lemons',
    quantity: 4,
    dateAdded: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    shelfLife: 21,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'green beans',
    quantity: 1,
    dateAdded: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'cauliflower',
    quantity: 1,
    dateAdded: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    shelfLife: 7,
    storage: 'fridge',

  },
  {
    id: uuid(),
    name: 'dumplings',
    quantity: 1,
    dateAdded: dayjs().subtract(40, 'day').format('YYYY-MM-DD'),
    shelfLife: 300,
    storage: 'freezer',

  },
  {
    id: uuid(),
    name: 'peas',
    quantity: 1,
    dateAdded: dayjs().subtract(9, 'day').format('YYYY-MM-DD'),
    shelfLife: 600,
    storage: 'freezer',

  },
  {
    id: uuid(),
    name: 'bread',
    quantity: 1,
    dateAdded: dayjs().subtract(9, 'day').format('YYYY-MM-DD'),
    shelfLife: 100,
    storage: 'freezer',

  },
  {
    id: uuid(),
    name: 'chocolate ice cream',
    quantity: 1,
    dateAdded: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    shelfLife: 600,
    storage: 'freezer',
  },
  {
    id: uuid(),
    name: 'vanilla ice cream',
    quantity: 1,
    dateAdded: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    shelfLife: 600,
    storage: 'freezer',
  },
] satisfies StoredItem[]

export function getRandomItems(
  itemList: StoredItem[] = possibleItems,
  minItems = 3,
  maxItems = 10,
) {
  // Determine the number of items to select
  const numItems = randomIntFromInterval(minItems, maxItems)

  // Array to hold our selected items
  const selectedItems = []

  // Select random items
  for (let i = 0; i < numItems && itemList.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemList.length)
    selectedItems.push(itemList[randomIndex])
    itemList.splice(randomIndex, 1)
  }

  return selectedItems
}
