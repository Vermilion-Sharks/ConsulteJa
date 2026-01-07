import rateLimit from 'express-rate-limit';
import Errors from '@utils/errorClasses';

class RateLimit {
    static readonly general = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 50,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, _res, next) =>
            next(new Errors.ManyRequestsError('Muitas requisições, tente novamente mais tarde.')),
    });

    static readonly login = rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 5,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, _res, next) =>
            next(new Errors.ManyRequestsError('Muitas tentativas de login, tente novamente mais tarde.')),
    });
}

export default RateLimit;