import { describe, it, expect } from 'vitest';
import { AdaptiveEngine } from '../adaptiveEngine';
import { ResultadoTentativaQuiz } from '../types';

describe('AdaptiveEngine', () => {
  const resultadoSucesso: ResultadoTentativaQuiz = {
    licaoId: 'licao-1',
    timestamp: new Date().toISOString(),
    tempoGastoSegundos: 120,
    totalQuestoes: 10,
    totalAcertos: 9,
    percentualGeral: 90,
    respostas: {},
    desempenhoPorHabilidade: {},
    errosConceituaisIdentificados: [],
    pontosFortes: ['Domínio demonstrado'],
    pontosMelhorar: [],
    planoRevisao: { licaoId: 'licao-1', conceitosParaRever: [], recomendacao: 'Avançar' },
  };

  const resultadoFraco: ResultadoTentativaQuiz = {
    ...resultadoSucesso,
    totalAcertos: 4,
    percentualGeral: 40,
    errosConceituaisIdentificados: [
      {
        questaoId: 'q1',
        conceito: 'Escala',
        erroIdentificado: 'Inverteu razão',
        alternativaMarcada: 'C',
        alternativaCorreta: 'A',
        linkRevisaoFase: 3,
      },
    ],
  };

  it('deve recomendar avançar de nível quando o estudante atingir 80% ou mais', () => {
    const acao = AdaptiveEngine.determinarProximaAcao(resultadoSucesso, 'licao-2');
    expect(acao.tipo).toBe('avancar_nivel');
    expect(acao.alvoLicaoId).toBe('licao-2');
  });

  it('deve agendar reforço imediato (1 dia) e apontar para a fase conceitual quando o estudante tiver aproveitamento baixo', () => {
    const acao = AdaptiveEngine.determinarProximaAcao(resultadoFraco);
    expect(acao.tipo).toBe('reforcar_pratica');
    expect(acao.alvoFase).toBe(3);

    const revisao = AdaptiveEngine.calcularProximaRevisao('licao-1', 'Razão e Proporção', resultadoFraco);
    expect(revisao.intervaloDias).toBe(1);
    expect(revisao.concluida).toBe(false);
  });

  it('deve agendar intervalo de 3 dias na primeira aprovação com folga', () => {
    const revisao = AdaptiveEngine.calcularProximaRevisao('licao-1', 'Razão e Proporção', resultadoSucesso);
    expect(revisao.intervaloDias).toBe(3);
  });
});
