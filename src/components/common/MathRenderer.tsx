import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  block = false,
  className = '',
  ariaLabel,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={className}
      role="math"
      aria-label={ariaLabel || math}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FormattedMathTextProps {
  text: string;
  className?: string;
}

/**
 * Componente que detecta automaticamente expressões entre $...$ (inline) e $$...$$ (bloco)
 * e as renderiza usando KaTeX preservando o restante do texto.
 */
export const FormattedMathText: React.FC<FormattedMathTextProps> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Expressão regular para blocos $$...$$ e inlines $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    const splitTokens = text.split(regex);

    return splitTokens.map((segment, index) => {
      if (segment.startsWith('$$') && segment.endsWith('$$')) {
        const math = segment.slice(2, -2).trim();
        return <MathRenderer key={index} math={math} block={true} className="my-2 block text-center" />;
      }
      if (segment.startsWith('$') && segment.endsWith('$')) {
        const math = segment.slice(1, -1).trim();
        return <MathRenderer key={index} math={math} block={false} className="inline-block mx-0.5" />;
      }
      return <span key={index}>{segment}</span>;
    });
  }, [text]);

  return <div className={`leading-relaxed ${className}`}>{parts}</div>;
};
