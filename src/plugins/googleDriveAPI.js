import fp from 'fastify-plugin';
import axios from 'axios';

export default fp(async (fastify) => {
    fastify.decorate();
})