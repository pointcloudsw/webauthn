import { RefillingTokenBucket } from "$lib/server/auth/rate-limit";
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "$lib/server/auth/session";
import { sequence } from "@sveltejs/kit/hooks";

import { redirect, type Handle, type ServerInit } from "@sveltejs/kit";

import { dbConnect } from "$lib/server/database/db";
import { resolve } from "$app/paths";
import { logger } from "$lib/exports";

const bucket = new RefillingTokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	// Note: Assumes X-Forwarded-For will always be defined.
	const clientIP = event.request.headers.get("X-Forwarded-For");
	if (clientIP === null) {
		return resolve(event);
	}
	let cost: number;
	if (event.request.method === "GET" || event.request.method === "OPTIONS") {
		cost = 1;
	} else {
		cost = 3;
	}
	if (!bucket.consume(clientIP, cost)) {
		return new Response("Too many requests", {
			status: 429
		});
	}
	return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {

	// Get session cookie from request
	const token = event.cookies.get("session");
	
	logger(`TOKEN: ${token}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);

	// Validate session state
	const { session, user } = token ? validateSessionToken(token) : { session: null, user: null };

	logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);

	// If session is valid, refresh cookie
	if ( (token && session && user) ) {

		setSessionTokenCookie(event, token, session.expiresAt);

		logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);


	} else {

		deleteSessionTokenCookie(event);
		event.locals.user = null;
		event.locals.session = null;
		logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);

	}

	event.locals.session = session;
	event.locals.user = user;

	return await resolve(event);
};

const redirectHandle: Handle = async ({ event, resolve }) => {

	const { request, route, url } = event;
	const { session, user } = event.locals;

	logger(`USERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}`);


	if ( !( session && user ) )
		if ( ! ( url.pathname.startsWith('/auth/') || route.id?.startsWith('/auth/') || route.id === '/' ) ) {
	
			logger(`\n----- REDIRECTING to / -----\nUSERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}`);

			return redirect(307, '/');
		}
	
		logger(`\n----- RESOLVING EVENT REQUEST / -----\nUSERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}`);

		// if (event.url.pathname.startsWith('/auth/logout') ) {
		// 	// return redirect(307, '/');
		// event.url.pathname = '/';
		// } else if ( !token && event.url.pathname !== '/' ) {

		// logger(`TOKEN: ${token}, SESSION: ${event.locals?.session?.userId}, USER: ${event.locals?.user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, PATHNAME: ${event?.url?.pathname}`);

		// // return redirect(307, '/auth/login');
		// event.url.pathname = '/auth/login';


		// logger(`TOKEN: ${token}, SESSION: ${event.locals?.session?.userId}, USER: ${event.locals?.user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, PATHNAME: ${event?.url?.pathname}`);

		// 	// return redirect(307, '/auth/login');
		// 	// return resolve(event, '/auth/login');
		// 	// return await resolve(event);
		// } else {
		// 	event.url.pathname = '/';
		// logger(`TOKEN: ${token}, SESSION: ${event.locals?.session?.userId}, USER: ${event.locals?.user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, PATHNAME: ${event?.url?.pathname}`);
		// }



	return await resolve(event);
};

export const init: ServerInit = async () => {
	// loadEnvFile("/home/pcs/sw/tdapp/webauthn/src/lib/server/.env");
	await dbConnect();
};


export const handle = sequence(rateLimitHandle, authHandle, redirectHandle);
