import * as v from 'valibot';

export const Item = v.object({
    created: v.optional(v.date(), (()=>new Date())),
    modified: v.optional(v.date()),
    dbid: v.optional(v.string()),
    due: v.optional(v.date()),
    editable: v.optional(v.boolean(), true),
    flag: v.optional(v.number()),
    id: v.optional(v.number()),
    priority: v.optional(v.number()),
    sequence: v.optional(v.number()),
    status: v.optional(v.number()),
    text: v.optional(v.string())
});

export type Item = v.InferOutput<typeof Item>;

export const List = v.object({
    created: v.optional(v.string()),
    modified: v.optional(v.string()),
    dbid: v.optional(v.string()),
    editable: v.optional(v.boolean(),true),
    id: v.optional(v.number()),
    /* items: v.optional(v.array(Item)), */
    items: v.optional(v.array(v.object({created: v.optional(v.string()),modified: v.optional(v.string()),dbid: v.optional(v.string()),editable: v.optional(v.boolean(), true),flag: v.optional(v.number()),id: v.optional(v.number()),priority: v.optional(v.number()),sequence: v.optional(v.number()),status: v.optional(v.number()),text: v.optional(v.string())}))),
    owner: v.optional(v.number()),
    title: v.optional(v.string())
});

export type List = v.InferOutput<typeof List>;

/*
const MinNumberSchema = v.pipe(v.number(), v.toMinValue(10));


const UrlSchema = v.union([v.pipe(v.string(), v.url()), v.literal('')]);

const ArrayLengthSchema = v.pipe(
  v.array(v.number()),
  v.minLength(1),
  v.maxLength(3)
);
*/



const ListKeyItem = v.union([v.string(),v.number()]);

type ListKeyItem = v.InferOutput<typeof ListKeyItem>;

export const ListKey = v.pipe(v.array(ListKeyItem), v.length(2));

export type ListKey = v.InferOutput<typeof ListKey>;


// export interface List {
//     created: Date;
//     dbid: string;
//     editable: boolean;
//     id: number;
//     items: Item[];
//     owner?: string | undefined;
//     title?: string | undefined;
// }
// const DomDataSet = new DOMStringMap();

// export const SourceEventData = v.object({
//   dataset: DomDataSet,
//   list: List
// });
// export type SourceEventData = v.InferOutput<typeof SourceEventData>;