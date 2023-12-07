import { z } from 'zod';

const envs = ['development', 'test', 'production'] as const;

type Env = (typeof envs)[number];

const envSchema = z.object({
	MODE: z.enum(envs),
	VITE_BACKEND_API_PATH: z.string().url(),
});

const parseEnv = () => {
	const parsed = envSchema.safeParse(import.meta.env);
	const mode = import.meta.env.MODE;
	if (!parsed.success) {
		console.error(
			'🔥 Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
			`\n🔥 Fix the issues in .env.${mode} file.`,
			`\n💡 Tip: If you recently updated the .env.${mode} file and the error still persists, try restarting the server.`,
		);
		throw new Error('Invalid environment, Check terminal for more details ');
	}

	return {
		env: parsed.data.MODE,
		backendPath: parsed.data.VITE_BACKEND_API_PATH,
	};
};

export const { env, backendPath } = parseEnv();

const isFetchMockedConfig: Record<Env, boolean> = {
	development: false,
	test: false,
	production: false,
};
/** should the app use dummy data? used for demos of the frontend */
export const isFetchMocked: boolean = isFetchMockedConfig[env];

const disableAuthConfig: Record<Env, boolean> = {
	development: false,
	test: false,
	production: false,
};

/** should fetch authentication be disabled? */
export const disableAuth = disableAuthConfig[env];
