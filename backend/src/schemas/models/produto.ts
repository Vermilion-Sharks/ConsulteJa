export interface ProdutoModelCreateData {
    codigo: string;
    nome: string;
    marca: string;
    descricao: string;
    preco: number;
    imagem?: string | null;
    importado?: boolean;
}