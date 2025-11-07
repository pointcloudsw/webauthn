<script lang="ts">
import { createList, getLists } from './data.remote.js';
import EditListModal from './EditListModal.svelte';
import ListForm from './ListForm.svelte';
import { supportsPopover } from '$lib/lib.js';
import { showModal } from './modalState.svelte';

let { data } = $props();
let { userId, username } = data;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

// let showModal = $state(false);

</script>

<header>
	<!-- <a href="/">Home</a>
	<a href="/settings">Settings</a>
	{#if username}
		<a href="/auth/logout">Logout</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
	<p>{username ?? "Please login"}</p> -->


{#if !supportsPopover()}
	<!-- <button popovertarget="editModal" popovertargetaction="show"> -->
	<button popovertarget="editModal">
	New List
	</button>
	<div id="editModal" popover>
		<h2>Popover List Entry</h2>
		<!-- <ListForm data={{listId:1, userId}} bind:showModal={showModal.value}/> -->
		<form {...createList} enctype="multipart/form-data">
				<label>
					<h2>Title</h2>
					<input {...title.as('text')} />
				</label>
				<label>
					Editable
					<input {...editable.as('checkbox')} />
				</label>
				<label>
					Owner
					<input {...owner.as('number')} />
				</label>
				<label>
					Created
					<input {...created.as('text')} />
				</label>
				<label>
					ID
					<input {...id.as('number')} />
				</label>
				<label>
					DBID
					<input {...dbid.as('text')} />
				</label>
				<p>Items
					<label>
						Created
						<input {...items[0].created.as('text')} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as('text')} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as('checkbox')} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as('number')} />
					</label>
					<label>
						ID
						<input {...items[0].id.as('number')} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as('number')} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as('number')} />
					</label>
					<label>
						Status
						<input {...items[0].status.as('number')} />
					</label>
					<label>
						Description
						<input {...items[0].text.as('text')} />
					</label>
				</p>
				<!-- <button type="button" popovertarget="editModal" popovertargetaction="hide">Save</button> -->
				<button type="button" popovertarget="editModal" onclick={()=>(console.log(createList.fields))}>Save</button>
			</form>
		<!-- <button popovertarget="editModal" popovertargetaction="hide"> -->
			<!-- Save & Close -->
		<!-- </button> -->
	</div>
{:else}
	<button onclick={() => (showModal.value = true)}> New List (Modal)</button>


	<EditListModal bind:showModal={showModal.value}>
		{#snippet header()}
			<h2>Modal List Entry</h2>
			{/snippet}
			<ListForm data={{listId:1, userId}} />
	</EditListModal>
{/if}
</header>

<main>
	{#if userId}
		<section class="lists">
			<h1>Todo Lists</h1>
			<div class="todo-list">
				{#each await getLists(userId) as list}
					<div>
						<p>{list.title}</p>
						<p>{list.owner}</p>
						<div class="todo-items">
						{#each list?.items as i}
							<p>{i.text}
							{i.created}
							 {i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}
			</div>
		</section>

		
		<!-- see https://svelte.dev/tutorial/kit/other-handlers -->
		<section class="list new">

			<h1>New List</h1>
			<!-- <form {...createList} enctype="multipart/form-data">
				<label>
					<h2>Title</h2>
					<input {...title.as('text')} />
				</label>
				<label>
					Editable
					<input {...editable.as('checkbox')} />
				</label>
				<label>
					Owner
					<input {...owner.as('number')} />
				</label>
				<label>
					Created
					<input {...created.as('text')} />
				</label>
				<label>
					ID
					<input {...id.as('number')} />
				</label>
				<label>
					DBID
					<input {...dbid.as('text')} />
				</label>
				<p>Items
					<label>
						Created
						<input {...items[0].created.as('text')} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as('text')} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as('checkbox')} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as('number')} />
					</label>
					<label>
						ID
						<input {...items[0].id.as('number')} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as('number')} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as('number')} />
					</label>
					<label>
						Status
						<input {...items[0].status.as('number')} />
					</label>
					<label>
						Description
						<input {...items[0].text.as('text')} />
					</label>
				</p>
				<button type="button">Save</button>
			</form> -->
			
		</section>
	{/if}

</main>

<style>
/* form {
	display: grid;
	grid: auto / 1fr;
} */

main {
	display: grid;
	/* grid: 1fr 1fr / auto; */
	grid: auto;
}
main .list.new {
	background: slategrey;
}
main .lists {
	background: lightslategray;
}
main > section {
	padding: 0.5rem;
	block-size: min-content;
}
main > section > * {
	padding: 0.25rem;
}
.todo-list, .todo-items {
	display: grid;
	grid: auto;
	/* grid-auto-flow: row; */
	border: 2px solid red;
}

</style>

