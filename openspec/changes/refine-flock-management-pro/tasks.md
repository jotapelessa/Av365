# Tarefas: Refinamento Pro da Gestão de Lotes

## Fase 1: Infraestrutura e Integridade de Dados
- [x] Implementar utilitário `calculateAge` e ajudantes de KPIs especialistas em `src/lib/utils/poultry.ts`.
- [x] Refatorar a ação `createDailyRecord` para usar transações Prisma.
- [x] Adicionar validação de guarda de mortalidade em `createDailyRecord`.
- [x] Implementar lógica de dedução automática de inventário em `createDailyRecord`.

## Fase 2: UI Analítica e Bento Grid (NOVO)
- [x] Construir o componente `FlockCardExpert` com grade de métricas e sparkline.
- [x] Criar o componente `AnalyticRibbon` para a visualização de detalhes.
- [x] Implementar **Bento Grid Layout** na página `/flocks/[id]` para visualização analítica.
- [x] Adicionar campos de **Consumo de Água** e **Temperatura** no formulário de lançamentos.
- [x] Desenvolver componente de **Alerta de Linhagem** (Comparativo Real vs. Padrão Genético).

## Fase 3: Refinamento Estético (SASS & Micro-interações)
- [x] Criar mixins SASS para Glassmorphism e estados de alerta em `src/styles`.
- [x] Implementar micro-animações de entrada (Fade-in + Scale) nos blocos do Bento Grid.
- [x] Refatorar botões de ação com sombras dinâmicas e feedback tátil (CSS transitions).

## Fase 4: Inteligência e Validação
- [x] Suporte a lançamentos retroativos com seletor de data.
- [x] Tabela de histórico densa com qualidade de ovos (quebrados/sujos).
- [x] Validar integridade do banco com múltiplos inquilinos (Tenancy Audit).
- [x] Testar alertas de desvio de produção (>3% queda).
