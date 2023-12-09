import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/error-boundary.component.js';
import { Dashboard } from './routes/dashboard.route.js';

import './assets/theme.css';

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
	return <RouterProvider router={router} />;
};
