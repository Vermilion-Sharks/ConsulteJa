import { useState } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';

const Auth = () => {
  const [modo, setModo] = useState('login'); 

  const toggleModo = () => {
    setModo(modo === 'login' ? 'cadastro' : 'login');
  };

  return modo === 'login' ? (
    <Login onToggleModo={toggleModo} />
  ) : (
    <Cadastro onToggleModo={toggleModo} />
  );
};

export default Auth;