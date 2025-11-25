<script lang="ts">
	import { logger } from "$lib/logger";
	import { createList, getLists, deleteList, listUpdate } from "./data.remote";
	// import * as v from 'valibot';

	let { data } = $props();
	let { userId, username } = data;

	type ID = number | string | undefined;
	type DT = number | string | Date | undefined;
	type BL = boolean | number | string | undefined;
	type TXT = string | undefined;

	type EventDataSetItem = {
		id: ID; // system generated
		created: DT; // system generated
		modified: DT; // system generated
		editable: BL; // client checkbox
		text: TXT; // client textarea
	};
	type EventDataSet = {
		id: ID; // system generated
		title: TXT; // client input
		owner: ID; // system generated
		created: DT; // system generated
		modified: DT; // system generated
		editable: BL; // client checkbox
		items: EventDataSetItem[] | undefined; // client may add, remove, change or rearrange items
	};

	let domEvtStrMap: DOMStringMap = $state() as DOMStringMap;
	// let evtDataSetItem: EventDataSetItem = $state({}) as EventDataSetItem;
	// const evtDataSetItem: EventDataSetItem = {
	// 	id: undefined,
	// 	created: undefined,
	// 	editable: undefined,
	// 	text: undefined
	// };
	let evtDataSetItem: EventDataSetItem = $state({
		id: undefined,
		created: undefined,
		modified: undefined,
		editable: undefined,
		text: undefined
	});

	// let btnEvtData: EventDataSet = $state({}) as EventDataSet;
	// const btnEvtData: EventDataSet = {
	// 	id: undefined,
	// 	created: undefined,
	// 	editable: undefined,
	// 	owner: undefined,
	// 	title: undefined,
	// 	items: [ evtDataSetItem ]
	// };
	let btnEvtData: EventDataSet = $state({
		id: undefined,
		created: undefined,
		modified: undefined,
		editable: undefined,
		owner: undefined,
		title: undefined,
		items: [ evtDataSetItem ]
	});

	createList.fields.created.set(new Date().toString());
	createList.fields.editable.set(true);
	createList.fields.owner.set(userId);

	const { created, dbid, editable, id, items, owner, title } = createList.fields;

	const createListModal = $state({ value: false });
	let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement;
	$effect(() => {
		if (createListModal?.value) createListDialog.showModal();
	});
	const updateListModalState = $state({ value: false });
	let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
	let list: HTMLElement | null;
	let listItems: HTMLElement | null;
	let qS = "";
	// let listId: number = $state(-1);
	let listItem = "";
	let idx = '';

	$effect(() => {
		if (updateListModalState?.value === true) {


			updateListDialog?.showModal();
		} else {
			updateListDialog?.close();
		}
	});
	// $effect(()=>{$inspect(btnEvtData);});

// TODO: find a better solution to populating the list edit modal, that still adheres to the page as data source principle
function populateListModal(listId:number){
	console.log(`\n\nPopulating List Modal\n\nButton Event Data with data from List #:${listId}\n`);
	
	if ( btnEvtData ) {
	console.log(`\n\nClearing Button Event Data\n\n`);
		btnEvtData.id = undefined;
		btnEvtData.created = undefined;
		btnEvtData.modified = undefined;
		btnEvtData.editable = undefined;
		btnEvtData.owner = undefined;
		btnEvtData.title = undefined;
		if ( btnEvtData?.items ) {
	console.log(`\n\nClearing Button Event Item Count:\n ${btnEvtData?.items.length} \n`);
			btnEvtData?.items.forEach( item => {
	console.log(`\n\nClearing Button Event Item ID:\n ${item.id} \n`);
				item.id = undefined
				item.created = undefined
				item.modified = undefined
				item.editable = undefined
				item.text = undefined
			});
			delete btnEvtData.items;
		}
	}
	if ( evtDataSetItem?.id ) {
		evtDataSetItem.id = undefined;
		evtDataSetItem.created = undefined;
		evtDataSetItem.modified = undefined;
		evtDataSetItem.editable = undefined;
		evtDataSetItem.text = undefined;
	}

	if (listId > -1) {
		btnEvtData.id = Number((btnEvtData?.id && Number(btnEvtData?.id) > -1) ? btnEvtData?.id : listId);

		console.log(btnEvtData);
		qS = `[data-list='${btnEvtData.id}']`;
		list = document?.querySelector(qS);
		console.log(list);

		if (list) {
			btnEvtData.created = list?.querySelector(`[data-list_created]`)?.textContent;

			btnEvtData.modified = list?.querySelector(`[data-list_modified]`)?.textContent;

			btnEvtData.owner = Number(list?.querySelector(`[data-list_owner]`)?.textContent);

			btnEvtData.title = list?.querySelector(`[data-list_title]`)?.textContent;

			listItems = list?.querySelector(`[data-list-items]`);
			console.log(listItems);

			// TODO: renovate this entire construct, starting with how we're instantiation evtDataSetItem (currently instantiated by setting invalid base values to the object; but also including how we're having to cycle through all elements regardless of if they contain valid dataset attribute types.  One idea would be to limit the list item query to search for those with a new data attribute such as data-type=list-item
			if ( listItems?.childElementCount )
				listItems
				.childNodes
				.forEach( ( listItem:any ) => { listItem
					.childNodes
					.forEach ( ( listItemElement:any ) => {
						if ( listItemElement.dataset ){ 
							// console.log('Node:');
							// console.log(listItemElement);
							// console.log('...has dataset:');
							// console.log(listItemElement.dataset);
							idx = listItemElement.dataset['name'] as string;
					// assign dynamically using bracket notation and an any-cast to satisfy TypeScript
							(evtDataSetItem as any)[idx] = listItemElement.dataset['value'];
						}
					})

					// evtDataSetItem.id = Number(n.dataset['list-item_id']);
					// evtDataSetItem.created = n.dataset['list-item_created'];
					// evtDataSetItem.editable = n.dataset['list-item_editable'];
					// evtDataSetItem.text = n.dataset['list-item_text'];
					
					// push a shallow copy so subsequent mutations don't overwrite previously pushed objects
					
					console.log('evtDataSetItem:');
					console.log({...evtDataSetItem});

					// TODO:  The renovation todo at the top of this construct also applies to the statements below
					btnEvtData.items = btnEvtData.items || [];
					if ( evtDataSetItem?.id && evtDataSetItem.id != -1 && btnEvtData.items[btnEvtData.items.length-1]?.id != evtDataSetItem.id)
						btnEvtData.items.push({ ...evtDataSetItem })
					// btnEvtData.items.push(evtDataSetItem);
					console.log('Event Data Items:');
					console.log(btnEvtData.items);
					evtDataSetItem.id = undefined;
					evtDataSetItem.created = undefined;
					evtDataSetItem.modified = undefined;
					evtDataSetItem.editable = undefined;
					evtDataSetItem.text = undefined;

				})
		}
	}
	console.log('Raw Event Data:');
	console.log(btnEvtData);
	console.log('Json Event Data:');
	console.log(JSON.stringify(btnEvtData));
}



function rmAndAppendReadonlyFormInputs(docForm:string,el:string,val: string){
	logger(`Updating: ${docForm} ${el} with value ${val}...`);
	let qSdel = `input[name='${el}']`;
	let qSadd = `[data-field='${el}']`;
	
	// Remove all (hopefully none, but just in case) arbitrary form input fields added by client
	document.forms[docForm as any].querySelectorAll(qSdel).forEach( e => e.remove() );

	// Add new form inputs to identify and match record to be updated
	let newTag = document.createElement('input');
	let newAttribute = document.createAttribute('name');
	let insAfter = document.forms[docForm as any].querySelector(qSadd);

	newAttribute.value = el;
	newTag.setAttributeNode(newAttribute)
	newAttribute = document.createAttribute('value')
	newAttribute.value = val;
	newTag.setAttributeNode(newAttribute);

	if ( insAfter )
		insAfter.insertAdjacentElement('afterend',newTag);
	else
		document.forms[docForm as any].appendChild(newTag);	

	
	logger(`Form update complete.`);
	console.log(document.forms[docForm as any]);

}

function restoreUpdateFormStaticValues(docForm:string) : void {

	logger(`Updating docForm...`);
	console.log(document.forms[docForm as any]);

	// List Modified Date
	// TODO:  update modified date only when user actually changed something in the list or in list items, if user escaped out or hit cancel, then modified date should not be updated, but if 'Save' button was activated and pressed, then modified date should be updated

	// when written, remember to remove these input fields from the dialog input form as they'll be manually added to the form inside this method instead


	rmAndAppendReadonlyFormInputs(docForm,'modified',(new Date()).toISOString());
	rmAndAppendReadonlyFormInputs(docForm,'id',btnEvtData.id as string);
	rmAndAppendReadonlyFormInputs(docForm,'owner',btnEvtData.owner as string);
	rmAndAppendReadonlyFormInputs(docForm,'created',btnEvtData.created as string ?? '');

	// document.forms[docForm as any].elements['id' as any].attributes['value' as any].value = btnEvtData.id as string;
	// document.forms[docForm as any].elements['owner' as any].attributes['value' as any].value = btnEvtData.owner as string;
	console.log(document.forms[docForm as any].elements);
	document.forms[docForm as any].childNodes.forEach( c => console.log(c));
}
</script>


 <!--
// Got it — you want a SvelteKit + Valibot example where dynamic fields are validated in real-time on the client before submission.
// Here’s a concise, working pattern you can adapt.

// Example: Real-time Validation of Dynamic Fields with Valibot in SvelteKit
// Svelte<script lang="ts">
// 	import { writable, derived } from 'svelte/store';
// 	import { object, string, minLength, email, parse } from 'valibot';

// 	// Dynamic form fields store
// 	const fields = writable([
// 		{ name: 'email', value: '' },
// 		{ name: 'username', value: '' }
// 	]);

// 	// Valibot schema
// 	const schema = object({
// 		email: string([email('Invalid email format')]),
// 		username: string([minLength(3, 'Username must be at least 3 characters')])
// 	});

// 	// Errors store
// 	const errors = writable<Record<string, string>>({});

// 	// Validate whenever fields change
// 	fields.subscribe(($fields) => {
// 		const data = Object.fromEntries($fields.map(f => [f.name, f.value]));
// 		try {
// 			parse(schema, data);
// 			errors.set({});
// 		} catch (err: any) {
// 			const errMap: Record<string, string> = {};
// 			err.issues?.forEach((issue: any) => {
// 				errMap[issue.path[0]] = issue.message;
// 			});
// 			errors.set(errMap);
// 		}
// 	});

// 	// Derived store to check if form is valid
// 	const isValid = derived(errors, $errors => Object.keys($errors).length === 0);

// 	function updateField(index: number, value: string) {
// 		fields.update(f => {
// 			f[index].value = value;
// 			return [...f];
// 		});
// 	}

// 	function submitForm() {
// 		if ($isValid) {
// 			alert('Form submitted!');
// 		}
// 	}
// </script>

// <form on:submit|preventDefault={submitForm}>
// 	{#each $fields as field, i}
// 		<div>
// 			<label>{field.name}</label>
// 			<input
// 				type="text"
// 				bind:value={field.value}
// 				on:input={(e) => updateField(i, e.target.value)}
// 			/>
// 			{#if $errors[field.name]}
// 				<p class="error">{$errors[field.name]}</p>
// 			{/if}
// 		</div>
// 	{/each}

// 	<button type="submit" disabled={!$isValid}>Submit</button>
// </form>

// <style>
// 	.error { color: red; font-size: 0.9em; }
// </style>


// How it works:

// fields store holds dynamic form fields (could be generated from API or user input).
// Valibot schema defines validation rules.
// fields.subscribe runs validation on every change, updating errors in real-time.
// isValid derived store enables/disables the submit button.
// No server round-trip — all validation happens client-side before submission.


// If you want, I can extend this so new fields can be added dynamically and still be validated instantly. That would make it perfect for forms where users can add/remove inputs on the fly.
// Do you want me to extend it that way?
  -->


<header>
	<button id="newList" onclick={() => createListDialog?.showModal()}>New List</button>
</header>

<main>
	{#if userId}
		<!-- <dialog id="updateListDialog"
			bind:this={updateListDialog}
			onbeforetoggle={(e:any)=>{ 
				if ( e.newState === 'open' ) populateListModal(listId) as undefined}}
			onclose={()=>{
				if ( updateListModalState.value === true )
					updateListModalState.value = false;
				console.log('Closing dialog and completing submission')
			}}
			onsubmit={() => {updateListModalState.value = false;}}
		> -->
		<dialog id="updateListDialog"
			bind:this={updateListDialog}
			onclose={()=>{
				if ( updateListModalState.value === true )
					updateListModalState.value = false;
				console.log('Closing dialog and completing submission')
			}}
			onsubmit={() => {updateListModalState.value = false;}}
		>
			<p>{btnEvtData?.title ?? "No Title Found"}</p>
			<form {...listUpdate} id="updateListForm" name="updateListForm">
				<p data-field="id">ID: {btnEvtData?.id || ""}</p>
				<!-- <input {...id.as('number')} name="id" type="hidden" value={btnEvtData?.id} />				 --> 
				<!-- <input {...id.as('number')} name="id" type="hidden" value={btnEvtData?.id} /> -->
				<!-- <input {...id.as(['hidden', btnEvtData.id])} name="id" type="hidden" value={btnEvtData.id} />				 -->
				 <!-- {@debug listUpdate} -->
				<!-- <input {...id.as(btnEvtData.id) } name="id" type="hidden" />				 -->
				<p data-field="owner">Owner: {btnEvtData.owner}</p>
				<!-- <input {...owner.as('number')} name="owner" type="hidden" value={btnEvtData?.owner} /> -->
				<!-- <input {...owner.value()} name="owner" type="hidden" value={btnEvtData?.owner} /> -->
				<!-- <input {...listUpdate.fields.owner.set(btnEvtData.owner as number)} name="owner" type="hidden" />				 -->
				<p data-field="created">Created: {btnEvtData?.created || ""}</p>
				<!-- <input {...created.as('text')} name="created" type="hidden" value={btnEvtData?.created} /> -->
				<p data-field="modified">Modified: {btnEvtData?.modified || ""}</p>
				<label for="title">Title:</label>
				<input {...title.as('text')} id="title" name="title" type="text" value={btnEvtData?.title || '' } />
				<label for="editable">Editable:</label>
				<input {...editable.as('checkbox')} name="editable" id="editable" type="checkbox" value={btnEvtData?.editable ?? false} {btnEvtData?.editable && `checked`}/>
				<section>
					<!-- <label for="items">Items:</label> -->
					<p data-field="items">{btnEvtData?.items || ""}</p>
					<h3>Items:</h3>
						{console.log(btnEvtData.items)}
					{#if btnEvtData?.items }
						<h3>Item Type: {typeof btnEvtData.items}</h3>
						<h3>Item Count: {btnEvtData.items.length}</h3>
						{console.log(btnEvtData.items)}
						{#each btnEvtData?.items as i, iidx}
							{console.log(i)}
							<p>{console.log(i)}</p>
							<label for="id_{i?.id}">ID: {i?.id}</label>
							<!-- <input name="item_id_{i?.id}" type="readonly" value={i.id || ''} /> -->
							<input {...items[iidx].id.as('number')} id="id_{i?.id}" name="id_{i?.id}" type="hidden" value={i?.id} />

							<label for="created_{i?.id}">Created: {i?.created}</label>
							<input {...items[iidx].created.as('text')} name="created_{i?.id}" id="created_{i?.id}"  type="hidden" value={i?.created || ''} />
							<label for="modified_{i?.id}">Modified: {i?.modified}</label>
							<label for="item_txt_{i?.id}">Todo:</label>
							<input {...items[iidx].text.as('text')} name="item_txt_{i?.id}" id="item_txt_{i?.id}" type="textarea" value={i.text || ''} />
							<label for="item_editable_{i?.id}">Editable:</label>
							<!-- <input {...i?.editable} name="item_editable" type="checkbox" value={i.editable || ''} /> -->
							<input {...items[iidx].editable?.as('checkbox')} name="item_editable_{i?.id}" id="item_editable_{i?.id}" type="text" />
						{/each}
					{/if}
				</section>
				<!-- <button onclick={()=>updateListModalState.value = false && this.close()}>OK</button> -->
				<!--
					TODO: Relocate the onclick form value corrections to either client form validation or to the listUpdate remote function 
				-->
				<!-- <button>OK</button> -->
				<!-- <button onclick={()=>{document.forms['updateListForm' as any].elements['id' as any].nodeValue = btnEvtData.id as string; document.forms['updateListForm' as any].elements['owner' as any].nodeValue = btnEvtData.owner as string}}>OK</button> -->
				 <!-- TODO:  In the meantime, move these cleanups to their own function where static values from both the main form and from the individual form items can be saved back to the form -->
				<!-- <button onclick={()=>{document.forms['updateListForm' as any].elements['id' as any].attributes['value' as any].value = btnEvtData.id as string; document.forms['updateListForm' as any].elements['owner' as any].attributes['value' as any].value = btnEvtData.owner as string;}}>OK</button> -->
				<button onclick={()=>{restoreUpdateFormStaticValues('updateListForm')}}>OK</button>
			</form>
		</dialog>
		<form {...deleteList} name="deleteListForm" id="deleteListForm"></form>

		<section class="lists">
			<h1>Todo Lists</h1>

			<div class="todo-list">
				{#each await getLists(userId) as list (list)}
					<div data-name="list" data-value={list.id} data-list={list.id}>
						<p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
						<p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p>
						<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
						<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
						<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p>
						<p data-name="editable" data-value={list.editable} data-list_editable={list.editable}>{list.editable}</p>

						<button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}">DELETE</button>

						<button name="updateListFormButton" onclick={() => { updateListModalState.value = true;populateListModal(list?.id as number) as undefined; console.log('UPDATE FORM BUTTON');console.log(btnEvtData)}}>Edit List</button>

						<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
							<h3>Array?:{Array.isArray(list?.items)}</h3>
							<h5>Type?:{typeof list?.items}</h5>
							<h5>Values?:{JSON.stringify(list?.items)}</h5>
							{#each list?.items as item (item)}
								<div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
									<p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
									<p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
									<p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
									<p data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</p>
									<p data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</p>
								</div>
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
		<dialog id="createListModalDialog" bind:this={createListDialog} onclose={() => (createListModal.value = false)}>
			<form {...createList} enctype="multipart/form-data">
				<h2>List Entry</h2>
				<label>
					<h2>Title</h2>
					<input {...title.as("text")} />
				</label>
				<label>
					Editable
					<input {...editable.as("checkbox")} />
				</label>
				<label>
					Owner
					<input {...owner.as("number")} />
				</label>
				<label>
					Created
					<input {...created.as("text")} />
				</label>
				<label>
					ID
					<input {...id.as("number")} />
				</label>
				<label>
					DBID
					<input {...dbid.as("text")} />
				</label>
				<p>
					Items
					<label>
						Created
						<input {...items[0].created.as("text")} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as("text")} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as("checkbox")} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as("number")} />
					</label>
					<label>
						ID
						<input {...items[0].id.as("number")} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as("number")} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as("number")} />
					</label>
					<label>
						Status
						<input {...items[0].status.as("number")} />
					</label>
					<label>
						Description
						<input {...items[0].text.as("text")} />
					</label>
				</p>

				<button type="reset">Clear</button>
				<button
					type="reset"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Cancel</button
				>
				<button
					type="submit"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Save</button
				>
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
	}
	form > *:not(button){
		grid: auto / 1fr 1fr;
	}
	form > button {
		/* gap: 1rem 0rem 0rem 0rem; */
		margin: 1rem 0rem;
		padding: 0.51rem 0rem;
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
	.todo-list,
	.todo-items {
		display: grid;
		/* grid: auto; */
		/* grid-auto-flow: row; */
		border: 2px solid red;
	}
</style>
