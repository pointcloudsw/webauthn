### Question
> How can I use Valibot with Typescript generics to create a validation helper that will perform safeParse and throw an error in case Valibot encounters validation issues?

### Answer
I'll help you create a TypeScript validation helper class using Valibot that performs safe parsing and throws errors on validation failures.I've created a comprehensive Valibot validation helper class for you! Here's what it includes:

## Key Features:

1. **`Validator.parse()`** - Validates data and throws a `ValidationError` if validation fails. This is what you asked for - it performs safeParse internally and throws on errors.

2. **`ValidationError` class** - A custom error class that captures all validation issues and provides a `getFormattedIssues()` method for easy error display.

3. **`Validator.validate()`** - Alternative method that returns a result object instead of throwing, useful when you want to handle errors without try-catch.

4. **`Validator.parseMany()`** - Validates arrays of items against the same schema, collecting all errors before throwing.

## Usage:

```typescript
// Basic usage - throws on error
const user = Validator.parse(UserSchema, formData);

// With custom error message
const user = Validator.parse(UserSchema, formData, "Invalid user data");

// Non-throwing alternative
const result = Validator.validate(UserSchema, formData);
if (result.success) {
  // use result.data
} else {
  // handle result.error
}
```

The helper class maintains full TypeScript type safety - the return type is automatically inferred from your Valibot schema!

## Code
```ts
import * as v from 'valibot';

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: v.Issue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  /**
   * Get a formatted string of all validation issues
   */
  getFormattedIssues(): string {
    return this.issues
      .map(issue => `  - ${issue.path?.map(p => p.key).join('.') || 'root'}: ${issue.message}`)
      .join('\n');
  }
}

/**
 * Validation helper class for Valibot
 */
export class Validator {
  /**
   * Validates data against a schema and throws an error if validation fails
   * @param schema - The Valibot schema to validate against
   * @param data - The data to validate
   * @param errorMessage - Optional custom error message
   * @returns The validated and typed data
   * @throws ValidationError if validation fails
   */
  static parse<TSchema extends v.BaseSchema>(
    schema: TSchema,
    data: unknown,
    errorMessage?: string
  ): v.Output<TSchema> {
    const result = v.safeParse(schema, data);

    if (!result.success) {
      const message = errorMessage || 'Validation failed';
      throw new ValidationError(message, result.issues);
    }

    return result.output;
  }

  /**
   * Validates data and returns a result object instead of throwing
   * @param schema - The Valibot schema to validate against
   * @param data - The data to validate
   * @returns Object with success flag and either data or error
   */
  static validate<TSchema extends v.BaseSchema>(
    schema: TSchema,
    data: unknown
  ): 
    | { success: true; data: v.Output<TSchema> }
    | { success: false; error: ValidationError } 
  {
    const result = v.safeParse(schema, data);

    if (!result.success) {
      return {
        success: false,
        error: new ValidationError('Validation failed', result.issues)
      };
    }

    return {
      success: true,
      data: result.output
    };
  }

  /**
   * Validates multiple data items against the same schema
   * @param schema - The Valibot schema to validate against
   * @param items - Array of items to validate
   * @returns Array of validated items
   * @throws ValidationError if any item fails validation
   */
  static parseMany<TSchema extends v.BaseSchema>(
    schema: TSchema,
    items: unknown[]
  ): v.Output<TSchema>[] {
    const results: v.Output<TSchema>[] = [];
    const errors: { index: number; issues: v.Issue[] }[] = [];

    items.forEach((item, index) => {
      const result = v.safeParse(schema, item);
      if (result.success) {
        results.push(result.output);
      } else {
        errors.push({ index, issues: result.issues });
      }
    });

    if (errors.length > 0) {
      const allIssues = errors.flatMap(e => 
        e.issues.map(issue => ({
          ...issue,
          message: `[Item ${e.index}] ${issue.message}`
        }))
      );
      throw new ValidationError(
        `Validation failed for ${errors.length} item(s)`,
        allIssues
      );
    }

    return results;
  }
}

// Example usage:

// Define a schema
const UserSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(0), v.maxValue(120)),
  role: v.optional(v.picklist(['admin', 'user', 'guest']))
});

// Example 1: Using parse (throws on error)
try {
  const user = Validator.parse(UserSchema, {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });
  console.log('Valid user:', user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:');
    console.error(error.getFormattedIssues());
  }
}

// Example 2: Using validate (returns result object)
const result = Validator.validate(UserSchema, {
  name: '',
  email: 'invalid-email',
  age: 150
});

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Validation errors:', result.error.getFormattedIssues());
}

// Example 3: Validating multiple items
try {
  const users = Validator.parseMany(UserSchema, [
    { name: 'Alice', email: 'alice@example.com', age: 25 },
    { name: 'Bob', email: 'bob@example.com', age: 30 }
  ]);
  console.log('All users valid:', users);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.message);
    console.error(error.getFormattedIssues());
  }
}
```