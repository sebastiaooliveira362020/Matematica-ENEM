import React, { useState, useEffect } from 'react';
import { Licao, ResultadoTentativaQuiz, ItemRevisaoEspacada } from '../../core/types';
import { StorageManager } from '../../storage/storageManager';
import { AdaptiveEngine } from '../../core/adaptiveEngine';
import { Fase1Curiosidade } from './phases/Fase1Curiosidade';
import { Fase2Diagnostico } from './phases/Fase2Diagnostico';
import { Fase3Explicacao } from './phases/Fase3Explicacao';
import { Fase4Interacao } from './phases/Fase4Interacao';
import { Fase5ResolucaoGuiada } from './phases/Fase5ResolucaoGuiada';
import { Fase6Pratica } from './phases/Fase6Pratica';
import { Fase7Enem } from './phases/Fase7Enem';
import { Fase8Quiz } from './phases/Fase8Quiz';
import { Fase9Devolutiva } from './phases/Fase9Devolutiva';
import { Fase10RevisaoContinuidade } from './phases/Fase10RevisaoContinuidade';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, HelpCircle, BookOpen } from 'lucide-react';

interface Props {
  licao: Licao;
  onVoltar: () => void;
}

const NOMES_FASES = [
  '1. Curiosidade',
  '2. Diagnóstico',
  '3. Explicação',
  '4. Interação',
  '5. Passo a Passo',
  '6. Prática',
  '7. ENEM',
  '8. Quiz Final',
  '9. Devolutiva',
  '10. Revisão',
];

export const LessonViewer: React.FC<Props> = ({ licao, onVoltar }) => {
  const [faseAtual, setFaseAtual] = useState<number>(1);
  const [resultadoQuiz, setResultadoQuiz] = useState<ResultadoTentativaQuiz | null>(null);
  const [revisaoAgendada, setRevisaoAgendada] = useState<ItemRevisaoEspacada | undefined>(undefined);
  const [ajudaAberta, setAjudaAberta] = useState(false);

  // Carrega o progresso e o último resultado do quiz para esta lição se houver
  useEffect(() => {
    const progresso = StorageManager.carregarProgresso();
    const licaoSalva = progresso.licoesStatus[licao.id];

    // Recupera a última tentativa de quiz desta lição
    const tentativasDestaLicao = progresso.historicoTentativas.filter((t) => t.licaoId === licao.id);
    const ultimaTentativa = tentativasDestaLicao.length > 0 ? tentativasDestaLicao[tentativasDestaLicao.length - 1] : null;

    if (ultimaTentativa) {
      setResultadoQuiz(ultimaTentativa);
      const revisao = progresso.revisoesAgendadas.find((r) => r.licaoId === licao.id);
      if (revisao) setRevisaoAgendada(revisao);
    }

    if (licaoSalva && licaoSalva.faseAtual > 1 && licaoSalva.faseAtual <= 10) {
      // Se a fase for 9 ou 10 mas não houver quiz respondido ainda, direciona para o quiz (fase 8)
      if ((licaoSalva.faseAtual === 9 || licaoSalva.faseAtual === 10) && !ultimaTentativa) {
        setFaseAtual(8);
      } else {
        setFaseAtual(licaoSalva.faseAtual);
      }
    }
  }, [licao.id]);

  const handleMudarFase = (novaFase: number) => {
    if (novaFase < 1 || novaFase > 10) return;
    setFaseAtual(novaFase);
    StorageManager.atualizarFaseLicao(licao.id, novaFase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConcluirQuiz = (resultado: ResultadoTentativaQuiz) => {
    setResultadoQuiz(resultado);
    const novaRevisao = AdaptiveEngine.calcularProximaRevisao(licao.id, licao.assunto, resultado);
    setRevisaoAgendada(novaRevisao);
    StorageManager.registrarResultadoQuiz(resultado, novaRevisao);
    handleMudarFase(9);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Fixo com Stepper da Lição */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onVoltar}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
              title="Voltar à trilha curricular"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {licao.assunto}
                </span>
                <Badge variant={licao.nivel === 'facil' ? 'brand' : licao.nivel === 'intermediario' ? 'warning' : 'purple'}>
                  Nível {licao.nivel.toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {licao.titulo}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMudarFase(3)}
              className="hidden sm:inline-flex gap-1.5 text-xs text-slate-700"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Rever Explicação
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAjudaAberta(!ajudaAberta)}
              className="text-xs text-indigo-600 gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Preciso de Ajuda
            </Button>
          </div>
        </div>

        {/* Stepper com as 10 Fases Didáticas */}
        <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between min-w-[720px] gap-1">
            {NOMES_FASES.map((nome, idx) => {
              const numFase = idx + 1;
              const isCurrent = numFase === faseAtual;
              const isPast = numFase < faseAtual;

              return (
                <button
                  key={numFase}
                  onClick={() => handleMudarFase(numFase)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : isPast
                      ? 'text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-indigo-600'
                        : isPast
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {numFase}
                  </span>
                  <span className="whitespace-nowrap">{nome.split('. ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Modal / Gaveta de Ajuda Rápida */}
      {ajudaAberta && (
        <div className="bg-indigo-900 text-white p-4 border-b border-indigo-800">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-sm mb-1">Como funciona a jornada pedagógica?</p>
              <p className="text-indigo-200">
                Você pode avançar passo a passo ou revisitar a qualquer momento as fases conceituais (Fase 3) ou o laboratório interativo (Fase 4).
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleMudarFase(3)}>
                Ir para a Teoria (Fase 3)
              </Button>
              <Button size="sm" variant="outline" onClick={() => setAjudaAberta(false)} className="text-white border-indigo-400">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Dinâmico da Fase Ativa */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {faseAtual === 1 && (
          <Fase1Curiosidade
            dados={licao.fases.fase1_curiosidade}
            onAvancar={() => handleMudarFase(2)}
          />
        )}
        {faseAtual === 2 && (
          <Fase2Diagnostico
            questoes={licao.fases.fase2_diagnosticoPrevio.questoes}
            onAvancar={() => handleMudarFase(3)}
          />
        )}
        {faseAtual === 3 && (
          <Fase3Explicacao
            blocos={licao.fases.fase3_explicacaoConceito.blocos}
            onAvancar={() => handleMudarFase(4)}
          />
        )}
        {faseAtual === 4 && (
          <Fase4Interacao
            simulador={licao.fases.fase4_interacaoPratica.simulador}
            onAvancar={() => handleMudarFase(5)}
          />
        )}
        {faseAtual === 5 && (
          <Fase5ResolucaoGuiada
            dados={licao.fases.fase5_resolucaoGuiada}
            onAvancar={() => handleMudarFase(6)}
          />
        )}
        {faseAtual === 6 && (
          <Fase6Pratica
            exercicios={licao.fases.fase6_praticaFeedback.exercicios}
            onAvancar={() => handleMudarFase(7)}
          />
        )}
        {faseAtual === 7 && (
          <Fase7Enem
            dados={licao.fases.fase7_conexaoEnem}
            onAvancar={() => handleMudarFase(8)}
          />
        )}
        {faseAtual === 8 && (
          <Fase8Quiz
            licaoId={licao.id}
            questoes={licao.fases.fase8_quizFinal.questoes}
            instrucoes={licao.fases.fase8_quizFinal.instrucoes}
            onConcluirQuiz={handleConcluirQuiz}
          />
        )}
        {faseAtual === 9 &&
          (resultadoQuiz ? (
            <Fase9Devolutiva
              resultado={resultadoQuiz}
              questoes={licao.fases.fase8_quizFinal.questoes}
              onIrParaFase={handleMudarFase}
              onAvancar={() => handleMudarFase(10)}
              onRefazerQuiz={() => handleMudarFase(8)}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-slate-800">Avaliação Ainda Não Realizada</h3>
              <p className="text-slate-600 text-sm">
                A devolutiva pedagógica e o diagnóstico formativo ficam disponíveis após a entrega do Quiz Final (Fase 8).
              </p>
              <Button onClick={() => handleMudarFase(8)}>Realizar Quiz Final Agora</Button>
            </div>
          ))}
        {faseAtual === 10 &&
          (resultadoQuiz ? (
            <Fase10RevisaoContinuidade
              licaoTitulo={licao.titulo}
              resultado={resultadoQuiz}
              revisaoAgendada={revisaoAgendada}
              onVoltarParaTrilha={onVoltar}
              onRevisarConceito={handleMudarFase}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-slate-800">Agendamento de Revisão</h3>
              <p className="text-slate-600 text-sm">
                Conclua a avaliação para que o motor adaptativo calcule seus prazos ideais de repetição espaçada.
              </p>
              <Button onClick={() => handleMudarFase(8)}>Realizar Quiz Final Agora</Button>
            </div>
          ))}
      </main>
    </div>
  );
};
