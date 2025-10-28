<script lang="ts">
	let { children, data } = $props();
	const { navRoutes } = data;

</script>

<svelte:head>
	<title>Email and password example with 2FA and WebAuthn in SvelteKit</title>
</svelte:head>
<header>
	{#each navRoutes as route}
		<a href={route.path}>{route.name}</a>
	{/each}
</header>

<!-- <slot /> -->
 {@render children()}
