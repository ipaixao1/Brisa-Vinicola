import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, ApiError, getToken, setToken } from "@/services/api";

export interface QuizAnswers {
  ocasiao: number;     // 0-3
  sabor: number;       // 0-3
  comida: number;      // 0-3
  experiencia: number; // 0-3
  preco: number;       // 0-3
}

export interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
  quizAnswers?: QuizAnswers;
}

// Formato que a API devolve
interface ApiUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  quizAnswers: QuizAnswers | null;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

interface AuthContextValue {
  user: User | null;
  pendingQuizAnswers: QuizAnswers | null; // respostas feitas antes do login
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  saveQuizAnswers: (answers: QuizAnswers) => Promise<void>;
  setPendingQuizAnswers: (answers: QuizAnswers) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "brisa_user";
const PENDING_KEY = "brisa_pending_quiz";

function toUser(u: ApiUser): User {
  return { name: u.name, email: u.email, isAdmin: u.isAdmin, quizAnswers: u.quizAnswers ?? undefined };
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignora */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // O usuário salvo evita "piscar" deslogado ao recarregar; a API confirma logo em seguida.
  const [user, setUser] = useState<User | null>(() => (getToken() ? readStorage<User>(USER_KEY) : null));
  const [pendingQuizAnswers, setPending] = useState<QuizAnswers | null>(() => readStorage<QuizAnswers>(PENDING_KEY));

  useEffect(() => { writeStorage(USER_KEY, user); }, [user]);
  useEffect(() => { writeStorage(PENDING_KEY, pendingQuizAnswers); }, [pendingQuizAnswers]);

  // Ao abrir o site, confirma na API se o token ainda vale
  useEffect(() => {
    if (!getToken()) return;
    api<ApiUser>("/auth/me")
      .then((u) => setUser(toUser(u)))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          setToken(null);
          setUser(null);
        }
      });
  }, []);

  // Guarda o token e, se havia quiz respondido antes do login, salva no perfil
  async function startSession(data: TokenResponse) {
    setToken(data.access_token);
    let apiUser = data.user;
    if (pendingQuizAnswers) {
      try {
        apiUser = await api<ApiUser>("/users/me/quiz", { method: "PUT", body: pendingQuizAnswers });
        setPending(null);
      } catch {
        /* se falhar, o usuário refaz o quiz depois */
      }
    }
    setUser(toUser(apiUser));
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const data = await api<TokenResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
      await startSession(data);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return false;
      throw err;
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const data = await api<TokenResponse>("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
      await startSession(data);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) return false;
      throw err;
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setPending(null);
  }

  async function saveQuizAnswers(answers: QuizAnswers): Promise<void> {
    if (!user) return;
    const updated = await api<ApiUser>("/users/me/quiz", { method: "PUT", body: answers });
    setUser(toUser(updated));
  }

  function setPendingQuizAnswers(answers: QuizAnswers) {
    setPending(answers);
  }

  return (
    <AuthContext.Provider value={{ user, pendingQuizAnswers, login, register, logout, saveQuizAnswers, setPendingQuizAnswers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
