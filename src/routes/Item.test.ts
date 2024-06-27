import {
	fireEvent,
	cleanup,
	getByDisplayValue,
	render,
	type RenderResult
} from '@testing-library/svelte/svelte5';
import userEvent from '@testing-library/user-event';
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
	const user = userEvent.setup();

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

		await user.click(getByText('delete'));

		expect(mockDeleteItem).toHaveBeenCalledWith(mockItem.id);
		expect(component.getByText('Test Item')).toBeTruthy();
	});

	it('increases quantity on right arrow key press', async () => {
		const { getByTestId, container } = component;

		const itemElement = getByTestId('item-1');
		// await fireEvent.keyDown(itemElement, { key: 'ArrowRight' });
		await user.keyboard('{arrowright}');
		log(container.innerHTML);
		expect(container.querySelector('input')?.value).toBe('1'); // 2
	});

	it('decreases quantity on left arrow key press', async () => {
		const { getByTestId } = component;

		const itemElement = getByTestId('item-1');
		await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' });
	});
});

function log(html: string) {
	const tab = '  ';
	let formatted = '';
	let indent = '';

	html.split(/>\s*</).forEach((tag) => {
		if (tag.match(/^\/\w/)) {
			indent = indent.substring(tab.length);
		}
		formatted += indent + '<' + tag + '>\n';
		if (tag.match(/^<?\w[^>]*[^/]$/) && !tag.startsWith('input')) {
			indent += tab;
		}
	});

	console.log(formatted);
}
