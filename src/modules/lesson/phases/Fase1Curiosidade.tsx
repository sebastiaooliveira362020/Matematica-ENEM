import React from 'react';
import { LicaoFases } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../../../components/common/Button';

interface Props {
  dados: LicaoFases['fase1_curiosidade'];
  onAvancar: () => void;
}

export const Fase1Curiosidade: React.FC<Props> = ({ dados, onAvancar }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        Fase 1: Despertar a Curiosidade
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
        {dados.tituloGancho}
      </h2>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 border border-indigo-100/90 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-xs text-indigo-600 shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-950 text-base">Pergunta Central para Reflexão:</h3>
            <p className="text-indigo-900 font-medium text-lg italic">
              "{dados.perguntaMotivadora}"
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-base">Conexão com a Vida Real</h4>
        <FormattedMathText text={dados.situacaoReal} className="text-slate-700 text-base leading-relaxed" />
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={onAvancar} className="gap-2">
          Vamos testar seus conhecimentos prévios
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
