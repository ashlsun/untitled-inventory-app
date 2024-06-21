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
			MM: '%dmos',
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

	$: if (selected) {
		itemDiv.focus();
	}

	let daysTilSpoil = item.dateAdded.add(item.daysToSpoil, 'day').diff(dayjs(), 'day');

	function handleKeyPressOnItem(event: KeyboardEvent, itemId: string) {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			deleteItem(itemId);
		} else if (event.key === 'Enter') {
			console.log('expand');
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
</script>

<div
	bind:this={itemDiv}
	id={item.id}
	class="flex justify-between px-1 focus:bg-yellow-200 focus:outline-none transition font-bold"
	on:focus={() => dispatch('selected')}
	tabindex="-1"
	role="tree"
	on:keydown={(event) => handleKeyPressOnItem(event, item.id)}
>
	{item.quantity}

	{item.name}

	<span>
		<span
			class="italic text-stone-400 mix-blend-multiply {daysTilSpoil < 1
				? 'text-red-600'
				: daysTilSpoil < 2
					? 'text-orange-600'
					: daysTilSpoil < 3
						? 'text-yellow-600'
						: ''}">{item.dateAdded.fromNow()}</span
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
