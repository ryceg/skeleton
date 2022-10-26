<script lang="ts">
	import Swapper from '$lib/components/Swapper/Swapper.svelte';
	import SwapperItem from '$lib/components/Swapper/SwapperItem.svelte';
	import CodeBlock from '$lib/utilities/CodeBlock/CodeBlock.svelte';
	import { writable } from 'svelte/store';

	// Stores
	let storeOne = writable('1');
	let storeTwo = writable('1');
	let storeThree = writable('1');
</script>

<div class="space-y-8">
	<!-- Header -->
	<header class="space-y-4">
		<h1>Swapper</h1>
		<p>Change the state of a thing.</p>
		<CodeBlock language="js" code={`import { Swapper, SwapperItem } from '@brainandbones/skeleton';`} />
	</header>

	<!-- Sandbox -->
	<section class="space-y-4">
		<div class="space-y-4 xl:space-y-0 xl:grid grid-cols-[1.5fr,1fr] gap-2">
			<!-- Examples -->
			<div class="card card-body space-y-4">
				<Swapper fade duration={3000} selected={storeOne}>
					<SwapperItem value="1"><img alt="A person" src="https://i.pravatar.cc/512?img=1" /></SwapperItem>
					<SwapperItem value="2"><img alt="A person" src="https://i.pravatar.cc/512?img=2" /></SwapperItem>
					<SwapperItem value="3"><img alt="A person" src="https://i.pravatar.cc/512?img=3" /></SwapperItem>
				</Swapper>
			</div>
			<div class="card card-body space-y-4">
				<Swapper fade flip rotate selected={storeTwo}>
					<SwapperItem value="1">😈</SwapperItem>
					<SwapperItem value="2">😇</SwapperItem>
					<SwapperItem value="3">🥶</SwapperItem>
				</Swapper>
			</div>
		</div>
	</section>
</div>
