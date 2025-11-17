<script lang="ts">
import { createList, getLists, deleteList, listUpdate, updateList } from './data.remote';
import EditListModal from './EditListModalOther.svelte';
import { boolState } from '$lib/state.svelte';

let { data } = $props();
let { userId, username } = data;
let bigEvent = $state('');
createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

const createListModal = $state({value: false});
let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (createListModal?.value) createListDialog.showModal();
});

const updModal = boolState();

let updateListModal = $state({value: false});
let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (updModal.get()) updateListDialog.showModal();
});

/*
const editList = (e:any) => {
	
	let listId = e.target.attributes['data-list_id']?.value;
	let list = document.querySelector("div[data-list_id='"+listId+"']");
	let dialogForm = document.querySelector("dialog > #updateListForm");
	let dfInputs = dialogForm?.querySelectorAll("input");

	list?.childNodes.forEach(n => { if ( n?.attributes?.length > 0 ) {
		
		if ( n.attributes.getNamedItem('data-list_id')?.value === listId ) {
			console.log(listId);
		}
		console.log(dialogForm);
	}
	});

	let targetTitle = updateListDialog.querySelector("#updateListTitle");
	targetTitle = e.target.parentElement.querySelector("#listTitle");
	updateListDialog?.showModal();
}
*/

</script>

<header>
		<button id="newList" onclick={()=>createListDialog?.showModal()}>New List</button>


</header>

<main>
	{#if userId}

		<section class="lists">
			<h1>Todo Lists</h1>

				<div class="todo-list">
					<dialog id="updateListDialog" oncommand={(e:any)=>bigEvent=e.source.dataset}>
						<!-- <EditListModal {bigEvent} /> -->
						<form {...listUpdate} id="updateListForm" name="updateListForm" >
							<label for="owner">Owner: {bigEvent.owner}</label>
							<label for="id">ID: {bigEvent.list_id}</label>
							<!-- <input name="owner" type="readonly" value={bigEvent.owner} /> -->
							<!-- </label> -->
							<label for="created">Created: {bigEvent.created}</label>
							<label for="modified">Modified: {bigEvent.created}</label>
							<label for="editable">Editable:
							<input name="editable" type="checkbox" value={bigEvent.editable} />
							</label>
							<label for="items">Items:
							<input name="items" value={bigEvent.items} />
							</label>
							
							<button>OK</button>
						</form>
					</dialog>
					<form {...deleteList} name="deleteListForm" id="deleteListForm"></form>

					{#each await getLists(userId) as list (list)}
					<div data-list_id={list.id}>
						<p data-list_id={list.id}>{list.id}</p>
						<p data-list_title={list.title}>{list.title}</p>
						<p data-list_owner={list.owner}>{list.owner}</p>
						<p data-list_owner={list.owner}>{list.owner}</p>

						
						<button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}">DELETE</button>
						

						<button type="submit" name="updateListFormButton" command="show-modal" commandfor="updateListDialog" data-list_id={list.id}  data-owner={userId} data-items={list.items}  data-editable={list.editable} data-created={list.created}>Edit List</button>


						<div data-list_items={`list-${list.id}-items`} class="todo-items">
						{#each list?.items as i}
							<p data-list_item_id={i.id}>{i.id}</p>
							<p data-list_item_text={i.text}>{i.text}</p>
							<p data-list_item_created={i.created}>{i.created}</p>
							<p data-list_item_editable={i.editable}>{i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}

					<!-- </form> -->
				</div>
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


		<!-- <dialog id="updateListModalDialog"> -->
		 <!--
		<dialog bind:this={updateListDialog} onclose={()=> (updateListModal.value=false)}>
			<form {...updateList} id="updateListForm" enctype="multipart/form-data">

				<label>
					<h2>Title</h2>
					<p>{updateList.fields.title.value()}</p>
					<input id="updateListTitle" {...title.as('text')}/>
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
			<button commandfor="updateListModalDialog" command="request-close">Close</button>
		</dialog>
	-->
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
form {
	display: grid;
	grid: auto / 1fr 1fr;
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

