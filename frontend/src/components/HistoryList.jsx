import { History, Check, X } from 'lucide-react';

const HistoryList = ({ historico }) => {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {historico.length === 0 ? (
        <div className="text-center py-8">
          <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Nenhuma pesquisa realizada</p>
        </div>
      ) : (
        historico.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            {item.sucesso ? (
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.produto}
              </p>
              <p className="text-xs text-gray-500">
                {item.codigo} • {new Date(item.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryList;