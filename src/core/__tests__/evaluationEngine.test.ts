import { describe, it, expect } from 'vitest';
import { EvaluationEngine } from '../evaluationEngine';
import { Questao } from '../types';

describe('EvaluationEngine', () => {
  const questaoMock1: Questao = {
    id: 'q1',
    licaoId: 'licao-prop-1',
    enunciado: 'Em uma maquete na escala 1:50, uma parede mede 4 cm. Qual a medida real em metros?',
    alternativas: [
      { letra: 'A', texto: '2 metros', explicacaoDiagnostica: 'Correto: 4 cm * 50 = 200 cm = 2 m.' },
      { letra: 'B', texto: '20 metros', explicacaoDiagnostica: 'Confundiu a conversão de centímetros para metros.', erroConceitual: 'Erro na conversão de unidades' },
      { letra: 'C', texto: '0,2 metros', explicacaoDiagnostica: 'Dividiu por 10 em vez de 100 na conversão.', erroConceitual: 'Erro na conversão de unidades' },
      { letra: 'D', texto: '12,5 metros', explicacaoDiagnostica: 'Inverteu a razão da escala.', erroConceitual: 'Aplicação invertida da escala' },
      { letra: 'E', texto: '200 metros', explicacaoDiagnostica: 'Ignorou a conversão de centímetro para metro.', erroConceitual: 'Falta de conversão de unidades' },
    ],
    alternativaCorreta: 'A',
    habilidadeId: 'H19',
    nivelDificuldade: 'facil',
    conceitoNecessario: 'Escala e Conversão de Unidades',
    linkRevisaoFase: 3,
  };

  const questaoMock2: Questao = {
    id: 'q2',
    licaoId: 'licao-prop-1',
    enunciado: 'Se 3 máquinas produzem 60 peças em 2 horas, quantas peças 5 máquinas produzirão em 4 horas?',
    alternativas: [
      { letra: 'A', texto: '100 peças', explicacaoDiagnostica: 'Considerou apenas a proporção de máquinas.', erroConceitual: 'Ignorou variável tempo' },
      { letra: 'B', texto: '200 peças', explicacaoDiagnostica: 'Correto: 60 / (3 * 2) = 10 peças/h/máquina. 5 * 4 * 10 = 200.' },
      { letra: 'C', texto: '120 peças', explicacaoDiagnostica: 'Dobrou o tempo sem ajustar máquinas.', erroConceitual: 'Cálculo incompleto' },
      { letra: 'D', texto: '150 peças', explicacaoDiagnostica: 'Erro de proporção inversa.', erroConceitual: 'Proporção incorreta' },
      { letra: 'E', texto: '300 peças', explicacaoDiagnostica: 'Superestimou a produção.', erroConceitual: 'Multiplicação incorreta' },
    ],
    alternativaCorreta: 'B',
    habilidadeId: 'H20',
    nivelDificuldade: 'intermediario',
    conceitoNecessario: 'Regra de Três Composta',
    linkRevisaoFase: 3,
  };

  it('deve calcular corretamente 100% de aproveitamento quando todas as respostas estiverem corretas', () => {
    const respostas = { q1: 'A' as const, q2: 'B' as const };
    const resultado = EvaluationEngine.avaliarQuiz('licao-prop-1', [questaoMock1, questaoMock2], respostas);

    expect(resultado.totalAcertos).toBe(2);
    expect(resultado.percentualGeral).toBe(100);
    expect(resultado.desempenhoPorHabilidade['H19'].dominio).toBe('Dominio demonstrado');
    expect(resultado.desempenhoPorHabilidade['H20'].dominio).toBe('Dominio demonstrado');
    expect(resultado.errosConceituaisIdentificados.length).toBe(0);
    expect(resultado.pontosFortes.length).toBeGreaterThan(0);
  });

  it('deve diagnosticar o erro conceitual específico ao marcar distrator incorreto', () => {
    const respostas = { q1: 'B' as const, q2: 'B' as const };
    const resultado = EvaluationEngine.avaliarQuiz('licao-prop-1', [questaoMock1, questaoMock2], respostas);

    expect(resultado.totalAcertos).toBe(1);
    expect(resultado.percentualGeral).toBe(50);
    expect(resultado.errosConceituaisIdentificados.length).toBe(1);
    expect(resultado.errosConceituaisIdentificados[0].conceito).toBe('Escala e Conversão de Unidades');
    expect(resultado.errosConceituaisIdentificados[0].erroIdentificado).toBe('Erro na conversão de unidades');
    expect(resultado.desempenhoPorHabilidade['H19'].dominio).toBe('Necessita reforço');
    expect(resultado.desempenhoPorHabilidade['H20'].dominio).toBe('Dominio demonstrado');
  });
});
