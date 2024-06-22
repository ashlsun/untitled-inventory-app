<script lang="ts">
	import dayjs from 'dayjs';
	import { v7 as uuid } from 'uuid';

	export let name;
	import Item from './Item.svelte';
	import { getRandomItems } from '$lib/itemGenerator';

	let items = getRandomItems();

	let newItem = '';
	let selectedIndex = -1;

	function setSelectedIndex(i: number) {
		selectedIndex = i;
	}

	function editNewItem(event: Event) {
		const target = event.target as HTMLInputElement;
		newItem = target.value;
	}
	function addNewItem() {
		items = [
			...items,
			{ id: uuid(), dateAdded: dayjs(), name: newItem, quantity: 1, daysToSpoil: 5 }
		];
		newItem = '';
		selectedIndex = items.length;
	}
	function deleteItem(itemId: string) {
		items = items.filter((item) => item.id !== itemId);
		if (selectedIndex >= items.length) {
			selectedIndex--;
		}
	}
	function handleInputKeypress(event: KeyboardEvent) {
		editNewItem(event);
		if (event.key == 'Enter') {
			addNewItem();
		}
	}
</script>

<div class="border border-black rounded-sm m-3 p-1 max-w-96 min-w-72 h-fit inline-block">
	<h1 class="font-bold">{name} <span class="text-stone-400">({items.length})</span></h1>
	{#each items as item, i (item.id)}
		<Item
			{item}
			{deleteItem}
			selected={selectedIndex === i}
			on:selected={() => {
				setSelectedIndex(i);
			}}
			on:up={() => {
				setSelectedIndex(i - 1);
			}}
			on:down={() => {
				setSelectedIndex(i + 1);
			}}
			on:changeDateAdded={(event) => {
				try {
					item.dateAdded = dayjs(event.detail);
				} catch {
					console.log('ok');
				}
			}}
		/>
	{/each}
	{#if items.length === 0}
		<div class="text-stone-400">Nothing in the {name}.</div>
	{/if}

	<input
		class="border border-black mt-5 px-1 rounded-sm outline-emerald-600 transition placeholder:text-stone-400"
		value={newItem}
		on:keypress={handleInputKeypress}
		maxlength="20"
	/>
	<button class="hover:text-emerald-700 hover:font-bold transition" on:click={addNewItem}>+</button>
</div>
