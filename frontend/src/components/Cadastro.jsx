import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, X } from 'lucide-react';

const Cadastro = ({ onToggleModo }) => {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  
  const { cadastrar } = useAuth();

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value
    });
    setErro('');
  };

  const validarFormulario = () => {
    if (dados.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (dados.senha !== dados.confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }

    if (!dados.nome.trim()) {
      setErro('O nome é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    if (!validarFormulario()) {
      setCarregando(false);
      return;
    }

    try {
      const resultado = await cadastrar(dados.nome.trim(), dados.email, dados.senha);
      
      if (!resultado.sucesso) {
        setErro(resultado.erro);
      }
    } catch (erro) {
      setErro('Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  const forcaSenha = () => {
    const comprimento = dados.senha.length;
    if (comprimento === 0) return { texto: '', cor: 'gray' };
    if (comprimento < 6) return { texto: 'Fraca', cor: 'red' };
    if (comprimento < 8) return { texto: 'Média', cor: 'yellow' };
    return { texto: 'Forte', cor: 'green' };
  };

  const forca = forcaSenha();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Criar conta</h2>
            <p className="mt-2 text-gray-600">Cadastre-se para começar</p>
          </div>

          {/* Formulário */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={dados.nome}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={dados.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={dados.senha}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Indicador de força da senha */}
              {dados.senha && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-600">Força da senha:</span>
                    <span className={`font-medium ${
                      forca.cor === 'red' ? 'text-red-600' :
                      forca.cor === 'yellow' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {forca.texto}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${
                        forca.cor === 'red' ? 'bg-red-500 w-1/3' :
                        forca.cor === 'yellow' ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  required
                  value={dados.confirmarSenha}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarConfirmarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Indicador de senhas iguais */}
              {dados.confirmarSenha && (
                <div className="mt-2 flex items-center space-x-2 text-xs">
                  {dados.senha === dados.confirmarSenha ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{erro}</p>
              </div>
            )}

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {carregando ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Criar conta</span>
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={onToggleModo}
                className="text-black font-medium hover:text-gray-800 transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;