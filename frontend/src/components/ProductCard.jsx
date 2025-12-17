import { Package, Hash, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onExcluir }) => {
  const handleExcluir = () => {
    if (window.confirm(`Tem certeza que deseja excluir "${product.nome}"?`)) {
      onExcluir(product.codigo);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group relative">
      <button
        onClick={handleExcluir}
        className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 z-10"
        title="Excluir produto"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {product.isInitial && (
        <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Demo
        </div>
      )}

      {product.imagem ? (
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-40 object-contain mb-3 rounded-lg group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors ">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
      )}
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
        {product.nome}
      </h3>
      <p className="text-sm text-gray-600 mb-3 text-gray-900 break-words whitespace-normal break-all flex-1">{product.marca}</p>
      
      <div className="flex items-center justify-between">
        <span className={`text-lg font-bold text-gray-900 break-words whitespace-normal break-all ${
          product.preco === "Sem preço definido" ? "text-gray-500" : "text-green-600"
        }`}>
          {product.preco}
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500 text-gray-900 break-words whitespace-normal break-all flex">
          <Hash className="h-3 w-3" />
          <span className="font-mono ">{product.codigo}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;