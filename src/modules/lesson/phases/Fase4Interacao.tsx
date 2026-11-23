import React from 'react';
import { SimuladorConfig } from '../../../core/types';
import { ProportionSimulator } from '../../../components/interactive/ProportionSimulator';
import { Button } from '../../../components/common/Button';
import { Sliders, ArrowRight } from 'lucide-react';

interface Props {
  simulador: SimuladorConfig;
  onAvancar: () => void;
}

export const Fase4Interacao: React.FC<Props> = ({ onAvancar }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sliders className="w-4 h-4 text-purple-600" />
          Fase 4: Aprender Interagindo
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratório Interativo de Grandezas
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Manipule as variáveis abaixo e observe como a física e a matemática da proporcionalidade se manifestam na prática.
        </p>
      </div>

      <ProportionSimulator />

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={onAvancar} className="gap-2">
          Ver Resolução Guiada Passo a Passo
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
