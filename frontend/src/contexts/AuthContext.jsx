import { useContext } from "react";
import { AuthContext } from '../hooks/authHooks.jsx'

export const useAuth = () => useContext(AuthContext);
