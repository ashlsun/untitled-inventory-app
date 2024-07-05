import { type Dayjs } from 'dayjs';

export type StoredItem = {
	id: string;
	name: string;
	quantity: number;
	dateAdded: string;
	shelfLife: number;
};
