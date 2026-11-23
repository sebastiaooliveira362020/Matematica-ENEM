# Plataforma Educacional Interativa de Matemática — Preparatório ENEM

> Plataforma web de aprendizagem progressiva, interativa e adaptativa para o ENEM e Ensino Médio/Fundamental, estruturada segundo a **BNCC** e a **Matriz de Referência de Matemática e suas Tecnologias do Inep**.

---

## 1. Visão Geral e Fundamentos Pedagógicos

A plataforma rompe com os repositórios tradicionais de listas estáticas de exercícios, implementando uma **jornada de aprendizagem em 10 fases didáticas**:

1. **Fase 1 — Despertar a Curiosidade:** Gancho do cotidiano e pergunta motivadora.
2. **Fase 2 — Conhecimentos Prévios:** Diagnóstico formativo de 3 a 5 itens sem caráter punitivo.
3. **Fase 3 — Explicação do Conceito:** Microlearning progressivo com fórmulas renderizadas via KaTeX e exemplos práticos comentados.
4. **Fase 4 — Aprender Interagindo:** Laboratório e simulador interativo com controle dinâmico de variáveis.
5. **Fase 5 — Resolução Guiada:** Passo a passo com revelação gradual de etapas e estímulo à dedução.
6. **Fase 6 — Prática com Feedback:** Exercícios acompanhados de 3 níveis de dicas graduais (Conceitual, Caminho e Procedimento).
7. **Fase 7 — Conexão com o ENEM:** Situação-problema original contextualizada no padrão do exame com análise crítica de comando e distratores.
8. **Fase 8 — Quiz Final:** Avaliação formativa estruturada (mínimo de 12 itens com 5 alternativas cada), navegação livre e sem revelação prévia de gabarito.
9. **Fase 9 — Devolutiva Pedagógica:** Relatório detalhado discriminado por habilidade BNCC/ENEM, gabarito comentado, identificação do erro conceitual em cada distrator e botão *"Reforçar meu aprendizado"*.
10. **Fase 10 — Revisão Espaçada e Continuidade:** Algoritmo determinístico de agendamento de repetição espaçada (1, 3, 7 e 14 dias) e recomendação personalizada do próximo passo.

---

## 2. Arquitetura do Sistema

A aplicação foi projetada com separação estrita em 3 camadas:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE APRESENTAÇÃO                        │
│   React 18/19 + TypeScript + Vite + Tailwind CSS + Lucide + KaTeX      │
│   (Dashboard, Trilhas Curriculares, Stepper em 10 Fases, Simuladores)  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                           MOTOR PEDAGÓGICO                             │
│   - EvaluationEngine (Matriz de Habilidades, Diagnóstico de Distratores)│
│   - AdaptiveEngine (Revisão Espaçada em 1, 3, 7 e 14 dias)             │
│   - PrerequisiteTracker (Rastreamento de Dependências Curriculares)    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                      BASE DE CONTEÚDO & DADOS                          │
│   - Schemas Zod Estritos (Validação de Lições, Fases e Questões)       │
│   - StorageManager (Persistência no Navegador, Export/Import JSON)     │
│   - Catálogo Modular dos 7 Eixos Temáticos                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Matriz Curricular (7 Eixos Oficiais)

1. **Matemática Básica e Aritmética** *(Alta Incidência)*
2. **Razão, Proporção e Matemática Financeira** *(Alta Incidência)*
   - Nível 1 (Fácil): Fundamentos de Razão, Proporção e Identificação de Grandezas (`licao-prop-facil-01`)
   - Nível 2 (Intermediário): Regra de Três Composta e Aplicação Contextualizada (`licao-prop-inter-02`)
   - Nível 3 (Avançado - ENEM): Escalas Multidimensionais ($k, k^2, k^3$) e Problemas Complexos (`licao-prop-avanc-03`)
3. **Estatística, Probabilidade e Combinatória** *(Alta Incidência)*
4. **Álgebra, Funções e Sequências** *(Alta Incidência)*
5. **Geometria Plana** *(Alta Incidência)*
6. **Geometria Espacial** *(Alta Incidência)*
7. **Geometria Analítica e Trigonometria** *(Média Incidência)*

---

## 4. Instruções de Execução

### Requisitos Prévios
- Node.js 18+ (testado e validado em Node.js v26.13)
- npm 9+

### Instalação de Dependências
```bash
npm install
```

### Executar em Ambiente de Desenvolvimento
```bash
npm run dev
```

### Executar Suíte de Testes Automatizados
```bash
npm test
```
*Executa os testes de unidade com Vitest para o `EvaluationEngine`, `AdaptiveEngine`, `PrerequisiteTracker`, `StorageManager` e os contratos do `LicaoSchema`.*

### Gerar Versão Estática para Produção
```bash
npm run build
```
*Gera os arquivos otimizados e minificados no diretório `dist/`, 100% estáticos e prontos para publicação no GitHub Pages, Vercel, Netlify ou servidor web convencional.*

---

## 5. Privacidade e LGPD

- Não requer cadastro nem coleta de dados sensíveis de estudantes menores de idade.
- Todo o progresso, histórico de tentativas e agendamentos de revisão são persistidos localmente no navegador (`LocalStorage` / `IndexedDB`).
- Suporte a **Exportação e Importação de Backup em formato JSON**, permitindo ao estudante salvar seus dados ou transferi-los entre dispositivos.
