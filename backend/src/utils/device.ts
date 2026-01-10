import { createHash } from 'node:crypto';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-country';
import FormatUtils from './format';

class DeviceUtils {

    static getDeviceName(userAgent: string, ip: string){
        const { browser, os } = UAParser(userAgent);
        const browserName = browser.name ?? 'Navegador desconhecido';
        const osName = os.name ?? 'SO desconhecido';
        const osVersion = os.version ? ` ${os.version}` : '';

        const geoipInfo = geoip.lookup(ip);
        const acronym = geoipInfo?.country ?? '';
        const country = FormatUtils.countryAcronymToName(acronym, 'pt') ?? 'País não identificado';

        return `${browserName} no ${osName}${osVersion}, ${country}`;
    }

    static createDeviceHash(visitorId: string){
        return createHash('sha256').update(visitorId).digest('hex');
    }

}

export default DeviceUtils;