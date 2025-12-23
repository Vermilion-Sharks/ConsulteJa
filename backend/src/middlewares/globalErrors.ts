import type { ErrorCustomVS, ErrorResponseVS } from '@interfaces/errorInterfaces';
import type { Response, ErrorRequestHandler, NextFunction } from 'express';
import type { RequestCustomVS } from '@interfaces/globalInterfaces';
import { ErroVS } from '@utils/erroClasses';
import http from 'http';

const errorHandler: ErrorRequestHandler = (err: ErrorCustomVS, req: RequestCustomVS, res: Response, _next: NextFunction) => {
    let status = 500;
    let error = err.custom_message || 'Erro interno no servidor.';

    const prismaCodes = [
        'P1001',
        'P2002',
        'P2025',
        '22P02'
    ];
    
    if (prismaCodes.includes(err.code||err.cause?.code||'')) {
        const code = err.code || err.cause?.code;
        switch (code) {
            case 'P1001':
                status = 503;
                error = 'Erro ao tentar acessar o banco de dados.';
                break;
            case 'P2002':
                status = 409;
                error = err.custom_message || 'Violação de chave única.';
                break;
            case 'P2025':
                status = 404;
                error = err.custom_message || 'Não encontrado.';
                break;
            case '22P02':
                status = 400;
                error = err.custom_message || 'Campo com formato inválido.';
                break;
            default:
                error = 'Erro no banco de dados.';
                break;
        }
    } else if(err instanceof ErroVS){
        error = err.message;
        status = err.status;
    }
    
    const type = http.STATUS_CODES[status] || 'Internal Server Error';

    if (status >= 500)
        console.error(`Erro ${status} pego pelo handler:`,{
            error: {
                type,
                name: err.name,
                message: error,
                stack: err.stack,
            },
            req: {
                path: req.originalUrl,
                method: req.method,
                userId: req.user?.id || 'Não autenticado',
            }
        });

    res.status(status).json({ error, type } satisfies ErrorResponseVS);
}

export default errorHandler;