import rateLimit from 'express-rate-limit';
import Erros from '@utils/erroClasses';

class RateLimit {
    static readonly limiteGeral = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 500,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, _res, next) =>
            next(new Erros.ErroDeMuitasTentativas('Muitas requisições, tente novamente mais tarde.')),
    });

    static readonly limiteLogin = rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 5,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, _res, next) =>
            next(new Erros.ErroDeMuitasTentativas('Muitas tentativas de login, tente novamente em 5 minutos.')),
    });
}

export default RateLimit;