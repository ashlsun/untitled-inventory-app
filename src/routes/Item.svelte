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
			s: 'just now',
			m: 'just now',
			mm: 'just now',
			h: 'today',
			hh: 'today',
			d: 'yesterday',
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

	let daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
	$: {
		daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');
		if (selected) {
			itemDiv.focus();
		}
	}

	let editingName = false;

	let childrenDiv: HTMLDivElement;
	let height = '0';
	let open = false;

	$: if (open) {
		height = String(childrenDiv.scrollHeight + 1);
	} else {
		height = '0';
	}

	function handleKeyDownOnName(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			editingName = false;
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
				deleteItem(itemId);
			}
		} else {
			console.log(event);
		}
	}

	function handleDateAddedChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('changeDateAdded', target.value);
	}
</script>

<div
	bind:this={itemDiv}
	id={item.id}
	class="rounded-sm px-2 {selected
		? 'bg-yellow-200'
		: open
			? 'outline-1 outline outline-[#e5e3ef] my-1'
			: ''}  focus:outline-none transition transition-margin font-bold {open ? 'pb-2' : ''}"
	on:focus={() => dispatch('selected')}
	tabindex="-1"
	role="tree"
	on:keydown={(event) => handleKeyPressOnItem(event, item.id)}
	on:dblclick={() => {
		open = !open;
	}}
>
	<div class="flex justify-between">
		<span>
			{item.quantity}

			<span
				bind:this={itemNameInput}
				role="textbox"
				tabindex="-1"
				contenteditable={editingName}
				on:keydown|stopPropagation={handleKeyDownOnName}
				on:click={() => {
					editingName = true;
				}}
				on:keydown={() => {
					editingName = true;
				}}
				class="focus:outline-none {editingName &&
					'underline'} decoration-1 underline-offset-2 rounded-sm max-w-fit">{item.name}</span
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
		class="text-sm px-2 overflow-y-hidden bg-[#f3f1fd] mix-blend-multiply {open
			? 'border-stone-400 border-dashed rounded-sm'
			: ''}"
		style="transition: all 0.1s ease-in-out; height: {open
			? childrenDiv.scrollHeight + 1 + 'px'
			: '0px'};"
	>
		<div>
			Edit date added:
			<input
				class="border border-dashed border-stone-400 border-1 my-1 px-1 rounded-sm"
				type="date"
				on:keydown|stopPropagation
				value={item.dateAdded.format('YYYY-MM-DD')}
				on:change={handleDateAddedChange}
			/>
		</div>
		<div>
			Edit shelf life:
			<input
				bind:value={item.daysToSpoil}
				on:keydown|stopPropagation
				class="w-5 mb-1 text-center border-stone-400 border-dashed border border-1 rounded sm ml-3"
			/>
			days
		</div>
	</div>
</div>
