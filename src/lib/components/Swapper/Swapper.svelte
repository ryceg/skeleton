<script lang='ts'>
    import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	// Props
	export let active: Writable<number> = writable(0);
    export let rotate: boolean = false;
    export let flip: boolean = false;
    export let fade: boolean = false;
    export let duration: number = 300; // ms
	export let rounded: string = 'rounded';
	export let background: string = 'bg-surface-300 dark:bg-surface-700';

    // Base Classes
	let cBaseGroup: string = `items-center p-1 rounded overflow-hidden space-x-1`;
    // Reactive
	$: classesGroup = `${cBaseGroup} ${background} ${rounded} ${$$props.class || ''}`;
</script>

<div class='swapper-group'>
    <slot />
</div>