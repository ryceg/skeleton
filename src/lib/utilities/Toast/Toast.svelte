<script lang="ts">
	import { fly } from 'svelte/transition';

	import { toastStore } from './stores';
	import Button from '$lib/components/Button/Button.svelte';

	// Props
	export let background: string = 'bg-accent-500';
	export let position: string = 'b'; // bottom
	export let variant: string = 'ghost';
	export let duration: number = 200;

	// Base Classes
	const cBase: string = 'fixed z-50 mx-auto max-w-[512px] p-4 space-y-2';
	const cToast: string = 'flex items-center py-3 px-4 space-x-4 rounded-xl shadow-xl';
	const cBaseMessage: string = 'flex-1 text-sm md:text-base';
	const cBaseActions: string = 'flex-none space-x-2';

	// Set Position
	let yAmount = 300;
	let y: number = yAmount;
	let cPosition: string;
	// prettier-ignore
	switch (position) {
        // Corners
        case ('tr'): cPosition = 'top-0 right-0 ml-0'; y = -yAmount; break;
        case ('tl'): cPosition = 'top-0 left-0 mr-0'; y = -yAmount; break;
        case ('br'): cPosition = 'bottom-0 right-0 ml-0'; break;
        case ('bl'): cPosition = 'bottom-0 left-0 mr-0'; break;
		 // Centered
		case('t'): cPosition = 'left-0 right-0 top-0'; y = -yAmount; break;
        default: cPosition = 'left-0 right-0 bottom-0'; // ('b')
    }

	// Functionality
	function onAction(): void {
		$toastStore[0].button.action();
		toastStore.close();
	}
	function onDismiss(id: number): void {
		toastStore.close(id);
	}

	// Reactive Classes
	$: classesBase = `${cBase} ${cPosition}`;
	$: classesToast = `${cToast}`;
</script>

{#if $toastStore.length}
	<div class="toast-wrapper {classesBase}" transition:fly|local={{ y, duration }}>
		<!-- Toasts (list) -->
		{#each $toastStore as toast, i}
			<div class="toast {classesToast} {toast.background || background}" data-testid="toast" role="alert" aria-live="polite">
				<!-- Message -->
				<div class="toast-message {cBaseMessage}">{@html toast.message}</div>
				<!-- Action -->
				<div class="toast-actions {cBaseActions}">
					{#if toast.button}<Button {variant} on:click={onAction}>{toast.button.label}</Button>{/if}
					<!-- prettier-ignore -->
					<Button {variant} on:click={() => { onDismiss(toast.id); }}>
						{@html toast.button ? '&#10005;' : 'Dismiss'}
					</Button>
				</div>
			</div>
		{/each}
	</div>
{/if}
