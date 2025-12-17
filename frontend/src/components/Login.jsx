import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ onToggleModo }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [dados, setDados] = useState({
    email: "",
    senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resultado = await login(dados.email, dados.senha);

      if (resultado?.sucesso) {
        navigate("/dashboard");
      } else {
        setErro(resultado?.erro || "Credenciais inválidas");
      }
    } catch {
      setErro("Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-gray-600">Faça login em sua conta</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={dados.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  required
                  value={dados.senha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {mostrarSenha ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {erro}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {carregando ? (
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Cadastro */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Não tem conta? </span>
            <button
              onClick={onToggleModo}
              className="text-black font-medium hover:underline"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
