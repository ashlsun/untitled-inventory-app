import { type RenderResult, cleanup, fireEvent, render } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ItemWrappedInTree from './ItemWrappedInTree.svelte'

function getMockItem() {
  return {
    id: '1',
    name: 'Test Item',
    quantity: 2,
    dateAdded: '2000-01-02',
    shelfLife: 20,
    storage: 'fridge',
  }
}

describe('the Item component', () => {
  let mockItem = getMockItem()

  const mockDeleteItem = vi.fn()

  document.getElementById = vi.fn().mockReturnValue({
    focus: vi.fn(),
  })

  let component: RenderResult<ItemWrappedInTree>

  beforeEach(async () => {
    component = render(ItemWrappedInTree, {
      props: {
        item: mockItem,
        onDelete: mockDeleteItem,
        isSelected: false,
        isExpanded: false,
        onToggleExpanded: vi.fn(),
        onSelected: vi.fn(),
        onUpdate: vi.fn(),
      },
    })
  })

  afterEach(() => {
    cleanup()
    mockItem = getMockItem()
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const { getByText, getByDisplayValue, getByTitle } = component

    expect(getByText(/Test Item/)).toBeTruthy()
    expect(getByDisplayValue('2')).toBeTruthy()
    expect(getByTitle('delete')).toBeTruthy()
  })

  it('increases quantity on right arrow key press', async () => {
    const { getByTestId } = component

    const itemElement = getByTestId('item-1')
    await fireEvent.keyDown(itemElement, { key: 'ArrowRight' })
    expect(mockItem.quantity).toBe(3)
  })

  it('decreases quantity on left arrow key press', async () => {
    const { getByTestId } = component

    const itemElement = getByTestId('item-1')
    await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' })
    expect(mockItem.quantity).toBe(1)
  })

  it('calls deleteItem when left arrow key is pressed and quantity becomes 0', async () => {
    const { getByTestId } = component

    const itemElement = getByTestId('item-1')
    await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' })
    await fireEvent.keyDown(itemElement, { key: 'ArrowLeft' })
    expect(mockDeleteItem).toHaveBeenCalledOnce()
  })

  it('calls deleteItem when delete button is clicked', async () => {
    const { getByTitle } = component

    await fireEvent.click(getByTitle('delete'))
    expect(mockDeleteItem).toHaveBeenCalledOnce()
  })
})
