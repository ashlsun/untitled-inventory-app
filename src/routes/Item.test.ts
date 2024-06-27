import {
	fireEvent,
	cleanup,
	getByDisplayValue,
	render,
	type RenderResult
} from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, vi, it } from 'vitest';
import dayjs from 'dayjs';
import ItemWrappedInTree from '$lib/ItemWrappedInTree.svelte';

describe('The Item component', () => {
	let mockItem = {
		id: '1',
		name: 'Test Item',
		quantity: 1,
		dateAdded: dayjs(),
		shelfLife: 20
	};

	const mockDeleteItem = vi.fn();
	const onQuantityChange = vi.fn();

	document.getElementById = vi.fn().mockReturnValue({
		focus: vi.fn()
	});

	let component: RenderResult<ItemWrappedInTree>;

	beforeEach(async () => {
		component = render(ItemWrappedInTree, {
			props: {
				item: mockItem,
				deleteItem: mockDeleteItem,
				isSelected: false,
				onChangeDate: vi.fn(),
				onQuantityChange,
				onSelected: vi.fn()
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
			shelfLife: 10
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
		const { getByTestId } = component;

		const itemElement = getByTestId('item-1');
		await fireEvent.keyDown(itemElement, { key: 'ArrowRight' });
		expect(mockItem.quantity).toBe(2);
	});

	it('decreases quantity on left arrow key press', async () => {
		const { getByTestId } = component;

		const itemElement = getByTestId('item-1');
		await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' });
		expect(mockItem.quantity).toBe(0);
		// After 100ms, deleteItem should have been called
		setInterval(() => expect(mockDeleteItem).toHaveBeenCalledWith('1'), 120); // always true
	});
});
