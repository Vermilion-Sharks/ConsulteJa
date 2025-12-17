import React from 'react';

const DebugInfo = ({ produtosSalvos }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-yellow-800 mb-2">Debug Info</h3>
      <p className="text-yellow-700 text-sm">
        Produtos carregados: {produtosSalvos.length}
      </p>
      <div className="mt-2 max-h-32 overflow-y-auto">
        {produtosSalvos.map((produto, index) => (
          <div key={index} className="text-xs text-yellow-600 border-b border-yellow-300 py-1">
            {produto.nome} - {produto.codigo}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugInfo;