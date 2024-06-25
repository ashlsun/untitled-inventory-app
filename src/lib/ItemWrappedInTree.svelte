<!-- 
    This Svelte component is for the purpose of avoiding errors
    when running unit tests of the Item component, since elements 
    with a "treeitem" role must have a parent with a "tree" role.
-->

<script lang="ts">
	import Item from '../routes/Item.svelte';
	import { type StoredItem } from './types';
	export let item: StoredItem;
	export let deleteItem: (itemId: string) => void;
	export let isSelected: boolean;
</script>

<div role="tree">
	<Item {item} {deleteItem} {isSelected} />
</div>
