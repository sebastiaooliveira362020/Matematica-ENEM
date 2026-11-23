import React, { useState } from 'react';
import { FormattedMathText } from '../common/MathRenderer';
import { Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

export const ProportionSimulator: React.FC = () => {
  const [tipo, setTipo] = useState<'direta' | 'inversa'>('direta');
  const [valorX, setValorX] = useState<number>(4); // Ex: Número de operários ou torneiras
  const [constante, setConstante] = useState<number>(12); // Constante de proporcionalidade

  // Cálculo da variável dependente Y
  const valorY = tipo === 'direta' ? valorX * constante : Number((constante * 10 / valorX).toFixed(1));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Laboratório Interativo
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Explorador de Grandezas Proporcionais
          </h3>
        </div>

        {/* Alternador de Tipo de Proporção */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => {
              setTipo('direta');
              setConstante(15);
              setValorX(3);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipo === 'direta'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diretamente Proporcionais
          </button>
          <button
            onClick={() => {
              setTipo('inversa');
              setConstante(6);
              setValorX(2);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipo === 'inversa'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inversamente Proporcionais
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Painel de Controles e Sliders */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              <span>{tipo === 'direta' ? 'Quantidade de Horas de Trabalho (X)' : 'Velocidade Média em km/h (X)'}:</span>
              <span className="text-indigo-600 font-bold text-base">{valorX} {tipo === 'direta' ? 'horas' : 'km/h'}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={valorX}
              onChange={(e) => setValorX(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 (mínimo)</span>
              <span>5</span>
              <span>10 (máximo)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              <span>Fator de Escala / Constante (k):</span>
              <span className="text-slate-900 font-bold text-base">{constante}</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={constante}
              onChange={(e) => setConstante(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Raciocínio Matemático */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-sm text-indigo-950">
            <h4 className="font-bold flex items-center gap-1.5 mb-2 text-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Equação da Relação
            </h4>
            {tipo === 'direta' ? (
              <FormattedMathText
                text={`Como as grandezas são **diretas**, a razão entre elas é constante:  
$$\\frac{Y}{X} = k \\implies \\frac{${valorY}}{${valorX}} = ${constante}$$  
Quando dobramos $X$, o valor de $Y$ **também dobra**.`}
              />
            ) : (
              <FormattedMathText
                text={`Como as grandezas são **inversas**, o produto entre elas é constante:  
$$X \\cdot Y = k \\implies ${valorX} \\times ${valorY} \\approx ${constante * 10}$$  
Quando aumentamos a velocidade $X$, o tempo de viagem $Y$ **diminui na mesma proporção**.`}
              />
            )}
          </div>
        </div>

        {/* Representação Visual Interativa (Canvas / SVG) */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-2xl shadow-inner min-h-[300px]">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Visualização Dinâmica de Grandezas</div>

          <div className="w-full max-w-xs space-y-4 my-auto">
            {/* Barra da Grandeza X */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Grandeza X</span>
                <span className="font-mono text-amber-400 font-bold">{valorX} un</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(valorX / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Barra da Grandeza Y */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Grandeza Y (Resultado)</span>
                <span className="font-mono text-emerald-400 font-bold">{valorY} un</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      tipo === 'direta' ? (valorY / (10 * constante)) * 100 : (valorY / 60) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 w-full text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            Mova os controles deslizantes para testar as variações.
          </div>
        </div>
      </div>
    </div>
  );
};
