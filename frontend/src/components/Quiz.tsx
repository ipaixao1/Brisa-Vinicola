import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type QuizAnswers } from "@/context/AuthContext";

const questions = [
  { id: 1, text: "Para qual ocasião você está procurando um vinho?", options: ["Jantar especial", "Celebração", "Presente", "Momento pessoal"] },
  { id: 2, text: "Qual perfil de sabor você prefere?", options: ["Frutado", "Seco", "Equilibrado", "Encorpado"] },
  { id: 3, text: "Com qual tipo de comida você pretende harmonizar?", options: ["Carnes", "Massas", "Peixes", "Queijos e aperitivos"] },
  { id: 4, text: "Qual é o seu nível de experiência com vinhos?", options: ["Estou começando", "Já aprecio vinhos", "Tenho experiência", "Sou apaixonado por vinhos"] },
  { id: 5, text: "Qual faixa de investimento você procura?", options: ["Até R$ 80", "R$ 80 — R$ 130", "Acima de R$ 130", "Ainda não sei"] },
];

interface Props {
  onClose: () => void;
}

export default function Quiz({ onClose }: Props) {
  const { user, saveQuizAnswers, setPendingQuizAnswers } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  // step 0 = gate (unauthenticated result ready), step 7 = done (logged in result shown inline then redirect)

  const [showGate, setShowGate] = useState(false);
  const [pendingAnswers, setPending] = useState<QuizAnswers | null>(null);

  const currentQ = questions[step - 1];

  function buildAnswers(list: number[]): QuizAnswers {
    return { ocasiao: list[0], sabor: list[1], comida: list[2], experiencia: list[3], preco: list[4] };
  }

  function handleNext() {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);

    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      // Quiz completed
      const quizAnswers = buildAnswers(next);
      if (user) {
        saveQuizAnswers(quizAnswers);
        onClose();
        navigate("/quiz-resultado");
      } else {
        setPendingQuizAnswers(quizAnswers);
        setPending(quizAnswers);
        setShowGate(true);
      }
    }
  }

  function goToLogin() {
    onClose();
    navigate("/login", { state: { from: "/quiz-resultado" } });
  }

  function goToCadastro() {
    onClose();
    navigate("/cadastro", { state: { from: "/quiz-resultado" } });
  }

  return (
    <div className="quiz-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quiz-modal">
        <button className="quiz-close" onClick={onClose} aria-label="Fechar">✕</button>

        {!showGate ? (
          <div className="quiz-question-wrap">
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${((step - 1) / 5) * 100}%` }} />
            </div>
            <p className="quiz-step-label">{step} de 5</p>
            <h3 className="quiz-q-text">{currentQ.text}</h3>
            <div className="quiz-options">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={opt}
                  className={`quiz-option${selected === idx ? " selected" : ""}`}
                  onClick={() => setSelected(idx)}
                >{opt}</button>
              ))}
            </div>
            <button
              className="quiz-btn-primary"
              style={{ opacity: selected === null ? 0.4 : 1 }}
              disabled={selected === null}
              onClick={handleNext}
            >
              {step === 5 ? "Ver meu resultado" : "Próxima pergunta"}
            </button>
          </div>
        ) : (
          /* Auth gate */
          <div className="quiz-intro" style={{ gap: 20 }}>
            <div className="quiz-deco-line" />
            <h2 className="quiz-main-title font-serif">Seu resultado está pronto!</h2>
            <p className="quiz-intro-sub" style={{ marginBottom: 8 }}>
              Entre ou crie sua conta para descobrir os vinhos selecionados especialmente para você.
            </p>
            <button className="quiz-btn-primary" onClick={goToLogin}>ENTRAR</button>
            <button className="quiz-btn-ghost" onClick={goToCadastro}>CRIAR CONTA</button>
          </div>
        )}
      </div>
    </div>
  );
}
