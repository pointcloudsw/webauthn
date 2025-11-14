<script lang="ts">
import { createList, updateList, getLists, deleteList } from './data.remote';


import { supportsPopover } from '$lib/lib';
	import { logger } from '$lib/logger';
	import { entries } from 'valibot';
let { data } = $props();
let { userId, username } = data;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

const createListModal = $state({value: false});
let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (createListModal?.value) createListDialog.showModal();
});

const updateListModal = $state({value: false});
let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (updateListModal?.value) updateListDialog.showModal();
});

</script>

<header>
		<button id="newList" onclick={()=>createListDialog?.showModal()}>New List</button>


</header>

<main>
	{#if userId}
		<section class="lists">
			<h1>Todo Lists</h1>

				<form {...deleteList} class="todo-list">
					{#each await getLists(userId) as list (list)}
					<div>
						<p>{list.id}</p>
						<p>{list.title}</p>
						<p>{list.owner}</p>
						<!-- <button {...updateList.fields.action.as('submit',['update', [ list.id, list.title, list.owner, list?.items ]])}>Update</button>
						<button {...updateList.fields.update.as('submit',[list.id,list.title,list.owner,list?.items])}>Save</button> -->
						<button {...deleteList.fields.delete.as('submit',[list.id, userId])}>DELETE</button>

						<button id="updateList" onclick={(e)=>{console.log(list.id, list.title, list.owner, e, e.target.parentElement, e.target);updateListDialog?.showModal()}}>Edit List</button>

						<div data-item={`list-${list.id}-items`} class="todo-items">
						{#each list?.items as i}
							<p data-item={`list-${list.id}-items-${i}`}>{i.text}
							{i.created}
							 {i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}

					</form>
		</section>

		
		<!-- see https://svelte.dev/tutorial/kit/other-handlers -->
		<dialog id="createListModalDialog" bind:this={createListDialog} onclose={()=> (createListModal.value=false)}>
			<form {...createList} enctype="multipart/form-data">
			<h2>List Entry</h2>
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

					<button type="reset">Clear</button>
					<button type="reset" onclick={()=>{createListDialog?.close(); createListModal.value=false}}>Cancel</button>
					<button type="submit" onclick={()=>{createListDialog?.close(); createListModal.value=false}}>Save</button>
			</form>
		</dialog>

		<dialog id="updateListModalDialog" bind:this={updateListDialog} onclose={()=> (updateListModal.value=false)}>
			<form {...updateList} enctype="multipart/form-data">
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
				<button>Save</button>
			</form>
		</dialog>
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
	/* grid: auto; */
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
	/* grid: auto; */
	/* grid-auto-flow: row; */
	border: 2px solid red;
}

</style>

