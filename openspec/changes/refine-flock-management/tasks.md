# Tasks: Elite Flock Management

## 1. Foundation & Layout
- [x] 1.1 Refatorar `src/app/flocks/page.tsx` para usar `DashboardContainer` e `DashboardGrid`.
- [x] 1.2 Atualizar o header da página com estilo executivo e botão 'Novo Lote' refinado.
- [x] 1.3 Converter cards de lote para o componente `ui-card` com tokens dinâmicos.

## 2. Components & Loading
- [x] 2.1 Criar `src/app/flocks/loading.tsx` usando `MetricSkeleton` e skeletons customizados para cards de lote.
- [x] 2.2 Refinar o `EmptyState` da página de lotes com estética premium e animações de entrada.
- [x] 2.3 Padronizar o formulário de cadastro (NewFlockPage) com o novo Design System.

## 3. Data & Detail
- [x] 3.1 Refatorar a Central Analítica do Lote (`src/app/flocks/[id]/page.tsx`) com Cockpit Elite.
- [x] 3.2 Implementar botões de ação rápida (Lançar, Ver Detalhes) com iconografia clara e compacta.
- [x] 3.3 Garantir que os metadados (Linhagem, Qtd, Data) tenham hierarquia tipográfica equilibrada.
- [x] 3.4 **[BÔNUS]** Refatorar formulário de Lançamento Diário (`record/page.tsx`) com padrão Elite.

## 4. Quality Control
- [x] 4.1 Validar consistência de gaps e arredondamentos com o Dashboard.
- [x] 4.2 Testar fluxos de navegação mobile.
- [x] 4.3 Verificar performance do Prisma nas queries de listagem.
