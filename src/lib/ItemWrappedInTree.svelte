<!-- 
    This Svelte component is for the purpose of avoiding errors
    when running unit tests of the Item component, since elements 
    with a "treeitem" role must have a parent with a "tree" role.
-->

<script lang="ts">
	import Item from '../routes/Item.svelte';
	import type { Props, Events } from '../routes/Item.svelte';

	let { ...props }: Props & Events = $props();
</script>

<div role="tree">
	<Item {...props} />
</div>
