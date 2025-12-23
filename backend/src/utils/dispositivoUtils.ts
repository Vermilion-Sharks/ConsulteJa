import { createHash } from 'node:crypto';

class DispositivoUtils {

    static pegarSO(userAgent: string){
        if (/windows nt/i.test(userAgent)) return 'Windows';
        if (/mac os x/i.test(userAgent)) return 'Mac';
        if (/android/i.test(userAgent)) return 'Android';
        if (/iphone/i.test(userAgent)) return 'iPhone';
        if (/ipad/i.test(userAgent)) return 'iPad';
        if (/linux/i.test(userAgent)) return 'Linux';

        return 'SO desconhecido';
    }

    static pegarBrowser(userAgent: string){
        if (/edg/i.test(userAgent)) return 'Edge';
        if (/chrome/i.test(userAgent)) return 'Chrome';
        if (/firefox/i.test(userAgent)) return 'Firefox';
        if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';

        return 'Navegador desconhecido';
    }

    static pegarDispositivoNome(userAgent: string){
        const so = DispositivoUtils.pegarSO(userAgent);
        const browser = DispositivoUtils.pegarBrowser(userAgent);
        return `${browser} no ${so}`;
    }

    static criarDispositivoHash(userAgent: string){
        return createHash('sha256').update(userAgent).digest('hex');
    }

}

export default DispositivoUtils;