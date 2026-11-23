import { z } from 'zod';

export const AlternativaSchema = z.object({
  letra: z.enum(['A', 'B', 'C', 'D', 'E']),
  texto: z.string().min(1, 'O texto da alternativa é obrigatório'),
  explicacaoDiagnostica: z.string().min(1, 'A explicação do distrator é obrigatória'),
  erroConceitual: z.string().optional(),
});

export const QuestaoSchema = z.object({
  id: z.string().min(1),
  licaoId: z.string().min(1),
  enunciado: z.string().min(5, 'O enunciado deve ser claro e contextualizado'),
  contextoVisual: z
    .object({
      tipo: z.enum(['svg', 'latex', 'canvas', 'tabela']),
      conteudo: z.string(),
      legendaAcessivel: z.string(),
    })
    .optional(),
  alternativas: z.array(AlternativaSchema).length(5, 'Questões no padrão ENEM devem ter exatamente 5 alternativas'),
  alternativaCorreta: z.enum(['A', 'B', 'C', 'D', 'E']),
  habilidadeId: z.string().min(1),
  nivelDificuldade: z.enum(['facil', 'intermediario', 'avancado']),
  conceitoNecessario: z.string().min(1),
  linkRevisaoFase: z.number().int().min(1).max(10).default(3),
});

export const BlocoExplicacaoSchema = z.object({
  id: z.string(),
  subtitulo: z.string().min(1),
  conteudoLatex: z.string().min(1),
  exemploPratico: z.string().min(1),
  recursoVisualSvg: z.string().optional(),
  microVerificacao: z
    .object({
      pergunta: z.string(),
      opcoes: z.array(z.string()).min(2),
      indiceCorreto: z.number().int(),
      feedbackImediato: z.string(),
    })
    .optional(),
});

export const ExercicioPraticaSchema = z.object({
  id: z.string(),
  enunciado: z.string().min(1),
  dicasProgressivas: z.tuple([z.string(), z.string(), z.string()]),
  alternativas: z.array(AlternativaSchema).min(2),
  alternativaCorreta: z.enum(['A', 'B', 'C', 'D', 'E']),
  solucaoPassoAPasso: z.string().min(1),
});

export const LicaoSchema = z.object({
  id: z.string().min(1),
  unidadeId: z.string().min(1),
  assunto: z.string().min(1),
  subassunto: z.string().min(1),
  titulo: z.string().min(1),
  nivel: z.enum(['facil', 'intermediario', 'avancado']),
  etapaEscolar: z.enum(['Fundamental', 'Medio', 'Ambos']),
  duracaoEstimadaMinutos: z.number().int().positive(),
  preRequisitos: z.array(z.string()),
  objetivosAprendizagem: z.array(z.string()).min(2, 'Cada lição deve ter no mínimo 2 objetivos mensuráveis'),
  habilidadesAvaliadas: z.array(
    z.object({
      id: z.string(),
      matriz: z.enum(['ENEM', 'BNCC']),
      descricao: z.string(),
      competencia: z.number().optional(),
      pendenteRevisao: z.boolean().optional(),
    })
  ).min(1),
  fases: z.object({
    fase1_curiosidade: z.object({
      tituloGancho: z.string(),
      perguntaMotivadora: z.string(),
      situacaoReal: z.string(),
      visualApoio: z.string().optional(),
    }),
    fase2_diagnosticoPrevio: z.object({
      instrucao: z.string(),
      questoes: z.array(QuestaoSchema).min(3).max(5),
    }),
    fase3_explicacaoConceito: z.object({
      blocos: z.array(BlocoExplicacaoSchema).min(1),
    }),
    fase4_interacaoPratica: z.object({
      simulador: z.object({
        tipo: z.enum([
          'balanca_proporcao',
          'grafico_funcao',
          'geometria_plana',
          'circulo_trigonometrico',
          'probabilidade_urna',
        ]),
        titulo: z.string(),
        instrucoes: z.string(),
        parametrosIniciais: z.record(z.string(), z.union([z.number(), z.string()])),
      }),
    }),
    fase5_resolucaoGuiada: z.object({
      problemaContextualizado: z.string(),
      etapas: z.array(
        z.object({
          ordem: z.number().int(),
          perguntaGuia: z.string(),
          explicacaoRevelavel: z.string(),
          formulaChave: z.string().optional(),
        })
      ).min(2),
    }),
    fase6_praticaFeedback: z.object({
      exercicios: z.array(ExercicioPraticaSchema).min(1),
    }),
    fase7_conexaoEnem: z.object({
      questaoOriginalEstiloENEM: QuestaoSchema,
      estrategiasEnem: z.object({
        interpretacaoComando: z.string(),
        distratoresIdentificados: z.string(),
        justificativaGabarito: z.string(),
      }),
    }),
    fase8_quizFinal: z.object({
      instrucoes: z.string(),
      questoes: z.array(QuestaoSchema).min(10).max(20), // Preferencialmente 12 a 15
    }),
  }),
});
