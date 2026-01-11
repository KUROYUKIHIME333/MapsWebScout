import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// First route , to begin with
fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

// Le serveur
const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
