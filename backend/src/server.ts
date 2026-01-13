// * Imports
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import corsConfig from '@configs/cors';
import RateLimit from '@middlewares/rateLimit';
import errorHandler from '@middlewares/errorHandler';
import path from 'path';

// * Server initialization
const port = process.env.PORT || 2923;
const app = express();
const server = http.createServer(app);
app.set('trust proxy', 1); // * This is important for deployment in services like Render.
const frontend = path.join(__dirname, '../../frontend');

// * Global Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(RateLimit.general);
app.use(cors(corsConfig));
app.use(express.static(path.join(frontend, '/dist')));

// * Cron tasks
import '@tasks/cronSessionsCleanup';

// * Importing Routes
import routes from '@routers/index';
app.use(routes);

app.get(/.*/, (req, res) => res.sendFile(path.join(frontend, '/dist/index.html')));

// * Error handling
app.use(errorHandler);

// * Server Port
server.listen(port, ()=>console.log(`Servidor rodando em http://localhost:${port}`));