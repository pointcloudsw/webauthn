import { json, text, redirect, type RemoteQueryFunction, type RemoteForm } from '@sveltejs/kit';

import * as v from 'valibot';
import { type List, type ListKey, type Item, ListSchema, ListKeySchema } from '$lib/types/list';
import { form, query } from "$app/server";
import { addList, delList,getListsByUser, getListByListId,editList } from '$lib/server/database/db';

// import { getLocals } from '$lib/auth.remote';
import { refreshAll } from '$app/navigation';
import { logger } from '$lib/exports';



// export const getLists = query( v.object( { userId: v.union( [ v.number(), v.string() ] ), listId: v.optional( v.union([v.string(),v.number()]))} ), async qry => {
export const getLists = query( ListKeySchema, async qry => {
    console.log('Getting lists by user and/or listId...');
    console.log('qry:');
    console.log(qry);

	// let { owner, _id = '' } = qry;

	// if ( !qry?.owner ) return [] as List[];

	const lists = qry?.owner ? await getListsByUser(qry as ListKey) as unknown as List[] : [] as List[];
	
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


// export const createList=form(list, async data => {
export const createList = form(ListSchema, async data => {
	console.log('CREATE LIST DATA:');
	console.log(data);
	
	// let { created, editable, items, modified, owner, title } = data;
	// _id = Number(_id);
	data.owner = Number(data.owner);
		// TODO: add try-catch and validation of owner
	// const result = await addList({created, editable, modified, items, owner, title});
	const result = await addList(data as unknown as List);

	logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		await getLists({owner: data.owner}).refresh();
		logger(`Done.`);

	}
	return result;
	}
);

export const deleteList=form(ListKeySchema, async data => {
	console.log(data);
	if ( data ) {
		let result;
		
		// let [ owner, _id ] : ListKey = data.deleteListFormButton.toString().split(',').map(v => Number(v));
	
		
	logger(`DATA: ${data}, OWNER: ${data.owner}, LISTID: ${data._id}`);
	// if ( id && owner )
	try {
		data.owner = Number(data.owner);

		// result = await delList({_id, owner});
		result = await delList(data as unknown as ListKey);

	// logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		// await getLists({userId: owner}).refresh();
		await getLists({owner: data.owner}).refresh();
		logger(`Done.`);

	}
} catch(err) { throw err}
	return result;
	
	}
}
);

// experimental
export const listUpdate = form(ListSchema, async data => {
	let result;
	// const list: List = {
	// 	editable: false
	// list._id: '',
	// list.created: '',
	// list.modified: '',
	// list.owner: -1,
	// list.title: ''
	// };

	

// TODO:  use context and/or cookie/session, database ID / listId and userID to validate and confirm that submitter is authorized to update the record 

	logger('Data:');
	console.log(data);
	if ( data ){



	logger(`DATA: ${data}, OWNER: ${data.owner}, LISTID: ${data._id}, EDITABLE: ${data.editable}`);
	if ( data._id && data.owner )
	try {	
		// let { id, created, modified, editable, owner, title } = data;
		// console.log('EDITABLE:');
		// console.log(editable);

		// list._id = id
		// list.created = String(created);
		// list.modified = String(modified);
		// list.editable = Boolean(editable);
		// list.owner = Number(owner);
		// list.title = String(title);

		
		result = await editList(data as List);
	

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