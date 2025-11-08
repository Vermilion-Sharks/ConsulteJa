import { useState } from 'react';
import { Upload, FileText, Table } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const UploadConverter = ({ onProductsImported }) => {
  const [previewData, setPreviewData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (result) => {
          processFileData(result.data);
        },
        header: true,
        skipEmptyLines: true
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        processFileData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processFileData = (data) => {
    if (data.length === 0) {
      alert('Arquivo vazio ou formato inválido');
      setIsProcessing(false);
      return;
    }

    const firstRow = data[0];
    const autoMapping = {};
    const availableColumns = Object.keys(firstRow);

    availableColumns.forEach(col => {
      const lowerCol = col.toLowerCase();
      if (lowerCol.includes('cod') || lowerCol.includes('ean') || lowerCol.includes('code')) {
        autoMapping.codigo = col;
      } else if (lowerCol.includes('nome') || lowerCol.includes('name') || lowerCol.includes('produto')) {
        autoMapping.nome = col;
      } else if (lowerCol.includes('marca') || lowerCol.includes('brand')) {
        autoMapping.marca = col;
      } else if (lowerCol.includes('desc') || lowerCol.includes('description')) {
        autoMapping.descricao = col;
      } else if (lowerCol.includes('preço') || lowerCol.includes('preco') || lowerCol.includes('price')) {
        autoMapping.preco = col;
      }
    });

    setColumnMapping(autoMapping);
    setPreviewData(data.slice(0, 5)); 
    setIsProcessing(false);
  };

  const handleImport = () => {
    if (!previewData || !columnMapping.codigo) {
      alert('Mapeie pelo menos a coluna de código antes de importar');
      return;
    }

    const importedProducts = previewData.map(row => {
      const codigo = String(row[columnMapping.codigo] || '').replace(/\D/g, '');
      const isValidEAN = [8, 12, 13, 14].includes(codigo.length);

      return {
        codigo: isValidEAN ? codigo : `temp_${Date.now()}_${Math.random()}`,
        nome: row[columnMapping.nome] || `Produto ${codigo.slice(-4)}`,
        marca: row[columnMapping.marca] || 'Marca Genérica',
        descricao: row[columnMapping.descricao] || 'Sem descrição disponível',
        preco: row[columnMapping.preco] || 'Sem preço definido',
        imagem: ''
      };
    });

    const existingProducts = JSON.parse(localStorage.getItem("produtos_modificados") || "[]");
    const mergedProducts = [...existingProducts, ...importedProducts];
    
    const uniqueProducts = mergedProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.codigo === product.codigo)
    );

    onProductsImported(uniqueProducts);
    setPreviewData(null);
    setColumnMapping({});
    alert(`${importedProducts.length} produtos importados com sucesso!`);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Arraste arquivos ou clique para fazer upload</p>
        <p className="text-sm text-gray-500 mb-3">Suporte para CSV e Excel (.xlsx, .xls)</p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <FileText className="h-4 w-4 mr-2" />
          Selecionar Arquivo
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {isProcessing && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Processando arquivo...</p>
        </div>
      )}

      {previewData && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Table className="h-4 w-4 mr-2" />
            Preview e Mapeamento
          </h3>
          
          {/* Coluna*/}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {['codigo', 'nome', 'marca', 'descricao', 'preco'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <select
                  value={columnMapping[field] || ''}
                  onChange={(e) => setColumnMapping(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Selecionar coluna...</option>
                  {previewData[0] && Object.keys(previewData[0]).map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {previewData[0] && Object.keys(previewData[0]).map(col => (
                    <th key={col} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="border-b">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-3 py-2 text-gray-600 max-w-xs truncate">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={!columnMapping.codigo}
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Importar {previewData.length} Produtos
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadConverter;