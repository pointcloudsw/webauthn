import type { ListDTO, ID } from "./types";
import { query } from "$app/server";
import { type RemoteQueryFunction } from "@sveltejs/kit";
import * as schema from './schema';
import { validate } from "./validate";
import { ValidationError } from "./verror";
import * as v from 'valibot';
import { getListsByUser } from '$lib/server/database/db';
import { logger } from "$lib/logger";


// loadListsFromRmtQry(owner: ID) : RemoteQueryFunction<ID,ListDTO[]>{
//   loadListsFromRmtQry(owner: ID) : RemoteQueryFunction<ID,Promise<void>> {
// export const loadLists : RemoteQueryFunction<ID,Promise<ListDTO[]>> = query( schema.ListDTOSchema['~types']?.input?.owner ?? '-1',
// export const loadLists : RemoteQueryFunction<ID,Promise<ListDTO[]>> = query( schema.ListDTOSchema,
// export const loadLists : RemoteQueryFunction<Pick<ListDTO,'owner'>,ListDTO[]> = query( v.pick(schema.ListDTOSchema,['owner']),
// export const loadLists : RemoteQueryFunction<Pick<ListDTO,'owner'>,ListDTO[]> = query( v.pick(schema.ListDTOSchema,['owner']),
export const loadLists : RemoteQueryFunction<{ owner: string },ListDTO[]> = query( v.pick(schema.ListDTOSchema,['owner']),
      async input => {
        // const lists = getListsByUser(owner);
        // return lists;
        let data: ListDTO[] = [];
        if ( input?.owner )
          try {
            data = await getListsByUser(input.owner) as unknown as ListDTO[];
            console.log('DATA:');
            console.log(data);
            const validatedLists : ListDTO[] = validate(v.array(schema.ListDTOSchema), data);
            console.log('VALIDATED LISTS:');
            console.log(validatedLists);
            return validatedLists;
          } catch (error) {
            if (error instanceof ValidationError) {
              console.error('Validation error loading lists:', error.getFieldErrors());
              logger(`Validation error loading lists: ${error.getFieldErrors()}`);
            }
            throw error;
          }
        return data;
      }
);