---
title: Using Valibot and Typescript to achieve POJO / object literal indexing with strings
---

# Background
JavaScript supports indexing of Objects / Object Literals using dot / dotted decimal notation.  It also allows for these objects to be indexed by key values in the form of strings enclosed in brackets, similar to associative arrays for anyone who may be familiar with those.  This all works fine when working solely in JavaScript.



# Problem
When using these together with Typescript, however, things break.  Here's an example of the error you may see:
Element implicitly has an 'any' type because expression of type 'string' can't be used to index object.   No index signature with a parameter of type 'string' was found on type object.

Element implicitly has an 'any' type because expression of type 'string' can't be used to index object.   No index signature with a parameter of type 'string' was found on type object.

The problem is that when 

# Solutions
Follow these steps to fix the TypeScript error:

Define an index signature for the object: Use the syntax const myObj: { [key: string]: any } = {}; to allow string-based indexing.

Use a type alias with an index signature: Define a type: type MyObject = { [key: string]: any };. Declare the object: const myObj: MyObject = {};.

Use the Record utility type: Declare the object as const myObj: Record<string, any> = {};.

Use an interface with an index signature: Define an interface: interface MyInterface { [key: string]: any; } Declare the object: const myObj: MyInterface = {};.

Use keyof for stricter typing: If you have a predefined object, use keyof to ensure the key exists: const myObj = { propname: "value" }; const value = myObj[prop as keyof typeof myObj];

Adjust the TypeScript configuration: Modify tsconfig.json to include "suppressImplicitAnyIndexErrors": true if you want to suppress this error globally.

Use type casting as a last resort: Cast the key explicitly: myObj[prop as string] = "value";.

These solutions ensure TypeScript understands the structure of your object and resolves the error


# References
[Copilot](https://www.bing.com/search?q=Element+implicitly+has+an+%27any%27+type+because+expression+of+type+%27string%27+can%27t+be+used+to+index+object.+++No+index+signature+with+a+parameter+of+type+%27string%27+was+found+on+type+object.&form=ANNTH1&refig=6932ffd0704b457e86dc7ffba5e75174&pc=U531)

[Typescript error: TS7053 Element implicitly has an 'any' type](
https://stackoverflow.com/questions/56833469/typescript-error-ts7053-element-implicitly-has-an-any-type)
TypeScript Error TS7053 Solution: Fixing Implicit 'any' Type Issue
https://stefvanlooveren.me/blog/how-fix-error-ts7053-element-implicitly-has-any-type-because-expression-type-cant-be-used
Expression of type string can't be used to index type X | Total Type…
https://www.totaltypescript.com/concepts/type-string-cannot-be-used-to-index-type
Follow these steps to fix the TypeScript error:

Define an index signature for the object: Use the syntax const myObj: { [key: string]: any } = {}; to allow string-based indexing.

Use a type alias with an index signature: Define a type: type MyObject = { [key: string]: any };. Declare the object: const myObj: MyObject = {};.

Use the Record utility type: Declare the object as const myObj: Record<string, any> = {};.

Use an interface with an index signature: Define an interface: interface MyInterface { [key: string]: any; } Declare the object: const myObj: MyInterface = {};.

Use keyof for stricter typing: If you have a predefined object, use keyof to ensure the key exists: const myObj = { propname: "value" }; const value = myObj[prop as keyof typeof myObj];

Adjust the TypeScript configuration: Modify tsconfig.json to include "suppressImplicitAnyIndexErrors": true if you want to suppress this error globally.

Use type casting as a last resort: Cast the key explicitly: myObj[prop as string] = "value";.

These solutions ensure TypeScript understands the structure of your object and resolves the error


# Examples

// type ListItem = {
//     id: string | number | undefined;
//     text: string | undefined;
// };

// type List = {
//     id: string | number | undefined;
//     title: string | undefined;
//     items: ListItem[] | undefined;
// };
interface ListItem {
    id: string | number | undefined;
    text: string | undefined;
};

interface List {
    id: string | number | undefined;
    title: string | undefined;
    items: ListItem[] | undefined;
};

const o:List = {
    "id": 59,
    "title": "New Title for 59",
    "items": [
        {
            "id": 1,
            "text": "u\\4@$m)*W_wx2. _ +xJm%C",
        },
        {
            "id": 2,
            "text": "k /\"9\\79HU2*hC6+kF4mIzy",
        },
        {
            "id": 3,
            "text": "LadPu;Ek'/e{puV6`mbo'<o",
        }
    ],
};

const t:List = { id: undefined, title: undefined, items: undefined };
console.clear();
// for ( const {k:string, v:any} in Object.entries(o) ) { console.log(typeof prop); console.log(Array.isArray(prop)); }
console.log(Object.entries(o));
Object.entries(o).forEach( ([k, v]) =>{ t[k as keyof List] = v; console.log(t); });


