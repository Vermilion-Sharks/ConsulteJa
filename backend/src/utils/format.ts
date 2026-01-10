import countries from "i18n-iso-countries";

import pt from "i18n-iso-countries/langs/pt.json";
countries.registerLocale(pt);

// * Habilitar o inglês só se for usar
// import en from "i18n-iso-countries/langs/en.json";
// countries.registerLocale(en);

class FormatUtils {

    static getMilisecondsByText(text: string){
        const textLower = text.toLowerCase();
        const lastCharacter = textLower.at(-1)!;
        if(!isNaN(parseInt(lastCharacter))) return Number(textLower);
        else {
            const numericString = Number(textLower.slice(0, -1));
            if(isNaN(numericString)) return 0;
            let conversion = 1;
            if(lastCharacter==='d') conversion = 24*60*60*1000;
            else if(lastCharacter==='h') conversion = 60*60*1000;
            else if(lastCharacter==='m') conversion = 60*1000;
            else if(lastCharacter==='s') conversion = 1000;
            return numericString * conversion;
        }
    }

    static countryAcronymToName(acronym: string, lang: 'pt'){
        return countries.getName(acronym, lang);
    }

}

export default FormatUtils;