import React, { useState } from 'react';
import { LicaoFases } from '../../../core/types';
import { FormattedMathText } from '../../../components/common/MathRenderer';
import { Button } from '../../../components/common/Button';
import { Layers, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  dados: LicaoFases['fase5_resolucaoGuiada'];
  onAvancar: () => void;
}

export const Fase5ResolucaoGuiada: React.FC<Props> = ({ dados, onAvancar }) => {
  // Número de etapas já reveladas (inicia em 1)
  const [etapasReveladas, setEtapasReveladas] = useState(1);
  const totalEtapas = dados.etapas.length;
  const todasReveladas = etapasReveladas >= totalEtapas;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-4 h-4 text-cyan-600" />
          Fase 5: Resolução Guiada Passo a Passo
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Como Desmontar um Problema
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Acompanhe o raciocínio linha a linha. Tente antecipar o que vem a seguir antes de clicar em revelar!
        </p>
      </div>

      {/* Enunciado do Problema Contextualizado */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm space-y-2">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Problema-Exemplo</span>
        <div className="text-slate-100 text-base leading-relaxed">
          <FormattedMathText text={dados.problemaContextualizado} />
        </div>
      </div>

      {/* Etapas Progressivas */}
      <div className="space-y-4">
        {dados.etapas.slice(0, etapasReveladas).map((etapa) => (
          <div
            key={etapa.ordem}
            className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3 transition-all animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Passo {etapa.ordem}: {etapa.perguntaGuia}
              </span>
            </div>

            <FormattedMathText text={etapa.explicacaoRevelavel} className="text-slate-700 text-sm leading-relaxed" />

            {etapa.formulaChave && (
              <div className="p-3 bg-indigo-50/60 rounded-xl text-center font-mono text-sm text-indigo-950 font-bold border border-indigo-100">
                <FormattedMathText text={`$$${etapa.formulaChave}$$`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de Revelação */}
      <div className="flex justify-between items-center pt-2">
        {!todasReveladas ? (
          <Button
            size="lg"
            variant="outline"
            onClick={() => setEtapasReveladas((prev) => prev + 1)}
            className="ml-auto gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Eye className="w-4 h-4" />
            Revelar Próxima Etapa ({etapasReveladas + 1} de {totalEtapas})
          </Button>
        ) : (
          <Button size="lg" onClick={onAvancar} className="ml-auto gap-2">
            Pronto para Praticar com Dicas
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
