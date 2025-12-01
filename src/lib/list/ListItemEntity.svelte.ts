import type { BL, DT, ID, ListDTO, ListItem, ListItemDTO, TXT } from "./types";
import { validate } from './validate';
import { ValidationError } from './verror';
import * as schema from './schema';
import * as v from 'valibot';

export class ListItemEntity {
  readonly id: ID;
  readonly created: DT;
  private _modified: DT;
  private _editable: BL;
  private _text: TXT;

  constructor(data: ListItemDTO, id?: ID) {
    const validated = validate(schema.ListItemDTOSchema, data);
    
    this.id = id || validated.id || crypto.randomUUID();
    this.created = validated.created ? new Date(validated.created) : new Date();
    this._modified = validated.modified ? new Date(validated.modified) : new Date();
    this._editable = validated.editable;
    this._text = validated.text;
  }

  get modified(): DT {
    return this._modified;
  }

  get editable(): BL {
    return this._editable;
  }

  get text(): TXT {
    return this._text;
  }

  setEditable(value: BL): void {
    this._editable = value;
    this._modified = new Date();
  }

  setText(value: TXT): void {
    const validated = validate(v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'Item text is required'),
      v.maxLength(1000, 'Item text must be 1000 characters or less')
    ), value);
    
    this._text = validated;
    this._modified = new Date();
  }

  toJSON(): ListItem {
    return {
      id: this.id,
      created: this.created,
      modified: this._modified,
      editable: this._editable,
      text: this._text,
    };
  }

  toDTO(): ListItemDTO {
    return {
      id: this.id,
      created: this.created.toISOString(),
      modified: this._modified.toISOString(),
      editable: this._editable,
      text: this._text,
    };
  }
}