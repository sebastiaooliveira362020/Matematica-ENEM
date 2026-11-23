import { ItemRevisaoEspacada, ResultadoTentativaQuiz } from './types';

export class AdaptiveEngine {
  /**
   * Calcula a data agendada somando N dias à data atual
   */
  private static adicionarDias(dias: number): string {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data.toISOString().split('T')[0];
  }

  /**
   * Determina a próxima revisão espaçada (1, 3, 7 ou 14 dias)
   */
  public static calcularProximaRevisao(
    licaoId: string,
    assunto: string,
    resultado: ResultadoTentativaQuiz,
    revisaoAnterior?: ItemRevisaoEspacada
  ): ItemRevisaoEspacada {
    let proximoIntervalo: 1 | 3 | 7 | 14 = 1;

    if (resultado.percentualGeral < 60) {
      // Se necessita reforço, revisão deve ser imediata no dia seguinte
      proximoIntervalo = 1;
    } else if (!revisaoAnterior) {
      // Primeira conclusão com aproveitamento satisfatório
      proximoIntervalo = resultado.percentualGeral >= 80 ? 3 : 1;
    } else {
      // Progressão espaçada
      switch (revisaoAnterior.intervaloDias) {
        case 1:
          proximoIntervalo = resultado.percentualGeral >= 80 ? 3 : 1;
          break;
        case 3:
          proximoIntervalo = resultado.percentualGeral >= 80 ? 7 : 3;
          break;
        case 7:
          proximoIntervalo = resultado.percentualGeral >= 80 ? 14 : 7;
          break;
        case 14:
          proximoIntervalo = 14;
          break;
      }
    }

    return {
      licaoId,
      assunto,
      dataAgendada: this.adicionarDias(proximoIntervalo),
      intervaloDias: proximoIntervalo,
      concluida: false,
    };
  }

  /**
   * Determina a próxima ação recomendada para o aluno
   */
  public static determinarProximaAcao(
    resultado: ResultadoTentativaQuiz,
    proximoNivelId?: string
  ): {
    tipo: 'avancar_nivel' | 'revisar_conceitos' | 'reforcar_pratica' | 'avancar_novo_assunto';
    titulo: string;
    descricao: string;
    alvoFase?: number;
    alvoLicaoId?: string;
  } {
    if (resultado.percentualGeral >= 80) {
      if (proximoNivelId) {
        return {
          tipo: 'avancar_nivel',
          titulo: 'Desafio Desbloqueado! Avançar para o Próximo Nível',
          descricao: 'Você dominou os conceitos essenciais. Vamos aprofundar sua capacidade analítica!',
          alvoLicaoId: proximoNivelId,
          alvoFase: 1,
        };
      }
      return {
        tipo: 'avancar_novo_assunto',
        titulo: 'Tópico Concluído com Sucesso!',
        descricao: 'Excelente! Você demonstrou domínio pleno e está pronto para o próximo tópico curricular.',
      };
    }

    if (resultado.percentualGeral >= 60) {
      const primeiroErro = resultado.errosConceituaisIdentificados[0];
      return {
        tipo: 'revisar_conceitos',
        titulo: 'Revisão Pontual de Conceitos',
        descricao: `Recomendamos revisitar a explicação sobre "${primeiroErro ? primeiroErro.conceito : 'conceitos da lição'}" antes de realizar um novo quiz.`,
        alvoFase: primeiroErro ? primeiroErro.linkRevisaoFase : 3,
        alvoLicaoId: resultado.licaoId,
      };
    }

    return {
      tipo: 'reforcar_pratica',
      titulo: 'Reforçar Fundamentos e Exercícios Orientados',
      descricao: 'Para fixar o conteúdo com segurança, volte à explicação detalhada e pratique com as dicas progressivas.',
      alvoFase: 3,
      alvoLicaoId: resultado.licaoId,
    };
  }
}
