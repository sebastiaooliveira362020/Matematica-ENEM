# Arquitetura e Plano de Implementação: Plataforma Educacional Interativa de Matemática (ENEM)

**Documento:** Plano Arquitetural e Roteiro de Execução Técnico-Pedagógico  
**Autor:** Antigravity Architect & ECC Planning Protocol  
**Alvo:** `c:\Projeto_Matematica_ENEM`  
**Referência Principal:** `prompt_mestre.txt` e `Conteudo_Programatico_ENEM-matematica.docx`  
**Complexidade Geral:** Alta (Plataforma Completa com Motor Pedagógico, 10 Fases Didáticas, Avaliação por Habilidades e Persistência Offline)

---

## 1. Visão Geral e Restatement dos Requisitos

A plataforma visa transformar a preparação para a prova de **Matemática e suas Tecnologias do ENEM** em um ambiente de aprendizagem ativa, progressiva e mensurável, rompendo com o paradigma de "banco estático de questões".

### Pilares Centrais
1. **Curricular**: Cobertura integral dos 7 eixos temáticos levantados no programa do ENEM:
   - Matemática Básica e Aritmética
   - Razão, Proporção e Matemática Financeira
   - Estatística, Probabilidade e Combinatória
   - Álgebra, Funções e Sequências
   - Geometria Plana
   - Geometria Espacial
   - Geometria Analítica e Trigonometria
2. **Pedagógico Progressivo**: 3 níveis de profundidade (Nível 1 - Fundamentos; Nível 2 - Aplicação Contextualizada; Nível 3 - Domínio e ENEM), cada lição contendo a **jornada em 10 fases** (Curiosidade, Diagnóstico Prévio, Explicação em Blocos, Interação Manipulável, Resolução Guiada, Prática com Dicas Progressivas, Conexão ENEM, Quiz Final de 12-15 itens, Devolutiva Diagnóstica e Revisão Espaçada).
3. **Motor Diagnóstico Adaptativo**: Sem IA caixa-preta inicial; baseado em regras determinísticas e transparentes de domínio por habilidade BNCC/ENEM, mapeamento de distratores conceituais e ciclo de revisão espaçada (1, 3, 7 e 14 dias).
4. **Resiliência e Acessibilidade**: Execução estática 100% no navegador (zero fricção de login inicial), persistência em `IndexedDB`/`LocalStorage`, conformidade WCAG 2.2 Nível AA, suporte offline via PWA, e renderização veloz de fórmulas com KaTeX e geometria interativa em SVG/Canvas.

---

## 2. Decisões Arquiteturais e Análise de Trade-offs (Architect Review)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE APRESENTAÇÃO                        │
│   React 19 + TypeScript + Vite + Tailwind CSS + Lucide + KaTeX         │
│   (Dashboard, Trilhas, Visualizador de Lição em 10 Fases, Simuladores)│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                           MOTOR PEDAGÓGICO                             │
│   - Avaliador de Habilidades (Matrix Evaluator)                        │
│   - Rastreador de Pré-Requisitos e Prontidão                           │
│   - Diagnóstico de Distratores Conceituais                             │
│   - Agendador de Revisão Espaçada (1, 3, 7, 14 dias)                  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                      BASE DE CONTEÚDO & DADOS                          │
│   - Schemas Zod Estritos (Unidades, Lições, Atividades, Questões)      │
│   - Catálogo Modular em JSON/TS (Isolamento completo da UI)            │
│   - Persistência Local (IndexedDB / LocalStorage com Dexie/LocalStore) │
│   - Mecanismo de Export/Import de Progresso (LGPD compliance)          │
└────────────────────────────────────────────────────────────────────────┘
```

### Análise de Trade-offs Técnicos

| Dimensão | Opção Selecionada | Alternativa Descartada | Justificativa do Arquiteto |
|---|---|---|---|
| **Framework Web** | **React 19 + Vite (SPA estática)** | Next.js / SSR | A plataforma precisa ser 100% estática, portável para GitHub Pages, Vercel ou qualquer servidor estático sem necessidade de Node.js em produção, além de suporte PWA offline natural. |
| **Estilização** | **Tailwind CSS + CSS Variables** | CSS Modules / Styled Components | Garante tokens semânticos acessíveis (WCAG AA), alto contraste facilitado, layout responsivo mobile-first e bundle mínimo purgado. |
| **Renderização Matemática** | **KaTeX (react-katex)** | MathJax | KaTeX é cerca de 10x mais veloz na renderização DOM síncrona, não causa layout shifts e possui peso de bundle significativamente menor. |
| **Gráficos e Interatividade** | **SVG interativo nativo + Canvas 2D** | Geogebra embed / Three.js | Geogebra cria dependências externas pesadas e iframes inacessíveis. SVG manipulável via React permite controle de variáveis leve, responsivo e 100% acessível via atributos ARIA. |
| **Armazenamento Local** | **IndexedDB com fallback para LocalStorage** | SQLite WebAssembly | IndexedDB suporta centenas de megabytes de histórico, questões e estados de simuladores com APIs assíncronas padrão, sem overhead de WASM. |
| **Contratos de Conteúdo** | **Zod Schemas + Validação estática em build** | Schema JSON solto | Validação Zod impede que lições com gabaritos errados, pré-requisitos quebrados ou ausência de alternativas cheguem à produção. |

---

## 3. Modelagem de Dados e Schemas Essenciais

### 3.1. Estrutura Curricular e Lição (TypeScript & Zod)

```typescript
export type Dificuldade = 'facil' | 'intermediario' | 'avancado';

export interface HabilidadeReferencia {
  id: string; // Ex: "EM13MAT301", "H21"
  matriz: 'BNCC' | 'ENEM';
  descricao: string;
  pendenteRevisao?: boolean;
}

export interface QuestaoQuiz {
  id: string;
  enunciado: string;
  contextoVisual?: { tipo: 'svg' | 'imagem' | 'grafico'; dados: any };
  alternativas: {
    letra: 'A' | 'B' | 'C' | 'D' | 'E';
    texto: string;
    explicacaoDiagnostica: string;
    erroConceitualAssociado?: string; // Ex: "Confundiu raio com diâmetro"
  }[];
  alternativaCorreta: 'A' | 'B' | 'C' | 'D' | 'E';
  habilidadeId: string;
  nivelDificuldade: Dificuldade;
  conceitoNecessario: string;
  linkRevisaoFase: number; // Redirecionamento direto para a Fase 3 ou 5 da lição
}

export interface LicaoCurricular {
  id: string;
  unidadeId: string;
  assuntoId: string;
  titulo: string;
  nivel: Dificuldade;
  duracaoMinutos: number;
  etapaEscolar: 'Fundamental' | 'Medio';
  preRequisitos: string[]; // IDs de outras lições necessárias
  objetivosAprendizagem: string[];
  habilidadesAvaliadas: HabilidadeReferencia[];
  fases: {
    fase1_curiosidade: { perguntaMotivadora: string; situacaoReal: string; visual?: string };
    fase2_diagnostico: { questoesRapidas: QuestaoQuiz[] }; // 3-5 questões
    fase3_explicacao: { blocos: { subtitulo: string; conceito: string; exemplo: string; microVerificacao: any }[] };
    fase4_interacao: { tipoInterativo: string; configuracao: Record<string, any> }; // Simulador
    fase5_resolucaoGuiada: { problema: string; etapasRevelaveis: { instrucao: string; explicacao: string }[] };
    fase6_pratica: { exercicios: { enunciado: string; dicas: [string, string, string]; solucao: string }[] };
    fase7_enem: { questaoOriginalEstiloENEM: QuestaoQuiz; analiseComando: string; distratoresExplicados: string };
    fase8_quiz: { questoes: QuestaoQuiz[] }; // 12 a 15 questões completas
  };
}
```

### 3.2. Estrutura do Estado do Aluno e Registro de Aprendizagem

```typescript
export interface ProgressoEstudante {
  licoesConcluidas: Record<string, {
    concluida: boolean;
    ultimaTentativa: string; // ISO Date
    aproveitamentoPercentual: number;
    respostasDadas: Record<string, string>; // questaoId -> alternativa
    habilidadesScore: Record<string, { acertos: number; total: number }>;
  }>;
  errosConceituaisFrequentes: Record<string, number>; // conceito -> frequencia de erro
  agendaRevisoesEspacadas: {
    licaoId: string;
    dataPrevista: string;
    intervaloDias: number; // 1, 3, 7, 14
    concluida: boolean;
  }[];
  trilhaAtual: {
    unidadeId: string;
    licaoId: string;
    faseAtual: number;
  };
}
```

---

## 4. Plano de Implementação Faseado (Roteiro ECC)

Seguindo estritamente as Etapas 1 a 6 estabelecidas no `prompt_mestre.txt`:

### Fase 1: Setup do Projeto e Arquitetura Base
- [ ] Inicialização da aplicação React + Vite + TypeScript (`npm create vite@latest`).
- [ ] Configuração do Tailwind CSS, Lucide React e KaTeX.
- [ ] Criação da estrutura de pastas modular:
  - `src/core/` (motores de avaliação, adaptativo e pré-requisitos)
  - `src/content/` (schemas Zod, inventário dos 7 eixos e arquivos de lições)
  - `src/components/` (design system, layout, componentes pedagógicos, renderizador de fórmulas)
  - `src/modules/` (telas: Home, Trilha/Disciplina, Visualizador de Lição, Dashboard de Resultados)
  - `src/storage/` (camada de persistência local, exportação e importação de JSON)
- [ ] Configuração de testes unitários com Vitest e Testing Library.

### Fase 2: Motor Pedagógico e Camada de Validação
- [ ] Implementação dos Zod Schemas e do validador estático de lições (`validate-content.ts`).
- [ ] Implementação do `EvaluationEngine`:
  - Cálculo de acertos por questão e por habilidade.
  - Classificação de domínio (<60% Reforço, 60-79% Em Desenvolvimento, >=80% Domínio).
  - Geração do diagnóstico automatizado de distratores e mapeamento de conceitos fracos.
- [ ] Implementação do `AdaptiveEngine`:
  - Cálculo de agendamento de revisão espaçada (1, 3, 7, 14 dias).
  - Detector de quebra de pré-requisitos e recomendação de trilha de reforço.

### Fase 3: A Primeira Experiência Completa (Piloto Vertical)
- [ ] Seleção do eixo de maior peso no ENEM: **Razão, Proporção e Matemática Financeira** (Tópico: *Grandezas Proporcionais e Regra de Três* ou *Porcentagem e Aumentos/Descontos*).
- [ ] Construção da primeira lição completa com as 10 fases em seus 3 níveis (Fácil, Intermediário e Avançado).
- [ ] Desenvolvimento de um componente interativo manipulável (ex: simulador de proporção e balança de grandezas em SVG dinâmico).
- [ ] Criação do banco de 15 questões reais calibradas por habilidade para o Quiz Final, com explicações diagnósticas completas em cada distrator.

### Fase 4: Experiência do Estudante (UI/UX e Acessibilidade)
- [ ] Tela Inicial (Boas-vindas, continuação imediata, métricas de estudo, revisões agendadas).
- [ ] Navegador Curricular (Visão dos 7 eixos temáticos, cartões por nível e status de domínio).
- [ ] Interface da Lição em 10 Fases (Stepper superior, botões Anterior/Continuar/Ajuda, KaTeX inline e em bloco, suporte total a navegação por teclado).
- [ ] Painel de Resultados & Devolutiva (Gráfico de domínio por habilidade, botão "Reforçar meu aprendizado" que leva ao ponto exato do conteúdo, orientações claras).
- [ ] Painel Geral de Evolução do Aluno.

### Fase 5: Expansão do Conteúdo Curricular (Lotes dos 7 Eixos)
- [ ] Lote 1: Matemática Básica e Aritmética.
- [ ] Lote 2: Razão, Proporção e Matemática Financeira (consolidação dos demais tópicos).
- [ ] Lote 3: Estatística, Probabilidade e Combinatória.
- [ ] Lote 4: Álgebra, Funções e Sequências.
- [ ] Lote 5: Geometria Plana.
- [ ] Lote 6: Geometria Espacial.
- [ ] Lote 7: Geometria Analítica e Trigonometria.
- [ ] Matriz de cobertura atualizada e relatório de conformidade curricular.

### Fase 6: Testes Automatizados, Otimização e PWA Offline
- [ ] Testes unitários para cálculos de proficiência e regras adaptativas (Vitest).
- [ ] Testes de componentes e integração do fluxo da lição (React Testing Library).
- [ ] Auditoria de acessibilidade (Lighthouse / axe-core) para conformidade WCAG 2.2 AA.
- [ ] Configuração do `vite-plugin-pwa` para caching e funcionamento offline autônomo.
- [ ] Geração do build estático de produção e documentação completa no `README.md`.

---

## 5. Matriz de Riscos e Estratégias de Mitigação

| Risco Identificado | Severidade | Estratégia de Mitigação Arquitetural |
|---|---|---|
| **Acoplamento entre UI e Conteúdo** | Alta | Lições são armazenadas estritamente em arquivos de dados isolados (`src/content/data/`) validados por Zod, consumidos via hooks (`useLesson(id)`). |
| **Sobrecarga de Interface para o Estudante** | Média | Paginação rigorosa pelas 10 fases com foco em microlearning; botões flutuantes e atalhos de teclado consistentes. |
| **Gabaritos ou Fórmulas Incorretas** | Alta | Suite de validação automática em tempo de compilação/teste que checa a existência de exatamente 1 alternativa correta por questão, links de revisão válidos e fórmulas KaTeX sem erros de sintaxe. |
| **Perda de Dados por Limpeza de Cookies/Cache** | Média | Alerta amigável no painel com botão de "Baixar Cópia do Meu Progresso (JSON)" e "Restaurar Progresso", com zero necessidade de cadastro. |

---

## 6. Critérios de Aceitação (Definition of Done)

Para considerar o projeto plenamente concluído:
1. O estudante acessa a plataforma sem necessidade de instalação nem cadastro.
2. Navega pelos 7 eixos de Matemática do ENEM e seleciona lições e níveis.
3. Executa a sequência pedagógica de 10 fases de ponta a ponta sem erros de console.
4. Interage com simulações visuais e manipulativas em tempo real.
5. Recebe feedback progressivo com 3 níveis de dicas na prática orientada.
6. Realiza o Quiz Final e recebe o relatório diagnóstico discriminado por habilidade e distrator.
7. O botão "Reforçar meu aprendizado" direciona com precisão para a fase da explicação pendente.
8. Recarregar a página ou reabrir o navegador mantém integralmente o progresso.
9. A aplicação funciona sem internet após a primeira carga.
10. Testes automatizados executam e passam 100% no pipeline.
