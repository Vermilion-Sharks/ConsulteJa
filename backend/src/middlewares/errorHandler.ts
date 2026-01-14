import type { ErrorCustomVS, ErrorIssue, ErrorResponseVS, ErrorTypeVS } from '@schemas/shared/errorSchema';
import type { Response, ErrorRequestHandler, NextFunction } from 'express';
import type { RequestCustomVS } from '@schemas/shared/requestSchema';
import { ErrorVS } from '@utils/errorClasses';
import http from 'http';
import { ZodError } from 'zod';

const errorHandler: ErrorRequestHandler = (err: ErrorCustomVS, req: RequestCustomVS, res: Response, _next: NextFunction) => {
    let status = 500;
    let error = err.custom_message || 'Erro interno no servidor.';
    let customType: ErrorTypeVS;
    let issues: ErrorIssue[] | undefined;

    const prismaCodes = [
        'P1001',
        'P2002',
        'P2003',
        'P2025',
        '22P02'
    ];
    
    if (prismaCodes.includes(err.code||err.cause?.code||'')) {
        const code = err.code || err.cause?.code;
        switch (code) {
            case 'P1001':
                status = 503;
                error = 'Erro ao tentar acessar o banco de dados.';
                customType = 'VS_DB_UNAVAILABLE';
                break;
            case 'P2002':
                status = 409;
                error = err.custom_message || 'Violação de chave única.';
                customType = 'VS_CONFLICT';
                break;
            case 'P2003':
                status = 400;
                error = err.custom_message || 'Chave estrangeira inválida.';
                customType = 'VS_VALIDATION';
                break;
            case 'P2025':
                status = 404;
                error = err.custom_message || 'Não encontrado.';
                customType = 'VS_NOT_FOUND';
                break;
            case '22P02':
                status = 400;
                error = err.custom_message || 'Campo com formato inválido.';
                customType = 'VS_VALIDATION';
                break;
            default:
                error = 'Erro no banco de dados.';
                customType = 'VS_SERVER_ERROR';
                break;
        }
    } else if(err instanceof ErrorVS){
        error = err.message;
        status = err.status;
        customType = err.type;
    } else if (err instanceof ZodError){
        issues = [];
        err.issues.forEach(iss=>{
            if(iss.code==='unrecognized_keys')
                return iss.keys.forEach(i=>issues!.push({
                    field: i,
                    message: 'Chave não reconhecida.'
                }));
            issues!.push({
                field: iss.path.join('.') || 'param',
                message: iss.message
            })
        });

        status = 400;
        error = 'Campos inválidos.';
        customType = 'VS_VALIDATION';
    }
    
    const type = customType! || http.STATUS_CODES[status] || 'Internal Server Error';

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

    res.status(status).json({ error, type, ...(issues?{issues}:{}) } satisfies ErrorResponseVS);
}

export default errorHandler;