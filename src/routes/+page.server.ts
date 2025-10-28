import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth/session";
import { get2FARedirect } from "$lib/server/auth/2fa";

import type { Actions } from "./$types";
import { logger } from '$lib/exports';

export function load(event) {
	
	if ( event.locals?.user ){
		
		if (!event.locals.user.emailVerified)
			return redirect(302, "/auth/verify-email");
		
		if (!event.locals.user.registered2FA)
			return redirect(302, "/auth/2fa/setup");
	}

	if ( event.locals?.session && event.locals?.user ) {
		if (!event.locals?.session?.twoFactorVerified)
			return redirect(302, get2FARedirect(event.locals?.user));
	}

	// const username = event.locals?.user?.username ?? '';
	// const userId = event.locals.session?.userId ?? -1;
	const { user, session } = event.locals;
	return { user: user, session: session };
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	logger(`SESSION: ${event.locals.session}, USER: ${event.locals.user}, REFERER: ${event.request.referrer}, REDIRECT: ${event.request.redirect}, DESTINATION: ${event.request.destination}`);

	
// 	// if (event.locals.session === null) {
// 	// 	return fail(401, {
// 	// 		message: "Not authenticated"
// 	// 	});
// 	// }

// 	// Logout
// 	// if ( event.url.pathname === '/auth/logout' )
// 	// 	return redirect(302, event.url.href);
	
// 	// Login
// 	// if ( !( event.locals.session && event.locals.user && event.url.pathname !== '/' ) )
// 	// 	return redirect(302, "/auth/login");
	
// 	return redirect(302, event.url.href);
	
	// Login
	// if ( !( event.locals.session && event.locals.user && event.url.pathname !== '/' ) )
	// 	return redirect(302, "/auth/login");
	
	return redirect(302, event.url.href);
	
	// invalidateSession(event.locals.session.id);
	// deleteSessionTokenCookie(event);
}
