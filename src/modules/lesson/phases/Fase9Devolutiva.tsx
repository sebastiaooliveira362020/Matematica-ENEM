import React from 'react';
import { Questao, ResultadoTentativaQuiz } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  Target,
} from 'lucide-react';

interface Props {
  resultado: ResultadoTentativaQuiz;
  questoes: Questao[];
  onIrParaFase: (fase: number) => void;
  onAvancar: () => void;
  onRefazerQuiz: () => void;
}

export const Fase9Devolutiva: React.FC<Props> = ({
  resultado,
  questoes,
  onIrParaFase,
  onAvancar,
  onRefazerQuiz,
}) => {
  const getBadgeDominio = (dominio: string) => {
    switch (dominio) {
      case 'Dominio demonstrado':
        return <Badge variant="success">Domínio Demonstrado</Badge>;
      case 'Em desenvolvimento':
        return <Badge variant="warning">Em Desenvolvimento</Badge>;
      default:
        return <Badge variant="danger">Necessita Reforço</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Award className="w-4 h-4 text-emerald-600" />
          Fase 9: Devolutiva Pedagógica Personalizada
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Relatório Formativo de Aprendizagem
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Veja com clareza o que você já conquistou e quais habilidades merecem atenção pontual.
        </p>
      </div>

      {/* 1. Resumo Geral de Desempenho */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Aproveitamento Geral
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{resultado.percentualGeral}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {resultado.totalAcertos} de {resultado.totalQuestoes} questões
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Diagnóstico Pedagógico
          </div>
          <div className="mt-1">
            {resultado.percentualGeral >= 80 ? (
              <Badge variant="success" size="md">Domínio Demonstrado</Badge>
            ) : resultado.percentualGeral >= 60 ? (
              <Badge variant="warning" size="md">Em Desenvolvimento</Badge>
            ) : (
              <Badge variant="danger" size="md">Necessita Reforço</Badge>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-2">Critério Inep/ENEM</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Tempo Registrado
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.floor(resultado.tempoGastoSegundos / 60)}m {resultado.tempoGastoSegundos % 60}s
          </div>
          <div className="text-xs text-slate-500 mt-1">Ritmo médio de prova</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4 text-purple-600" />
            Ação Imediata
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={() => onIrParaFase(3)}
          >
            Reforçar meu aprendizado
          </Button>
        </div>
      </div>

      {/* 2. Pontos Fortes e Pontos a Melhorar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
          <h3 className="font-bold text-emerald-950 flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Seus Pontos Fortes
          </h3>
          {resultado.pontosFortes.map((ponto, i) => (
            <p key={i} className="text-xs text-emerald-900 leading-relaxed font-medium">
              • {ponto}
            </p>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
          <h3 className="font-bold text-amber-950 flex items-center gap-2 text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Onde Concentrar Sua Atenção
          </h3>
          {resultado.pontosMelhorar.length > 0 ? (
            resultado.pontosMelhorar.map((ponto, i) => (
              <p key={i} className="text-xs text-amber-900 leading-relaxed font-medium">
                • {ponto}
              </p>
            ))
          ) : (
            <p className="text-xs text-emerald-900 font-medium">
              Parabéns! Não foram identificados erros conceituais recorrentes nesta tentativa.
            </p>
          )}
        </div>
      </div>

      {/* 3. Desempenho Discriminado por Habilidade ENEM */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Matriz de Domínio por Habilidade
        </h3>
        <div className="space-y-4">
          {Object.entries(resultado.desempenhoPorHabilidade).map(([habId, dados]) => (
            <div key={habId} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Habilidade {habId}: {dados.acertos} de {dados.total} acertos ({dados.percentual}%)
                </span>
                {getBadgeDominio(dados.dominio)}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    dados.percentual >= 80 ? 'bg-emerald-500' : dados.percentual >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${dados.percentual}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Análise Completa Questão por Questão com Gabarito Comentado */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Gabarito Comentado e Correção Diagnóstica
        </h3>

        <div className="space-y-6">
          {questoes.map((q, idx) => {
            const respostaDada = resultado.respostas[q.id];
            const acertou = respostaDada === q.alternativaCorreta;
            const altCorretaObj = q.alternativas.find((a) => a.letra === q.alternativaCorreta);
            const altMarcadaObj = q.alternativas.find((a) => a.letra === respostaDada);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border space-y-3 ${
                  acertou ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    {acertou ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                    Questão {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Sua resposta: <strong>{respostaDada || 'Em branco'}</strong> • Gabarito: <strong>{q.alternativaCorreta}</strong>
                  </span>
                </div>

                <div className="text-slate-800 text-sm font-medium">
                  <FormattedMathText text={q.enunciado} />
                </div>

                <div className="text-xs p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                  <div className="text-emerald-900 leading-relaxed">
                    <span className="font-bold">Por que a alternativa ({q.alternativaCorreta}) está correta: </span>
                    <FormattedMathText text={altCorretaObj?.explicacaoDiagnostica || ''} />
                  </div>

                  {!acertou && respostaDada && altMarcadaObj && (
                    <div className="text-rose-900 leading-relaxed border-t border-slate-100 pt-2">
                      <span className="font-bold">Por que a sua escolha ({respostaDada}) foi um distrator: </span>
                      <FormattedMathText text={altMarcadaObj.explicacaoDiagnostica} />
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Conceito associado: <strong>{q.conceitoNecessario}</strong></span>
                    <button
                      onClick={() => onIrParaFase(q.linkRevisaoFase || 3)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                    >
                      Revisar este conceito na lição &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controles Finais */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onRefazerQuiz} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Refazer Quiz com Novas Tentativas
        </Button>

        <Button size="lg" onClick={onAvancar} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          Ver Agendamento de Revisão Espaçada
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
