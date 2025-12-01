import type { BL, CreateListItemInput, DT, ID, List, ListDTO, TXT, UpdateListItemInput } from "./types";
import { ListItemEntity } from './ListItemEntity.svelte';
import { validate } from './validate';
import { ValidationError } from './verror';
import * as schema from './schema';
import * as v from 'valibot';

export class ListEntity {
  readonly id: ID;
  readonly owner: ID;
  readonly created: DT;
  private _modified: DT;
  private _title: TXT;
  private _editable: BL;
  private _items: ListItemEntity[];

  constructor(data: ListDTO, owner?: ID, id?: ID) {
    const validated = validate(schema.ListDTOSchema, data);
    
    this.id = id || validated.id || crypto.randomUUID();
    this.owner = owner || validated.owner || '';
    this.created = validated.created ? new Date(validated.created) : new Date();
    this._modified = validated.modified ? new Date(validated.modified) : new Date();
    this._title = validated.title;
    this._editable = validated.editable;
    this._items = (validated.items || []).map(item => new ListItemEntity(item));
  }

  get modified(): DT {
    return this._modified;
  }

  get title(): TXT {
    return this._title;
  }

  get editable(): BL {
    return this._editable;
  }

  get items(): ListItemEntity[] {
    return [...this._items];
  }

  setTitle(value: TXT): void {
    const validated = validate(v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'List title is required'),
      v.maxLength(200, 'List title must be 200 characters or less')
    ), value);
    
    this._title = validated;
    this._modified = new Date();
  }

  setEditable(value: BL): void {
    this._editable = value;
    this._modified = new Date();
  }

  addItem(itemData: CreateListItemInput): ListItemEntity {
    const validated = validate(schema.CreateListItemInputSchema, itemData);
    const item = new ListItemEntity(validated);
    this._items.push(item);
    this._modified = new Date();
    return item;
  }

  removeItem(itemId: ID): boolean {
    const index = this._items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this._items.splice(index, 1);
      this._modified = new Date();
      return true;
    }
    return false;
  }

  updateItem(itemId: ID, updates: UpdateListItemInput): boolean {
    const validated = validate(schema.UpdateListItemInputSchema, updates);
    const item = this._items.find(i => i.id === itemId);
    
    if (item) {
      if (validated.text !== undefined) item.setText(validated.text);
      if (validated.editable !== undefined) item.setEditable(validated.editable);
      this._modified = new Date();
      return true;
    }
    return false;
  }

  reorderItems(newOrder: ID[]): boolean {
    const validated = validate(schema.ReorderItemsInputSchema, newOrder);
    
    if (validated.length !== this._items.length) {
      // throw new ValidationError([{
      //   kind: 'validation',
      //   type: 'min_length',
      //   input: validated,
      //   expected: `"${this._items.length}"`,
      //   received: `"${this._items.length}"`,
      //   message: `Expected ${this._items.length} item IDs but received ${validated.length}`,
      //   requirement: undefined,
      //   path: undefined,
      //   issues: undefined,
      //   lang: undefined,
      //   abortEarly: undefined,
      //   abortPipeEarly: undefined,
      // }]);
      throw new ValidationError([{
        kind: 'validation',
        type: 'min_length',
        input: validated[0],
        expected: '>=1',
        received: `${this._items.length}`,
        message: `Expected ${this._items.length} item IDs but received ${validated.length}`,
        requirement: 1,
        path: undefined,
        issues: undefined,
        lang: undefined,
        abortEarly: undefined,
        abortPipeEarly: undefined,
      }]);
    }
    
    const reordered: ListItemEntity[] = [];
    for (const id of validated) {
      const item = this._items.find(i => i.id === id);
      if (!item) {
        // throw new ValidationError([{
        //   kind: 'validation',
        //   type: 'custom',
        //   input: id,
        //   expected: null,
        //   received: String(id),
        //   message: `Item with ID "${id}" not found in list`,
        //   requirement: undefined,
        //   path: undefined,
        //   issues: undefined,
        //   lang: undefined,
        //   abortEarly: undefined,
        //   abortPipeEarly: undefined,
        // }]);
        throw new ValidationError([{
          kind: 'validation',
          type: 'min_length',
          input: id,
          expected: '>=1',
          received: `${Number(id)}`,
          message: `Item with ID "${id}" not found in list`,
          requirement: 1,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
        }]);
      }
      reordered.push(item);
    }
    
    this._items = reordered;
    this._modified = new Date();
    return true;
  }

  toJSON(): List {
    return {
      id: this.id,
      title: this._title,
      owner: this.owner,
      created: this.created,
      modified: this._modified,
      editable: this._editable,
      items: this._items.map(item => item.toJSON()),
    };
  }

  toDTO(): ListDTO {
    return {
      id: this.id,
      title: this._title,
      owner: this.owner,
      created: this.created.toISOString(),
      modified: this._modified.toISOString(),
      editable: this._editable,
      items: this._items.map(item => item.toDTO()),
    };
  }
}