import { type MySqlDoc } from "$lib/server/database/MySQLXAccessor";

export interface List {
    id: string;
    items: string[];
    owner?: string | undefined;
    title?: string | undefined;
}

export {type MySqlDoc};