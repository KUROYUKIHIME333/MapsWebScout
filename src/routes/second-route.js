export default async function routes(fastify, options) {
	fastify.get('/02', async (request, reply) => {
		return { message: 'This is the second route' };
	});

	fastify.get('/03', async (request, reply) => {
		return { info: 'This is the third route' };
	});
}
