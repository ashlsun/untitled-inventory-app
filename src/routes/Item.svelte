<script lang="ts">
	import dayjs, { type Dayjs } from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import updateLocale from 'dayjs/plugin/updateLocale';

	dayjs.extend(relativeTime);
	dayjs.extend(updateLocale);
	dayjs.updateLocale('en', {
		relativeTime: {
			future: '%s',
			past: '%s',
			s: 'now',
			m: 'now',
			mm: 'now',
			h: '1h',
			hh: '%dh',
			d: '1d',
			dd: '%dd',
			M: '1mo',
			MM: '%dmo',
			y: '1yr',
			yy: '%dyrs'
		}
	});

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let item: {
		id: string;
		name: string;
		quantity: number;
		dateAdded: Dayjs;
		daysToSpoil: number;
	};
	export let deleteItem: (itemId: string) => void;
	export let selected: boolean;
	let itemDiv: HTMLDivElement;
	let itemNameInput: HTMLSpanElement;
	let itemQuantityInput: HTMLInputElement;

	let daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
	$: {
		daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
		if (selected) {
			itemDiv.focus();
		} else {
			open = false;
		}
	}

	let editingName = false;
	let draftName = item.name;
	let childrenDiv: HTMLDivElement;
	let height = '0';
	let open = false;

	let dateAddedInput: HTMLInputElement;
	let shelfLifeInput: HTMLInputElement;

	let draftShelfLife = item.daysToSpoil;
	let draftDateAdded = item.dateAdded.format('YYYY-MM-DD');

	$: if (open) {
		height = String(childrenDiv.scrollHeight + 1);
	} else {
		height = '0';
	}

	function handleKeyDownOnName(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			item.name = draftName;
			editingName = false;
			itemNameInput.blur();
		} else if (event.key === 'Escape') {
			draftName = item.name;
			editingName = false;
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

	function handleKeyPressOnItem(event: KeyboardEvent, itemId: string) {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			if (open) {
				open = false;
				setTimeout(() => deleteItem(itemId), 70);
			} else {
				deleteItem(itemId);
			}
		} else if (event.key === 'Enter') {
			open = !open;
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

	function updateDateAdded() {
		dispatch('changeDateAdded', draftDateAdded);
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
	class="rounded-sm px-2 pt-[0.5px] {selected
		? 'bg-yellow-200'
		: open
			? 'outline-1 outline outline-[#e5e3ef] my-1'
			: ''}  focus:outline-none transition transition-margin {open ? 'pb-2' : ''} select-none"
	on:focus={() => dispatch('selected')}
	tabindex="-1"
	role="tree"
	on:keydown={(event) => handleKeyPressOnItem(event, item.id)}
	on:dblclick={() => {
		open = !open;
	}}
	on:click={(event) => {
		// to remove the caret/selection inserted at itemNameInput
		if (event.target !== itemNameInput) {
			itemNameInput.blur();
		}
	}}
	on:blur={() => {
		draftName = item.name;
		editingName = false;
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
				class="stealth text-center max-w-12 focus:outline-none focus:underline underline-offset-1 decoration-1"
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
				on:keydown|stopPropagation={handleKeyDownOnName}
				on:click={() => {
					editingName = true;
				}}
				class="focus:outline-none {editingName &&
					'underline'} decoration-1 underline-offset-2 rounded-sm"
				>{editingName ? draftName : item.name}</span
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
				class="items-end hover:text-red-600 transition"
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
		aria-selected="false"
		class="text-sm px-3 overflow-y-hidden bg-[#f3f1fd] mix-blend-multiply {open
			? 'border-stone-400 border-dashed rounded-sm'
			: ''}"
		style="transition: all 0.1s ease-in-out; height: {open
			? childrenDiv.scrollHeight + 1 + 'px'
			: '0px'};"
	>
		<div>
			Edit date added:
			<input
				bind:this={dateAddedInput}
				type="date"
				class="border border-dashed border-stone-400 border-1 my-1 px-1 rounded-sm"
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
				class="always-display-spinner max-w-12 w-fit mb-1 text-center border-stone-400 border-dashed border border-1 rounded sm ml-3"
				bind:value={draftShelfLife}
				on:keydown|stopPropagation
				on:dblclick|stopPropagation
				on:blur={() => (item.daysToSpoil = draftShelfLife)}
			/>
			days
		</div>
	</div>
</div>
