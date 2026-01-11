import Fastify from 'fastify';
import fastifyEnv from '@fastify/env'; // 1. Import du plugin
import secondRoute from './routes/second-route.js';
import postsRoutes from './routes/post-routes.js';
import findPlacesPlugin from './plugins/placeAPI.js';
import viewPlugin from './plugins/views.js';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const fastify = Fastify({ logger: true });

// 2. Définition du schéma basé sur ton .env
const schema = {
	type: 'object',
	required: ['PLACES_API_KEY', 'GEMINI_API_KEY'], // Les clés critiques
	properties: {
		PLACES_API_KEY: { type: 'string' },
		GEMINI_API_KEY: { type: 'string' },
		SERVICE_ACCOUNT_EMAIL: { type: 'string' },
		GOOGLE_SHEET_ID: { type: 'string' },
		PORT: { type: 'string', default: '3000' },
	},
};

const start = async () => {
	try {
		// 3. Charger l'environnement AVANT les autres plugins
		await fastify.register(fastifyEnv, {
			schema,
			dotenv: true,
		});

		// Maintenant fastify.config est disponible

		fastify.register(fastifyStatic, {
			root: join(dirname(fileURLToPath(import.meta.url)), '..', 'public'),
			prefix: '/public/',
		});

		// ENREGISTREMENT DES PLUGINS
		fastify.register(viewPlugin);
		fastify.register(findPlacesPlugin); // Ce plugin pourra utiliser fastify.config.PLACES_API_KEY

		// DÉCLARATION DES ROUTES
		fastify.get('/', async (request, reply) => {
			return reply.view('index.ejs');
		});

		fastify.register(secondRoute);
		fastify.register(postsRoutes);

		// DÉMARRER LE SERVEUR
		await fastify.listen({
			port: Number(fastify.config.PORT) || 3000,
			host: '0.0.0.0',
		});

		console.log(`🚀 MapScout démarré sur http://localhost:${fastify.config.PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
