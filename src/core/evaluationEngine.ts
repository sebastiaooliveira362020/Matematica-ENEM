import { Questao, ResultadoTentativaQuiz } from './types';

export class EvaluationEngine {
  /**
   * Avalia as respostas submetidas para um conjunto de questões do quiz final
   */
  public static avaliarQuiz(
    licaoId: string,
    questoes: Questao[],
    respostas: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>,
    tempoGastoSegundos: number = 0
  ): ResultadoTentativaQuiz {
    let totalAcertos = 0;
    const totalQuestoes = questoes.length;

    const desempenhoPorHabilidade: ResultadoTentativaQuiz['desempenhoPorHabilidade'] = {};
    const errosConceituaisIdentificados: ResultadoTentativaQuiz['errosConceituaisIdentificados'] = [];
    const conceitosComErro = new Set<string>();
    const conceitosDominados = new Set<string>();

    questoes.forEach((q) => {
      const respostaDada = respostas[q.id];
      const acertou = respostaDada === q.alternativaCorreta;

      if (acertou) {
        totalAcertos++;
        conceitosDominados.add(q.conceitoNecessario);
      } else if (respostaDada) {
        conceitosComErro.add(q.conceitoNecessario);

        // Identifica o erro conceitual específico representado pelo distrator
        const alternativaMarcadaObj = q.alternativas.find((a) => a.letra === respostaDada);
        const erroDesc = alternativaMarcadaObj?.erroConceitual ||
          alternativaMarcadaObj?.explicacaoDiagnostica ||
          'Erro na aplicação do procedimento ou interpretação do enunciado';

        errosConceituaisIdentificados.push({
          questaoId: q.id,
          conceito: q.conceitoNecessario,
          erroIdentificado: erroDesc,
          alternativaMarcada: respostaDada,
          alternativaCorreta: q.alternativaCorreta,
          linkRevisaoFase: q.linkRevisaoFase || 3,
        });
      }

      // Agregação por habilidade
      const habId = q.habilidadeId;
      if (!desempenhoPorHabilidade[habId]) {
        desempenhoPorHabilidade[habId] = {
          habilidadeDescricao: `Habilidade ${habId}`,
          acertos: 0,
          total: 0,
          percentual: 0,
          dominio: 'Necessita reforço',
        };
      }

      desempenhoPorHabilidade[habId].total++;
      if (acertou) {
        desempenhoPorHabilidade[habId].acertos++;
      }
    });

    // Calcula percentual e nível de domínio por habilidade
    Object.keys(desempenhoPorHabilidade).forEach((habId) => {
      const item = desempenhoPorHabilidade[habId];
      item.percentual = Math.round((item.acertos / item.total) * 100);
      if (item.percentual >= 80) {
        item.dominio = 'Dominio demonstrado';
      } else if (item.percentual >= 60) {
        item.dominio = 'Em desenvolvimento';
      } else {
        item.dominio = 'Necessita reforço';
      }
    });

    const percentualGeral = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

    // Síntese pedagógica personalizada (sem frases genéricas)
    const pontosFortes: string[] = [];
    const pontosMelhorar: string[] = [];

    // Habilidades dominadas
    const habsDominadas = Object.entries(desempenhoPorHabilidade)
      .filter(([_, val]) => val.dominio === 'Dominio demonstrado')
      .map(([id]) => id);

    if (habsDominadas.length > 0) {
      pontosFortes.push(
        `Excelente domínio demonstrado nas habilidades: ${habsDominadas.join(', ')}.`
      );
    }

    if (conceitosDominados.size > 0) {
      pontosFortes.push(
        `Compreensão sólida e aplicação correta nos conceitos: ${Array.from(conceitosDominados).slice(0, 3).join(', ')}.`
      );
    }

    // Habilidades com necessidade de reforço
    const habsFracas = Object.entries(desempenhoPorHabilidade)
      .filter(([_, val]) => val.dominio === 'Necessita reforço')
      .map(([id]) => id);

    if (habsFracas.length > 0) {
      pontosMelhorar.push(
        `Identificamos necessidade de reforço nas seguintes habilidades da matriz: ${habsFracas.join(', ')}.`
      );
    }

    if (conceitosComErro.size > 0) {
      pontosMelhorar.push(
        `Atenção redobrada aos tópicos conceituais onde houve equívoco: ${Array.from(conceitosComErro).join(', ')}.`
      );
    }

    // Recomendação de continuidade adaptativa
    let recomendacao = '';
    if (percentualGeral >= 80) {
      recomendacao = 'Você atingiu os objetivos desta lição com maestria. Está apto a avançar para o próximo nível ou conteúdo!';
    } else if (percentualGeral >= 60) {
      recomendacao = 'Você construiu uma boa base, mas alguns distratores indicam deslizes pontuais. Revise os conceitos indicados abaixo antes de avançar.';
    } else {
      recomendacao = 'Recomendamos refazer a trilha conceitual (Fases 3 e 5) e praticar com as dicas progressivas antes de uma nova tentativa.';
    }

    return {
      licaoId,
      timestamp: new Date().toISOString(),
      tempoGastoSegundos,
      totalQuestoes,
      totalAcertos,
      percentualGeral,
      respostas,
      desempenhoPorHabilidade,
      errosConceituaisIdentificados,
      pontosFortes,
      pontosMelhorar,
      planoRevisao: {
        licaoId,
        conceitosParaRever: Array.from(conceitosComErro),
        recomendacao,
      },
    };
  }
}
