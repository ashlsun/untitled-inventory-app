// import { type RenderResult, cleanup, fireEvent, render } from '@testing-library/svelte'
// import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// import StoragePlace from './StoragePlace.svelte'

// function getMockItem() {
//   return {
//     id: '1',
//     name: 'Test Item',
//     quantity: 2,
//     dateAdded: '2000-01-02',
//     shelfLife: 20,
//     storage: 'fridge',
//   }
// }

// describe('the Item component', () => {
//   let mockItem = getMockItem()

//   const mockDeleteItem = vi.fn()

//   document.getElementById = vi.fn().mockReturnValue({
//     focus: vi.fn(),
//   })

//   let component: RenderResult<ItemWrappedInTree>

//   beforeEach(async () => {
//     component = render(ItemWrappedInTree, {
//       props: {
//         item: mockItem,
//         onDelete: mockDeleteItem,
//         isSelected: false,
//         onSelected: vi.fn(),
//         onUpdate: vi.fn(),
//       },
//     })
//   })

//   afterEach(() => {
//     cleanup()
//     mockItem = getMockItem()
//     vi.clearAllMocks()
//   })

//   it('renders correctly', () => {
//     const { getByText, getByDisplayValue } = component

//     expect(getByText(/Test Item/)).toBeTruthy()
//     expect(getByDisplayValue('2')).toBeTruthy()
//     expect(getByText('delete')).toBeTruthy()
//   })
// })
