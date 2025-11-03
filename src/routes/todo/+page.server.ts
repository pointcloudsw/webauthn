import { fail, redirect, type RequestEvent } from "@sveltejs/kit";

import type { Actions } from "./$types";
import { PersistentListManager } from "$lib/server/list/PersistentListManager";
import { logger } from '$lib/exports';


export function load(event) {
	
	const username : string = event.locals?.user?.username ?? '';
	const userId : number = event.locals.session?.userId ?? -1;
	const plm : PersistentListManager = new PersistentListManager(userId);

	return { username, userId, plm };
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	logger(`SESSION: ${event.locals.session}, USER: ${event.locals.user}, REFERER: ${event.request.referrer}, REDIRECT: ${event.request.redirect}, DESTINATION: ${event.request.destination}`);
	
	return redirect(302, event.url.href);
}
