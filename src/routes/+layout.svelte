<script lang="ts">
	let { children, data } = $props();
	const { navMap } = data;
	const navKeys = navMap
</script>

<svelte:head>
	<title>Email and password example with 2FA and WebAuthn in SvelteKit</title>
</svelte:head>
<header>
	<section>
	{#each [...navMap?.keys()] as key}
		<a href={navMap?.get(key)?.path}>{navMap?.get(key)?.name}</a>
	{/each}
	</section>
	<section>
		<span>USERNAMEHERE</span>
	</section>
</header>

<!-- <slot /> -->
 {@render children()}

 <style>
 header {
	position: sticky;
	top: 0;
	background: #f9f;
	padding: 0.5rem;
	z-index: 1;
	display: grid;
	grid: auto / 3fr 1fr;
}

</style>