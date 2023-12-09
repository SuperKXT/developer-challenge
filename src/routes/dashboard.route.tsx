import { Outlet } from 'react-router-dom';

import styles from './dashboard.route.module.scss';

import { AppLink } from '../components/app-link.component.js';
import { Sidebar } from '../components/sidebar.component.js';

const loader = () => {
	return 1;
};

export const Dashboard = () => {
	return (
		<main className={styles.main}>
			<Sidebar />
			<aside>
				<div>
					<h1>📱 Homefeed</h1>
					<button>➕</button>
				</div>
				<AppLink to=''>
					<span>📱</span>Live Preview
				</AppLink>
				<hr />
				<AppLink to='call-to-action'>
					<span>☝️️</span> Call To Action
				</AppLink>
				<AppLink to='todo'>
					<span>✅</span> Todo
				</AppLink>
			</aside>
			<Outlet />
		</main>
	);
};

Dashboard.loader = loader;
