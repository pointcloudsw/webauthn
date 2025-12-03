import { json, text, redirect, type RemoteQueryFunction, type RemoteForm } from '@sveltejs/kit';

import * as v from 'valibot';
import { List, ListKey, type Item } from '$lib/types/list';
import { form, query } from "$app/server";
import { addList, delList,getListsByUser, getListByListId,editList } from '$lib/server/database/db';

// import { getLocals } from '$lib/auth.remote';
import { refreshAll } from '$app/navigation';
import { logger } from '$lib/exports';



export const getLists = query( v.object( { userId: v.union( [ v.number(), v.string() ] ), listId: v.optional( v.union([v.string(),v.number()]))} ), async qry => {
    console.log('Getting lists by user and/or listId...');
    console.log('qry:');
    console.log(qry);

	let { userId, listId = '' } = qry;

	if ( !userId ) return [] as List[];

	const lists = await getListsByUser(userId, listId) as unknown as List[];
	
	return lists;
});


const list = v.object({
	created: v.optional(v.string()),
	modified: v.optional(v.string()),
	dbid: v.optional(v.string()),
	editable: v.optional(v.boolean(), true),
	id: v.optional(v.union([v.string(),v.number()]), -1),
	items: v.optional(v.array(v.object({created: v.optional(v.string()),modified: v.optional(v.string()),dbid: v.optional(v.string()),editable: v.optional(v.boolean(), true),flag: v.optional(v.number()),id: v.optional(v.number()),priority: v.optional(v.number()),sequence: v.optional(v.number()),status: v.optional(v.number()),text: v.optional(v.string())}))),
	owner: v.optional(v.union([v.string(),v.number()]), -1),
	title: v.optional(v.string(), '')
});
// const listKey = v.object({ id: v.number(), owner: v.number()});
/*
export const getList = query( 'unchecked', async qryFltr => {
	let [ listId, listOwner ] = qryFltr;

	const lists = await getListByListId(listId, listOwner) as unknown as List[];
	return lists;
});
*/

export const createList=form(list, async data => {
	console.log('CREATE LIST DATA:');
	console.log(data);
	let { created, dbid, editable, id, items, modified, owner, title } = data;
	id = Number(id);
	owner = Number(owner);
	const result = await addList({created, dbid, editable, id, modified, items, owner, title});

	logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		await getLists({userId: owner as number}).refresh();
		logger(`Done.`);

	}
	return result;
	}
);

// let listKey: ListKey;
export const deleteList=form('unchecked', async data => {
	// const listKey: ListKey = [ -1, -1 ];
	console.log(data);
	if ( data ) {
		let result;
		let [ owner, id ] : ListKey = data.deleteListFormButton.toString().split(',').map(v => Number(v));
	// let [ id, owner ] = data.delete.toString().split(',').map(e => Number(e));
	// let i = data.get('id') as number;
	// console.log(data.id.split(','));
	logger(`DATA: ${data}, OWNER: ${owner}, LISTID: ${id}`);
	// if ( id && owner )
	try {
		result = await delList({id, owner});

	// logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		await getLists({userId: owner}).refresh();
		logger(`Done.`);

	}
} catch(err) { throw err}
	return result;
	
	}
}
);

// experimental
export const listUpdate=form('unchecked', async data => {
	let result;
	const list: List = { editable: false };
	list.id = undefined;
	list.created = undefined;
	list.modified = undefined;
	list.owner = undefined;
	list.title = undefined;
	// list.items = undefined;
// const listKey: ListKey = [ -1, -1 ];

// TODO:  use context and/or cookie/session, database ID / listId and userID to validate and confirm that submitter is authorized to update the record 

	logger('Data:');
	console.log(data);
	// if ( data.update ){
	if ( data ){


	// let [ id, owner ] = data.update.toString().split(',').map(e => Number(e));
	// let i = data.get('id') as number;
	// console.log(data.id.split(','));
	logger(`DATA: ${data}, OWNER: ${data.owner}, LISTID: ${data.id}, EDITABLE: ${data.editable}`);
	if ( data.id && data.owner )
	try {	
		let { id, created, modified, editable, owner, title } = data;
		console.log('EDITABLE:');
		console.log(editable);

		list.id = Number(id);
		list.created = String(created);
		list.modified = String(modified);
		list.editable = Boolean(editable);
		list.owner = Number(owner);
		list.title = String(title);
		// list.items = items;
		// result = await delList({id, owner});
		// result = true;
		// let info = data.update.toString().split(','); 
		// logger(...info);
		console.log(list);
		result = await editList(list);
	

	// logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		// await getLists(owner).refresh();
		logger(`Done.`);

	}
} catch(err) { throw err}
	return result;
	}
 }
);

// experimental
/*
export const listAction=form('unchecked', async data => {
	let result;

	if ( data.action ){
	let [ action, id, owner ] = data.update.toString().split(',').map(e => Number(e));
	logger(`DATA: ${data}, OWNER: ${owner}, LISTID: ${id}`);
	if ( id && owner ) {

	switch (action) {
		case 'update':
			console.log('update');
			break;
		default:
			console.log(action);
	}
	try {
		result = true;
	let info = data.action.toString().split(','); 
	logger(...info);
	console.log(data.action);

	if ( result ){
		logger(`Refreshing...`);
		await getLists(owner).refresh();
		logger(`Done.`);

	}
} catch(err) { throw err}
	return result;
}
	}
 }
);
*/


// const modifyList = form( async ({}) => {});
// const removeList = command( async ({}) => {});
// const removeListItem = form( async ({}) => {});
// const modifyListItem = form( async ({}) => {});
/*
const createListItem = form(	v.object({
		due: v.string(),
		editable: v.boolean(),
		flag: v.number(),
		id: v.number(),
		listid: v.number(),
		owner: v.number(),
		priority: v.number(),
		sequence: v.number(),
		status: v.number(),
		text: v.string()
	}),
	async ({due, editable, flag, id, listid, owner, priority, sequence, status, text}) => {
		let user;
		if ( !( user = (await getUser()).id ) ){
			throw new Error("user not found");
			return [ 'user not found' ];
		}

		const result : string[] = await addListItem({due, editable, flag, id, listid, owner, priority, sequence, status, text});

		// if ( result ) refreshAll();

		return result;
	});
	*/