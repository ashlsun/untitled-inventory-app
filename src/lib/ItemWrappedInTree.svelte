<!-- 
    This Svelte component is for the purpose of avoiding errors
    when running unit tests of the Item component, since elements 
    with a "treeitem" role must have a parent with a "tree" role.
-->

<script lang="ts">
	import Item from '../routes/Item.svelte';
	import { type StoredItem } from './types';

	type Props = {
		item: StoredItem;
		deleteItem: (itemId: string) => void;
		isSelected: boolean;
	};

	let { item, deleteItem, isSelected }: Props = $props();
</script>

<div role="tree">
	<Item {item} {deleteItem} {isSelected} />
</div>
