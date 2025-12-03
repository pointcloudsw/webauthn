import type { Collection } from "@mysql/xdevapi";
import { type AppDb, MySQLXAccessor, type ConnectionConfig, type MySqlDoc } from "./MySQLXAccessor";
import { env, loadEnvFile } from 'node:process';
import { type List, type Item } from '$lib/types/list';
import { projectlib } from "$lib/constants";
import type { int64 } from "@mysql/xdevapi/types/lib/Protocol/ScalarValues";
import { logger } from "$lib/logger";
// import { type int64 } from "@mysql/xdevapi/types/lib/Protocol/ScalarValues";
loadEnvFile(`.${projectlib}/server/.env`);

const adb: AppDb = {
    collection: `todo_lists`,
    cfg: {
        host: env.APP_DB_HOST || '',
        port: env.APP_DB_PORT,
        user: env.APP_DB_USR || '',
        password: env.APP_DB_PW || '',
        schema: env.APP_DB || ''
    }
};

export async function dbConnect(): Promise<MySQLXAccessor> {
    // Initialize the accessor if not already connected

    
    try {
            console.log('Accessor class initiating...');
            adb.db = new MySQLXAccessor(adb.cfg);
            await adb.db.connect();
    } catch (e) {
        throw new Error(`database connection failed: ${e}`);
    }
   
    return adb.db;
}

export async function getListsByUser(owner: string | number, listId?: string | number) : Promise<MySqlDoc[]> {
    let lists : MySqlDoc[] = [];
    let qry = `owner = :uid`;
    let parms = Object.assign({}, { uid: owner });
    
    if ( listId ) {
        qry += ` AND id = :lid`;
        parms = Object.assign(parms, { lid: listId });
    }

    if (owner){

        if ( !adb.db?.isConnected() ) await dbConnect();

        if ( adb.db )
            lists = await adb.db.find(
                adb.cfg.schema ?? '',
                adb.collection,
                qry,
                { 
                    bind: parms, 
                    sort: ["created desc"]
                }
            );
    }
    return lists;
}

export async function getListByListId(listId: number, user: string | number) : Promise<MySqlDoc[]> {
    let lists : MySqlDoc[];

    if (! ( user && listId ) ){
        lists = [];
        return lists;
    }

    if ( !adb.db?.isConnected() ) await dbConnect();

    if ( adb.db )
        lists = await adb.db.find(
            adb.cfg.schema ?? '',
            adb.collection,
            `owner = :uid AND id = :lid`, {
                bind: { 'uid': user, 'lid': listId }
            });
    else
        lists = [];

    return lists;
}


// export async function addList(list: List) : Promise<string[]> {
export async function addList(list: List) : Promise<string[]> {
    let result : string[];
    let coll : Collection;
    console.log('DATA BASE INPUT:');
    console.log(list);

    if (!adb.db) {
        throw new Error('Database not connected. Call dbConnect() first.');
    }

    coll = await adb.db.getCollection(adb.cfg.schema ?? '',adb.collection);
    if (!coll)
        throw new Error("DB collection found");
    
    result = await adb.db.insertOne(
        adb.cfg.schema ?? '',
        adb.collection,
        list
    );
    return result;
}

export async function editList(list: List) : Promise<int64> {
    let result : int64;
    let coll : Collection;

    if (!adb.db) {
        throw new Error('Database not connected. Call dbConnect() first.');
    }

    coll = await adb.db.getCollection(adb.cfg.schema ?? '',adb.collection);
    if (!coll)
        throw new Error("DB collection found");
    logger(`Updating database...\n{ Schema:${adb.cfg.schema},\nCollection:${adb.collection},\nOwner: ${list.owner},\nListID: ${list.id}}`);
    console.log(list);
    result = await adb.db.update(
        adb.cfg.schema ?? '',
        adb.collection,
        list,
        `owner = :uid AND id = :lid`,
        {
            bind: { 'uid': list.owner, 'lid': list.id }
        }
    );
    return result;
}


export async function delList(list: {id:number,owner:number}) : Promise<int64> {
    let result : int64;
    let coll : Collection;

    if (!adb.db) {
        throw new Error('Database not connected. Call dbConnect() first.');
    }

    coll = await adb.db.getCollection(adb.cfg.schema ?? '',adb.collection);
    if (!coll)
        throw new Error("DB collection found");
    
    result = await adb.db.delete(
        adb.cfg.schema ?? '',
        adb.collection,
        `owner = :uid AND id = :lid`,
        {
            bind: { 'uid': list.owner, 'lid': list.id }
        }
    );
    return result;
}

export async function editListItem(){
    
}
/*
export async function addListItem(listItem: Item){
    if (!adb.db) {
        throw new Error('Database not connected. Call dbConnect() first.');
    }

    coll = await adb.db.getCollection(adb.cfg.schema ?? '',adb.collection);
    if (!coll)
        throw new Error("DB collection found");
    
    result = await adb.db.insertOne(
        adb.cfg.schema ?? '',
        adb.collection,
        list
    );
    return result;    
}
*/
export async function delListItem(){
    
}