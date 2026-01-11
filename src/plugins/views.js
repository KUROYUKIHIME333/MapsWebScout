import fp from 'fastify-plugin';
import view from '@fastify/view';
import ejs from "ejs";

import {dirname, join} from 'path';
import { fileURLToPath } from 'url';

const pathView = join(dirname(fileURLToPath(import.meta.url)), '../../views');

export default fp(async (fastify) => {
    fastify.register(view, {
        engine: {ejs: ejs},
        root: pathView,
        viewExt: 'ejs',
        layout: 'layouts/main',
        propertyName: 'view'
    })
})