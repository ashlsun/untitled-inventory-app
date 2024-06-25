<script lang="ts">
	import dayjs from 'dayjs';
	import { v7 as uuid } from 'uuid';
	import Item from './Item.svelte';
	import { getRandomItems } from '$lib/itemGenerator';

	// Component props
	export let storagePlaceName;

	// State
	let items = getRandomItems();
	let newItemName = '';
	let selectedIndex = -1;

	// Methods and handlers
	function setSelectedIndex(i: number) {
		selectedIndex = i;
	}

	function editNewItem(event: Event) {
		const target = event.target as HTMLInputElement;
		newItemName = target.value;
	}

	function addNewItem() {
		if (newItemName === '') return;

		const newItemList = newItemName.split(' ');
		if (newItemList.length > 1 && newItemList[0].match(/^\d+$/)) {
			items = [
				...items,
				{
					id: uuid(),
					dateAdded: dayjs(),
					name: newItemName.slice(newItemList[0].length).trim(),
					quantity: Number(newItemList[0]),
					shelfLife: 5
				}
			];
		} else {
			items = [
				...items,
				{ id: uuid(), dateAdded: dayjs(), name: newItemName, quantity: 1, shelfLife: 5 }
			];
		}

		newItemName = '';
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

<div
	class="m-3 inline-block h-fit min-w-72 max-w-96 rounded-sm border border-black p-1"
	role="tree"
>
	<h1 class="font-bold">{storagePlaceName} <span class="text-stone-400">({items.length})</span></h1>
	<div role="group">
		{#each items as item, i (item.id)}
			<Item
				{item}
				{deleteItem}
				isSelected={selectedIndex === i}
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
	</div>
	{#if items.length === 0}
		<div class="text-stone-400">Nothing in the {storagePlaceName}.</div>
	{/if}

	<input
		class="mt-5 rounded-sm border border-black px-1 outline-emerald-600 transition placeholder:text-stone-400"
		value={newItemName}
		on:keypress={handleInputKeypress}
		maxlength="20"
	/>
	<button class="transition hover:font-bold hover:text-emerald-700" on:click={addNewItem}>+</button>
</div>
