import { Search, Upload, X, Edit, Check, X as CloseIcon } from 'lucide-react';

const SearchSection = ({
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
  onPrecoChange
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Consultar Produto</h2>
      
      {/* Área de Busca */}
      <div className="mb-6">
        <p className="text-gray-600 mb-3 text-sm">
          Use <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">↑</kbd> para voltar ao produto anterior
        </p>
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Digite ou escaneie o código de barras..."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={onKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <button
            onClick={onBuscarProduto}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-gray-600">Carregando...</span>
        </div>
      )}

      {produto && (
        <div className="border border-gray-200 rounded-lg p-6 animate-fade-in">
          <div className="space-y-4 mb-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
              {editandoNome ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={nomeTemp}
                    placeholder="Digite o nome do produto"
                    onChange={(e) => setNomeTemp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onConfirmarEdicao("nome")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onConfirmarEdicao("nome")}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Confirmar</span>
                    </button>
                    <button
                      onClick={() => onCancelarEdicao("nome")}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      <CloseIcon className="h-4 w-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between group bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="text-gray-900">{produto.nome}</span>
                  <button
                    onClick={onIniciarEdicaoNome}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-all"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Editar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              {editandoMarca ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={marcaTemp}
                    placeholder="Digite a marca"
                    onChange={(e) => setMarcaTemp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onConfirmarEdicao("marca")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onConfirmarEdicao("marca")}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Confirmar</span>
                    </button>
                    <button
                      onClick={() => onCancelarEdicao("marca")}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      <CloseIcon className="h-4 w-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between group bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="text-gray-900">{produto.marca}</span>
                  <button
                    onClick={onIniciarEdicaoMarca}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-all"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Editar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              {editandoDescricao ? (
                <div className="space-y-3">
                  <textarea
                    value={descricaoTemp}
                    placeholder="Digite a descrição do produto"
                    onChange={(e) => setDescricaoTemp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onConfirmarEdicao("descricao")}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Confirmar</span>
                    </button>
                    <button
                      onClick={() => onCancelarEdicao("descricao")}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      <CloseIcon className="h-4 w-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start justify-between group bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <p className="text-gray-900 flex-1">{produto.descricao}</p>
                    <button
                      onClick={onIniciarEdicaoDescricao}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-all ml-3 flex-shrink-0"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preço Atual */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço Atual</label>
            <div className="bg-gray-50 px-4 py-3 border border-gray-200 rounded-lg">
              <span className={`text-lg font-semibold ${produto.preco === "Sem preço definido" ? "text-gray-500" : "text-green-600"}`}>
                {produto.preco}
              </span>
            </div>
          </div>

          {/* Imagem do Produto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Imagem do Produto</label>
            {produto.imagem ? (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
                />
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-colors font-medium">
                    <Upload className="h-4 w-4" />
                    <span>Alterar Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageUpload}
                    />
                  </label>
                  <button
                    onClick={onRemoverImagem}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <X className="h-4 w-4" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">Nenhuma imagem disponível</p>
                <label className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-colors font-medium">
                  <Upload className="h-4 w-4" />
                  <span>Adicionar Imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Preço customizado */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Definir Preço Personalizado
            </label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ex: 1000 = 10,00R$"
                value={precoCustom}
                onChange={onPrecoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                onClick={onSalvarProduto}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors font-medium"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;