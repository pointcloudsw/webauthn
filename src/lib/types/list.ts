import * as v from 'valibot';

export const ItemSchema = v.object({
    created: v.optional(v.union([v.string(),v.number()]), (()=>new Date()).toString()),
    modified: v.optional(v.union([v.string(),v.number()])),
    due: v.optional(v.union([v.string(),v.number()])),
    editable: v.optional(v.boolean(), true),
    flag: v.optional(v.number()),
    id: v.optional(v.number()),
    priority: v.optional(v.number()),
    sequence: v.optional(v.number()),
    status: v.optional(v.number()),
    text: v.optional(v.string())
});

export const ListSchema = v.object({
    created: v.optional(v.union([v.string(),v.number()])),
    modified: v.optional(v.union([v.string(),v.number()])),
    editable: v.optional(v.boolean(),true),
    _id: v.optional(v.string()),
    items: v.optional(v.array(ItemSchema)),
    owner: v.optional(v.number(), -1),
    title: v.optional(v.string())
});

export const ListKeySchema = v.pick(ListSchema, [ '_id', 'owner' ]);

export const ItemKeySchema = v.pick(v.object({...ListKeySchema.entries, ...ItemSchema.entries }), [ '_id', 'owner', 'id' ]);

export type Item = v.InferOutput<typeof ItemSchema>;
export type List = v.InferOutput<typeof ListSchema>;
export type ListKey = v.InferOutput<typeof ListKeySchema>;
export type ItemKey = v.InferOutput<typeof ItemKeySchema>;

