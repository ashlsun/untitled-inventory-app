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
		if (newItem === '') return;

		const newItemList = newItem.split(' ');
		if (newItemList.length > 1 && newItemList[0].match(/^\d+$/)) {
			items = [
				...items,
				{
					id: uuid(),
					dateAdded: dayjs(),
					name: newItem.slice(newItemList[0].length).trim(),
					quantity: Number(newItemList[0]),
					daysToSpoil: 5
				}
			];
		} else {
			items = [
				...items,
				{ id: uuid(), dateAdded: dayjs(), name: newItem, quantity: 1, daysToSpoil: 5 }
			];
		}

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

<div class="m-3 inline-block h-fit min-w-72 max-w-96 rounded-sm border border-black p-1">
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
		class="mt-5 rounded-sm border border-black px-1 outline-emerald-600 transition placeholder:text-stone-400"
		value={newItem}
		on:keypress={handleInputKeypress}
		maxlength="20"
	/>
	<button class="transition hover:font-bold hover:text-emerald-700" on:click={addNewItem}>+</button>
</div>
