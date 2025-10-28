<script lang="ts">
	import { logger } from "$lib/logger";

	let { data } = $props();

	let action =  data?.username && data?.userId ? 'Logout' : 'Login';
	let wmsg = action === 'Logout' ? `Welcome aboard, ${data.username}!` : `Welcome, please login to continue`;
</script>
<!-- <header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	<a href="/lists">Lists</a>
	<a href="/todo">Todo</a>
</header> -->

<main>
	<h1>{wmsg}</h1>
	<!-- <form method="post" action={`/auth/${action.toLowerCase()}`}>
		<button>{action}</button>
	</form> -->
	<a href={`/auth/${action.toLowerCase()}`} class="btn">{action}</a>

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
