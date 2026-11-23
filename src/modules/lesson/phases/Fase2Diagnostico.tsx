import React, { useState } from 'react';
import { Questao } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  questoes: Questao[];
  onAvancar: () => void;
}

export const Fase2Diagnostico: React.FC<Props> = ({ questoes, onAvancar }) => {
  const [respostas, setRespostas] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [revelarFeedbacks, setRevelarFeedbacks] = useState(false);

  const todasRespondidas = questoes.every((q) => respostas[q.id]);

  const handleSelecionar = (questaoId: string, letra: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (revelarFeedbacks) return;
    setRespostas((prev) => ({ ...prev, [questaoId]: letra }));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Fase 2: Conhecimentos Prévios
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verificação Rápida de Fundamentos
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Não se preocupe com notas aqui! O objetivo é identificar o que você já domina e preparar a explicação seguinte.
        </p>
      </div>

      <div className="space-y-6">
        {questoes.map((q, idx) => {
          const respostaAtual = respostas[q.id];
          const acertou = respostaAtual === q.alternativaCorreta;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                revelarFeedbacks
                  ? acertou
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Item {idx + 1} de {questoes.length}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {q.conceitoNecessario}
                </span>
              </div>

              <div className="text-slate-900 font-medium mb-4 text-base">
                <FormattedMathText text={q.enunciado} />
              </div>

              <div className="space-y-2.5">
                {q.alternativas.map((alt) => {
                  const isSelected = respostaAtual === alt.letra;
                  const isCorrect = alt.letra === q.alternativaCorreta;

                  let styleClass =
                    'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700 bg-white';

                  if (isSelected && !revelarFeedbacks) {
                    styleClass = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-2 ring-indigo-500/20';
                  }

                  if (revelarFeedbacks) {
                    if (isCorrect) {
                      styleClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isSelected) {
                      styleClass = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      styleClass = 'opacity-60 border-slate-200 bg-white';
                    }
                  }

                  return (
                    <button
                      key={alt.letra}
                      type="button"
                      disabled={revelarFeedbacks}
                      onClick={() => handleSelecionar(q.id, alt.letra)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-sm ${styleClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {alt.letra}
                      </span>
                      <div className="flex-1">
                        <FormattedMathText text={alt.texto} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback após conferência */}
              {revelarFeedbacks && (
                <div
                  className={`mt-4 p-4 rounded-xl text-sm border flex items-start gap-3 ${
                    acertou
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  {acertou ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {acertou ? 'Excelente raciocínio!' : 'Ponto de atenção preparado para a próxima fase:'}
                    </p>
                    <p>
                      {
                        q.alternativas.find((a) => a.letra === respostaAtual)?.explicacaoDiagnostica
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        {!revelarFeedbacks ? (
          <Button
            size="lg"
            disabled={!todasRespondidas}
            onClick={() => setRevelarFeedbacks(true)}
            className="ml-auto"
          >
            Verificar Respostas e Continuar
          </Button>
        ) : (
          <Button size="lg" onClick={onAvancar} className="ml-auto gap-2">
            Avançar para a Explicação Conceitual
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
