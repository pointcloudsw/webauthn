<script lang="ts">
	import { page } from '$app/state';

	let daction : string = $derived(page.data.action);
	let dpath : string = $derived(page.data.path);
	let dusername : string = $derived(page.data.username);
	let action : string = page.data.action;
	let path : string = page.data.path;
	let username : string = page.data.username;
  console.log(`---- ↓ /+page.svelte (PAGE DATA) ↓ -----`);
  console.log(`NOT derived...`);
  console.log(`Action:`);
  console.log(action);
  console.log(`Path:`);
  console.log(path);
  console.log(`Username:`);
  console.log(username);
  console.log(`DERIVED...`);
  console.log(`Action:`);
  console.log(daction);
  console.log(`Path:`);
  console.log(dpath);
  console.log(`Username:`);
  console.log(dusername);
  console.log(`---- ↑ /+page.svelte (PAGE DATA) ↑ -----`);

</script>
<!-- <header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	<a href="/lists">Lists</a>
	<a href="/todo">Todo</a>
</header> -->

<main>
	<h1>{action === 'Logout' ? `Welcome aboard, ${username}!` : `Welcome, please login to continue`}</h1>
	<form method="post" action={path}>
		<button class="btn">{action}</button>
	</form>

</main>

<style>
  .btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #0070f3;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #005bb5;
  }
</style>
