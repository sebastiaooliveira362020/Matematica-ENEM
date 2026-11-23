import React, { useState } from 'react';
import { EixoTematico, PerfilEstudanteProgresso } from '../../core/types';
import { EIXOS_CURRICULARES } from '../../content/eixosCurriculares';
import { StorageManager } from '../../storage/storageManager';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  BookOpen,
  Calendar,
  Award,
  ArrowRight,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  progresso: PerfilEstudanteProgresso;
  onSelecionarEixo: (eixo: EixoTematico) => void;
  onIniciarLicaoDireta: (licaoId: string) => void;
  onAtualizarProgresso: () => void;
}

export const HomePage: React.FC<Props> = ({
  progresso,
  onSelecionarEixo,
  onIniciarLicaoDireta,
  onAtualizarProgresso,
}) => {
  const [mensagemImportacao, setMensagemImportacao] = useState<string | null>(null);

  // Calcula estatísticas consolidadas
  const totalLicoesDisponiveis = EIXOS_CURRICULARES.reduce((acc, e) => acc + e.licoes.length, 0);
  const licoesConcluidasCount = Object.values(progresso.licoesStatus).filter(
    (s) => s.status === 'concluido'
  ).length;
  const licoesEmAndamentoCount = Object.values(progresso.licoesStatus).filter(
    (s) => s.status === 'em_andamento'
  ).length;

  const aproveitamentoMedio =
    progresso.historicoTentativas.length > 0
      ? Math.round(
          progresso.historicoTentativas.reduce((acc, t) => acc + t.percentualGeral, 0) /
            progresso.historicoTentativas.length
        )
      : 0;

  // Encontra a última lição em andamento para "Continuar de onde parei"
  const licaoParaContinuar = Object.entries(progresso.licoesStatus).find(
    ([_, status]) => status.status === 'em_andamento'
  );

  const handleExportar = () => {
    const jsonStr = StorageManager.exportarProgressoJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progresso-matematica-enem-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = StorageManager.importarProgressoJSON(content);
      if (ok) {
        setMensagemImportacao('Progresso restaurado com sucesso!');
        onAtualizarProgresso();
      } else {
        setMensagemImportacao('Arquivo inválido ou corrompido.');
      }
      setTimeout(() => setMensagemImportacao(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 py-8">
      {/* Banner Principal de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Matemática e suas Tecnologias • Preparatório ENEM
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Aprenda Matemática de Verdade, Sem Decoreba.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Uma jornada progressiva em 10 fases didáticas com simulações interativas, resolução guiada passo a passo e diagnóstico adaptativo por habilidades.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {licaoParaContinuar ? (
              <Button
                size="lg"
                variant="success"
                onClick={() => onIniciarLicaoDireta(licaoParaContinuar[0])}
                className="gap-2 shadow-lg shadow-emerald-900/30 font-bold"
              >
                Continuar de Onde Parei
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                variant="primary"
                onClick={() => onIniciarLicaoDireta('licao-prop-facil-01')}
                className="gap-2 shadow-lg shadow-indigo-600/30 font-bold"
              >
                Começar a Estudar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              onClick={() => onSelecionarEixo(EIXOS_CURRICULARES[1])}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Explorar Trilhas
            </Button>
          </div>
        </div>
      </div>

      {/* Painel de Métricas do Aluno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {licoesConcluidasCount} / {totalLicoesDisponiveis}
            </div>
            <div className="text-xs font-medium text-slate-500">Lições Dominadas</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{licoesEmAndamentoCount}</div>
            <div className="text-xs font-medium text-slate-500">Em Andamento</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{aproveitamentoMedio}%</div>
            <div className="text-xs font-medium text-slate-500">Média Geral no Quiz</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {progresso.revisoesAgendadas.filter((r) => !r.concluida).length}
            </div>
            <div className="text-xs font-medium text-slate-500">Revisões Agendadas</div>
          </div>
        </div>
      </div>

      {/* Alerta de Revisão Espaçada Pendente se houver */}
      {progresso.revisoesAgendadas.some((r) => !r.concluida) && (
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                Você tem revisões espaçadas programadas!
              </h4>
              <p className="text-xs text-amber-800">
                Fixar o conteúdo em intervalos regulares multiplica por 4x sua retenção até o dia da prova.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-900 bg-white hover:bg-amber-100/50 text-xs font-bold"
            onClick={() => onIniciarLicaoDireta('licao-prop-facil-01')}
          >
            Revisar Agora
          </Button>
        </div>
      )}

      {/* Grade dos 7 Eixos Temáticos Curriculares */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Eixos Temáticos do ENEM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Matriz oficial de Matemática e suas Tecnologias organizada pedagogicamente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EIXOS_CURRICULARES.map((eixo) => {
            const totalLicoes = eixo.licoes.length;
            const licoesConcluidas = eixo.licoes.filter(
              (l) => progresso.licoesStatus[l.id]?.status === 'concluido'
            ).length;
            const percentualConclusao =
              totalLicoes > 0 ? Math.round((licoesConcluidas / totalLicoes) * 100) : 0;

            return (
              <div
                key={eixo.id}
                onClick={() => onSelecionarEixo(eixo)}
                className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-400/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        eixo.incidenciaENEM === 'Alta Incidência' ? 'danger' : 'neutral'
                      }
                    >
                      {eixo.incidenciaENEM}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">
                      {totalLicoes} {totalLicoes === 1 ? 'lição' : 'lições'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg leading-snug">
                    {eixo.nome}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {eixo.descricao}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
                  <ProgressBar
                    value={percentualConclusao}
                    label="Domínio da Unidade"
                    showPercentage={true}
                    color={percentualConclusao === 100 ? 'success' : 'brand'}
                  />
                  <div className="flex justify-end pt-1">
                    <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Acessar trilha &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção de Backup, Privacidade e LGPD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Privacidade e Salvamento Local
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Seus dados ficam 100% no seu navegador. Você pode baixar uma cópia do seu progresso em JSON para transferir de aparelho.
          </p>
          {mensagemImportacao && (
            <p className="text-xs font-bold text-indigo-600 mt-1">{mensagemImportacao}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportar} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            Exportar Histórico
          </Button>

          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImportar} className="hidden" />
            <span className="inline-flex items-center justify-center font-medium rounded-xl text-xs px-3 py-1.5 border-2 border-slate-200 hover:border-indigo-500 text-slate-700 bg-white gap-1.5 transition-all">
              <Upload className="w-3.5 h-3.5" />
              Restaurar Backup
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
