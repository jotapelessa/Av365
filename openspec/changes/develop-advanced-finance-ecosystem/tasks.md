# Tarefas: ERP Contábil e Operacional de Elite

## Fase 1: Fundação Patrimonial (Banco de Dados)
- [x] Criar modelos `FinancialAccount`, `Employee`, `Customer`, `Supplier`, `FinancialPartner`.
- [x] Implementar modelo de `Installment` (Parcelas) para suporte a vendas/compras a prazo.
- [x] Migrar banco de dados e gerar cliente Prisma.

## Fase 2: Motor Financeiro e Governança
- [x] Implementar `financialActions.ts` com suporte a transações parceladas.
- [x] Criar lógica de `InternalTransfer` entre contas bancárias/caixa.
- [x] Aplicar trava de segurança `Role.PRODUCER` para todas as ações de edição contábil.

## Fase 3: Cockpit de Gestão (UI/UX)
- [x] Criar Dashboard de Fluxo de Caixa Projetado (Gráfico Realizado vs Previsto).
- [x] Implementar telas de gestão de Clientes, Fornecedores e Funcionários.
- [x] Desenvolver o "Gerenciador de Contas" (Visualização de saldos de Caixa, Bancos e Dívidas).
- [x] Adicionar suporte a parcelamento nos formulários de Venda e Despesa.

## Fase 4: Exportação e Auditoria Contábil
- [ ] Implementar filtro de "Período Fiscal" para exportação de dados.
- [ ] Adicionar upload de comprovantes/notas fiscais em cada transação.
- [x] Implementar filtro de "Período Fiscal" para exportação de dados.
- [x] Adicionar upload de comprovantes/notas fiscais em cada transação.
- [x] Finalizar visual Luxury Modern: Glassmorphism e animações de transição.
- [x] Validação: Testar fluxo de ponta a ponta (Venda a prazo -> Conta a Receber -> Liquidação em Conta Bancária).

## Fase 5: Engenharia Contábil e Liquidez (Brainstorm)
- [x] Implementar `LiquidityMap`: Grid de contas bancárias com saldos reais e identidades visuais.
- [x] Desenvolver `ReceivablesAgingCard`: Visualização de prazos (Hoje, 7d, 30d).
- [x] **FASE 1: Cockpit de Liquidez & Patrimônio** (CONCLUÍDO)
    - [x] Implementar cálculo de "Patrimônio Total" (Equity) incluindo ativos biológicos.
    - [x] Criar componente `LiquidityMap.tsx` para visão multi-conta.
    - [x] Criar componente `ReceivablesAgingCard.tsx` para rastreio de prazos.

- [x] **FASE 2: Rigor Contábil & Governança** (CONCLUÍDO)
    - [x] Implementar `TransactionGuard` em Server Actions (Bloqueio de deleção de registros pagos).
    - [x] Refatorar formulários de Venda/Despesa para o padrão `radius-18px` Elite.
    - [x] Garantir serialização robusta de dados (Decimal/Dates).

- [x] **FASE 3: UX de Alta Performance** (CONCLUÍDO)
    - [x] Integração de micro-animações (Framer Motion) em todo o fluxo financeiro.
    - [x] Layout Bento Grid otimizado para o Dashboard Financeiro.
    - [x] Feedback visual de governança (TransactionGuard mensagens).

### 💎 Elite Standards Achieved
O ecossistema financeiro agora opera com o rigor de um ERP profissional, combinando design de luxo com integridade contábil absoluta.

## Fase 6: Governança e Refinamento UI
- [x] Implementar `TransactionGuard`: Proteção contra exclusão de transações conciliadas.
- [x] Refinar todos os componentes financeiros para conformidade total com `PADRAO_UI_PROJETO.md`.
- [x] Gerador de Snapshot Patrimonial (PDF/Relatório Tático).
