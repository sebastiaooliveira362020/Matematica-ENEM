/**
 * Tipos centrais do Sistema Pedagógico e Plataforma Educacional
 * Alinhado com a BNCC e Matrizes de Referência do ENEM
 */

export type Dificuldade = 'facil' | 'intermediario' | 'avancado';

export type EixoTematicoId =
  | 'matematica-basica'
  | 'razao-proporcao-financeira'
  | 'estatistica-probabilidade-combinatoria'
  | 'algebra-funcoes-sequencias'
  | 'geometria-plana'
  | 'geometria-espacial'
  | 'geometria-analitica-trigonometria';

export interface HabilidadeReferencia {
  id: string; // Ex: "H19", "EM13MAT301"
  matriz: 'ENEM' | 'BNCC';
  descricao: string;
  competencia?: number;
  pendenteRevisao?: boolean;
}

export interface Alternativa {
  letra: 'A' | 'B' | 'C' | 'D' | 'E';
  texto: string;
  explicacaoDiagnostica: string;
  erroConceitual?: string; // Diagnóstico específico do erro (ex: "Inverteu numerador e denominador")
}

export interface Questao {
  id: string;
  licaoId: string;
  enunciado: string;
  contextoVisual?: {
    tipo: 'svg' | 'latex' | 'canvas' | 'tabela';
    conteudo: string;
    legendaAcessivel: string;
  };
  alternativas: Alternativa[];
  alternativaCorreta: 'A' | 'B' | 'C' | 'D' | 'E';
  habilidadeId: string;
  nivelDificuldade: Dificuldade;
  conceitoNecessario: string;
  linkRevisaoFase: number; // Fase da lição para redirecionar em caso de dúvida (normalmente Fase 3)
}

export interface BlocoExplicacao {
  id: string;
  subtitulo: string;
  conteudoLatex: string;
  exemploPratico: string;
  recursoVisualSvg?: string;
  microVerificacao?: {
    pergunta: string;
    opcoes: string[];
    indiceCorreto: number;
    feedbackImediato: string;
  };
}

export interface ExercicioPratica {
  id: string;
  enunciado: string;
  dicasProgressivas: [string, string, string]; // [Conceitual, Caminho de Resolução, Parcial]
  alternativas: Alternativa[];
  alternativaCorreta: 'A' | 'B' | 'C' | 'D' | 'E';
  solucaoPassoAPasso: string;
}

export interface SimuladorConfig {
  tipo: 'balanca_proporcao' | 'grafico_funcao' | 'geometria_plana' | 'circulo_trigonometrico' | 'probabilidade_urna';
  titulo: string;
  instrucoes: string;
  parametrosIniciais: Record<string, number | string>;
}

export interface LicaoFases {
  fase1_curiosidade: {
    tituloGancho: string;
    perguntaMotivadora: string;
    situacaoReal: string;
    visualApoio?: string;
  };
  fase2_diagnosticoPrevio: {
    instrucao: string;
    questoes: Questao[]; // 3 a 5 questões de pré-requisitos
  };
  fase3_explicacaoConceito: {
    blocos: BlocoExplicacao[];
  };
  fase4_interacaoPratica: {
    simulador: SimuladorConfig;
  };
  fase5_resolucaoGuiada: {
    problemaContextualizado: string;
    etapas: {
      ordem: number;
      perguntaGuia: string;
      explicacaoRevelavel: string;
      formulaChave?: string;
    }[];
  };
  fase6_praticaFeedback: {
    exercicios: ExercicioPratica[];
  };
  fase7_conexaoEnem: {
    questaoOriginalEstiloENEM: Questao;
    estrategiasEnem: {
      interpretacaoComando: string;
      distratoresIdentificados: string;
      justificativaGabarito: string;
    };
  };
  fase8_quizFinal: {
    instrucoes: string;
    questoes: Questao[]; // 12 a 15 questões completas por objetivos
  };
  fase9_devolutiva: {
    // Calculado dinamicamente pelo EvaluationEngine
  };
  fase10_revisaoContinuidade: {
    // Calculado dinamicamente pelo AdaptiveEngine
  };
}

export interface Licao {
  id: string;
  unidadeId: EixoTematicoId;
  assunto: string;
  subassunto: string;
  titulo: string;
  nivel: Dificuldade;
  etapaEscolar: 'Fundamental' | 'Medio' | 'Ambos';
  duracaoEstimadaMinutos: number;
  preRequisitos: string[]; // IDs de lições requeridas
  objetivosAprendizagem: string[];
  habilidadesAvaliadas: HabilidadeReferencia[];
  fases: LicaoFases;
}

export interface EixoTematico {
  id: EixoTematicoId;
  nome: string;
  descricao: string;
  incidenciaENEM: 'Alta Incidência' | 'Média Incidência' | 'Baixa Incidência';
  topicosDetalhados: string[];
  licoes: Licao[];
}

export interface ResultadoTentativaQuiz {
  licaoId: string;
  timestamp: string;
  tempoGastoSegundos: number;
  totalQuestoes: number;
  totalAcertos: number;
  percentualGeral: number;
  respostas: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>; // questaoId -> resposta
  desempenhoPorHabilidade: Record<string, {
    habilidadeDescricao: string;
    acertos: number;
    total: number;
    percentual: number;
    dominio: 'Dominio demonstrado' | 'Em desenvolvimento' | 'Necessita reforço';
  }>;
  errosConceituaisIdentificados: {
    questaoId: string;
    conceito: string;
    erroIdentificado: string;
    alternativaMarcada: string;
    alternativaCorreta: string;
    linkRevisaoFase: number;
  }[];
  pontosFortes: string[];
  pontosMelhorar: string[];
  planoRevisao: {
    licaoId: string;
    conceitosParaRever: string[];
    recomendacao: string;
  };
}

export interface ItemRevisaoEspacada {
  licaoId: string;
  assunto: string;
  dataAgendada: string; // ISO Date YYYY-MM-DD
  intervaloDias: 1 | 3 | 7 | 14;
  concluida: boolean;
}

export interface PerfilEstudanteProgresso {
  versaoSchema: number;
  ultimaAtualizacao: string;
  licoesStatus: Record<string, {
    status: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'necessita_revisao';
    faseAtual: number;
    maiorAproveitamento: number;
    tentativasTotais: number;
  }>;
  historicoTentativas: ResultadoTentativaQuiz[];
  revisoesAgendadas: ItemRevisaoEspacada[];
}
