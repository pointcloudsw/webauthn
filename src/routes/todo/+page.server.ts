import { redirect, type RequestEvent } from "@sveltejs/kit";
import { delList } from "$lib/server/database/db";
import type { Actions } from "./$types";
import { logger } from '$lib/exports';


export function load(event) {

	// logger(`\n--------- ↓ /todo/+page.server.ts (load) ↓ -----------\n`);
	// console.log(`EVENT:`);
	// console.log(event);
	// logger(`\n--------- ↑ /todo/+page.server.ts (load) ↑ -----------\n`);

	
	const username : string = event.locals?.user?.username ?? '';
	const userId : number = event.locals.session?.userId ?? -1;

	return { username, userId };
}

export const actions: Actions = {
	default: action
	// delete: deleteList
} satisfies Actions;

async function action(event: RequestEvent) {

	// logger(`\n--------- ↓ /todo/+page.server.ts (action) ↓ -----------\n`);
	// console.log(`EVENT:`);
	// console.log(event);
	// logger(`\n--------- ↑ /todo/+page.server.ts (action) ↑ -----------\n`);

	logger(`SESSION: ${event.locals.session}, USER: ${event.locals.user}, REFERER: ${event.request.referrer}, REDIRECT: ${event.request.redirect}, DESTINATION: ${event.request.destination}`);
	
	return redirect(302, event.url.href);
}

// async function rmList(event:RequestEvent) {
// 	let result;
// 		// result = await delList(data);
// 		console.log(event);

// 	// logger(`Result: ${result.toString()}`);
// 	if ( result ){
// 		logger(`Refreshing...`);
// 		// await getLists(data.owner).refresh();
// 		logger(`Done.`);

// 	}
// }