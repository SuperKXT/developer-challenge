import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app.jsx';
import { worker } from './mocks/browser.js';

await worker.start();

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('root element not found in index.html');

const root = createRoot(rootElement);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
