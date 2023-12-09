import { createStore } from './helpers/store.helpers.js';
import { dbSchema, parsedDbIdSchema } from './schemas.js';

import type { Db } from './schemas.js';

export const dbStore = createStore({
	key: 'db',
	schema: dbSchema,
	defaultVal: { todos: [], callToActions: [] },
});

export const db = {
	get: <K extends keyof Db>(key: K): Db[K] => {
		return dbStore.get()[key];
	},
	getById: <K extends keyof Db>(key: K, id: string): Db[K][number] => {
		const parsedId = parsedDbIdSchema.parse(id);
		const row = dbStore.get()[key].find((curr) => curr.id === parsedId);
		if (!row) throw new Error('row not found');
		return row;
	},
	add: <K extends keyof Db>(
		key: K,
		row: Omit<Db[K][number], 'id'>,
	): Db[K][number] => {
		const data = dbStore.get();
		const withId = { id: Date.now(), ...row } as never;
		data[key].push(withId);
		dbStore.set(data);
		return withId;
	},
	update: <K extends keyof Db>(
		key: K,
		id: string,
		row: Omit<Db[K][number], 'id'>,
	): Db[K][number] => {
		const data = dbStore.get();
		const parsedId = parsedDbIdSchema.parse(id);
		const idx = data[key].findIndex((curr) => curr.id === parsedId);
		if (!idx) throw new Error('row not found');
		const updated = { id, ...row } as never;
		data[key][idx] = updated;
		dbStore.set(data);
		return updated;
	},
	delete: <K extends keyof Db>(key: K, id: string): Db[K][number] => {
		const data = dbStore.get();
		const arr = data[key];
		const parsedId = parsedDbIdSchema.parse(id);
		const idx = arr.findIndex((curr) => curr.id === parsedId);
		if (!idx) throw new Error('row not found');
		const deleted = arr.splice(idx, 1);
		data[key] = arr;
		dbStore.set(data);
		return deleted[0] as never;
	},
};
