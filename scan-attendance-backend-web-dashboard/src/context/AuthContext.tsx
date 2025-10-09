/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowToast } from "@/components/hero-ui";
import AuthService from "@/services/auth.service";
import { decodeSpecificToken } from "@/utils/jwt";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface UserPayload {
  user_id: number;
  username: string;
  email: string;
  assign_type: string;
  assign_to: number;
}

interface Account {
  user: UserPayload;
  token: string;
}

interface AuthContextProps {
  accounts: Account[];
  activeAccount: Account | null;
  login: (account: Account) => void;
  logout: (userId?: number) => void;
  switchAccount: (userId: number) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const stored = localStorage.getItem("accounts");
    return stored ? JSON.parse(stored) : [];
  });
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    const stored = localStorage.getItem("activeAccount");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();
 
  // ====== Login Functionality ======
  const login = (account: Account) => {
    // Add or replace account
    setAccounts(prev => {
      const filtered = prev.filter(a => a.user.user_id !== account.user.user_id);
      const updated = [...filtered, account];
      localStorage.setItem("accounts", JSON.stringify(updated));
      return updated;
    });
    setActiveAccount(account);
    localStorage.setItem("activeAccount", JSON.stringify(account));
    decodeSpecificToken(account.token);
  };

  // ====== Logout Functionality ======
  const logout = async (userId?: number) => {
    const tokenToLogout = userId 
      ? accounts.find(a => a.user.user_id === userId)?.token 
      : activeAccount?.token;

    try {

      // Call API first before updating state
      if (tokenToLogout) {
        await AuthService.logout(tokenToLogout);
      }
      
      // Only update state after successful API call
      setAccounts(prev => {
        const updated = userId ? prev.filter(a => a.user.user_id !== userId) : [];
        localStorage.setItem("accounts", JSON.stringify(updated));
        return updated;
      });

      if (!userId || activeAccount?.user.user_id === userId) {
        setActiveAccount(null);
        localStorage.removeItem("activeAccount");
        navigate("/login");
      }
      
      ShowToast({ color: "success", title: "Success", description: "Logout successfully" });
    } catch (error) {
      console.error("Logout error : ", error);
      ShowToast({ color: "error", title: "Error", description: "Failed to logout" });
    }
  };

  // ====== Switch Account Functionality ======
  const switchAccount = (userId: number) => {
    const account = accounts.find(a => a.user.user_id === userId) || null;
    setActiveAccount(account);
    if (account) localStorage.setItem("activeAccount", JSON.stringify(account));
  };

  return (
    <AuthContext.Provider value={{ accounts, activeAccount, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };