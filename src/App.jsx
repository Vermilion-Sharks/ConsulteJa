import { useState, useRef, useEffect } from "react";
import { Alert, useAlert } from "./components/Alert";
import Dashboard from "./components/Dashboard";

function App() {
  const [codigo, setCodigo] = useState("");
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [precoCustom, setPrecoCustom] = useState("");
  const [produtosSalvos, setProdutosSalvos] = useState([]);
  const [nomeTemp, setNomeTemp] = useState("");
  const [marcaTemp, setMarcaTemp] = useState("");
  const [descricaoTemp, setDescricaoTemp] = useState("");
  const [ultimoCodigo, setUltimoCodigo] = useState("");
  const [historicoPesquisas, setHistoricoPesquisas] = useState([]);
  const [apiLink, setApiLink] = useState("");
  const [editandoNome, setEditandoNome] = useState(false);
  const [editandoMarca, setEditandoMarca] = useState(false);
  const [editandoDescricao, setEditandoDescricao] = useState(false);
  const inputRef = useRef(null);
  const { alertMessage, showAlert } = useAlert();

  useEffect(() => {
    inputRef.current.focus();
    carregarProdutosIniciais();
    carregarHistoricoPesquisas();
  }, []);

  const carregarProdutosIniciais = () => {
    try {
      const produtosExistentes = JSON.parse(localStorage.getItem("produtos_modificados") || "[]");
      const sanitizeProducts = (list) => {
        if (!Array.isArray(list)) return [];
        return list.map((p) => {
          try {
            const codigo = p?.codigo != null ? String(p.codigo) : '';
            const nome = p?.nome != null ? String(p.nome) : `Produto ${codigo.slice(-4)}`;
            const marca = p?.marca != null ? String(p.marca) : 'Marca Genérica';
            const descricao = p?.descricao != null ? String(p.descricao) : 'Sem descrição disponível';

            
            let preco = p?.preco;
            if (preco === undefined || preco === null || String(preco).trim() === '') {
              preco = 'Sem preço definido';
            } else if (typeof preco === 'number') {
              preco = `${String(preco).replace('.', ',')}R$`;
            } else {
              preco = String(preco);
              if (/\d+\.\d+/.test(preco)) preco = preco.replace('.', ',');
              if (!/R\$/.test(preco) && !/r\$/.test(preco)) preco = `${preco}R$`;
            }

            return {
              codigo,
              nome,
              marca,
              descricao,
              preco,
              imagem: p?.imagem || '',
              isImported: !!p?.isImported,
              createdAt: p?.createdAt || new Date().toISOString(),
              updatedAt: p?.updatedAt || null
            };
          } catch (err) {
            return null;
          }
        }).filter(Boolean);
      };
      if (produtosExistentes.length === 0) {
        console.log("Nenhum produto salvo encontrado — iniciando lista vazia.");
        localStorage.setItem("produtos_modificados", JSON.stringify([]));
        setProdutosSalvos([]);
      } else {
        const sanitized = sanitizeProducts(produtosExistentes);
        console.log("Produtos existentes carregados (sanitizados):", sanitized.length);
        localStorage.setItem("produtos_modificados", JSON.stringify(sanitized));
        setProdutosSalvos(sanitized);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      
      localStorage.setItem("produtos_modificados", JSON.stringify([]));
      setProdutosSalvos([]);
    }
  };

  const carregarHistoricoPesquisas = () => {
    const historico = JSON.parse(localStorage.getItem("historico_pesquisas") || "[]");
    setHistoricoPesquisas(historico);
  };

  const salvarProdutosLocal = (lista) => {
    console.log("Salvando produtos:", lista.length);
    localStorage.setItem("produtos_modificados", JSON.stringify(lista));
    setProdutosSalvos(lista);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('productsUpdated'));
    }, 100);
  };


  const excluirProduto = (codigo) => {
    const novosProdutos = produtosSalvos.filter(p => p.codigo !== codigo);
    salvarProdutosLocal(novosProdutos);
    showAlert("Produto excluído com sucesso!");
    if (produto && produto.codigo === codigo) {
      setProduto(null);
    }
  };

  const resetarParaProdutosIniciais = () => {
    if (window.confirm("Isso irá restaurar os 10 produtos iniciais e remover quaisquer produtos adicionados. Continuar?")) {
      const produtosComTimestamp = initialProducts.map(prod => ({
        ...prod,
        isInitial: true,
        createdAt: new Date().toISOString()
      }));
      salvarProdutosLocal(produtosComTimestamp);
      showAlert("Produtos iniciais restaurados com sucesso!");
    }
  };

  const adicionarHistoricoPesquisa = (codigo, produtoEncontrado) => {
    const novoHistorico = [
      {
        timestamp: new Date().toISOString(),
        codigo,
        produto: produtoEncontrado?.nome || `Produto ${codigo}`,
        sucesso: !!produtoEncontrado
      },
      ...historicoPesquisas.slice(0, 49)
    ];
    setHistoricoPesquisas(novoHistorico);
    localStorage.setItem("historico_pesquisas", JSON.stringify(novoHistorico));
  };

  const traduzirTexto = async (texto) => {
    if (!texto) return texto;
    try {
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: texto,
          source: "auto",
          target: "pt",
          format: "text",
        }),
      });
      const data = await res.json();
      return data?.translatedText || texto;
    } catch {
      return texto;
    }
  };

  const buscarProduto = async () => {
    if (!codigo) return showAlert("Digite ou escaneie um código de barras!");

    setLoading(true);
    setProduto(null);
    setUltimoCodigo(codigo);

    try {
      let nome = "";
      let marca = "";
      let descricao = "";
      let imagem = "";

      
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
        const data = await res.json();
        if (data.status === 1) {
          const p = data.product;
          nome = p.product_name || p.generic_name || "";
          marca = p.brands || "";
          descricao = p.categories || "Sem descrição";
          imagem = p.image_url || "";
        }
      } catch (err) {
        console.warn("OpenFoodFacts falhou:", err);
      }

      
      if (!nome || !marca) {
        try {
          const res2 = await fetch(`https://brasilapi.com.br/api/barcode/v1/${codigo}`);
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2?.description) nome = nome || data2.description;
            if (data2?.brand) marca = marca || data2.brand;
          }
        } catch (err) {
          console.warn("BrasilAPI falhou:", err);
        }
      }

      
      if (!nome || !marca) {
        try {
          const res3 = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${codigo}`);
          const data3 = await res3.json();
          if (data3?.items && data3.items.length > 0) {
            const p = data3.items[0];
            nome = nome || p.title;
            marca = marca || p.brand;
            imagem = imagem || p.images?.[0] || "";
            descricao = descricao || p.description || "Sem descrição";
          }
        } catch (err) {
          console.warn("UPCItemDB falhou:", err);
        }
      }

      
      if (!nome || !marca) {
        try {
          const res4 = await fetch(`https://api.productopendata.com/products/${codigo}`);
          const data4 = await res4.json();
          if (data4?.product) {
            nome = nome || data4.product.name;
            marca = marca || data4.product.brand;
            imagem = imagem || data4.product.image_url;
          }
        } catch (err) {
          console.warn("ProductOpenData falhou:", err);
        }
      }

      nome = await traduzirTexto(nome);
      marca = await traduzirTexto(marca);

      nome = nome || `Produto ${codigo.slice(-4)}`;
      marca = marca || "Marca Genérica";
      descricao = descricao || "Sem descrição disponível";

      const lista = JSON.parse(localStorage.getItem("produtos_modificados") || "[]");
      const produtoExistente = lista.find((item) => item.codigo === codigo);

      const produtoEncontrado = {
        codigo,
        nome,
        marca,
        descricao,
        preco: produtoExistente?.preco || "Sem preço definido",
        imagem: produtoExistente?.imagem || imagem,
      };

      setProduto(produtoEncontrado);
      setNomeTemp("");
      setMarcaTemp("");
      setDescricaoTemp("");
      setEditandoNome(false);
      setEditandoMarca(false);
      setEditandoDescricao(false);
      
      adicionarHistoricoPesquisa(codigo, produtoEncontrado);
    } catch (err) {
      showAlert("Erro ao buscar produto.");
      console.error(err);
      adicionarHistoricoPesquisa(codigo, null);
    } finally {
      setLoading(false);
      setCodigo("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") buscarProduto();

    if (e.key === "ArrowUp" && !codigo && ultimoCodigo) {
      setCodigo(ultimoCodigo);
      setTimeout(() => {
        buscarProduto();
      }, 100);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProduto((prev) => ({ ...prev, imagem: "" }));
      showAlert("Imagem removida com sucesso!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProduto((prev) => ({ ...prev, imagem: base64 }));
      showAlert("Imagem carregada com sucesso!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverImagem = () => {
    setProduto((prev) => ({ ...prev, imagem: "" }));
    showAlert("Imagem removida com sucesso!");
  };

  const iniciarEdicaoNome = () => {
    setNomeTemp(produto.nome);
    setEditandoNome(true);
  };

  const iniciarEdicaoMarca = () => {
    setMarcaTemp(produto.marca);
    setEditandoMarca(true);
  };

  const iniciarEdicaoDescricao = () => {
    setDescricaoTemp(produto.descricao);
    setEditandoDescricao(true);
  };


  const confirmarEdicao = (tipo) => {
    if (!produto) return;
    
    if (tipo === "nome" && nomeTemp.trim()) {
      setProduto({ ...produto, nome: nomeTemp.trim() });
      setNomeTemp("");
      setEditandoNome(false);
      showAlert("Nome atualizado com sucesso!");
    }
    if (tipo === "marca" && marcaTemp.trim()) {
      setProduto({ ...produto, marca: marcaTemp.trim() });
      setMarcaTemp("");
      setEditandoMarca(false);
      showAlert("Marca atualizada com sucesso!");
    }
    if (tipo === "descricao" && descricaoTemp.trim()) {
      setProduto({ ...produto, descricao: descricaoTemp.trim() });
      setDescricaoTemp("");
      setEditandoDescricao(false);
      showAlert("Descrição atualizada com sucesso!");
    }
  };

  const cancelarEdicao = (tipo) => {
    if (tipo === "nome") {
      setEditandoNome(false);
      setNomeTemp("");
    }
    if (tipo === "marca") {
      setEditandoMarca(false);
      setMarcaTemp("");
    }
    if (tipo === "descricao") {
      setEditandoDescricao(false);
      setDescricaoTemp("");
    }
  };

  const salvarProdutoAtualizado = () => {
    if (!produto) return showAlert("Nenhum produto carregado.");
    if (!precoCustom && produto.preco === "Sem preço definido")
      return showAlert("Digite um preço antes de salvar!");

    const precoFormatado = precoCustom ? `${precoCustom}R$` : produto.preco;

    const novosProdutos = [...produtosSalvos];
    const index = novosProdutos.findIndex((p) => p.codigo === produto.codigo);

    const atualizado = {
      ...produto,
      preco: precoFormatado,
      isInitial: false, 
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      novosProdutos[index] = atualizado;
    } else {
      novosProdutos.unshift(atualizado); 
    }

    salvarProdutosLocal(novosProdutos);
    setProduto(atualizado);
    setPrecoCustom("");
    setEditandoNome(false);
    setEditandoMarca(false);
    setEditandoDescricao(false);
    showAlert("Produto salvo com sucesso!");
  };

  const handlePrecoChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.slice(0, -2) + "," + valor.slice(-2);
    setPrecoCustom(valor);
  };

  const gerarArquivoJSON = () => {
    const produtosFormatados = produtosSalvos.map((p) => ({
      ...p,
      preco: p.preco.endsWith("R$") ? p.preco : `${p.preco}R$`,
    }));

    const dataStr = JSON.stringify(produtosFormatados, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produtos_modificados.json";
    a.click();
    URL.revokeObjectURL(url);
    showAlert("Arquivo JSON gerado com sucesso!");
  };

  const gerarLinkAPI = () => {
    const produtosFormatados = produtosSalvos.map((p) => ({
      ...p,
      preco: p.preco.endsWith("R$") ? p.preco : `${p.preco}R$`,
    }));

    const dataStr = JSON.stringify(produtosFormatados, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setApiLink(url);
    showAlert("Link da API gerado com sucesso! Copie o link abaixo.");
  };

  return (
    <Dashboard
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
      onBuscarProduto={buscarProduto}
      onKeyPress={handleKeyPress}
      onImageUpload={handleImageUpload}
      onRemoverImagem={handleRemoverImagem}
      onIniciarEdicaoNome={iniciarEdicaoNome}
      onIniciarEdicaoMarca={iniciarEdicaoMarca}
      onIniciarEdicaoDescricao={iniciarEdicaoDescricao}
      onConfirmarEdicao={confirmarEdicao}
      onCancelarEdicao={cancelarEdicao}
      onSalvarProduto={salvarProdutoAtualizado}
      onPrecoChange={handlePrecoChange}
      

      produtosSalvos={produtosSalvos}
      historicoPesquisas={historicoPesquisas}
      onGerarArquivoJSON={gerarArquivoJSON}
      onSalvarProdutosLocal={salvarProdutosLocal}
      onGerarLinkAPI={gerarLinkAPI}
      onExcluirProduto={excluirProduto}
      onResetarProdutosIniciais={resetarParaProdutosIniciais}
      apiLink={apiLink}
      alertMessage={alertMessage}
    />
  );
}

export default App;