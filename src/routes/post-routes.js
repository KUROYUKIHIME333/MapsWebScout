export default async function postRoutes(fastify, options) {
	fastify.post('/scan', async (request, reply) => {
		// 'request' en minuscule est la convention
		console.log('Request Body:', request.body); // Pour déboguer le corps de la requête
		const { type, radius, longitude, latitude } = request.body;

		try {
			const places = await fastify.findPlaces(type, radius, longitude, latitude);

			request.session.searchData = places; // Stocker les résultats dans la session
			if (!places) {
				return reply.code(400).send({
					status: 'failed',
					message: 'Un probleme est survenu.',
				});
			}
			return reply.code(200).send({
				status: 'success',
				message: 'Recherche terminé.',
			});
		} catch (error) {
			fastify.log.error(error);
			const statusCode = error.statusCode || 500;
			return reply.code(statusCode).send({
				status: 'error',
				message: error.message,
			});
		}
	});
}
