import * as v from 'valibot';

export const ListItemDTOSchema = v.object({
  id: v.optional(v.string()),
  // created: v.optional(v.string(v.isoDateTime())),
  created: v.optional(v.string()),
  modified: v.optional(v.string()),
  editable: v.boolean(),
  text: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Item text is required'),
    v.maxLength(1000, 'Item text must be 1000 characters or less')
  ),
});

export const ListDTOSchema = v.object({
  id: v.optional(v.string()),
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'List title is required'),
    v.maxLength(200, 'List title must be 200 characters or less')
  ),
  owner: v.string(),
  created: v.optional(v.string()),
  modified: v.optional(v.string()),
  editable: v.boolean(),
  items: v.optional(v.array(ListItemDTOSchema)),
});

export const CreateListInputSchema = v.object({
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'List title is required'),
    v.maxLength(200, 'List title must be 200 characters or less')
  ),
  editable: v.boolean(),
  items: v.optional(v.array(ListItemDTOSchema), []),
});

export const UpdateListInputSchema = v.object({
  title: v.optional(v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'List title is required'),
    v.maxLength(200, 'List title must be 200 characters or less')
  )),
  editable: v.optional(v.boolean()),
});

export const CreateListItemInputSchema = v.object({
  text: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Item text is required'),
    v.maxLength(1000, 'Item text must be 1000 characters or less')
  ),
  editable: v.boolean(),
});

export const UpdateListItemInputSchema = v.object({
  text: v.optional(v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Item text is required'),
    v.maxLength(1000, 'Item text must be 1000 characters or less')
  )),
  editable: v.optional(v.boolean()),
});

export const ReorderItemsInputSchema = v.pipe(
  v.array(v.string()),
  v.minLength(1, 'At least one item ID is required')
);
