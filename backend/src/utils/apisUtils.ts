import crypto from 'node:crypto';

class ApisUtils {

    static gerarApiKey(){
        const apiKey = crypto.randomBytes(32).toString('hex');
        return apiKey;
    }

    static gerarHashApiKey(apiKey: string){
        const hashApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');
        return hashApiKey;
    }

    static compararApiKeyComHash(apiKey: string, hash: string){
        const hashAtual = crypto.createHash('sha256').update(apiKey).digest('hex');
        return crypto.timingSafeEqual(
            Buffer.from(hashAtual, 'hex'),
            Buffer.from(hash, 'hex')
        );
    }

}

export default ApisUtils;