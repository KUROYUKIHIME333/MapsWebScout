export default async function routes(fastify, options) {
	fastify.get('/02', async (request, reply) => {
		const places = request.body;
		return reply.view('results', {
			results: [],
		});
	});

	fastify.get('/03', async (request, reply) => {
		return reply.view('index', {});
	});

	fastify.get('/results', async (request, reply) => {
		const places = request.session.searchData || [];

		return reply.view('results', { results: places });
	});
}
