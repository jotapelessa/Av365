# Design: ERP Contábil e Operacional de Elite

## Visão Geral da Arquitetura
O sistema evoluirá para uma contabilidade de "Partidas Dobradas" simplificada, onde cada movimentação financeira afeta uma conta de origem e uma de destino, garantindo o equilíbrio patrimonial.

## 1. Esquema do Banco de Dados (Prisma)
### Novos Modelos Patrimoniais
*   **FinancialAccount**: `id, name, type (CASH, BANK, LOAN, EQUITY, ASSET), balance, bankDetails (JSON), producerId`.
*   **FinancialPartner**: Para gestão de Sócios e seus aportes/retiradas.
*   **Installment (Parcela)**: `id, transactionId, dueDate, amount, status (PENDING, PAID, OVERDUE), paidAt, accountId`.

### Modelos de Entidade (Operacional)
*   **Employee**: `id, name, cpf, salaryDetails, producerId`.
*   **Customer/Supplier**: `id, name, taxId, category, contact, producerId`.

### Modelos de Transação (Unificados)
As tabelas `Expense` e `Sale` serão mantidas para legibilidade, mas ambas herdarão relações com `Account` e `Installment`.
*   **Expense**: Adiciona `supplierId, employeeId, accountId, isRecurring, totalInstallments`.
*   **Sale**: Adiciona `customerId, accountId, isInstallment, invoiceUrl`.

## 2. Motor de Previsão (Forecasting)
O sistema calculará o saldo projetado somando:
`Saldo Atual das Contas + Parcelas a Receber (Vendas) - Parcelas a Pagar (Despesas/Empréstimos)`.

## 3. Lógica de Transferências
Criaremos uma ação de `InternalTransfer` que debita de uma `FinancialAccount` e credita em outra, registrando o log de movimentação para a contabilidade.

## 4. Camada de Controle de Acesso
Implementaremos um utilitário `checkAdminAccess` em Server Actions.
```typescript
async function validateFinanceAdmin() {
  const user = await getSessionUser();
  if (user.role !== 'PRODUCER') {
    throw new Error('Acesso negado: Somente administradores podem editar registros financeiros.');
  }
}
```

## 5. UI Components (Luxury Modern)
*   **FinancialDashboard**: Gráfico de linha dupla (Realizado vs Previsto).
*   **TransactionTable**: Tabela de alta densidade com suporte a parcelas expansíveis.
*   **AccountManager**: Grade de cards mostrando o saldo em tempo real de cada conta (Caixa, Bancos, etc).

## 3. Componentes de UI (Luxury Modern)
*   **TransactionTable**: Uma tabela de alta densidade com cabeçalhos fixos, efeitos de linha em glassmorphism e coloração baseada no status.
*   **EntityCard**: Cards em estilo bento mostrando estatísticas rápidas para cada Funcionário/Cliente/Fornecedor (ex: "Total Gasto este Ano").
*   **FinancialModal**: Formulário unificado com campos dinâmicos baseados na categoria (Despesa vs Venda).

## 4. Estratégia de Navegação
A `Sidebar.tsx` será atualizada para incluir:
```typescript
const menuItems = [
  // ...
  { icon: Users, label: "Funcionários", href: "/employees" },
  { icon: Briefcase, label: "Fornecedores", href: "/suppliers" },
  { icon: Handshake, label: "Clientes", href: "/customers" },
  // ...
];
```

## 5. Integridade de Dados
*   Exclusões em cascata serão evitadas. Excluir um fornecedor irá "anular" a referência em Despesas, em vez de excluir o registro da despesa, para preservar a integridade histórica financeira.
