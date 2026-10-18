import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface QuizAnswers {
  ocasiao: number;   // 0-3
  sabor: number;     // 0-3
  comida: number;    // 0-3
  experiencia: number; // 0-3
  preco: number;     // 0-3
}

export interface User {
  name: string;
  email: string;
  quizAnswers?: QuizAnswers;
}

interface AuthState {
  user: User | null;
  pendingQuizAnswers: QuizAnswers | null; // answers saved before login
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  saveQuizAnswers: (answers: QuizAnswers) => void;
  setPendingQuizAnswers: (answers: QuizAnswers) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "brisa_auth";
const ACCOUNTS_KEY = "brisa_accounts";

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, pendingQuizAnswers: null };
}

function saveState(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface Account { name: string; email: string; password: string; quizAnswers?: QuizAnswers }

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // seed demo accounts
  return [
    { name: "Isabel", email: "isabel@brisa.com", password: "123456" },
    { name: "Carlos", email: "carlos@brisa.com", password: "123456",
      quizAnswers: { ocasiao: 0, sabor: 3, comida: 0, experiencia: 2, preco: 1 } },
  ];
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

  function login(email: string, password: string): boolean {
    const accounts = loadAccounts();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) return false;

    // merge pending quiz answers into the account
    let quizAnswers = account.quizAnswers;
    if (state.pendingQuizAnswers) {
      quizAnswers = state.pendingQuizAnswers;
      const updated = accounts.map((a) =>
        a.email === account.email ? { ...a, quizAnswers } : a
      );
      saveAccounts(updated);
    }

    setState({ user: { name: account.name, email: account.email, quizAnswers }, pendingQuizAnswers: null });
    return true;
  }

  function register(name: string, email: string, password: string): boolean {
    const accounts = loadAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) return false;

    const quizAnswers = state.pendingQuizAnswers ?? undefined;
    const newAccount: Account = { name, email, password, quizAnswers };
    saveAccounts([...accounts, newAccount]);
    setState({ user: { name, email, quizAnswers }, pendingQuizAnswers: null });
    return true;
  }

  function logout() {
    setState({ user: null, pendingQuizAnswers: null });
  }

  function saveQuizAnswers(answers: QuizAnswers) {
    if (!state.user) return;
    const accounts = loadAccounts();
    const updated = accounts.map((a) =>
      a.email === state.user!.email ? { ...a, quizAnswers: answers } : a
    );
    saveAccounts(updated);
    setState((s) => ({ ...s, user: s.user ? { ...s.user, quizAnswers: answers } : null }));
  }

  function setPendingQuizAnswers(answers: QuizAnswers) {
    setState((s) => ({ ...s, pendingQuizAnswers: answers }));
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, saveQuizAnswers, setPendingQuizAnswers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
