import { RefillingTokenBucket } from "$lib/server/auth/rate-limit";
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "$lib/server/auth/session";
import { sequence } from "@sveltejs/kit/hooks";

import { redirect, type Handle, type ServerInit } from "@sveltejs/kit";

import { dbConnect } from "$lib/server/database/db";
import { resolve } from "$app/paths";
import { logger } from "$lib/exports";

const bucket = new RefillingTokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	logger(`ROUTEID: ${event.route?.id}, REFERRER: ${event.request?.referrer}, eURL: ${event.url}, rURL: ${event.request.url}, METHOD: ${event?.request?.method}, SOURCEIP: ${event?.getClientAddress()}`);

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
	
	logger(`TOKEN: ${token}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, METHOD: ${event?.request?.method}`);

	// Validate session state
	const { session, user } = token ? validateSessionToken(token) : { session: null, user: null };

	logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, METHOD: ${event?.request?.method}, SOURCEIP: ${event?.getClientAddress()}`);

	// If session is valid, refresh cookie
	if ( (token && session && user) ) {

		setSessionTokenCookie(event, token, session.expiresAt);

		logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, METHOD: ${event?.request?.method}`);


	} else {

		deleteSessionTokenCookie(event);
		event.locals.user = null;
		event.locals.session = null;
		logger(`TOKEN: ${token}, SESSION: ${session?.userId}, USER: ${user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}, METHOD: ${event?.request?.method}`);

	}

	event.locals.session = session;
	event.locals.user = user;
	// console.log(event.request.body.);
	// console.log(event.request.headers);
	// console.log(event.request.body);
	// console.log(event.request.formData.length);
	logger(`Resolving event ${event}`);
	return await resolve(event);
};

const redirectHandle: Handle = async ({ event, resolve }) => {

	const { request, route, url } = event;
	const { session, user } = event.locals;

	logger(`USERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}, METHOD: ${event?.request?.method}, SOURCEIP: ${event?.getClientAddress()}`);


	if ( !( session && user ) )
		if ( ! ( url.pathname.startsWith('/auth/') || route.id?.startsWith('/auth/') || route.id === '/' ) ) {
	
			logger(`\n----- REDIRECTING to / -----\nUSERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}, METHOD: ${event?.request?.method}`);

			return await redirect(303, '/');
		}
	
		logger(`\n----- RESOLVING EVENT REQUEST / -----\nUSERNAME: ${user?.username}, SESSIONUSERID: ${session?.userId}, ROUTEID: ${route.id}, REFERRER: ${request?.referrer}, eURL: ${url}, rURL: ${request.url}, METHOD: ${event?.request?.method}`);


	return await resolve(event);
};

export const init: ServerInit = async () => {
	await dbConnect();
};


export const handle = sequence(rateLimitHandle, authHandle, redirectHandle);
