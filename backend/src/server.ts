// * Imports e Configurações
import 'dotenv/config';

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import cors from 'cors';
import corsConfig from '@config/cors';
import errorHandler from '@middlewares/errorHandler';
import RateLimit from '@middlewares/rateLimit';

// * Inicialização do servidor
const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const frontend = path.join(__dirname, '../../frontend');
app.set('trust proxy', 1);

// * Middlewares globais
app.use(cookieParser());
app.use(express.json());
app.use(RateLimit.limiteGeral);
app.use(cors(corsConfig));
app.use(express.static(path.join(frontend, '/dist')));

import routes from '@routes/index';

app.use(routes);

app.get(/.*/, (req, res) => res.sendFile(path.join(frontend, '/dist/index.html')));

// * Tratamento de erros
app.use(errorHandler);

server.listen(port, ()=>console.log(`Servidor rodando em http://localhost:${port}`));