<script lang="ts">
import * as rf from './data.remote';
// import { getLocals } from "$lib/auth.remote";
import { type List } from "$lib/schema";

// const { session, user } = await getLocals();
let { data } = $props();

const { title, items } = rf.createList.fields;


let lists : List[];
let list : List;

</script>

<header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	{#if data.username}
		<a href="/auth/logout">Logout</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
	<!-- <p>{user?.username ?? "Please login"}</p>
	<a href="/auth/login">{user?.id ? "Logout" : "Login" }</a> -->
	<p>{data?.username ?? "Please login"}</p>
</header>

<main>
	{#if data?.userId}
		<h1>Todo Lists</h1>
		<div class="todo-list">
			{#each await rf?.getLists() as list}
				<div>
					<p>{list.title}</p>
					<p>{list.owner}</p>
					<div class="todo-items">
					{#each list?.items as item}
						<p>{item}</p>
					{/each}
					</div>
				</div>
			{:else}
				<p>no records found</p>
			{/each}
		</div>

	<!-- see https://svelte.dev/tutorial/kit/other-handlers -->

		<h1>New List</h1>
		<form {...rf.createList} enctype="multipart/form-data">
			<label>
				<h2>Title</h2>
				<input {...title.as('text')} />
			</label>

			<label>
				<h2>Add item</h2>
				<input
					type="text"
					autocomplete="off"
					onkeydown={async (e) => {
						if (e.key !== 'Enter') return;

						const input = e.currentTarget;
						const text = input.value;
						const response = await 
					}}
				/>
			</label>
			<button onclick={async () => await rf.getLists().refresh()}>Save</button>
		</form>
		
	{/if}

</main>

<style>
.todo-list, .todo-items {
	display: grid;
	grid: auto;
	/* grid-auto-flow: row; */
	border: 2px solid red;

}
</style>

