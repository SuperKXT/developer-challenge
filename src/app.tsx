import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/error-boundary.component.js';
import { hooks } from './css-hooks.js';
import { Dashboard } from './routes/dashboard.route.js';

import './assets/reset.css';

const router = createBrowserRouter([
	{
		path: '',
		element: <Dashboard />,
		loader: Dashboard.loader,
		children: [
			{
				errorElement: <ErrorBoundary />,
				children: [],
			},
		],
		errorElement: <ErrorBoundary />,
	},
]);

export const App = () => {
	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			<style dangerouslySetInnerHTML={{ __html: hooks }} />
			<RouterProvider router={router} />
		</>
	);
};
