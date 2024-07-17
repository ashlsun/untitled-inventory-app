import { type RenderResult, cleanup, fireEvent, render, within } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StoragePlace from './StoragePlace.svelte'
import { itemStore } from '$lib/stores/item.svelte'
import { localDb } from '$lib/db'

vi.mock('$lib/db', () => ({
  localDb: {
    storage: {
      getSort: vi.fn().mockReturnValue('none'),
      setSort: vi.fn(),
      rename: vi.fn(),
    },
  },
}))

const mockStorageOperations = {
  addItem: vi.fn(),
  deleteItem: vi.fn(),
  updateItem: vi.fn(),
  sortItems: vi.fn(),
  getItemById: vi.fn(),
  getItemByName: vi.fn(),
}

vi.mock('$lib/stores/item.svelte', () => {
  return {
    itemStore: {
      items: {},
      itemCounts: {},
      selected: {},
      selectItem: vi.fn(),
      updateStorage: vi.fn(),
      storage: vi.fn(() => mockStorageOperations),
    },
  }
})

describe('storagePlace Component', () => {
  const mockStorageName = 'TestStorage'
  let component: RenderResult<StoragePlace>

  beforeEach(() => {
    vi.resetAllMocks()

    itemStore.items[mockStorageName] = []
    itemStore.itemCounts[mockStorageName] = 0

    vi.mocked(itemStore.storage).mockReturnValue({
      ...mockStorageOperations,
    })

    component = render(StoragePlace, { props: { storageName: mockStorageName } })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the storage correctly', () => {
    const { getByRole, getByText, getByPlaceholderText } = component

    expect(getByText(mockStorageName)).toBeTruthy()

    const sortDropdown = getByRole('listbox')
    expect(sortDropdown).toBeTruthy()

    const input = getByPlaceholderText('Add a new item...')
    expect(input).toBeTruthy()
  })

  it('displays the correct item count and message when empty', () => {
    const { getByText } = component
    expect(getByText('(0)')).toBeTruthy()
    expect(getByText(`Nothing in the ${mockStorageName}.`)).toBeTruthy()
  })

  it('displays the correct item count when items exist', () => {
    itemStore.itemCounts[mockStorageName] = 42
    component = render(StoragePlace, { props: { storageName: mockStorageName } })
    const { getByText } = component
    expect(getByText('(42)')).toBeTruthy()
  })

  it('adds a new item when pressing Enter in the input field', async () => {
    const { getByPlaceholderText } = component
    const input = getByPlaceholderText('Add a new item...')
    await fireEvent.input(input, { target: { value: 'New Item' } })
    await fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(itemStore.storage(mockStorageName).addItem).toHaveBeenCalledWith({ name: 'New Item', quantity: 1 })
  })

  it('adds a new item with quantity when input format is "2 New Item"', async () => {
    const { getByPlaceholderText } = component
    const input = getByPlaceholderText('Add a new item...')
    await fireEvent.input(input, { target: { value: '2 New Item' } })
    await fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(itemStore.storage(mockStorageName).addItem).toHaveBeenCalledWith({ name: 'New Item', quantity: 2 })
  })

  it('clears the input field after adding an item', async () => {
    const { getByPlaceholderText } = component
    const input = getByPlaceholderText('Add a new item...') as HTMLInputElement
    await fireEvent.input(input, { target: { value: 'New Item' } })
    await fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(input.value).toBe('')
  })

  it('changes the sort option when selecting from the dropdown', async () => {
    const { getByRole } = component
    const sortDropdown = getByRole('listbox')
    await fireEvent.change(sortDropdown, { target: { value: 'newest' } })
    expect(localDb.storage.setSort).toHaveBeenCalledWith(mockStorageName, 'newest')
    expect(itemStore.storage(mockStorageName).sortItems).toHaveBeenCalledWith('newest')
  })

  it('renders items when they exist in the store', async () => {
    cleanup()
    itemStore.items[mockStorageName] = [
      { id: '1', name: 'Item 1', quantity: 1, dateAdded: '2024-01-01', shelfLife: 1, storage: mockStorageName },
      { id: '2', name: 'Item 2', quantity: 1, dateAdded: '2024-01-02', shelfLife: 1, storage: mockStorageName },
    ]
    itemStore.itemCounts[mockStorageName] = 2
    component = render(StoragePlace, { props: { storageName: mockStorageName } })
    const { getByText } = component
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })

  it('allows editing the storage name', async () => {
    const { getByLabelText } = component
    const nameElement = getByLabelText('storage name')
    await fireEvent.input(nameElement, { target: { textContent: 'New Storage Name' } })
    await fireEvent.keyDown(nameElement, { key: 'Enter', code: 'Enter' })
    expect(itemStore.updateStorage).toHaveBeenCalledWith(mockStorageName, 'New Storage Name')
    expect(localDb.storage.rename).toHaveBeenCalledWith(mockStorageName, 'New Storage Name')
  })
})
