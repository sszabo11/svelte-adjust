<script lang="ts">
	type Props = {
		error: string;
		code_error?: string | null;
	};
	let { error, code_error = null }: Props = $props();
</script>

<div class="error-container">
	<span class="error">{error}</span>
	{#if code_error}
		<pre><code class="language-html">{code_error}</code></pre>
		<a href="/docs/ad-units">Learn more</a>
	{/if}
</div>

<style>
	.error-container {
		background-color: #ff000630;
		border: 1px solid #ff3f4450;
		border-radius: 12px;
		font-family: 'Inter';
		text-align: left;
		padding: 12px;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
	.error {
		font-weight: 500;
		font-size: 18px;
		color: #f05256;
	}
</style>
