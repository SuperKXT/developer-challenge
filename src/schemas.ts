import { z } from 'zod';

export const dbIdSchema = z.number().int().min(1).brand('db-id');

export type DbId = (typeof dbIdSchema)['_output'];

export const parsedDbIdSchema = z.preprocess((val) => Number(val), dbIdSchema, {
	invalid_type_error: 'Id must be a number',
});

export const todoSchema = z.strictObject({
	id: dbIdSchema,
	title: z.string(),
	visible: z.boolean(),
	completed: z.boolean(),
});

export type Todo = (typeof todoSchema)['_output'];

export const callToActionSchema = z.strictObject({
	id: dbIdSchema,
	title: z.string(),
	visible: z.boolean(),
	link: z.string().url(),
});

export type CallToAction = (typeof callToActionSchema)['_output'];

export const dbSchema = z.strictObject({
	todos: z.array(todoSchema),
	callToActions: z.array(callToActionSchema),
});

export type Db = (typeof dbSchema)['_output'];

export const apiResponseSchema = z.discriminatedUnion('error', [
	z.strictObject({ error: z.literal(false), data: z.unknown() }),
	z.strictObject({
		error: z.literal(true),
		message: z.string(),
		description: z.string().optional(),
	}),
]);

export type ApiResponse = (typeof apiResponseSchema)['_output'];
