<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let selected: Writable<any> = getContext('selected');
	// Props
	export let value: any = $selected.value;
	// A11y
	export let label: string = 'swapper';

	export let dispatch: any = getContext('dispatch');
	export let active: any = getContext('active');
	export let rotate: boolean = getContext('rotate');
	export let flip: boolean = getContext('flip');
	export let fade: boolean = getContext('fade');
	export let duration: number = getContext('duration');
	export let rounded: string = getContext('rounded');
	export let background: string = getContext('background');
	// Swap Handlers
	function swapPrev(): void {
		active.set(active - 1);
	}
	function swapNext(): void {
		active.set(active + 1);
	}
	function onComplete() {
		dispatch('complete', {});
	}

	// A11y Input Handlers
	function onKeyDown(event: KeyboardEvent): void {
		// Enter/Space to toggle element
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			event.target?.click();
		}
	}
    console.log($selected.value)

	// Reactive
	$: isSelected = value == $selected;
	// Base
	// Base Classes
	let cBaseGroup: string = `items-center p-1 rounded overflow-hidden space-x-1`;
	// Reactive Classes
	$: classesGroup = isSelected ? `${cBaseGroup} ${background} ${rounded} ${$$props.class || ''}` : 'hidden';
</script>

<button
	class="swap {classesGroup}"
	data-testid="swap"
	on:keydown={onKeyDown}
	on:click={() => {
		selected.set(value);
	}}
>
	<slot />
</button>
{isSelected}
