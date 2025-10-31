import { type MySqlDoc } from "$lib/server/database/MySQLXAccessor";


export interface Item {
    created: string;
    dbid: string;
    due: string;
    editable: boolean;
    flag: number;
    id: number;
    listid: number;
    owner: number;
    priority: number;
    sequence: number;
    status: number;
    text: string;
};

export interface List {
    dbid: string;
    id: number;
    items: Item[];
    owner?: string | undefined;
    title?: string | undefined;
};

export {type MySqlDoc};