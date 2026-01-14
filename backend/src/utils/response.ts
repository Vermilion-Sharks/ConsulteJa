import { ResponseCustomVS } from '@schemas/shared/responseSchema';
import type { Response as Res } from 'express';

export function ResponseVS(res: Res, content: ResponseCustomVS, status: number = 200){
    return res.status(status).json(content); 
}