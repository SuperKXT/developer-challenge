import { useSyncExternalStore } from 'react';
import { z } from 'zod';

import { createStore } from '../helpers/store.helpers.js';

const store = createStore({
	key: 'sidebar',
	schema: z.enum(['full', 'minimized']),
	defaultVal: 'minimized',
});

const subscribe = (callback: () => void) => {
	const listener = (event: StorageEvent) => {
		if (event.key && event.key !== 'sidebar') return;
		callback();
	};
	window.addEventListener('storage', listener);
	return () => {
		window.removeEventListener('storage', listener);
	};
};

export const toggleSidebar = () => {
	store.set(store.get() === 'full' ? 'minimized' : 'full');
};

export const useSidebar = () => {
	const size = useSyncExternalStore(subscribe, store.get);
	return { size, isMinimized: size === 'minimized' };
};
