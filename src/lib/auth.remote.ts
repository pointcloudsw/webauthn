// $lib/auth.remote.ts

import { getRequestEvent, query } from '$app/server';
import { logger } from '$lib/exports';

export const getLocals = query(async () => {
    const { locals, request } = await getRequestEvent();
    
    
    logger(`LOCALS: ${locals.session?.userId}, ${locals.user?.username}, HEADERS: ${request.headers.entries().reduce((v,k)=>{return `\n${k.toString().replace(',',': ')}${v}`},`\n`)}`);
    return { session: locals.session, user: locals.user, headers: request.headers.entries().reduce((v,k)=>{return `\n${k.toString().replace(',',': ')}${v}`},`\n`) };
    // return locals?.user ? { username: locals.user?.username, id: locals.user?.id } : { username: '', id: -1 };
});
