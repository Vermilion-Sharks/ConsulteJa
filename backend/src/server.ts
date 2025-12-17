// * Imports e Configurações
import 'dotenv/config';

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import path from 'path';

// * Inicialização do servidor
const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// * Middlewares globais
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

server.listen(port, ()=>console.log(`Servidor rodando em http://localhost:${port}`));