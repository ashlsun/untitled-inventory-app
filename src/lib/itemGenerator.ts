import { v7 as uuid } from 'uuid';
import dayjs, { Dayjs } from 'dayjs';
import { randomIntFromInterval } from './utils';

export const possibleItems = [
	{
		id: uuid(),
		name: 'milk',
		quantity: 1,
		dateAdded: dayjs().subtract(100, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'eggs',
		quantity: 12,
		dateAdded: dayjs().subtract(16, 'day'),
		daysToSpoil: 35
	},
	{
		id: uuid(),
		name: 'choy sum',
		quantity: 2,
		dateAdded: dayjs().subtract(12, 'day'),
		daysToSpoil: 5
	},
	{
		id: uuid(),
		name: 'bananas',
		quantity: 6,
		dateAdded: dayjs().subtract(2, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'apples',
		quantity: 4,
		dateAdded: dayjs().subtract(7, 'day'),
		daysToSpoil: 14
	},
	{
		id: uuid(),
		name: 'tomatoes',
		quantity: 5,
		dateAdded: dayjs().subtract(2, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'lettuce',
		quantity: 1,
		dateAdded: dayjs().subtract(4, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'carrots',
		quantity: 8,
		dateAdded: dayjs().subtract(10, 'day'),
		daysToSpoil: 21
	},
	{
		id: uuid(),
		name: 'broccoli',
		quantity: 2,
		dateAdded: dayjs().subtract(3, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'cucumber',
		quantity: 3,
		dateAdded: dayjs().subtract(5, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'strawberries',
		quantity: 1,
		dateAdded: dayjs().subtract(1, 'day'),
		daysToSpoil: 5
	},
	{
		id: uuid(),
		name: 'potatoes',
		quantity: 6,
		dateAdded: dayjs().subtract(14, 'day'),
		daysToSpoil: 28
	},
	{
		id: uuid(),
		name: 'onions',
		quantity: 4,
		dateAdded: dayjs().subtract(20, 'day'),
		daysToSpoil: 30
	},
	{
		id: uuid(),
		name: 'bell peppers',
		quantity: 3,
		dateAdded: dayjs().subtract(4, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'grapes',
		quantity: 1,
		dateAdded: dayjs().subtract(2, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'avocados',
		quantity: 2,
		dateAdded: dayjs().subtract(1, 'day'),
		daysToSpoil: 5
	},
	{
		id: uuid(),
		name: 'mushrooms',
		quantity: 8,
		dateAdded: dayjs().subtract(10, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'zucchini',
		quantity: 2,
		dateAdded: dayjs().subtract(5, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'oranges',
		quantity: 6,
		dateAdded: dayjs().subtract(8, 'day'),
		daysToSpoil: 14
	},
	{
		id: uuid(),
		name: 'spinach',
		quantity: 1,
		dateAdded: dayjs().subtract(2, 'day'),
		daysToSpoil: 5
	},
	{
		id: uuid(),
		name: 'lemons',
		quantity: 4,
		dateAdded: dayjs().subtract(10, 'day'),
		daysToSpoil: 21
	},
	{
		id: uuid(),
		name: 'green beans',
		quantity: 1,
		dateAdded: dayjs().subtract(3, 'day'),
		daysToSpoil: 7
	},
	{
		id: uuid(),
		name: 'cauliflower',
		quantity: 1,
		dateAdded: dayjs().subtract(4, 'day'),
		daysToSpoil: 7
	}
];

export function getRandomItems(
	itemList: {
		id: string;
		name: string;
		quantity: number;
		dateAdded: Dayjs;
		daysToSpoil: number;
	}[] = possibleItems,
	minItems = 3,
	maxItems = 10
) {
	// Determine the number of items to select
	const numItems = randomIntFromInterval(minItems, maxItems);

	// Array to hold our selected items
	let selectedItems = [];

	// Select random items
	for (let i = 0; i < numItems && itemList.length > 0; i++) {
		const randomIndex = Math.floor(Math.random() * itemList.length);
		selectedItems.push(itemList[randomIndex]);
		itemList.splice(randomIndex, 1);
	}

	return selectedItems;
}