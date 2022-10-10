<script lang='ts'>
    import { writable, type Writable } from 'svelte/store';
	import { createEventDispatcher, getContext, setContext } from 'svelte';

    // Event Dispacher
	const dispatch = createEventDispatcher();

	// Props
    export let items = writable([]);
	export let selected: Writable<any>;
    export let rotate: boolean = false;
    export let flip: boolean = false;
    export let fade: boolean = false;
    export let duration: number = 300; // ms

    // Button
	export let rounded: string = 'rounded';
	export let background: string = 'bg-surface-300 dark:bg-surface-700';

    
	// A11y
	export let labeledby: string | undefined = undefined;
	export let label: string | undefined = undefined;

    // Context
    setContext('dispatch', dispatch);
    setContext('selected', selected);
    setContext('items', items);
    setContext('rotate', rotate);
    setContext('flip', flip);
    setContext('fade', fade);
    setContext('duration', duration);
    setContext('rounded', rounded);
    setContext('background', background);
    // Base Classes
	let cBaseGroup: string = `items-center p-1 rounded overflow-hidden space-x-1`;
    // Reactive Classes
	$: classesGroup = `${cBaseGroup} ${background} ${rounded} ${$$props.class || ''}`;
</script>

<div class='swapper-group {classesGroup}' data-testid="swapper"  aria-labelledby={labeledby} aria-label={label}>
    <slot />
</div>