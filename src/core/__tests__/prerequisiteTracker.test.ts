import { describe, it, expect } from 'vitest';
import { PrerequisiteTracker } from '../prerequisiteTracker';
import { Licao, PerfilEstudanteProgresso } from '../types';

describe('PrerequisiteTracker', () => {
  const licaoComRequisitos: Licao = {
    id: 'licao-2',
    unidadeId: 'razao-proporcao-financeira',
    assunto: 'Razão',
    subassunto: 'Composta',
    titulo: 'Lição 2',
    nivel: 'intermediario',
    etapaEscolar: 'Medio',
    duracaoEstimadaMinutos: 20,
    preRequisitos: ['licao-1'],
    objetivosAprendizagem: ['Obj 1', 'Obj 2'],
    habilidadesAvaliadas: [{ id: 'H19', matriz: 'ENEM', descricao: 'Desc' }],
    fases: {} as any,
  };

  const progressoVazio: PerfilEstudanteProgresso = {
    versaoSchema: 1,
    ultimaAtualizacao: new Date().toISOString(),
    licoesStatus: {},
    historicoTentativas: [],
    revisoesAgendadas: [],
  };

  it('deve bloquear a lição se o pré-requisito não foi concluído', () => {
    const check = PrerequisiteTracker.verificarProntidao(licaoComRequisitos, progressoVazio);
    expect(check.apto).toBe(false);
    expect(check.preRequisitosPendentes).toContain('licao-1');
  });

  it('deve liberar a lição quando o pré-requisito for concluído com aproveitamento mínimo de 60%', () => {
    const progressoAprovado: PerfilEstudanteProgresso = {
      ...progressoVazio,
      licoesStatus: {
        'licao-1': {
          status: 'concluido',
          faseAtual: 10,
          maiorAproveitamento: 85,
          tentativasTotais: 1,
        },
      },
    };

    const check = PrerequisiteTracker.verificarProntidao(licaoComRequisitos, progressoAprovado);
    expect(check.apto).toBe(true);
    expect(check.preRequisitosPendentes.length).toBe(0);
  });
});
