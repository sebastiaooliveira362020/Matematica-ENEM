import { Licao, PerfilEstudanteProgresso } from './types';

export class PrerequisiteTracker {
  /**
   * Verifica se o aluno cumpriu todos os pré-requisitos de uma lição
   */
  public static verificarProntidao(
    licao: Licao,
    progresso: PerfilEstudanteProgresso
  ): {
    apto: boolean;
    preRequisitosPendentes: string[];
  } {
    if (!licao.preRequisitos || licao.preRequisitos.length === 0) {
      return { apto: true, preRequisitosPendentes: [] };
    }

    const pendentes = licao.preRequisitos.filter((reqId) => {
      const statusReq = progresso.licoesStatus[reqId];
      return !statusReq || statusReq.status !== 'concluido' || statusReq.maiorAproveitamento < 60;
    });

    return {
      apto: pendentes.length === 0,
      preRequisitosPendentes: pendentes,
    };
  }
}
