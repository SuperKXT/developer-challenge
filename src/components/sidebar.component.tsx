import { AppIcon } from './app-icon.component.js';
import { AppLink } from './app-link.component.js';
import { Button } from './button.component.js';
import styles from './sidebar.component.module.scss';

import { cx } from '../helpers/style.helpers.js';
import { toggleSidebar, useSidebar } from '../hooks/sidebar.hook.js';

const items = [
	'home',
	'reports',
	'members',
	'dinner-parties',
	'inbox',
	'home-feed',
	'events',
	'service',
	'resources',
] as const;

const SideNav = (props: { name: (typeof items)[number] }) => {
	return (
		<AppLink
			to={props.name}
			className={styles.nav}
		>
			<AppIcon
				name={props.name}
				size={50}
			/>
			<p>{props.name.replace(/-/gu, ' ')}</p>
		</AppLink>
	);
};

export const Sidebar = () => {
	const { isMinimized } = useSidebar();
	return (
		<aside className={cx(styles.aside, isMinimized && styles.mini)}>
			<Button
				label={<AppIcon name='expand' />}
				onClick={toggleSidebar}
			/>
			{items.map((item) => (
				<SideNav
					key={item}
					name={item}
				/>
			))}
		</aside>
	);
};
