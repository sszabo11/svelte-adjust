<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import ErrorMessage from '../error/ErrorMessage.svelte';

	type Props = {
		children: Snippet;
		name: string;
	};
	let { children, name }: Props = $props();
</script>

{#if name}
	<div class="group-ads" data-group-name={name}>
		{@render children()}
	</div>
{:else}
	<ErrorMessage error="No group name" />
{/if}

<style>
	.group-ads {
		all: inherit;
	}
</style>
