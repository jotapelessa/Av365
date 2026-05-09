# Change: Modernização do Dashboard Elite e Ecossistema Financeiro

## Why
O dashboard atual precisava de uma evolução para se tornar um "Cockpit Bio-Operacional", integrando inteligência financeira (fluxo de caixa) e performance biológica (ranking de lotes) em uma única visão executiva de alta densidade (Executive High-Density), conforme as diretrizes do `PADRAO_UI_PROJETO.md`.

## What Changes
- **MODIFIED**: Sidebar do produtor com categorias ERP (Funcionários, Clientes, Fornecedores) no primeiro nível.
- **ADDED**: Centro Financeiro Bento Grid no Dashboard com métricas reais de Receita, Despesas e Saldo.
- **ADDED**: Top Performers Hub para ranqueamento de lotes por taxa de postura.
- **MODIFIED**: Quick Actions focadas em fluxo de campo e financeiro.
- **MODIFIED**: Blindagem RSC para serialização de objetos Decimal/Date em componentes de cliente.

## Impact
- Affected specs: `specs/dashboard/spec.md`, `specs/finance/spec.md`
- Affected code: `src/app/dashboard/page.tsx`, `src/app/dashboard/actions.ts`, `src/components/layout/Sidebar.tsx`
