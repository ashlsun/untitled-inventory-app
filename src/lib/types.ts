import { type Dayjs } from 'dayjs';

export type StoredItem = {
	id: string;
	name: string;
	quantity: number;
	dateAdded: Dayjs;
	shelfLife: number;
};
