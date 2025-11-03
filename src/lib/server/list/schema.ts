
export interface Item {
    created: Date;
    dbid: string;
    due: Date;
    editable: boolean;
    flag: number;
    id: number;
    priority: number;
    sequence: number;
    status: number;
    text: string;
}

export interface List {
    created: Date;
    dbid: string;
    editable: boolean;
    id: number;
    items: Item[];
    owner?: string | undefined;
    title?: string | undefined;
}