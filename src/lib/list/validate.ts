import * as v from 'valibot';
// import * as schema from './schema';
import * as types from './types';
import { ValidationError } from './verror';


// Validation Helper
// export function validate<T>(schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>, data: unknown): T {
export function validate<TSchema extends v.BaseSchema<any,any,any>>(
  schema: TSchema,
  data: unknown): v.InferOutput<TSchema> {
    const result = v.safeParse(schema, data);
  
    if (!result.success) {
      // throw new ValidationError<TSchema>(result.issues);
      throw new ValidationError(result.issues);
    }
  
    return result.output;
}