export interface ProdutoModelCreateData {
    codigo: string;
    nome: string;
    marca: string;
    descricao: string;
    preco: string;
    imagem?: string | null;
    importado?: boolean;
}