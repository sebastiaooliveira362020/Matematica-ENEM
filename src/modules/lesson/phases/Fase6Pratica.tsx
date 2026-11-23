import React, { useState } from 'react';
import { ExercicioPratica } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { Target, HelpCircle, CheckCircle2, XCircle, ArrowRight, ChevronDown } from 'lucide-react';

interface Props {
  exercicios: ExercicioPratica[];
  onAvancar: () => void;
}

export const Fase6Pratica: React.FC<Props> = ({ exercicios, onAvancar }) => {
  const [exIdx] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [revelouFeedback, setRevelouFeedback] = useState(false);
  const [dicasAbertas, setDicasAbertas] = useState<number>(0); // 0 = nenhuma, 1 = dica1, 2 = dica2, 3 = dica3

  const exAtual = exercicios[exIdx];
  const acertou = respostaSelecionada === exAtual.alternativaCorreta;

  const handleVerificar = () => {
    if (!respostaSelecionada) return;
    setRevelouFeedback(true);
  };

  const handleTentarNovamente = () => {
    setRespostaSelecionada(null);
    setRevelouFeedback(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Target className="w-4 h-4 text-emerald-600" />
          Fase 6: Prática com Feedback Orientado
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pratique com Dicas Graduais
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Exercício {exIdx + 1} de {exercicios.length}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-slate-900 font-medium text-base leading-relaxed">
          <FormattedMathText text={exAtual.enunciado} />
        </div>

        {/* Sistema de Dicas Progressivas (3 Níveis) */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Precisa de ajuda para resolver?
            </span>
            {dicasAbertas < 3 && (
              <button
                type="button"
                onClick={() => setDicasAbertas((prev) => Math.min(3, prev + 1))}
                className="text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-all flex items-center gap-1"
              >
                Abrir Dica {dicasAbertas + 1} de 3
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {dicasAbertas >= 1 && (
            <div className="text-xs bg-white p-3 rounded-lg border border-amber-200 text-slate-800">
              <span className="font-bold text-amber-800">Dica 1 (Conceito): </span>
              <FormattedMathText text={exAtual.dicasProgressivas[0]} />
            </div>
          )}
          {dicasAbertas >= 2 && (
            <div className="text-xs bg-white p-3 rounded-lg border border-amber-200 text-slate-800">
              <span className="font-bold text-amber-800">Dica 2 (Caminho): </span>
              <FormattedMathText text={exAtual.dicasProgressivas[1]} />
            </div>
          )}
          {dicasAbertas >= 3 && (
            <div className="text-xs bg-white p-3 rounded-lg border border-amber-200 text-slate-800">
              <span className="font-bold text-amber-800">Dica 3 (Passo Parcial): </span>
              <FormattedMathText text={exAtual.dicasProgressivas[2]} />
            </div>
          )}
        </div>

        {/* Alternativas */}
        <div className="space-y-2.5">
          {exAtual.alternativas.map((alt) => {
            const isSelected = respostaSelecionada === alt.letra;
            const isCorrect = alt.letra === exAtual.alternativaCorreta;

            let btnClass = 'border-slate-200 bg-white hover:bg-indigo-50/40 text-slate-700';

            if (isSelected && !revelouFeedback) {
              btnClass = 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20';
            }

            if (revelouFeedback) {
              if (isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
              } else if (isSelected) {
                btnClass = 'border-rose-400 bg-rose-50 text-rose-950';
              } else {
                btnClass = 'opacity-60 border-slate-200 bg-white';
              }
            }

            return (
              <button
                key={alt.letra}
                type="button"
                disabled={revelouFeedback}
                onClick={() => setRespostaSelecionada(alt.letra)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-sm ${btnClass}`}
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

        {/* Feedback Detalhado */}
        {revelouFeedback && (
          <div
            className={`p-5 rounded-xl text-sm border space-y-2 ${
              acertou
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {acertou ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Correto! Você aplicou o raciocínio perfeitamente.
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Não foi dessa vez, mas veja a reconstrução do raciocínio:
                </>
              )}
            </div>
            <FormattedMathText
              text={
                exAtual.alternativas.find((a) => a.letra === respostaSelecionada)?.explicacaoDiagnostica ||
                exAtual.solucaoPassoAPasso
              }
            />
            {!acertou && (
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleTentarNovamente}>
                  Tentar Novamente Este Exercício
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        {!revelouFeedback ? (
          <Button
            size="lg"
            disabled={!respostaSelecionada}
            onClick={handleVerificar}
            className="ml-auto"
          >
            Conferir Resposta
          </Button>
        ) : (
          <Button size="lg" onClick={onAvancar} className="ml-auto gap-2">
            Ver a Conexão com o ENEM
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
