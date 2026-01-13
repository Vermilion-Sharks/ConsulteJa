import { createHash } from 'node:crypto';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-country';
import FormatUtils from './format';

class DeviceUtils {

    static getDeviceName(userAgent: string, ip: string){
        const { browser, os, device } = UAParser(userAgent);

        const browserName = browser.name ?? 'Navegador desconhecido';
        const osVersion = os.version ? ` ${os.version}` : '';
        const osName = os.name ? os.name+osVersion : '';
        const deviceModel = device.model ?? '';

        const geoipInfo = geoip.lookup(ip);
        const acronym = geoipInfo?.country ?? '';
        const country = FormatUtils.countryAcronymToName(acronym, 'pt') ?? 'Localização desconhecida';

        const deviceName = `${browserName} | ${deviceModel||osName||'Dispositivo desconhecido'} | ${country}`

        return deviceName;
    }

    static createDeviceHash(visitorId: string){
        return createHash('sha256').update(visitorId).digest('hex');
    }

}

export default DeviceUtils;