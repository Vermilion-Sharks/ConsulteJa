// * Imports e Configurações
import 'dotenv/config';

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import cors from 'cors';
import corsConfig from '@config/cors';

// * Inicialização do servidor
const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const frontend = path.join(__dirname, '../../frontend');

// * Middlewares globais
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsConfig));
app.use(express.static(path.join(frontend, '/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontend, '/dist/index.html'));
});

server.listen(port, ()=>console.log(`Servidor rodando em http://localhost:${port}`));