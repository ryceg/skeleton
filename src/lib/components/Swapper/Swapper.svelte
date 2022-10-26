<script lang='ts'>
    import { writable, type Writable } from 'svelte/store';
	import { createEventDispatcher, getContext, setContext } from 'svelte';

    // Event Dispacher
	const dispatch = createEventDispatcher();

	// Props
    export let items = writable([]);
    /** Which item is currently selected. */
	export let selected: Writable<any>;
    /** Does this rotate on change? */
    export let rotate: boolean = false;
    /** Does this flip on change? */
    export let flip: boolean = false;
    /** Does this fade on change? */
    export let fade: boolean = false;
    /** Duration of the transition in milliseconds */
    export let duration: number = 300; // ms

    // Button
    /** The TailWind rounded attribute */
	export let rounded: string = 'rounded';
    /** The TailWind background attribute */
	export let background: string = 'bg-surface-300 dark:bg-surface-700';


	// A11y
    /** Provide the ID of the element that describes the group */
	export let labeledby: string | undefined = undefined;
    /** Defines a semantic label for the group */
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