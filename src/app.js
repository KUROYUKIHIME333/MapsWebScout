import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import secondRoute from './routes/second-route.js';
import postsRoutes from './routes/post-routes.js';
import findPlacesPlugin from './plugins/placeAPI.js';
import viewPlugin from './plugins/views.js';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const fastify = Fastify({ logger: true });

// SCHEMAS D ABORD
const schema = {
	type: 'object',
	required: ['PLACES_API_KEY', 'SESSION_SECRET'],
	properties: {
		PLACES_API_KEY: { type: 'string' },
		GEMINI_API_KEY: { type: 'string' },
		SESSION_SECRET: { type: 'string' },
		PORT: { type: 'string', default: '3000' },
	},
};

const start = async () => {
	try {
		// CHARGER L'ENVIRONNEMENT
		await fastify.register(fastifyEnv, {
			schema,
			dotenv: true,
		});

		// ENREGISTRER LES COOKIES ET SESSIONS APRES L ENVIRONNEMENT
		await fastify.register(fastifyCookie);
		await fastify.register(fastifySession, {
			secret: fastify.config.SESSION_SECRET,
			cookie: {
				secure: false, // false pour localhost
				maxAge: 1800000, //30 minutes
			},
		});

		// PLUGINS ET STATIQUES
		await fastify.register(fastifyStatic, {
			root: join(dirname(fileURLToPath(import.meta.url)), '..', 'public'),
			prefix: '/public/',
		});

		await fastify.register(viewPlugin);
		await fastify.register(findPlacesPlugin);

		// ROUTES
		fastify.get('/', async (request, reply) => {
			return reply.view('index.ejs');
		});

		fastify.register(secondRoute);
		fastify.register(postsRoutes);

		// DÉMARRAGE
		await fastify.listen({
			port: Number(fastify.config.PORT) || 3000,
			host: '0.0.0.0',
		});

		console.log(`MapScout démarré sur http://localhost:${fastify.config.PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
