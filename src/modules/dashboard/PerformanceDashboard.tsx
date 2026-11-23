import React from 'react';
import { PerfilEstudanteProgresso } from '../../core/types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Clock,
  TrendingUp,
} from 'lucide-react';

interface Props {
  progresso: PerfilEstudanteProgresso;
  onVoltar: () => void;
  onIniciarLicaoDireta: (licaoId: string) => void;
}

export const PerformanceDashboard: React.FC<Props> = ({
  progresso,
  onVoltar,
  onIniciarLicaoDireta,
}) => {
  const tentativas = progresso.historicoTentativas;

  // Consolidação de Habilidades Avaliadas em todas as tentativas
  const habilidadesAgrupadas: Record<
    string,
    { descricao: string; acertos: number; total: number }
  > = {};

  tentativas.forEach((t) => {
    Object.entries(t.desempenhoPorHabilidade).forEach(([habId, dados]) => {
      if (!habilidadesAgrupadas[habId]) {
        habilidadesAgrupadas[habId] = {
          descricao: dados.habilidadeDescricao,
          acertos: 0,
          total: 0,
        };
      }
      habilidadesAgrupadas[habId].acertos += dados.acertos;
      habilidadesAgrupadas[habId].total += dados.total;
    });
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Badge variant="brand">Painel de Evolução do Aluno</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Seu Desempenho e Histórico
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe a consolidação de cada habilidade exigida pela matriz do ENEM.
          </p>
        </div>

        <Button variant="outline" onClick={onVoltar}>
          Voltar ao Início
        </Button>
      </div>

      {/* Grade de Habilidades Acumuladas */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Domínio Consolidado por Habilidade ENEM
        </h2>

        {Object.keys(habilidadesAgrupadas).length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhum quiz final foi concluído ainda. Complete sua primeira lição para visualizar o mapa de habilidades!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(habilidadesAgrupadas).map(([habId, dados]) => {
              const perc = Math.round((dados.acertos / dados.total) * 100);
              const dominio =
                perc >= 80 ? 'Dominio demonstrado' : perc >= 60 ? 'Em desenvolvimento' : 'Necessita reforço';

              return (
                <div key={habId} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Habilidade {habId}</span>
                    <Badge variant={perc >= 80 ? 'success' : perc >= 60 ? 'warning' : 'danger'}>
                      {dominio} ({perc}%)
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        perc >= 80 ? 'bg-emerald-500' : perc >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${perc}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {dados.acertos} acertos em {dados.total} questões respondidas
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico Cronológico de Tentativas */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Histórico de Tentativas no Quiz
        </h2>

        {tentativas.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhuma tentativa registrada no histórico.
          </p>
        ) : (
          <div className="space-y-3">
            {tentativas.slice().reverse().map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">Lição: {t.licaoId}</div>
                  <div className="text-slate-500">
                    Realizado em:{' '}
                    {new Date(t.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-base">{t.percentualGeral}%</div>
                    <div className="text-slate-500">{t.totalAcertos}/{t.totalQuestoes} acertos</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onIniciarLicaoDireta(t.licaoId)}
                    className="text-xs"
                  >
                    Praticar Novamente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
