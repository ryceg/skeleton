<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
    import { circInOut } from 'svelte/easing';
	import type { EasingFunction } from 'svelte/transition';
	export let selected: Writable<any> = getContext('selected');
	// Props
	export let value: any = $selected;
    export let items: Writable<any[]> = getContext('items');
    if (items) {
        items.update((i) => {
            if (!i.includes($$props.value)) {
                i.push($$props.value);
            }
            return i;
        });
    }
    console.log($items);
	// A11y
	export let label: string = 'swapper';
    export let cInactive: string = 'hidden';
	export let dispatch: any = getContext('dispatch');
	export let active: any = getContext('active');
	export let rotate: boolean = getContext('rotate');
	export let flip: boolean = getContext('flip');
	export let fade: boolean = getContext('fade');
	export let duration: number = getContext('duration');
	export let rounded: string = getContext('rounded');
	export let background: string = getContext('background');
    const opts = {
        duration,
        easing: circInOut,
        delay: 0,
        times: 0.2
    };
    /**
     * Custom easing function
     * @see {@link https://svelte.dev/repl/082e308f9fe44bcb98621dab346c2e85?version=3.29.4 Taken from this Svelte REPL}
     * @param node
     * @param options
     */
    function spin(node: Element, options: Partial<{ duration: number, easing: EasingFunction, times: number, delay: number}>) {
        const { duration = opts.duration, easing = opts.easing, times = opts.times, delay = opts.delay } = options;
        return {
            delay,
            duration,
            easing,
			// The value of t passed to the css method
			// varies between zero and one during an "in" transition
			// and between one and zero during an "out" transition.
            css: (t: number) => {
				// Svelte takes care of applying the easing function.
                const deg = t * 360 * times;  // through which to spin
                return `transform: rotate(${deg}deg);`;
            }
        };
	}

	// A11y Input Handlers
	function onKeyDown(event: KeyboardEvent): void {
		// Enter/Space to toggle element
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			event.target?.click();
		}           
	}

	// Reactive
	$: isSelected = value == $selected;
    $: selectedIndex = $items.indexOf($selected);
	// Base
	// Base Classes
	let cBaseGroup: string = `items-center p-1 rounded overflow-hidden space-x-1`;
	// Reactive Classes
	$: classesGroup = `${cBaseGroup} ${background} ${rounded} ${$$props.class || ''}`;
</script>
{#if isSelected}
<button
	class="swap {classesGroup}"
	data-testid="swap"
    in:spin|local={{duration, times: 0.1}}
	on:keydown={onKeyDown}
	on:click={() => {
        const length = $items.length;
        selected.set($items[selectedIndex + 1 < length ? selectedIndex + 1 : 0]);
	}}
>
	<slot />
</button>
{/if}