<script lang="ts">
	import StoragePlace from './StoragePlace.svelte';
	import {
		IconArrowUp,
		IconArrowDown,
		IconBackspace,
		IconArrowBack,
		IconArrowRight,
		IconArrowLeft
	} from '@tabler/icons-svelte';
  
	let showTips = $state(false);
	// let tips: HTMLDivElement | null = $state(null);
  let tips: HTMLDivElement

	// TODO: fix broken accordion on resize
</script>

<div class="m-2">
	<div class="flex w-full">
		<StoragePlace storagePlaceName="fridge" />
	</div>

	<div class="m-2 mt-12 max-w-sm">
		<h1>
			<b>Tips for users:</b>
			<span class="text-stone-400 transition hover:text-stone-500">
				(<button
					aria-label="{showTips ? 'Hide' : 'Show'} tips"
					class="underline decoration-1 underline-offset-2"
					onclick={() => (showTips = !showTips)}>{showTips ? 'hide' : 'show'}</button
				>)
			</span>
		</h1>

		<div
			bind:this={tips}
			class="text-sm"
			style="transition: all 0.1s ease-in-out; overflow: hidden; height: {showTips
				? tips?.scrollHeight + 1 + 'px'
				: '0px'};"
		>
			<p>This is a demo, so nothing here is saved.</p>
			<li>Click on an item to select it.</li>
			<li class="ml-5">
				Double click or press [<b>
					<IconArrowBack class="inline items-start" size="14" stroke="3" aria-hidden /> Enter</b
				>] to expand.
			</li>
			<li class="ml-5">
				[<b>
					<IconBackspace class="inline items-start" size="14" stroke="3" aria-hidden /> Backspace</b
				>] to delete.
			</li>
			<li class="ml-5">
				[<b> <IconArrowUp class="inline items-center" size="14" stroke="3" aria-hidden /> Up</b>] or
				[<b>
					<IconArrowDown class="inline items-center" size="14" stroke="3" aria-hidden /> Down</b
				>] to select a different item.
			</li>
			<li class="ml-5">
				[<b>
					<IconArrowLeft class="inline items-center" size="14" stroke="3" aria-hidden /> Left</b
				>] or [<b>
					<IconArrowRight class="inline items-center" size="14" stroke="3" aria-hidden /> Right</b
				>] to change the quantity.
			</li>

			<li>Click on an item's name to edit it.</li>
			<li class="ml-5">
				When editing, press [<b>
					<IconArrowBack class="inline items-start" size="14" stroke="3" aria-hidden /> Enter</b
				>] to save, [<b>Esc</b>] to cancel.
			</li>
		</div>
	</div>
</div>
