# OpenSpec: Elite Financial Management UI/UX

## Context & Objectives
O módulo financeiro é o coração da rentabilidade do produtor. Atualmente, a interface apresenta elementos desproporcionais e falta de consistência com os novos padrões "Elite" (arredondamentos, densidade e tipografia). O objetivo é refatorar a visão financeira para um cockpit executivo de alta fidelidade, otimizando o acompanhamento de receitas, despesas e saldo.

## UI/UX Standards (Elite Compact)
- **Grid System**: Substituir layouts manuais por `DashboardGrid` e `DashboardCard`.
- **Card Design**: Unificar arredondamentos para 24px (`rounded-2xl`) usando a classe `ui-card`.
- **Typography**: Reduzir títulos de `text-6xl` para `text-4xl` máximo, focando em `font-black` e hierarquia clara.
- **Color Palette**: Manter Violet/Indigo para finanças, mas com contrastes refinados.

## Tasks

### 1. Page Refactoring
- [ ] 1.1 Migrar `FinancePage` para a estrutura modular de `DashboardGrid` e `DashboardCard`.
- [ ] 1.2 Padronizar o cabeçalho financeiro com ações compactas (Nova Venda / Despesa).
- [ ] 1.3 Unificar os estilos de KPI (Receita, Despesa, Saldo) no padrão Elite.

### 2. Transaction Logs
- [ ] 2.1 Refatorar as listas de Vendas e Despesas para utilizarem o visual "Luxury Table" ou cards compactos de alta densidade.
- [ ] 2.2 Implementar estados vazios (empty states) específicos para finanças.

### 3. Analytics & Charts
- [ ] 3.1 Refinar o `FinanceChart` para seguir a estética do `ProductionChart` (glow, tooltips customizadas, densidade).
- [ ] 3.2 Implementar `loading.tsx` financeiro com skeletons de alta fidelidade.

## Validation Gates
- [ ] Equilíbrio visual entre colunas de receita e despesa.
- [ ] Consistência de tokens de design com o Dashboard Analítico.
- [ ] Legibilidade de valores monetários em resoluções desktop e mobile.
