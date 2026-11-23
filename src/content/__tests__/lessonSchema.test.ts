import { describe, it, expect } from 'vitest';
import { LicaoSchema } from '../schema';
import { LICAO_PROPORCAO_FACIL } from '../data/licaoProporcaoFacil';
import { LICAO_PROPORCAO_INTERMEDIARIO } from '../data/licaoProporcaoIntermediario';
import { LICAO_PROPORCAO_AVANCADO } from '../data/licaoProporcaoAvancado';

describe('Validação Curricular de Lições', () => {
  it('todas as lições dos três níveis devem cumprir integralmente o Zod Schema', () => {
    [LICAO_PROPORCAO_FACIL, LICAO_PROPORCAO_INTERMEDIARIO, LICAO_PROPORCAO_AVANCADO].forEach(
      (licao) => {
        const parseResult = LicaoSchema.safeParse(licao);
        if (!parseResult.success) {
          console.error(`Falha na lição ${licao.id}:`, parseResult.error.format());
        }
        expect(parseResult.success).toBe(true);
      }
    );
  });

  it('o quiz final de cada lição deve conter no mínimo 12 questões com 5 alternativas cada', () => {
    [LICAO_PROPORCAO_FACIL, LICAO_PROPORCAO_INTERMEDIARIO, LICAO_PROPORCAO_AVANCADO].forEach(
      (licao) => {
        const questoes = licao.fases.fase8_quizFinal.questoes;
        expect(questoes.length).toBeGreaterThanOrEqual(12);

        questoes.forEach((q) => {
          expect(q.alternativas.length).toBe(5);
          const letras = q.alternativas.map((a) => a.letra);
          expect(letras).toEqual(['A', 'B', 'C', 'D', 'E']);
          expect(['A', 'B', 'C', 'D', 'E']).toContain(q.alternativaCorreta);
          expect(q.alternativas.find((a) => a.letra === q.alternativaCorreta)?.explicacaoDiagnostica).toBeTruthy();
        });
      }
    );
  });
});

