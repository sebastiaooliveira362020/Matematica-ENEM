import React, { useState } from 'react';
import { BlocoExplicacao } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { BookOpen, Check, ArrowRight, HelpCircle } from 'lucide-react';

interface Props {
  blocos: BlocoExplicacao[];
  onAvancar: () => void;
}

export const Fase3Explicacao: React.FC<Props> = ({ blocos, onAvancar }) => {
  const [blocoIndex, setBlocoIndex] = useState(0);
  const [microRespostas, setMicroRespostas] = useState<Record<string, number>>({});

  const blocoAtual = blocos[blocoIndex];
  const totalBlocos = blocos.length;
  const ehUltimoBloco = blocoIndex === totalBlocos - 1;

  const handleMicroVerificacao = (blocoId: string, opcaoIdx: number) => {
    setMicroRespostas((prev) => ({ ...prev, [blocoId]: opcaoIdx }));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Fase 3: Explicação Conceitual
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Construção dos Conceitos
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Parte {blocoIndex + 1} de {totalBlocos}
          </span>
        </div>
      </div>

      {/* Navegador de mini-blocos */}
      <div className="flex gap-2">
        {blocos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setBlocoIndex(idx)}
            className={`h-2 flex-1 rounded-full transition-all ${
              idx === blocoIndex
                ? 'bg-indigo-600'
                : idx < blocoIndex
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`}
            title={`Ir para o bloco ${idx + 1}`}
          />
        ))}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          {blocoAtual.subtitulo}
        </h3>

        {/* Explicação Teórica com KaTeX */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
          <FormattedMathText text={blocoAtual.conteudoLatex} />
        </div>

        {/* Exemplo Prático Destacado */}
        <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-indigo-600 text-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Exemplo Prático e Contextualizado:
          </h4>
          <FormattedMathText text={blocoAtual.exemploPratico} className="text-sm leading-relaxed" />
        </div>

        {/* Microverificação de Compreensão */}
        {blocoAtual.microVerificacao && (
          <div className="mt-6 p-5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Microverificação: {blocoAtual.microVerificacao.pergunta}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {blocoAtual.microVerificacao.opcoes.map((opcao, optIdx) => {
                const escolhido = microRespostas[blocoAtual.id] === optIdx;
                const estaCorreto = optIdx === blocoAtual.microVerificacao?.indiceCorreto;
                const jaRespondeu = microRespostas[blocoAtual.id] !== undefined;

                let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                if (jaRespondeu) {
                  if (estaCorreto) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (escolhido) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={jaRespondeu}
                    onClick={() => handleMicroVerificacao(blocoAtual.id, optIdx)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opcao}</span>
                    {jaRespondeu && estaCorreto && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {microRespostas[blocoAtual.id] !== undefined && (
              <p className="text-xs text-indigo-900 font-medium pt-1">
                {blocoAtual.microVerificacao.feedbackImediato}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Controles de Navegação */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          disabled={blocoIndex === 0}
          onClick={() => setBlocoIndex((prev) => prev - 1)}
        >
          Bloco Anterior
        </Button>

        {!ehUltimoBloco ? (
          <Button onClick={() => setBlocoIndex((prev) => prev + 1)} className="gap-2">
            Próximo Bloco
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={onAvancar} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            Experimentar no Simulador Interativo
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
