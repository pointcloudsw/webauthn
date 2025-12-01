import * as schema from './schema';
import * as v from 'valibot';
import type {
  ID,
  ListDTO,
  CreateListInput, 
  UpdateListInput
} from './types';
import { ListEntity } from "./ListEntity.svelte";
import { validate } from './validate';
import { ValidationError } from './verror';
import type { RemoteQueryFunction } from '@sveltejs/kit';
import type { Schema } from '@mysql/xdevapi';
import { query } from '$app/server';
import { logger } from '$lib/logger';
import { loadLists } from './list.remote';

// List Manager Service
export class ListManager {
  private lists: Map<ID, ListEntity> = new Map();
  private ownerId: ID;

  constructor(ownerId: ID) {
    this.ownerId = ownerId;
  }

  async loadListsFromAPI(apiUrl: string): Promise<void> {
    try {
      const response = await fetch(`${apiUrl}/lists?owner=${this.ownerId}`);
      const data = await response.json();
      const validatedLists = validate(v.array(schema.ListDTOSchema), data);
      
      this.lists.clear();
      validatedLists.forEach(listData => {
        const list = new ListEntity(listData, this.ownerId);
        this.lists.set(list.id, list);
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error('Validation error loading lists:', error.getFieldErrors());
      }
      throw error;
    }
  }


  // loadListsFromRmtQry(owner: ID) : RemoteQueryFunction<ID,ListDTO[]>{
  // loadListsFromRmtQry(owner: Pick<ListDTO, 'owner'>) : void {
  async loadListsFromRmtQry() : Promise<ListDTO[]> {
    // let listsDto: ListDTO[];
    // TODO: handle the no owner case
    if (this?.ownerId){
      let input = { owner: this.ownerId };
      const listsDto = await loadLists(input);
      console.log(listsDto);

      // this.lists.clear();
      // if ( lists )
      //   lists.then( l => l.forEach( listData => 
      //     {
      //       const list = new ListEntity(listData, this.ownerId);
      //       this.lists.set(list.id, list);
      //     }
      //   ));
      return listsDto;
    }
      // return listsDto;
      return [];

  }

  createList(listData: CreateListInput): ListEntity {
    const validated = validate(schema.CreateListInputSchema, listData);
    // TODO:  Refactor / cleanup ListEntity constructor parms
    const list = new ListEntity(
      // { ...validated, items: validated.items ?? [] },
      {...validated, id: 
      '', owner: this.ownerId
       },
      this.ownerId, ''
    );
    this.lists.set(list.id, list);
    return list;
  }

  getList(listId: ID): ListEntity | undefined {
    return this.lists.get(listId);
  }

  getAllLists(): ListEntity[] {
    return Array.from(this.lists.values());
  }

  updateList(listId: ID, updates: UpdateListInput): boolean {
    const validated = validate(schema.UpdateListInputSchema, updates);
    const list = this.lists.get(listId);
    
    if (list) {
      if (validated.title !== undefined) list.setTitle(validated.title);
      if (validated.editable !== undefined) list.setEditable(validated.editable);
      return true;
    }
    return false;
  }

  deleteList(listId: ID): boolean {
    return this.lists.delete(listId);
  }

  async syncList(listId: ID, apiUrl: string): Promise<boolean> {
    const list = this.lists.get(listId);
    if (!list) return false;

    try {
      const response = await fetch(`${apiUrl}/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list.toDTO()),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to sync list:', error);
      return false;
    }
  }

  async createListOnServer(listId: ID, apiUrl: string): Promise<boolean> {
    const list = this.lists.get(listId);
    if (!list) return false;

    try {
      const response = await fetch(`${apiUrl}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list.toDTO()),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to create list:', error);
      return false;
    }
  }

  async deleteListOnServer(listId: ID, apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/lists/${listId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.lists.delete(listId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete list:', error);
      return false;
    }
  }
}