import { v7 as uuid } from 'uuid'
import dayjs from 'dayjs'
import type { StoredItem } from '$lib/types'

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
] satisfies StoredItem[]
