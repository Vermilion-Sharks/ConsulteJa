import Erros from '@utils/erroClasses';
import axios from 'axios';
import validator from "validator";

class ValidarCampos{

    static validarTamanhoMax(valor: string, maximo: number, nome: string){
        const valorTrimado = valor.trim();
        if(!valorTrimado){
            throw new Erros.ErroDeValidacao(`O campo ${nome} precisa ser fornecido.`);
        }
        if(valorTrimado.length > maximo){
            throw new Erros.ErroDeValidacao(`O campo ${nome} não pode ter mais de ${maximo} caracteres.`);
        }
        return valorTrimado;
    }

    static validarTamanhoMin(valor: string, minimo: number, nome: string){
        const valorTrimado = valor.trim();
        if(!valorTrimado){
            throw new Erros.ErroDeValidacao(`O campo ${nome} precisa ser fornecido.`)
        }
        if(valorTrimado.length < minimo){
            throw new Erros.ErroDeValidacao(`O campo ${nome} não pode ter menos de ${minimo} caracteres.`)
        }
        return valorTrimado;
    }

    static async validarTamanhoExato(valor: string, tamanho: number, nome: string){
        const valorTrimado = valor.trim();
        if(!valorTrimado){
            throw new Erros.ErroDeValidacao(`O campo ${nome} precisa ser fornecido.`)
        }
        if(valorTrimado.length !== tamanho){
            throw new Erros.ErroDeValidacao(`O campo ${nome} deve ter exatamente ${tamanho} caracteres.`)
        }
        return valorTrimado;
    }

    static validarEmail(email: string){
        const emailTrimado = email.trim();
        if(!emailTrimado){
            throw new Erros.ErroDeValidacao(`O email precisa ser fornecido.`)
        }
        if(!validator.isEmail(emailTrimado)){
            throw new Erros.ErroDeValidacao(`O email fornecido não é válido.`)
        }
        return emailTrimado;
    }

    static validarIdade(data: Date, minimo: number, maximo: number, nome: string){
        const nascimento = new Date(data);
        const hoje = new Date();
        if (nascimento > hoje) {
            throw new Erros.ErroDeValidacao(`${nome} não pode ser uma data no futuro.`);
        }
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        const dia = hoje.getDate() - nascimento.getDate();

        if (mes < 0 || (mes === 0 && dia < 0)) {
            idade--;
        }
        if (idade < minimo) {
            throw new Erros.ErroDeValidacao(`${nome} não pode ter menos de ${minimo} anos.`);
        }
        if (idade > maximo) {
            throw new Erros.ErroDeValidacao(`${nome} não pode ter mais de ${maximo} anos.`);
        }
        return nascimento;
    }

    static validarCpf(cpf: string) {
        // Remove pontos e traços
        const cpfLimpo = cpf.replace(/[^\d]/g, '').trim();

        if (!cpfLimpo) {
            throw new Erros.ErroDeValidacao('O CPF precisa ser fornecido.');
        }

        if (!/^\d{11}$/.test(cpfLimpo)) {
            throw new Erros.ErroDeValidacao('O CPF deve conter exatamente 11 dígitos numéricos.');
        }

        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            throw new Erros.ErroDeValidacao('O CPF fornecido é inválido.');
        }

        const calcularDigito = (cpfParcial: string, pesoInicial: number) => {
            let soma = 0;
            for (let i = 0; i < cpfParcial.length; i++) {
                soma += parseInt(cpfParcial[i]) * (pesoInicial - i);
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const primeiroDigito = calcularDigito(cpfLimpo.slice(0, 9), 10);
        const segundoDigito = calcularDigito(cpfLimpo.slice(0, 10), 11);

        if (
            parseInt(cpfLimpo[9]) !== primeiroDigito ||
            parseInt(cpfLimpo[10]) !== segundoDigito
        ) {
            throw new Erros.ErroDeValidacao('O CPF fornecido é inválido.');
        }
        return cpfLimpo;
    }

    static validarCnpj(cnpj: string){
        // Remove pontos e traços
        const cnpjLimpo = cnpj.replace(/[^\d]/g, '').trim();

        if (!cnpjLimpo) {
            throw new Erros.ErroDeValidacao('O CNPJ precisa ser fornecido.');
        }

        if (!/^\d{14}$/.test(cnpjLimpo)) {
            throw new Erros.ErroDeValidacao('O CNPJ deve conter exatamente 14 dígitos numéricos.');
        }
        return cnpjLimpo;
    }

    static validarCep(cep: string){
        // Remove pontos e traços
        const cepLimpo = cep.replace(/[^\d]/g, '').trim();

        if (!cepLimpo) {
            throw new Erros.ErroDeValidacao('O CEP precisa ser fornecido.');
        }

        if (!/^\d{8}$/.test(cepLimpo)) {
            throw new Erros.ErroDeValidacao('O CEP deve conter exatamente 8 dígitos numéricos.');
        }
        return cepLimpo;
    }

    static validarTelefone(telefone: string){
        const telefoneLimpo = telefone.replace(/[^\d]/g, '').trim();

        if (!telefoneLimpo) {
            throw new Erros.ErroDeValidacao('O Telefone precisa ser fornecido.');
        }

        if (!/^\d{13}$/.test(telefoneLimpo)) {
            throw new Erros.ErroDeValidacao('O Telefone deve conter exatamente 13 dígitos numéricos.');
        }
        return telefoneLimpo;
    }

    static validarImagemNoCloudinary(imagem: string){
        const prefix = "https://res.cloudinary.com/ddbfifdxd/image/upload/";
        if (!imagem || !imagem.startsWith(prefix)) {
            throw new Erros.ErroDeValidacao("A imagem não pode ser enviada diretamente. Use o upload de arquivo.");
        }
        return imagem;
    }

    static validarArquivoRawNoCloudinary(arquivo: string){
        const prefix = "https://res.cloudinary.com/ddbfifdxd/raw/upload/";
        if (!arquivo || !arquivo.startsWith(prefix)) {
            throw new Erros.ErroDeValidacao("Arquivo inválido.");
        }
        return arquivo;
    }

    static validarLink(link: string, tipo: string = 'any'){
        const linkTrimado = link?.trim();

        if (!linkTrimado || !validator.isURL(linkTrimado, { require_protocol: false })) {
            throw new Erros.ErroDeValidacao("URL inválida.");
        }

        switch (tipo) {
            case 'i':
                const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/i;
                if(!instagramRegex.test(linkTrimado)){
                    throw new Erros.ErroDeValidacao("URL do Instagram inválida.");
                }
                break;
            case 'g':
                const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i;
                if(!githubRegex.test(linkTrimado)){
                    throw new Erros.ErroDeValidacao("URL do GitHub inválida.");
                }
                break;
            case 'y':
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;
                if(!youtubeRegex.test(linkTrimado)){
                    throw new Erros.ErroDeValidacao("URL do YouTube inválida.");
                }
                break;
            case 'x':
                const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}\/?$/i;
                if(!twitterRegex.test(linkTrimado)){
                    throw new Erros.ErroDeValidacao("URL do Twitter/X inválida.");
                }
                break;
            case 'l':
                const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;
                if(!linkedinRegex.test(linkTrimado)){
                    throw new Erros.ErroDeValidacao("URL do LinkedIn inválida.");
                }
                break;
            case 'f':
                const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9.]+)\/?$/i;
                if (!facebookRegex.test(linkTrimado)) {
                    throw new Erros.ErroDeValidacao("URL do Facebook inválida.");
                }
                break;
            case 'any':
            default:
                if(!validator.isURL(linkTrimado, { require_protocol: false })){
                    throw new Erros.ErroDeValidacao("URL inválida.");
                }
                break;
        };
        return /^https?:\/\//i.test(linkTrimado) ? linkTrimado : 'https://'+linkTrimado;
    }

    static async validarEstadoSigla(estado: string){
        const response = await axios("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        const estados = response.data as {sigla: string}[];
        const siglas = estados.map((e) => e.sigla.toUpperCase());
        const estadoUpper = estado.toUpperCase();
        if (!siglas.includes(estadoUpper)) {
            throw new Erros.ErroDeValidacao(`Estado inválido. Use uma sigla válida.`);
        }
        return estadoUpper;
    }

    static async validarCidadePorEstadoSigla(cidade: string, estado: string){
        const response = await axios(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
        const cidades = response.data as {nome: string}[];
        const nomesCidades = cidades.map((c) => c.nome.toLowerCase());
        const cidadeTrim = cidade.trim();
        if (!nomesCidades.includes(cidadeTrim.toLowerCase())) {
            throw new Erros.ErroDeValidacao(`${cidade} não existe em: ${estado}.`);
        }
        return cidadeTrim;
    }

}

export default ValidarCampos;