import garrafaTinto from "@/imports/garrafa-tinto.webp";
import garrafaBranco from "@/imports/garrafa-branco.webp";
import garrafaRose from "@/imports/garrafa-rose.webp";
import garrafaEspumante from "@/imports/garrafa-espumante.webp";
import garrafaPrimitivo from "@/imports/garrafa-primitivo.webp";
import type { Wine } from "@/data/wines";

// Endereço da API. Em produção vem de VITE_API_URL (veja frontend/.env.example).
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const TOKEN_KEY = "brisa_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* sem localStorage: o login vale só até recarregar a página */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // false = não envia o token (login e cadastro)
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token && options.auth !== false) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Tente novamente em instantes.");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    let message = "Erro inesperado. Tente novamente.";
    if (typeof data?.detail === "string") message = data.detail;
    else if (Array.isArray(data?.detail) && data.detail[0]?.msg) message = data.detail[0].msg;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

// A API devolve o nome do arquivo da garrafa; no front a imagem é importada no bundle.
export type ApiWine = Omit<Wine, "img" | "type"> & { img: string; type: string };

// Uma garrafa por categoria. O "Primitivo di Manduria" tem garrafa própria.
const garrafaPorTipo: Record<string, string> = {
  Tinto: garrafaTinto,
  Branco: garrafaBranco,
  "Rosé": garrafaRose,
  Espumante: garrafaEspumante,
};

export function garrafaDoVinho(name: string, type: string): string {
  if (name.trim().toLowerCase() === "primitivo di manduria") return garrafaPrimitivo;
  return garrafaPorTipo[type] ?? garrafaTinto;
}

export function toWine(w: ApiWine): Wine {
  return { ...w, type: w.type as Wine["type"], img: garrafaDoVinho(w.name, w.type) };
}
