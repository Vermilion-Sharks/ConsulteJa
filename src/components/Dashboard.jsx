import { useState, useMemo } from 'react';
import {
    Search,
    Package,
    History,
    BarChart3,
    Upload,
    Download,
    ArrowUpDown,
    Calendar,
    DollarSign,
    Hash,
    Link,
    Copy,
    RotateCcw
} from 'lucide-react';
import ProductCard from './ProductCard';
import StatsCard from './StatsCard';
import HistoryList from './HistoryList';
import UploadConverter from './UploadConverter';
import SearchSection from './SearchSection';

const Dashboard = ({
    // Search Section Props
    codigo,
    setCodigo,
    produto,
    loading,
    precoCustom,
    nomeTemp,
    setNomeTemp,
    marcaTemp,
    setMarcaTemp,
    descricaoTemp,
    setDescricaoTemp,
    editandoNome,
    editandoMarca,
    editandoDescricao,
    inputRef,
    onBuscarProduto,
    onKeyPress,
    onImageUpload,
    onRemoverImagem,
    onIniciarEdicaoNome,
    onIniciarEdicaoMarca,
    onIniciarEdicaoDescricao,
    onConfirmarEdicao,
    onCancelarEdicao,
    onSalvarProduto,
    onPrecoChange,

    // Dashboard Props
    produtosSalvos,
    historicoPesquisas,
    onGerarArquivoJSON,
    onSalvarProdutosLocal,
    onGerarLinkAPI,
    onExcluirProduto,
    onResetarProdutosIniciais,
    apiLink,
    alertMessage
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nome');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    // Estatísticas
    const stats = useMemo(() => {
        const totalProdutos = produtosSalvos.length;
        const produtosComPreco = produtosSalvos.filter(p => p.preco !== "Sem preço definido").length;

        const precoMedio = produtosComPreco > 0
            ? produtosSalvos
                .filter(p => p.preco !== "Sem preço definido")
                .reduce((acc, p) => {
                    const precoNum = parseFloat(p.preco.replace('R$', '').replace(',', '.').trim());
                    return acc + (isNaN(precoNum) ? 0 : precoNum);
                }, 0) / produtosComPreco
            : 0;

        const produtoRecente = produtosSalvos.length > 0
            ? produtosSalvos[0]
            : null;

        return {
            totalProdutos,
            produtosComPreco,
            precoMedio: precoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            produtoRecente: produtoRecente?.nome || 'Nenhum'
        };
    }, [produtosSalvos]);

    // Filtros e ordenação
    const filteredProducts = useMemo(() => {
        let filtered = produtosSalvos.filter(product =>
            product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigo.includes(searchTerm)
        );

        // Ordenação
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'preco') {
                aValue = parseFloat(a.preco.replace('R$', '').replace(',', '.').trim()) || 0;
                bValue = parseFloat(b.preco.replace('R$', '').replace(',', '.').trim()) || 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [produtosSalvos, searchTerm, sortBy, sortOrder]);

    // Paginação
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredProducts.slice(startIndex, startIndex + pageSize);
    }, [filteredProducts, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Link copiado para a área de transferência!");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Package className="h-8 w-8 text-white" />
                            <h1 className="text-2xl font-bold text-white">ConsulteJá</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={onResetarProdutosIniciais}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                title="Restaurar produtos iniciais"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>Restaurar</span>
                            </button>
                            <button
                                onClick={onGerarArquivoJSON}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                <span>Exportar JSON</span>
                            </button>
                            <button
                                onClick={onGerarLinkAPI}
                                className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                <Link className="h-4 w-4" />
                                <span>Gerar API</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Alert Message */}
            {alertMessage && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {alertMessage}
                    </div>
                </div>
            )}

            {/* API Link */}
            {apiLink && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-800 font-medium">Link da API gerado com sucesso!</p>
                                <p className="text-green-600 text-sm">Use este link para acessar seus produtos via API</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(apiLink)}
                                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                            >
                                <Copy className="h-3 w-3" />
                                <span>Copiar</span>
                            </button>
                        </div>
                        <div className="mt-2">
                            <input
                                type="text"
                                readOnly
                                value={apiLink}
                                className="w-full px-3 py-2 bg-white border border-green-300 rounded text-sm text-green-800 font-mono"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Busca e detalhes do produto */}
                    <div className="lg:col-span-2 space-y-6">
                        <SearchSection
                            codigo={codigo}
                            setCodigo={setCodigo}
                            produto={produto}
                            loading={loading}
                            precoCustom={precoCustom}
                            nomeTemp={nomeTemp}
                            setNomeTemp={setNomeTemp}
                            marcaTemp={marcaTemp}
                            setMarcaTemp={setMarcaTemp}
                            descricaoTemp={descricaoTemp}
                            setDescricaoTemp={setDescricaoTemp}
                            editandoNome={editandoNome}
                            editandoMarca={editandoMarca}
                            editandoDescricao={editandoDescricao}
                            inputRef={inputRef}
                            onBuscarProduto={onBuscarProduto}
                            onKeyPress={onKeyPress}
                            onImageUpload={onImageUpload}
                            onRemoverImagem={onRemoverImagem}
                            onIniciarEdicaoNome={onIniciarEdicaoNome}
                            onIniciarEdicaoMarca={onIniciarEdicaoMarca}
                            onIniciarEdicaoDescricao={onIniciarEdicaoDescricao}
                            onConfirmarEdicao={onConfirmarEdicao}
                            onCancelarEdicao={onCancelarEdicao}
                            onSalvarProduto={onSalvarProduto}
                            onPrecoChange={onPrecoChange}
                        />
                    </div>

                    {/* Coluna Direita */}
                    <div className="space-y-6">
                        {/* Estatísticas */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5 text-gray-700" />
                                <span>Estatísticas</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <StatsCard
                                    title="Total de Produtos"
                                    value={stats.totalProdutos}
                                    icon={<Package className="h-4 w-4" />}
                                />
                                <StatsCard
                                    title="Com Preço"
                                    value={stats.produtosComPreco}
                                    icon={<DollarSign className="h-4 w-4" />}
                                />
                                <StatsCard
                                    title="Preço Médio"
                                    value={`R$ ${stats.precoMedio}`}
                                    icon={<BarChart3 className="h-4 w-4" />}
                                />
                                <div className="break-words">
                                    <StatsCard
                                        title="Mais Recente"
                                        value={stats.produtoRecente}
                                        icon={<Calendar className="h-4 w-4" />}
                                    />
                                </div>
                            </div>
                        </div>



                        {/* Upload/Import */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Upload className="h-5 w-5 text-gray-700" />
                                <span>Importar Dados</span>
                            </h2>
                            <UploadConverter onProductsImported={onSalvarProdutosLocal} />
                        </div>

                        {/* Histórico de Pesquisas */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <History className="h-5 w-5 text-gray-700" />
                                <span>Histórico de Pesquisas</span>
                            </h2>
                            <HistoryList historico={historicoPesquisas} />
                        </div>
                    </div>
                </div>

                {/* Lista de Produtos Salvos */}
                <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Produtos Salvos</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredProducts.length} produto(s) encontrado(s)
                                {produtosSalvos.some(p => p.isInitial) && (
                                    <span className="ml-2 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                                        Inclui produtos demonstrativos
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Filtros e Busca */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            >
                                <option value="nome">Nome</option>
                                <option value="marca">Marca</option>
                                <option value="preco">Preço</option>
                            </select>

                            <button
                                onClick={() => {
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Grid de Produtos */}
                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                                {paginatedProducts.map((product) => (
                                    <ProductCard
                                        key={product.codigo}
                                        product={product}
                                        onExcluir={onExcluirProduto}
                                    />
                                ))}
                            </div>

                            {/* Paginação */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border-t border-gray-200 pt-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Itens por página:</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        >
                                            <option value={4}>4</option>
                                            <option value={8}>8</option>
                                            <option value={12}>12</option>
                                            <option value={16}>16</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Anterior
                                        </button>

                                        <span className="text-sm text-gray-600 mx-4">
                                            Página {currentPage} de {totalPages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Nenhum produto encontrado</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {searchTerm ? "Tente ajustar os termos de busca" : "Adicione produtos usando a consulta acima"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;