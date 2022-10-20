<script lang="ts">
	import { fade } from 'svelte/transition';

	// Props
	/**
	 * Control visibility of the alert.
	 * 
	 * @type {boolean}
	 * @default
	 */
	export let visible: boolean = true;
	/**
	 * Provide classes to set background color.
	 * 
	 * @type {string}
	 * @default
	 */
	export let background: string = 'bg-ternary-500/30';
	/**
	 * Provide classes to set the border styles.
	 * 
	 * @type {string}
	 * @default
	 */
	export let border: string = 'border-l-4 border-l-ternary-500';
	/**
	 * Provide classes to set text color.
	 * 
	 * @type {string | undefined}
	 * @default
	 */
	export let color: string | undefined = undefined;
	/**
	 * Provide classes to set border radius.
	 * 
	 * @type {string | undefined}
	 * @default
	 */
	export let rounded: string | undefined = undefined;
	/**
	 * Svelte fade transition duration. Set <code>0</code> to disable
	 * 
	 * @type {number}
	 * @default
	 */
	export let duration: number = 200; // ms
	// Props (slots)
	/**
	 * Provide a leading element, such as an icon.
	 * 
	 * @type {string | undefined}
	 */
	export let slotLead: string = '';
	/**
	 * Provide the alert message text.
	 * 
	 * @type {string | undefined}
	 */
	export let slotContent: string = '';
	/**
	 * Provide a trailing element, such as a call to action
	 * 
	 * @type {string | undefined}
	 */
	export let slotTrail: string = '';
	// Base Classes
	let cBaseCard: string = 'flex flex-col items-start lg:items-center lg:flex-row p-5 space-y-4 lg:space-y-0 lg:space-x-4';
	let cLead: string = 'flex justify-center items-center';
	let cContent: string = 'flex flex-col w-full justify-center space-y-2';
	let cTrail: string = 'flex items-center space-x-4';

	// Reactive Classes
	$: classesCard = `${cBaseCard} ${background} ${border} ${color} ${rounded} ${$$props.class ?? ''}`;
	$: classesLead = `${cLead} ${slotLead}`;
	$: classesContent = `${cContent} ${slotContent}`;
	$: classesTrail = `${cTrail} ${slotTrail}`;
</script>

{#if visible}
	<div class="alert {classesCard}" transition:fade|local={{ duration }} data-testid="alert" role="alert" aria-live="polite">
		<!-- Slot: Lead -->
		{#if $$slots.lead}
			<section class="alert-lead {classesLead}">
				<slot name="lead" />
			</section>
		{/if}

		<!-- Content -->
		<section class="alert-content {classesContent}">
			<!-- Slot: Title -->
			{#if $$slots.title}<h3 class="alert-title"><slot name="title" /></h3>{/if}
			<!-- Slot: Default -->
			{#if $$slots.default}<div class="alert-message {color}"><slot /></div>{/if}
		</section>

		<!-- Slot: Trail -->
		{#if $$slots.trail}
			<section class="alert-trail {classesTrail}">
				<slot name="trail" />
			</section>
		{/if}
	</div>
{/if}
