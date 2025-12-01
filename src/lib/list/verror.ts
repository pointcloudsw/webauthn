import * as v from 'valibot';
// import * as schema from './schema';
import { ListDTOSchema, ListItemDTOSchema } from './schema';
import * as types from './types';


export class ValidationError extends v.ValiError<typeof ListDTOSchema | typeof ListItemDTOSchema> {
// export class ValidationError extends Error {

// export class ValidationError extends v.ValiError<v.InferIssue<typeof ListDTOSchema>> {
  constructor(public issues: [v.InferIssue<typeof ListDTOSchema>, ...v.InferIssue<typeof ListDTOSchema>[]]) {
    // super(['Validation failed']);
    // this.name = 'ValidationError';
    super(issues);
  }

  getFieldErrors(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const issue of this.issues) {
      const path = issue.path?.map(p => p.key).join('.') || 'root';
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    }
    return errors;
  }

  getFirstError(): string {
    return this.issues[0]?.message || 'Validation failed';
  }
}
