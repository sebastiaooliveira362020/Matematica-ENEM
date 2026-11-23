import { EixoTematico } from '../core/types';
import { LICAO_PROPORCAO_FACIL } from './data/licaoProporcaoFacil';
import { LICAO_PROPORCAO_INTERMEDIARIO } from './data/licaoProporcaoIntermediario';
import { LICAO_PROPORCAO_AVANCADO } from './data/licaoProporcaoAvancado';

export const EIXOS_CURRICULARES: EixoTematico[] = [
  {
    id: 'matematica-basica',
    nome: 'Matemática Básica e Aritmética',
    descricao: 'Fundamentos numéricos essenciais, operações com números reais, frações, potências e conversão de medidas.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Operações fundamentais com números naturais, inteiros, racionais e reais',
      'Frações, números decimais, dízimas periódicas e conversão entre representações',
      'Potenciação, radiciação, notação científica e propriedades operatórias',
      'Critérios de divisibilidade, números primos, fatoração, MMC e MDC',
      'Sistemas de medidas (comprimento, área, volume, capacidade, massa e tempo) e conversão de unidades',
    ],
    licoes: [],
  },
  {
    id: 'razao-proporcao-financeira',
    nome: 'Razão, Proporção e Matemática Financeira',
    descricao: 'O eixo mais cobrado no ENEM: relações diretas e inversas, escalas, porcentagens e matemática comercial.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Razões e proporções; grandezas diretamente e inversamente proporcionais',
      'Regra de três simples e regra de três composta',
      'Escalas cartográficas, lineares, superficiais e volumétricas',
      'Porcentagem, aumentos e descontos sucessivos, lucro e margem',
      'Juros simples e juros compostos; noções de financiamento e amortização',
    ],
    licoes: [
      LICAO_PROPORCAO_FACIL,
      LICAO_PROPORCAO_INTERMEDIARIO,
      LICAO_PROPORCAO_AVANCADO,
    ],
  },
  {
    id: 'estatistica-probabilidade-combinatoria',
    nome: 'Estatística, Probabilidade e Combinatória',
    descricao: 'Interpretação intensiva de gráficos e tabelas, médias, desvios, contagem e cálculo de probabilidades.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Leitura, análise e interpretação de gráficos (colunas, setores, linhas, histogramas) e tabelas',
      'Medidas de tendência central: média aritmética simples e ponderada, mediana e moda',
      'Medidas de dispersão: amplitude, variância e desvio padrão',
      'Análise Combinatória: PFC, permutação, arranjo e combinação',
      'Probabilidade simples, união, eventos independentes e probabilidade condicional',
    ],
    licoes: [],
  },
  {
    id: 'algebra-funcoes-sequencias',
    nome: 'Álgebra, Funções e Sequências',
    descricao: 'Modelagem algébrica de fenômenos: funções do 1º e 2º graus, exponenciais, logaritmos, PA e PG.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Expressões algébricas, fatoração, equações e inequações de 1º e 2º graus',
      'Sistemas de equações lineares e problemas contextualizados',
      'Conceito de função, domínio, imagem e gráficos',
      'Função Afim e Função Quadrática (vértice, máximos e mínimos)',
      'Função Exponencial e Logarítmica (aplicações em crescimento, pH e escalas)',
      'Sequências numéricas: Progressão Aritmética (PA) e Progressão Geométrica (PG)',
    ],
    licoes: [],
  },
  {
    id: 'geometria-plana',
    nome: 'Geometria Plana',
    descricao: 'Figuras bidimensionais, semelhança, teorema de Pitágoras, círculos e cálculo de áreas compostas.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Ângulos, retas paralelas cortadas por uma transversal e polígonos regulares',
      'Triângulos: classificação, semelhança, Teorema de Tales e Pitágoras',
      'Quadriláteros notáveis (quadrado, retângulo, losango, trapézio e paralelogramo)',
      'Circunferência e círculo: comprimento, arcos, setor e relações métricas',
      'Cálculo de perímetros e áreas de figuras planas e regiões compostas',
    ],
    licoes: [],
  },
  {
    id: 'geometria-espacial',
    nome: 'Geometria Espacial',
    descricao: 'Visualização tridimensional, projeções ortogonais, planificações, prismas, cilindros, cones e esferas.',
    incidenciaENEM: 'Alta Incidência',
    topicosDetalhados: [
      'Geometria de posição: projeções ortogonais e vistas espaciais',
      'Poliedros convexos e regulares; Relação de Euler',
      'Prismas, cubos, paralelepípedos, pirâmides, cilindros, cones e esferas',
      'Planificação de sólidos, áreas de superfície e volumes',
      'Troncos de pirâmide/cone e problemas de capacidade em recipientes',
    ],
    licoes: [],
  },
  {
    id: 'geometria-analitica-trigonometria',
    nome: 'Geometria Analítica e Trigonometria',
    descricao: 'Localização cartesiana, equações de retas e circunferências, triângulo retângulo e ciclo trigonométrico.',
    incidenciaENEM: 'Média Incidência',
    topicosDetalhados: [
      'Plano cartesiano, distância entre pontos e ponto médio',
      'Equação da reta, coeficiente angular e equação da circunferência',
      'Razões trigonométricas no triângulo retângulo (seno, cosseno, tangente) e ângulos notáveis',
      'Ciclo trigonométrico, funções periódicas, Lei dos Senos e Lei dos Cossenos',
    ],
    licoes: [],
  },
];
