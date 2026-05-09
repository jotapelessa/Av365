# Tasks: Elite Financial Management

## 1. Foundation & Layout
- [x] 1.1 Refatorar `src/app/finance/page.tsx` para usar `DashboardGrid` e `DashboardCard` modulares.
- [x] 1.2 Atualizar o header financeiro para `text-4xl` com botões de ação 'Elite' (uppercase, black).
- [x] 1.3 Padronizar os cards de KPI (Receita, Despesa e Saldo) com a classe `ui-card`.

## 2. Transactions & Logs
- [x] 2.1 Refatorar a lista de 'Vendas Recentes' para o padrão de alta densidade (cards compactos ou tabela luxo).
- [x] 2.2 Refatorar a seção de 'Despesas' para manter simetria visual com as vendas.
- [x] 2.3 Padronizar badges de categoria e ícones de transação.

## 3. Analytics & Feedback
- [x] 3.1 Criar `src/app/finance/loading.tsx` com `MetricSkeleton` e skeletons de gráfico.
- [x] 3.2 Refinar o componente `FinanceChart` (se necessário) para compatibilidade estética total.
- [x] 3.3 Integrar o card de 'Relatório DRE' ao grid de forma orgânica.
- [x] 3.4 **[BÔNUS]** Refatorar formulários de Nova Venda e Nova Despesa com padrão Elite.

## 4. Quality Control
- [x] 4.1 Validar contraste de cores (Emerald/Rose) no modo escuro e claro.
- [x] 4.2 Testar alinhamento de valores monetários em telas pequenas.
- [x] 4.3 Verificar se as variáveis de design dinâmico (`--radius-ui`) estão sendo aplicadas corretamente.

## 5. Infrastructure & Maintenance
- [x] 5.1 Migrar Prisma para v7 com Driver Adapters (`PrismaPg`).
- [x] 5.2 Migrar de `middleware.ts` para `proxy.ts` (Convenção Next.js 16).
- [x] 5.3 Sincronizar definições globais do Clerk (`clerk.d.ts`) com metadados do produtor.
