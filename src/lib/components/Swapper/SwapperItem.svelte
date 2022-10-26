<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
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
	/** Defines a semantic label for the item */
	export let label: string = 'swapper';
	/** The class to be applied while it is inactive. */
	export let cInactive: string = 'hidden';
	export let dispatch: any = getContext('dispatch');

	export let active: any = getContext('active');
	/** Does this rotate on change? */
	export let rotate: boolean = getContext('rotate'); // todo: rotate counter-clockwise
	/** Does this flip on change? */
	export let flip: boolean = getContext('flip'); // todo: flip ltr, rtl, ttb, btt
	/** Does this fade on change? */
	export let fade: boolean = getContext('fade');
	/** Duration of the transition in milliseconds */
	export let duration: number = getContext('duration');
	export let rounded: string = getContext('rounded');
	export let background: string = getContext('background');
	const defaultOpts = {
		duration,
		easing: circInOut,
		delay: 0,
		times: 0.2
	};

	function swapAnimation(node: Element, options: Partial<{ duration: number; easing: EasingFunction; times: number; delay: number }>) {
		const { duration = defaultOpts.duration, easing = defaultOpts.easing, times = defaultOpts.times, delay = defaultOpts.delay } = options;
		return {
			delay,
			duration,
			easing,
			// The value of t passed to the css method
			// varies between zero and one during an "in" transition
			// and between one and zero during an "out" transition.
			css: (t: number) => {
				const u = 1 - t;
				const o = +getComputedStyle(node).opacity;
				let rotateProp = ''
				let fadeProp = ''
				let flipProp = ''
				const deg = t * 360 * times; // through which to spin
				if (rotate) rotateProp = `rotate(${deg}deg)`
				if (fade) fadeProp = `opacity: ${t * o}`
				if (flip) flipProp = `rotateY(${1 - (u * 180)}deg); transform-style: preserve-3d`
				// Svelte takes care of applying the easing function.
				// return `transform: ${rotateProp} ${fadeProp} ${flipProp};`;
				return `transform: ${rotateProp};`;
				// return `opacity: ${t * o};`
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
	$: classesGroup = `${cBaseGroup} ${$$props.class || ''}`;

</script>

{#if isSelected}
	<button
		class="swap {classesGroup} {!isSelected ? cInactive : ''}"
		class:fade
		class:flip
		class:rotate
		class:rounded
		class:background
		data-testid="swap"
		transition:swapAnimation|local
		on:keydown={onKeyDown}
		on:click={() => {
			const length = $items.length;
			selected.set($items[selectedIndex + 1 < length ? selectedIndex + 1 : 0]);
		}}
	>
		<slot />
	</button>
	<!-- current: {value} -->
	<!-- isSelected: {isSelected} -->
{/if}

<style>
	.swapper-item-container {
		perspective: 1000px;
	}
</style>