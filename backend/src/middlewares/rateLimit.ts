import rateLimit from 'express-rate-limit';
import type { ErrorResponseVS } from '@interfaces/errorInterfaces';

class RateLimit {
    static readonly limiteGeral = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 50,
        message: ()=>{return {error: 'Muitas requisições, tente novamente mais tarde.', type: 'Too Many Requests'} satisfies ErrorResponseVS},
        statusCode: 429,
    });

    static readonly limiteLogin = rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 5,
        message: ()=>{return {error: 'Muitas tentativas de login, tente novamente em 5 minutos.', type: 'Too Many Requests'} satisfies ErrorResponseVS},
        statusCode: 429,
    });
}

export default RateLimit;