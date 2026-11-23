import React, { useState, useEffect } from 'react';
import { EixoTematico, Licao, PerfilEstudanteProgresso } from './core/types';
import { EIXOS_CURRICULARES } from './content/eixosCurriculares';
import { StorageManager } from './storage/storageManager';
import { HomePage } from './modules/home/HomePage';
import { CurriculumTrackPage } from './modules/curriculum/CurriculumTrackPage';
import { LessonViewer } from './modules/lesson/LessonViewer';
import { PerformanceDashboard } from './modules/dashboard/PerformanceDashboard';
import { TrendingUp, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'eixo' | 'licao' | 'dashboard'>('home');
  const [eixoAtivo, setEixoAtivo] = useState<EixoTematico | null>(null);
  const [licaoAtiva, setLicaoAtiva] = useState<Licao | null>(null);
  const [progresso, setProgresso] = useState<PerfilEstudanteProgresso>(StorageManager.carregarProgresso());

  const recarregarProgresso = () => {
    setProgresso(StorageManager.carregarProgresso());
  };

  useEffect(() => {
    recarregarProgresso();
  }, [view]);

  const handleSelecionarEixo = (eixo: EixoTematico) => {
    setEixoAtivo(eixo);
    setView('eixo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelecionarLicao = (licao: Licao) => {
    setLicaoAtiva(licao);
    setView('licao');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIniciarLicaoDireta = (licaoId: string) => {
    for (const eixo of EIXOS_CURRICULARES) {
      const encontrada = eixo.licoes.find((l) => l.id === licaoId);
      if (encontrada) {
        setEixoAtivo(eixo);
        handleSelecionarLicao(encontrada);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Barra de Navegação Superior Global (quando não estiver dentro da Lição em 10 Fases) */}
      {view !== 'licao' && (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/95">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div
              onClick={() => setView('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-none">
                  Matemática <span className="text-indigo-600">ENEM</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                  Plataforma Educacional Interativa
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
              <button
                onClick={() => setView('home')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  view === 'home'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Início
              </button>

              <button
                onClick={() => {
                  setEixoAtivo(EIXOS_CURRICULARES[1]); // Eixo de Razão e Proporção
                  setView('eixo');
                }}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  view === 'eixo'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Trilhas Curriculares
              </button>

              <button
                onClick={() => setView('dashboard')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  view === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Meu Desempenho
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* Roteador de Vistas */}
      <div className="flex-1">
        {view === 'home' && (
          <HomePage
            progresso={progresso}
            onSelecionarEixo={handleSelecionarEixo}
            onIniciarLicaoDireta={handleIniciarLicaoDireta}
            onAtualizarProgresso={recarregarProgresso}
          />
        )}

        {view === 'eixo' && eixoAtivo && (
          <CurriculumTrackPage
            eixo={eixoAtivo}
            progresso={progresso}
            onVoltar={() => setView('home')}
            onSelecionarLicao={handleSelecionarLicao}
          />
        )}

        {view === 'licao' && licaoAtiva && (
          <LessonViewer
            licao={licaoAtiva}
            onVoltar={() => {
              recarregarProgresso();
              setView(eixoAtivo ? 'eixo' : 'home');
            }}
          />
        )}

        {view === 'dashboard' && (
          <PerformanceDashboard
            progresso={progresso}
            onVoltar={() => setView('home')}
            onIniciarLicaoDireta={handleIniciarLicaoDireta}
          />
        )}
      </div>

      {/* Rodapé Acessível e Informativo */}
      {view !== 'licao' && (
        <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p className="font-semibold text-slate-700">
              Plataforma Educacional Interativa de Matemática e suas Tecnologias para o ENEM
            </p>
            <p>
              Conforme as diretrizes pedagógicas da BNCC e Matrizes de Referência do Inep • Acessibilidade WCAG 2.2 Nível AA
            </p>
            <p className="text-[11px] text-slate-400">
              Questões originais de fixação e preparação contextualizada • Armazenamento local sem rastreamento de dados pessoais
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};
