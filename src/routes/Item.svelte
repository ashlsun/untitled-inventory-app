<script lang="ts">
	import dayjs, { type Dayjs } from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import updateLocale from 'dayjs/plugin/updateLocale';
	import { createEventDispatcher } from 'svelte';

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

	// Component props
	export let item: {
		id: string;
		name: string;
		quantity: number;
		dateAdded: Dayjs;
		daysToSpoil: number;
	};
	export let deleteItem: (itemId: string) => void;
	export let isSelected: boolean;

	// Reactive declarations
	let daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
	$: {
		daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
		if (isSelected) {
			itemDiv.focus();
		} else {
			isExpanded = false;
		}
	}
	$: if (isExpanded) {
		height = String(childrenDiv.scrollHeight + 1);
	} else {
		height = '0';
	}

	const dispatch = createEventDispatcher();
	let height = '0';
	let isExpanded = false;
	let isEditingName = false;
	let draftName = item.name;
	let draftShelfLife = item.daysToSpoil;
	let draftDateAdded = item.dateAdded.format('YYYY-MM-DD');
	let itemDiv: HTMLDivElement;
	let itemNameInput: HTMLSpanElement;
	let itemQuantityInput: HTMLInputElement;
	let childrenDiv: HTMLDivElement;
	let dateAddedInput: HTMLInputElement;
	let shelfLifeInput: HTMLInputElement;

	function updateDateAdded() {
		dispatch('changeDateAdded', draftDateAdded);
	}

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
			dispatch('up');
		} else if (event.key === 'ArrowDown') {
			dispatch('down');
		} else if (event.key === 'ArrowRight') {
			item.quantity++;
		} else if (event.key === 'ArrowLeft') {
			item.quantity--;
			if (item.quantity === 0) {
				setTimeout(() => deleteItem(item.id), 100);
			}
		} else {
			console.log(event);
		}
	}

	function handleDateAddedKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			updateDateAdded();
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
	class="select-none rounded-sm px-2 pt-[0.5px] transition transition-margin focus:outline-none
		{isSelected ? 'bg-yellow-200' : ''}
		{isExpanded ? 'pb-2' : ''}"
	tabindex="-1"
	role="treeitem"
	aria-selected={isSelected}
	aria-expanded={isExpanded}
	on:focus={() => dispatch('selected')}
	on:keydown={(event) => handleKeyDownOnItem(event, item.id)}
	on:click={(event) => {
		// to remove the caret/selection inserted at itemNameInput
		if (event.target !== itemNameInput) {
			itemNameInput.blur();
		}
	}}
	on:dblclick={() => {
		isExpanded = !isExpanded;
	}}
	on:blur={() => {
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
				on:keydown|stopPropagation
				on:dblclick|stopPropagation
				on:change={handleQuantityInputChange}
			/>

			<span
				bind:this={itemNameInput}
				bind:textContent={draftName}
				role="textbox"
				tabindex="-1"
				contenteditable
				class="rounded-sm decoration-1 underline-offset-2 focus:outline-none {isEditingName &&
					'underline'}"
				on:keydown|stopPropagation={handleKeyDownOnName}
				on:click={() => {
					isEditingName = true;
				}}
				on:dblclick|stopPropagation>{isEditingName ? draftName : item.name}</span
			>
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
				on:click={() => {
					deleteItem(item.id);
				}}
				>delete
			</button>
		</span>
	</div>
	<div
		bind:this={childrenDiv}
		role="treeitem"
		aria-hidden={!isExpanded}
		aria-selected="false"
		class="overflow-y-hidden bg-[#f3f1fd] px-3 text-sm mix-blend-multiply {isExpanded
			? 'rounded-sm border-dashed border-stone-400'
			: ''}"
		style="transition: all 0.1s ease-in-out; height: {isExpanded
			? childrenDiv.scrollHeight + 1 + 'px'
			: '0px'};"
	>
		<div>
			Edit date added:
			<input
				bind:this={dateAddedInput}
				type="date"
				class="border-1 my-1 rounded-sm border border-dashed border-stone-400 px-1"
				bind:value={draftDateAdded}
				on:keydown|stopPropagation={handleDateAddedKeydown}
				on:dblclick|stopPropagation
				on:blur={updateDateAdded}
			/>
		</div>
		<div>
			Edit shelf life:
			<input
				bind:this={shelfLifeInput}
				type="number"
				class="always-display-spinner border-1 sm mb-1 ml-3 w-fit max-w-12 rounded border border-dashed border-stone-400 text-center"
				bind:value={draftShelfLife}
				on:keydown|stopPropagation
				on:dblclick|stopPropagation
				on:blur={() => (item.daysToSpoil = draftShelfLife)}
			/>
			days
		</div>
	</div>
</div>
