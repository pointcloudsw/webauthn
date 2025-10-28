import { type RequestEvent } from "@sveltejs/kit";

export async function load({route}) {
	const r = await route;
	return { r };
}