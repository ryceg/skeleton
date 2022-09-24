<script lang='ts'>
	import Swapper from "$lib/components/Swapper/Swapper.svelte";
    import SwapperItem from "$lib/components/Swapper/SwapperItem.svelte";
import CodeBlock from "$lib/utilities/CodeBlock/CodeBlock.svelte";
</script>

<div class="space-y-8">
	<!-- Header -->
	<header class="space-y-4">
		<h1>Swapper</h1>
		<p>Change the state of a thing.</p>
		<CodeBlock language="js" code={`import { Swapper } from '@brainandbones/skeleton';`} />
	</header>

	<!-- Sandbox -->
	<section class="space-y-4">
		<div class="space-y-4 xl:space-y-0 xl:grid grid-cols-[1.5fr,1fr] gap-2">
				<!-- Examples -->
			<div class="card card-body space-y-4">
                <Swapper {active}>
                    <SwapperItem value="a">Tab A</SwapperItem>
                    <SwapperItem value="b">Tab B</SwapperItem>
                </Swapper>
            </div>
        </div>
    </section>

</div>