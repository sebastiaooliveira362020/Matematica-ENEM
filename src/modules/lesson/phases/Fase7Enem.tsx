import React, { useState } from 'react';
import { LicaoFases } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { Award, Compass, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  dados: LicaoFases['fase7_conexaoEnem'];
  onAvancar: () => void;
}

export const Fase7Enem: React.FC<Props> = ({ dados, onAvancar }) => {
  const [resposta, setResposta] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [revelarAnalise, setRevelarAnalise] = useState(false);

  const questao = dados.questaoOriginalEstiloENEM;
  const acertou = resposta === questao.alternativaCorreta;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Award className="w-4 h-4 text-rose-600" />
          Fase 7: Conexão Direta com o ENEM
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Situação-Problema no Estilo do Exame
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Aprenda a decodificar as "pegadinhas" (distratores) e a identificar o comando central da prova.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Questão Original Estilo ENEM • Habilidade {questao.habilidadeId}
          </span>
          <span className="text-xs font-medium text-slate-400">5 Alternativas</span>
        </div>

        <div className="text-slate-800 text-base leading-relaxed">
          <FormattedMathText text={questao.enunciado} />
        </div>

        {/* Alternativas */}
        <div className="space-y-2.5">
          {questao.alternativas.map((alt) => {
            const isSelected = resposta === alt.letra;
            const isCorrect = alt.letra === questao.alternativaCorreta;

            let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

            if (isSelected && !revelarAnalise) {
              btnClass = 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
            }

            if (revelarAnalise) {
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
                disabled={revelarAnalise}
                onClick={() => setResposta(alt.letra)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-sm ${btnClass}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
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

        {/* Devolutiva e Análise Estratégica ENEM */}
        {revelarAnalise && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl text-sm border flex items-center gap-3 ${
                acertou
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              {acertou ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <span className="font-semibold">
                {acertou
                  ? 'Gabarito correto! Veja como interpretar o padrão da questão:'
                  : 'Atenção ao distrator! Entenda a mecânica da questão abaixo:'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Interpretação do Comando:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {dados.estrategiasEnem.interpretacaoComando}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Armadilha dos Distratores:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {dados.estrategiasEnem.distratoresIdentificados}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
              <span className="font-bold">Resolução e Justificativa Oficial: </span>
              <FormattedMathText text={dados.estrategiasEnem.justificativaGabarito} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        {!revelarAnalise ? (
          <Button
            size="lg"
            disabled={!resposta}
            onClick={() => setRevelarAnalise(true)}
            className="ml-auto"
          >
            Submeter e Ver Estratégia ENEM
          </Button>
        ) : (
          <Button size="lg" onClick={onAvancar} className="ml-auto gap-2 bg-indigo-600 hover:bg-indigo-700">
            Fazer o Quiz Final da Lição
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
