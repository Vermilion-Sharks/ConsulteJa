import { Decimal } from "@prisma/client/runtime/client";

export interface ProdutoModelCreateData {
    codigo: string;
    nome: string;
    marca: string;
    descricao: string;
    preco: string;
    imagem?: string | null;
    importado?: boolean;
}

export interface ProdutoModelUpdateFields {
    codigo?: string;
    nome?: string;
    marca?: string;
    descricao?: string;
    preco?: string;
    imagem?: string;
}

export interface Produto {
    id: string;
    data_criacao: Date;
    data_atualizacao: Date;
    codigo: string;
    nome: string;
    marca: string;
    descricao: string;
    preco: Decimal;
    imagem: string | null;
    importado: boolean;
}