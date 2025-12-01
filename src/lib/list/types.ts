import * as v from 'valibot';
import * as schema from './schema';

// Type definitions
type PrimitiveTypes = {
  ID: string;
  DT: Date;
  BL: boolean;
  TXT: string;
};

export type ID = PrimitiveTypes['ID'];
export type DT = PrimitiveTypes['DT'];
export type BL = PrimitiveTypes['BL'];
export type TXT = PrimitiveTypes['TXT'];


// Infer types from schemas
export type ListItemDTO = v.InferOutput<typeof schema.ListItemDTOSchema>;
export type ListDTO = v.InferOutput<typeof schema.ListDTOSchema>;
export type CreateListInput = v.InferOutput<typeof schema.CreateListInputSchema>;
export type UpdateListInput = v.InferOutput<typeof schema.UpdateListInputSchema>;
export type CreateListItemInput = v.InferOutput<typeof schema.CreateListItemInputSchema>;
export type UpdateListItemInput = v.InferOutput<typeof schema.UpdateListItemInputSchema>;


export interface ListItem {
  id: PrimitiveTypes['ID'];
  created: PrimitiveTypes['DT'];
  modified: PrimitiveTypes['DT'];
  editable: PrimitiveTypes['BL'];
  text: PrimitiveTypes['TXT'];
}

export interface List {
  id: PrimitiveTypes['ID'];
  title: PrimitiveTypes['TXT'];
  owner: PrimitiveTypes['ID'];
  created: PrimitiveTypes['DT'];
  modified: PrimitiveTypes['DT'];
  editable: PrimitiveTypes['BL'];
  items: ListItem[];
}
