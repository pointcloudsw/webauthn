import type { Collection } from "@mysql/xdevapi";
import { MySQLXAccessor, type ConnectionConfig, type MySqlDoc } from "./MySQLXAccessor";
import { env, loadEnvFile } from 'node:process';
import { type List } from '$lib/schema';
import { projectlib } from "$lib/constants";

loadEnvFile(`.${projectlib}/server/.env`);



interface AppDb {
    cfg: ConnectionConfig;
    collection: string;
    db?: MySQLXAccessor;  // Fixed: Removed angle brackets
}



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

export async function getListsByUser(user: string | number) : Promise<MySqlDoc[]> {
    let lists : MySqlDoc[];

    if (!user) return [];

    if ( !adb.db?.isConnected() ) await dbConnect();

    if ( adb.db )
        lists = await adb.db.find(
            adb.cfg.schema ?? '',
            adb.collection,
            `owner = :uid`,
            { 
                bind: { uid: user }, 
                sort: ["created desc"]
            }
        );
    else
        return [];


    return lists;
}

export async function addList(list: {owner: string | number, title: string, items: Item[]}) : Promise<string[]> {
    let result : string[];
    let coll : Collection;

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

export async function delList(){

}
export async function editList(){

}

export async function editListItem(){
    
}
export async function addListItem(input){
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
export async function delListItem(){
    
}