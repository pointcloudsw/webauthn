### Question
> How can I use Valibot with Typescript generics to create a validation helper that will perform safeParse and throw an error in case Valibot encounters validation issues?

### Answer
> Great question — this is a perfect use case for combining **Valibot** with **TypeScript generics** to build a reusable validation helper. Let’s break it down step by step.

---

## 🛠️ Goal
We want a helper function that:
1. Accepts a Valibot schema.
2. Runs `safeParse` on some input.
3. Returns the validated value if successful.
4. Throws an error if validation fails.

---

## ✅ Example Implementation

```ts
import { safeParse, Schema, InferOutput } from "valibot";

/**
 * Generic validation helper using Valibot
 * @param schema - Valibot schema to validate against
 * @param input - Input data to validate
 * @returns Validated data of type inferred from schema
 * @throws Error if validation fails
 */
export function validateOrThrow<TSchema extends Schema<any, any>>(
  schema: TSchema,
  input: unknown
): InferOutput<TSchema> {
  const result = safeParse(schema, input);

  if (!result.success) {
    // You can customize error handling here
    throw new Error(
      `Validation failed: ${JSON.stringify(result.issues, null, 2)}`
    );
  }

  return result.output;
}
```

---

## 🔍 How It Works
- `TSchema extends Schema<any, any>`  
  Ensures the helper accepts any Valibot schema.
- `InferOutput<TSchema>`  
  Automatically infers the correct TypeScript type for the validated output.
- `safeParse(schema, input)`  
  Returns `{ success: true, output }` or `{ success: false, issues }`.

---

## 🎯 Usage Example

```ts
import { object, string, number } from "valibot";

const UserSchema = object({
  name: string(),
  age: number(),
});

type User = InferOutput<typeof UserSchema>;

const user = validateOrThrow(UserSchema, {
  name: "Alice",
  age: 30,
});

console.log(user); // ✅ typed as User
```

If you pass invalid data:

```ts
validateOrThrow(UserSchema, { name: "Alice", age: "thirty" });
// ❌ Throws: Validation failed: [...]
```

---

## ✨ Benefits
- **Type-safe**: Output type is inferred from the schema.
- **Reusable**: Works with any Valibot schema.
- **Customizable**: You can format or wrap errors however you like (e.g., throw a custom `ValidationError` class).

---

👉 Would you like me to extend this helper to support **async validation** (e.g., if you’re using Valibot’s `async` schemas), or keep it strictly synchronous?


Perfect — let’s extend the helper so it works with both **synchronous** and **asynchronous** Valibot schemas.  

Valibot provides `safeParseAsync` for async validation, so we can mirror the same pattern we used before.

---

## 🔄 Extended Helper (Sync + Async)

```ts
import { safeParse, safeParseAsync, Schema, InferOutput } from "valibot";

/**
 * Validate synchronously with Valibot
 */
export function validateOrThrow<TSchema extends Schema<any, any>>(
  schema: TSchema,
  input: unknown
): InferOutput<TSchema> {
  const result = safeParse(schema, input);

  if (!result.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(result.issues, null, 2)}`
    );
  }

  return result.output;
}

/**
 * Validate asynchronously with Valibot
 */
export async function validateOrThrowAsync<TSchema extends Schema<any, any>>(
  schema: TSchema,
  input: unknown
): Promise<InferOutput<TSchema>> {
  const result = await safeParseAsync(schema, input);

  if (!result.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(result.issues, null, 2)}`
    );
  }

  return result.output;
}
```

---

## 🎯 Usage Examples

### Synchronous schema
```ts
import { object, string, number } from "valibot";

const UserSchema = object({
  name: string(),
  age: number(),
});

const user = validateOrThrow(UserSchema, { name: "Alice", age: 30 });
console.log(user); // ✅ { name: "Alice", age: 30 }
```

### Asynchronous schema
```ts
import { object, string, customAsync } from "valibot";

const AsyncUserSchema = object({
  name: string(),
  // Example: async check (e.g., uniqueness in DB)
  email: customAsync<string>(async (value) => {
    const exists = await fakeEmailCheck(value);
    return exists ? "Email already taken" : true;
  }),
});

async function run() {
  const user = await validateOrThrowAsync(AsyncUserSchema, {
    name: "Bob",
    email: "bob@example.com",
  });
  console.log(user);
}
```

---

## ✨ Key Benefits
- **Type-safe**: Both sync and async helpers infer the correct output type.
- **Reusable**: Works across all Valibot schemas.
- **Customizable**: You can replace the `Error` with a custom `ValidationError` class for richer error handling.

---

👉 Do you want me to show you how to **unify both sync and async into a single helper** (so you don’t have to call two different functions), or would you prefer keeping them separate for clarity?