import { navMap } from '$lib/constants';
import { logger } from "$lib/logger";

export function load() {
	// logger(`\n--------- ↓ /+layout.server.ts (load) ↓ -----------\n`);
	// logger(`\n--------- ↑ /+layout.server.ts (load) ↑ -----------\n`);


	return { navMap };
}