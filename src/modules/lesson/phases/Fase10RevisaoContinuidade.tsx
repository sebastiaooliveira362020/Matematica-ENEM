import React from 'react';
import { ItemRevisaoEspacada, ResultadoTentativaQuiz } from '../../../core/types';
import { AdaptiveEngine } from '../../../core/adaptiveEngine';
import { Button } from '../../../components/common/Button';
import { Calendar, ArrowRight, Home } from 'lucide-react';

interface Props {
  licaoTitulo: string;
  resultado: ResultadoTentativaQuiz;
  revisaoAgendada?: ItemRevisaoEspacada;
  onVoltarParaTrilha: () => void;
  onRevisarConceito: (fase: number) => void;
}

export const Fase10RevisaoContinuidade: React.FC<Props> = ({
  licaoTitulo,
  resultado,
  revisaoAgendada,
  onVoltarParaTrilha,
  onRevisarConceito,
}) => {
  const proximaAcao = AdaptiveEngine.determinarProximaAcao(resultado);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Fase 10: Revisão Espaçada e Continuidade
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ciclo de Aprendizagem e Próximos Passos
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          A memória de longo prazo para o ENEM se constrói com repetição espaçada e prática ativa.
        </p>
      </div>

      {/* Cartão de Próxima Ação Adaptativa */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
          Recomendação do Motor Pedagógico
        </span>
        <h3 className="text-xl sm:text-2xl font-bold">{proximaAcao.titulo}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{proximaAcao.descricao}</p>

        <div className="pt-2 flex flex-wrap gap-3">
          {proximaAcao.alvoFase && (
            <Button
              variant="outline"
              size="md"
              onClick={() => onRevisarConceito(proximaAcao.alvoFase!)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Revisar Fase Indicada
            </Button>
          )}

          <Button
            variant="success"
            size="md"
            onClick={onVoltarParaTrilha}
            className="gap-2"
          >
            Continuar Trilha Curricular
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cartão de Revisão Espaçada Agendada */}
      {revisaoAgendada && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Sua Próxima Revisão Espaçada foi Agendada!
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Para garantir que o conteúdo de <strong>"{licaoTitulo}"</strong> não seja esquecido pela curva do esquecimento, agendamos uma rápida recapitulação:
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">Data Prevista</div>
              <div className="text-base font-extrabold text-slate-900">
                {new Date(revisaoAgendada.dataAgendada + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                Intervalo de {revisaoAgendada.intervaloDias} dia(s)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ações de Encerramento */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onVoltarParaTrilha} className="gap-2">
          <Home className="w-4 h-4" />
          Voltar ao Menu Principal
        </Button>
      </div>
    </div>
  );
};
