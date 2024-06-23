import {
	render,
	fireEvent,
	cleanup,
	type RenderResult,
	getByDisplayValue
} from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import Item from './Item.svelte';

describe('The Item component', () => {
	let mockItem = {
		id: '1',
		name: 'Test Item',
		quantity: 1,
		dateAdded: dayjs(),
		daysToSpoil: 20
	};

	const mockDeleteItem = vi.fn();

	document.getElementById = vi.fn().mockReturnValue({
		focus: vi.fn()
	});

	let component: RenderResult<Item>;

	beforeEach(() => {
		component = render(Item, {
			props: {
				item: mockItem,
				deleteItem: mockDeleteItem,
				selected: false
			}
		});
	});

	afterEach(() => {
		cleanup();

		// reset mock item
		mockItem = {
			id: '1',
			name: 'Test Item',
			quantity: 1,
			dateAdded: dayjs(),
			daysToSpoil: 10
		};

		vi.clearAllMocks();
	});

	it('renders correctly', () => {
		const { getByText, getByDisplayValue } = component;

		expect(getByText(/Test Item/)).toBeTruthy();
		expect(getByDisplayValue('1')).toBeTruthy();
		expect(getByText('delete')).toBeTruthy();
	});

	it('calls deleteItem when delete button is clicked', async () => {
		const { getByText } = component;

		await fireEvent.click(getByText('delete'));
		expect(mockDeleteItem).toHaveBeenCalledWith('1');
	});

	it('increases quantity on right arrow key press', async () => {
		const { getByRole } = component;

		const itemElement = getByRole('tree');
		await fireEvent.keyDown(itemElement, { key: 'ArrowRight' });
		expect(mockItem.quantity).toBe(2);
	});

	it('decreases quantity on left arrow key press', async () => {
		const { getByRole } = component;

		const itemElement = getByRole('tree');
		await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' });
		expect(mockItem.quantity).toBe(0);
		// After 100ms, deleteItem should have been called
		setInterval(() => expect(mockDeleteItem).toHaveBeenCalledWith('1'), 120);
	});
});
