import { HttpResponse, delay } from 'msw';
import { z } from 'zod';

import { db } from './db.js';
import { createRoute } from './helpers/api.helpers.js';
import { callToActionSchema, todoSchema } from './schemas.js';

const res = async <T extends Obj | Obj[]>(response: T) => {
	await delay();
	return HttpResponse.json(response);
};

export const api = {
	todos: {
		get: createRoute({
			method: 'get',
			path: '/todo',
			response: z.array(todoSchema),
			mock: async () => {
				await delay();
				return res(db.get('todos'));
			},
		}),
		getById: createRoute({
			method: 'get',
			path: '/todo/:id',
			response: todoSchema,
			mock: async ({ params }) => {
				await delay();
				return res(db.getById('todos', params.id));
			},
		}),
		add: createRoute({
			method: 'post',
			path: '/todo',
			body: todoSchema.omit({ id: true }),
			response: todoSchema,
			mock: async ({ request }) => {
				const todo = await request.json();
				const added = db.add('todos', todo);
				return res(added);
			},
		}),
		update: createRoute({
			method: 'put',
			path: '/todo/:id',
			body: todoSchema.omit({ id: true }),
			response: todoSchema,
			mock: async ({ request, params }) => {
				const todo = await request.json();
				const updated = db.update('todos', params.id, todo);
				return res(updated);
			},
		}),
		delete: createRoute({
			method: 'delete',
			path: '/todo/:id',
			response: todoSchema,
			mock: async ({ params }) => {
				const deleted = db.delete('todos', params.id);
				return res(deleted);
			},
		}),
	},
	callToAction: {
		get: createRoute({
			method: 'get',
			path: '/call-to-action',
			response: z.array(callToActionSchema),
			mock: async () => {
				await delay();
				return res(db.get('callToActions'));
			},
		}),
		getById: createRoute({
			method: 'get',
			path: '/call-to-action/:id',
			response: callToActionSchema,
			mock: async ({ params }) => {
				await delay();
				return res(db.getById('callToActions', params.id));
			},
		}),
		add: createRoute({
			method: 'post',
			path: '/call-to-action',
			body: callToActionSchema.omit({ id: true }),
			response: callToActionSchema,
			mock: async ({ request }) => {
				const row = await request.json();
				const added = db.add('callToActions', row);
				return res(added);
			},
		}),
		update: createRoute({
			method: 'put',
			path: '/call-to-action/:id',
			body: callToActionSchema.omit({ id: true }),
			response: callToActionSchema,
			mock: async ({ request, params }) => {
				const row = await request.json();
				const updated = db.update('callToActions', params.id, row);
				return res(updated);
			},
		}),
		delete: createRoute({
			method: 'delete',
			path: '/call-to-action/:id',
			response: callToActionSchema,
			mock: async ({ params }) => {
				const deleted = db.delete('callToActions', params.id);
				return res(deleted);
			},
		}),
	},
};
