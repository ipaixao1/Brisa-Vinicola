import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, toWine, type ApiWine } from "@/services/api";
import type { Wine } from "@/data/wines";

export interface ScoredWine extends Wine {
  score: number;
  compatibility: number; // 0-100
  label: string;
}

export interface ContentItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  videoUrl: string; // link do vídeo no YouTube
  videoTitle: string;
  learn: string[]; // pontos-chave do tema
  article?: string | null; // artigo da loja sobre o mesmo assunto
  wineIds: number[]; // vinhos da loja relacionados ao assunto
}

export interface Recommendation {
  profile: string;
  profileDescription: string;
  traits: string[];
  level: string;
  levelTip: string;
  wines: ScoredWine[];
  content: ContentItem[];
}

interface ApiRecommendation {
  profile: string;
  profileDescription: string;
  traits: string[];
  level: string;
  levelTip: string;
  wines: (ApiWine & { score: number; compatibility: number; label: string })[];
  content: ContentItem[];
}

// Busca na API os vinhos e conteúdos recomendados para o usuário logado.
// Só faz a chamada se ele já respondeu ao quiz.
export function useRecommendations() {
  const { user } = useAuth();
  const answersKey = user?.quizAnswers ? JSON.stringify(user.quizAnswers) : null;

  const [data, setData] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!answersKey) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    api<ApiRecommendation>("/users/me/recommendations")
      .then((r) => {
        if (cancelled) return;
        setData({
          profile: r.profile,
          profileDescription: r.profileDescription,
          traits: r.traits,
          level: r.level,
          levelTip: r.levelTip,
          content: r.content,
          wines: r.wines.map((w) => ({
            ...toWine(w),
            score: w.score,
            compatibility: w.compatibility,
            label: w.label,
          })),
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar recomendações.");
      });
    return () => {
      cancelled = true;
    };
  }, [answersKey]);

  return { data, error };
}
