export default async function routes(fastify, options) {
	fastify.get('/02', async (request, reply) => {
		return reply.view('results', {
			results: [],
		});
	});

	fastify.get('/03', async (request, reply) => {
		return reply.view('index', {});
	});
}
