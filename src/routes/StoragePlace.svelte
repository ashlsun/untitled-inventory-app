<script lang="ts">
	import dayjs from 'dayjs';
	import { v7 as uuid } from 'uuid';
	import Item from './Item.svelte';
	import { getRandomItems } from '$lib/itemGenerator';
	import { encodeImage } from '$lib/imageUtils';
	import { getPromptText } from '$lib/promptText';

	// Component props
	export let storagePlaceName;

	// State
	let items = getRandomItems();
	let newItemName = '';
	let selectedIndex = -1;
	let selectedFile: File | null = null;
	let isProcessingReceipt = false;
	let errorProcessingReceipt = false;

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
					dateAdded: dayjs().format('YYYY-MM-DD'),
					name: newItemName.slice(newItemList[0].length).trim(),
					quantity: Number(newItemList[0]),
					shelfLife: 5
				}
			];
		} else {
			items = [
				...items,
				{
					id: uuid(),
					dateAdded: dayjs().format('YYYY-MM-DD'),
					name: newItemName,
					quantity: 1,
					shelfLife: 5
				}
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

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length !== 1) {
			console.log('files does not have 1 elem');
			return;
		}

		const file = files[0];
		if (!file) return;

		selectedFile = target.files?.[0] || null;
	}

	async function handleUpload() {
		if (!selectedFile) return;

		try {
			isProcessingReceipt = true;
			errorProcessingReceipt = false;
			const base64Image = await encodeImage(selectedFile); // Function to encode image to base64

			// Send image data and prompt to OpenAI
			const response = await sendImageToOpenAI(base64Image);

			const content = response.choices[0].message.content;
			console.log(content);

			try {
				const json_content = JSON.parse(content);
				console.log(json_content);
				const json_items = json_content.items;
				console.log(json_items);
				const itemsWithIdsAdded = json_items.map(
					(extractedItem: { name: string; quantity: number; shelfLife: number }) => {
						console.log('processing', JSON.stringify(extractedItem));
						const processedItem = JSON.parse(JSON.stringify(extractedItem));
						if (processedItem.id === 'to be generated') {
							processedItem.id = uuid();
							console.log('new item', processedItem);
						} else {
							console.log('existing item', processedItem);
						}
						return processedItem;
					}
				);

				console.log(itemsWithIdsAdded);
				items = [...itemsWithIdsAdded];
			} catch (e) {
				console.log("darn couldn't parse", e);
				errorProcessingReceipt = true;
			}

			console.log('OpenAI Response:', response); // Example: Log response from OpenAI

			// Clear selected file after successful upload
			selectedFile = null;
			isProcessingReceipt = false;
		} catch (error) {
			console.error('Error uploading image:', error);
			isProcessingReceipt = false;
			errorProcessingReceipt = true;
		}
	}

	async function sendImageToOpenAI(base64Image: string) {
		const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
		const api_key = 'OPENAI API KEY'; // Replace with your OpenAI API key

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${api_key}`
		};

		const existingInventory = JSON.stringify(items);
		const payload = {
			model: 'gpt-4o',
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: getPromptText(existingInventory)
						},
						{
							type: 'image_url',
							image_url: {
								url: `data:image/jpeg;base64,${base64Image}`
							}
						}
					]
				}
			],
			max_tokens: 1000
		};
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
		}

		return response.json();
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
						item.dateAdded = dayjs(event.detail).format('YYYY-MM-DD');
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

	<div class="mb-1 mt-3 px-1 text-sm">
		receipt pic:
		<div class="flex items-center text-xs">
			<input type="file" accept="image/*" class="" on:change={handleFileSelect} />
			<button class="transition hover:font-bold hover:text-emerald-700" on:click={handleUpload}
				>extract items</button
			>
		</div>
		{#if isProcessingReceipt}
			<div class="italic">One moment while receipt is being processed...</div>
		{:else if errorProcessingReceipt}
			<div class="text-red-800">Dang! An error occurred :(</div>
		{/if}
	</div>
	<input
		class="mt-5 rounded-sm border border-black px-1 outline-emerald-600 transition placeholder:text-stone-400"
		value={newItemName}
		on:keypress={handleInputKeypress}
		maxlength="20"
	/>
	<button class="transition hover:font-bold hover:text-emerald-700" on:click={addNewItem}>+</button>
</div>
