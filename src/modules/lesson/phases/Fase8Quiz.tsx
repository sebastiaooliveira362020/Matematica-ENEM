import React, { useState } from 'react';
import { Questao, ResultadoTentativaQuiz } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { EvaluationEngine } from '../../../core/evaluationEngine';
import { HelpCircle, Check, ArrowRight, ArrowLeft, Send } from 'lucide-react';

interface Props {
  licaoId: string;
  questoes: Questao[];
  instrucoes: string;
  onConcluirQuiz: (resultado: ResultadoTentativaQuiz) => void;
}

export const Fase8Quiz: React.FC<Props> = ({
  licaoId,
  questoes,
  instrucoes,
  onConcluirQuiz,
}) => {
  const [questaoAtualIdx, setQuestaoAtualIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [iniciadoEm] = useState<number>(Date.now());
  const [confirmandoEnvio, setConfirmandoEnvio] = useState(false);

  const questaoAtual = questoes[questaoAtualIdx];
  const totalQuestoes = questoes.length;
  const totalRespondidas = Object.keys(respostas).length;
  const todasRespondidas = totalRespondidas === totalQuestoes;

  const handleSelecionar = (letra: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setRespostas((prev) => ({ ...prev, [questaoAtual.id]: letra }));
  };

  const handleFinalizar = () => {
    const tempoGastoSegundos = Math.round((Date.now() - iniciadoEm) / 1000);
    const resultado = EvaluationEngine.avaliarQuiz(licaoId, questoes, respostas, tempoGastoSegundos);
    onConcluirQuiz(resultado);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          Fase 8: Avaliação Final Formativa
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quiz Formativo por Habilidades
          </h2>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full">
            Respondidas: {totalRespondidas} de {totalQuestoes}
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-1">{instrucoes}</p>
      </div>

      {/* Grade de Navegação Rápida entre Questões */}
      <div className="flex flex-wrap gap-2 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
        {questoes.map((q, idx) => {
          const foiRespondida = !!respostas[q.id];
          const isCurrent = idx === questaoAtualIdx;

          return (
            <button
              key={q.id}
              onClick={() => {
                setConfirmandoEnvio(false);
                setQuestaoAtualIdx(idx);
              }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                  : foiRespondida
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {!confirmandoEnvio ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Questão {questaoAtualIdx + 1} de {totalQuestoes} • Habilidade {questaoAtual.habilidadeId}
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {questaoAtual.conceitoNecessario}
            </span>
          </div>

          <div className="text-slate-900 font-medium text-base leading-relaxed">
            <FormattedMathText text={questaoAtual.enunciado} />
          </div>

          {/* Alternativas de A a E */}
          <div className="space-y-3">
            {questaoAtual.alternativas.map((alt) => {
              const isSelected = respostas[questaoAtual.id] === alt.letra;

              return (
                <button
                  key={alt.letra}
                  type="button"
                  onClick={() => handleSelecionar(alt.letra)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 text-sm ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 bg-white'
                  }`}
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              disabled={questaoAtualIdx === 0}
              onClick={() => setQuestaoAtualIdx((prev) => prev - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {questaoAtualIdx < totalQuestoes - 1 ? (
              <Button
                onClick={() => setQuestaoAtualIdx((prev) => prev + 1)}
                className="gap-2"
              >
                Próxima
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="md"
                variant="success"
                onClick={() => setConfirmandoEnvio(true)}
                className="gap-2"
              >
                Revisar e Finalizar
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Tela de Confirmação e Revisão */
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Confirmação de Envio</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            {todasRespondidas
              ? 'Você respondeu a todas as questões! Deseja finalizar o quiz agora e receber sua análise diagnóstica detalhada?'
              : `Você respondeu a ${totalRespondidas} de ${totalQuestoes} questões. Questões sem resposta serão consideradas incorretas no relatório formativo.`}
          </p>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setConfirmandoEnvio(false)}>
              Voltar e Revisar Questões
            </Button>
            <Button variant="primary" onClick={handleFinalizar} className="gap-2">
              <Send className="w-4 h-4" />
              Entregar Avaliação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
