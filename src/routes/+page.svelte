<script lang="ts">
	import { logger } from "$lib/logger";

	let { data } = $props();
	let { action, path, userid, username } = data;

	logger(`\n----- / -----\nUSERNAME: ${username}, SESSIONUSERID: ${userid}`);

	let wmsg = action === 'Logout' ? `Welcome aboard, ${username}!` : `Welcome, please login to continue`;
</script>
<!-- <header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	<a href="/lists">Lists</a>
	<a href="/todo">Todo</a>
</header> -->

<main>
	<h1>{wmsg}</h1>
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
