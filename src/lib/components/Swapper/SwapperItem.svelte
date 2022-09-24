<script lang='ts'>
    import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let selected: Writable<any> = getContext('selected');
</script>

<div>
    <slot />
</div>