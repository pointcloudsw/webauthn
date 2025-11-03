<script lang="ts">
	let { children, data } = $props();
	const { navMap } = data;
	const navKeys = navMap
</script>

<svelte:head>
	<title>Email and password example with 2FA and WebAuthn in SvelteKit</title>
</svelte:head>
<header>
	{#each [...navMap.keys()] as key}
		<a href={navMap.get(key).path}>{navMap.get(key).name}</a>
	{/each}
</header>

<!-- <slot /> -->
 {@render children()}
