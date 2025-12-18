import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = async (email, senha) => {
    // MOCK
    if (email && senha) {
      const userData = { email };
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { sucesso: true };
    }
    return { sucesso: false, erro: "Credenciais inválidas" };
  };

  const cadastrar = async (nome, email, senha) => {
    // MOCK
    return { sucesso: true };
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};