import React from 'react';
import { EixoTematico, Licao, PerfilEstudanteProgresso } from '../../core/types';
import { PrerequisiteTracker } from '../../core/prerequisiteTracker';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Clock, Lock, Play, RotateCcw } from 'lucide-react';

interface Props {
  eixo: EixoTematico;
  progresso: PerfilEstudanteProgresso;
  onVoltar: () => void;
  onSelecionarLicao: (licao: Licao) => void;
}

export const CurriculumTrackPage: React.FC<Props> = ({
  eixo,
  progresso,
  onVoltar,
  onSelecionarLicao,
}) => {
  const getStatusBadge = (licaoId: string) => {
    const statusObj = progresso.licoesStatus[licaoId];
    if (!statusObj || statusObj.status === 'nao_iniciado') {
      return <Badge variant="neutral">Não Iniciado</Badge>;
    }
    if (statusObj.status === 'concluido') {
      return <Badge variant="success">Concluído ({statusObj.maiorAproveitamento}%)</Badge>;
    }
    if (statusObj.status === 'necessita_revisao') {
      return <Badge variant="danger">Revisão Recomendada</Badge>;
    }
    return <Badge variant="warning">Em Andamento (Fase {statusObj.faseAtual})</Badge>;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      {/* Botão de Retorno e Cabeçalho do Eixo */}
      <div className="space-y-4">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a todos os eixos
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">Eixo Temático</Badge>
              <Badge variant={eixo.incidenciaENEM === 'Alta Incidência' ? 'danger' : 'neutral'}>
                {eixo.incidenciaENEM}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{eixo.nome}</h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{eixo.descricao}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo Programático Oficial do Eixo */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tópicos Curriculares Cobertos Neste Eixo
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
          {eixo.topicosDetalhados.map((topico, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>{topico}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lista de Lições nos 3 Níveis */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Lições Disponíveis</h2>

        {eixo.licoes.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              Lições em Preparação Curricular
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Este eixo temático já está mapeado com todos os seus tópicos oficiais e receberá suas lições pedagógicas progressivas nas próximas etapas do plano.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {eixo.licoes.map((licao) => {
              const { apto, preRequisitosPendentes } = PrerequisiteTracker.verificarProntidao(
                licao,
                progresso
              );
              const statusObj = progresso.licoesStatus[licao.id];

              return (
                <div
                  key={licao.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          licao.nivel === 'facil'
                            ? 'brand'
                            : licao.nivel === 'intermediario'
                            ? 'warning'
                            : 'purple'
                        }
                      >
                        NÍVEL {licao.nivel.toUpperCase()}
                      </Badge>
                      {getStatusBadge(licao.id)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {licao.duracaoEstimadaMinutos} min
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{licao.titulo}</h3>

                    {/* Objetivos de Aprendizagem */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Objetivos desta lição:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {licao.objetivosAprendizagem.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!apto && (
                      <div className="p-2.5 bg-rose-50 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          Pré-requisitos pendentes: {preRequisitosPendentes.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-2 shrink-0">
                    <Button
                      size="md"
                      disabled={!apto}
                      onClick={() => onSelecionarLicao(licao)}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {statusObj?.status === 'concluido' ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          Revisitar Lição
                        </>
                      ) : statusObj?.status === 'em_andamento' ? (
                        <>
                          <Play className="w-4 h-4" />
                          Continuar (Fase {statusObj.faseAtual})
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Iniciar Lição
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
