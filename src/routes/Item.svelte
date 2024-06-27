<script lang="ts" context="module">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import updateLocale from 'dayjs/plugin/updateLocale';
	import { stopPropagation } from '$lib/utils';
	import { type StoredItem } from '$lib/types';

	export type Props = {
		item: StoredItem;
		deleteItem: (itemId: string) => void;
		isSelected: boolean;
	};

	export type Events = {
		onSelected: (index?: number) => void;
		onQuantityChange: (quantity: number) => void;
		onChangeDate: (date: string) => void;
	};
</script>

<script lang="ts">
	let { item, deleteItem, isSelected, onSelected, onQuantityChange, onChangeDate }: Props & Events =
		$props();

	// State
	let isExpanded = $state(false);
	let isEditingName = $state(false);
	let draftName = $state(item.name);
	let draftShelfLife = $state(item.shelfLife);
	let draftDateAdded = $state(item.dateAdded.format('YYYY-MM-DD'));

	// DOM nodes
	let itemDiv: HTMLDivElement;
	let itemNameInput: HTMLSpanElement;
	let itemQuantityInput: HTMLInputElement;
	let childrenDiv: HTMLDivElement;
	let dateAddedInput: HTMLInputElement;
	let shelfLifeInput: HTMLInputElement;

	// Reactive declarations
	let daysTilSpoil = $derived(item.dateAdded.add(item.shelfLife, 'day').diff(dayjs(), 'day'));

	$effect(() => {
		if (isSelected) {
			itemDiv.focus();
		} else {
			isExpanded = false;
		}
	});

	// Dayjs configuration
	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.updateLocale('en', {
		relativeTime: {
			future: '%s',
			past: '%s',
			s: 'now',
			m: 'now',
			mm: 'now',
			h: 'today',
			hh: 'today',
			d: '1d',
			dd: '%dd',
			M: '1mo',
			MM: '%dmo',
			y: '1yr',
			yy: '%dyrs'
		}
	});

	// Methods and handlers
	function handleKeyDownOnName(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			item.name = draftName;
			isEditingName = false;
			itemNameInput.blur();
		} else if (event.key === 'Escape') {
			draftName = item.name;
			isEditingName = false;
			itemNameInput.blur();
		} else if (
			// enforce 20 character maximum
			// TODO: truncate pasting
			draftName.length > 18 &&
			event.key !== 'Backspace' &&
			event.key !== 'Delete' &&
			!document.getSelection()?.toString()
		) {
			event.preventDefault();
		}
	}

	function handleKeyDownOnItem(event: KeyboardEvent, itemId: string) {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			if (isExpanded) {
				isExpanded = false;
				setTimeout(() => deleteItem(itemId), 70);
			} else {
				deleteItem(itemId);
			}
		} else if (event.key === 'Enter') {
			isExpanded = !isExpanded;
		} else if (event.key === 'ArrowUp') {
			onSelected(-1);
		} else if (event.key === 'ArrowDown') {
			onSelected(1);
		} else if (event.key === 'ArrowRight') {
			onQuantityChange(item.quantity + 1);
		} else if (event.key === 'ArrowLeft') {
			onQuantityChange(item.quantity - 1);
		} else {
			console.log(event);
		}
	}

	function handleDateAddedKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onChangeDate(draftDateAdded);
		} else if (event.key === 'Escape') {
			draftDateAdded = item.dateAdded.format('YYYY-MM-DD');
			dateAddedInput.blur();
		}
	}

	function handleQuantityInputChange(event: Event) {
		let target = event.target as HTMLInputElement;
		if (target.value === '0') {
			setTimeout(() => deleteItem(item.id), 100);
		}
		if (target.value === '') {
			target.value = '0';
			setTimeout(() => deleteItem(item.id), 300);
		}
	}
</script>

<div
	bind:this={itemDiv}
	id={item.id}
	data-testid="item-{item.id}"
	class="select-none rounded-sm px-2 pt-[0.5px] transition transition-margin focus:outline-none
		{isSelected ? 'bg-yellow-200' : ''}
		{isExpanded ? 'pb-2' : ''}"
	tabindex="-1"
	role="treeitem"
	aria-selected={isSelected}
	aria-expanded={isExpanded}
	onfocus={() => onSelected()}
	onkeydown={(event) => handleKeyDownOnItem(event, item.id)}
	onclick={(event) => {
		// to remove the caret/selection inserted at itemNameInput
		if (event.target !== itemNameInput) {
			itemNameInput.blur();
		}
	}}
	ondblclick={() => {
		isExpanded = !isExpanded;
	}}
	onblur={() => {
		draftName = item.name;
		isEditingName = false;
	}}
>
	<div class="flex justify-between">
		<span>
			<input
				bind:this={itemQuantityInput}
				bind:value={item.quantity}
				type="number"
				min="0"
				max="99"
				class="stealth max-w-12 text-center decoration-1 underline-offset-1 focus:underline focus:outline-none"
				onkeydown={stopPropagation()}
				ondblclick={stopPropagation()}
				onchange={handleQuantityInputChange}
			/>

			<span
				bind:this={itemNameInput}
				bind:textContent={draftName}
				role="textbox"
				tabindex="-1"
				contenteditable
				class="rounded-sm decoration-1 underline-offset-2 focus:outline-none {isEditingName &&
					'underline'}"
				onkeydown={stopPropagation(handleKeyDownOnName)}
				onclick={() => {
					isEditingName = true;
				}}
				ondblclick={stopPropagation()}
			>
				{isEditingName ? draftName : item.name}
			</span>
		</span>

		<span>
			<span
				class="italic mix-blend-multiply {daysTilSpoil < 1
					? 'text-red-500'
					: daysTilSpoil < 2
						? 'text-orange-500'
						: daysTilSpoil < 3
							? 'text-yellow-500'
							: ' text-stone-400'}">{item.dateAdded.fromNow()}</span
			>
			<button
				class="items-end transition hover:text-red-600"
				onclick={() => {
					deleteItem(item.id);
				}}
				>delete
			</button>
		</span>
	</div>
	<div
		bind:this={childrenDiv}
		role="group"
		aria-hidden={!isExpanded}
		class="overflow-y-hidden bg-[#f3f1fd] px-3 text-sm mix-blend-multiply {isExpanded
			? 'rounded-sm border-dashed border-stone-400'
			: ''}"
		style="transition: all 0.1s ease-in-out; height: {isExpanded
			? childrenDiv?.scrollHeight + 1 + 'px'
			: '0px'};"
	>
		<div role="treeitem" aria-selected="false">
			Edit date added:
			<input
				bind:this={dateAddedInput}
				type="date"
				class="border-1 my-1 rounded-sm border border-dashed border-stone-400 px-1"
				bind:value={draftDateAdded}
				onkeydown={stopPropagation(handleDateAddedKeydown)}
				ondblclick={stopPropagation()}
				onblur={() => onChangeDate(draftDateAdded)}
			/>
		</div>
		<div role="treeitem" aria-selected="false">
			Edit shelf life:
			<input
				bind:this={shelfLifeInput}
				type="number"
				class="always-display-spinner border-1 sm mb-1 ml-3 w-fit max-w-12 rounded border border-dashed border-stone-400 text-center"
				bind:value={draftShelfLife}
				onkeydown={stopPropagation()}
				ondblclick={stopPropagation()}
				onblur={() => (item.shelfLife = draftShelfLife)}
			/>
			days
		</div>
	</div>
</div>
