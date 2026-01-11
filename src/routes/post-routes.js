export default async function postRoutes(fastify, options) {
    fastify.post('/scan', async (request, reply) => { // 'request' en minuscule est la convention
        console.log('Request Body:', request.body); // Pour déboguer le corps de la requête
        const { type, radius, longitude, latitude } = request.body;

        try {
            const places = await fastify.findPlaces(type, radius, longitude, latitude);

            // 1. On retire .ejs car défini dans le plugin
            // 2. On désactive le layout pour les requêtes Fetch/Axios (fragment HTML)
            // 3. On renomme 'datas' en 'results' pour correspondre à ton EJS
            return reply.view("results", {
                results: places // Indispensable pour ton results.forEach
            }, { layout: false }); 

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