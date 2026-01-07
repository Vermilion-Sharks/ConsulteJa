// * CORS
import { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:5173'];

const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS.'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
    ],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 24*60*60
};

export default corsConfig;