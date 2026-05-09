# Tasks: Gestão Profissional de Lotes ✅

## 1. Data Foundation (Prisma) ✅
- [x] 1.1 Adicionar enum `FlockPurpose { POSTURA, CORTE, RECRIA }` ao `schema.prisma`.
- [x] 1.2 Expandir modelo `Flock` com os campos técnicos e financeiros.
- [x] 1.3 Executar migração Prisma e regenerar o client.

## 2. Server Logic (Actions) ✅
- [x] 2.1 Atualizar `createFlock` em `src/app/flocks/actions.ts` para receber e validar os novos campos.
- [x] 2.2 Implementar o cálculo automático de `totalCost = initialQuantity * unitPrice` no backend.
- [x] 2.3 Garantir que a criação da `Expense` automática use o `totalCost` calculado.

## 3. UI/UX Refinement (Frontend) ✅
- [x] 3.1 Refatorar formulário em `flocks/new/page.tsx` para layout de alta densidade (3 colunas).
- [x] 3.2 Adicionar campos técnicos: Fornecedor, Linhagem, Idade na Chegada, Peso Médio.
- [x] 3.3 Adicionar campos financeiros: Preço Unitário e display de Custo Total (calculado via JS no cliente).
- [x] 3.4 Implementar DatePickers para Data de Nascimento e Data de Aquisição.
- [x] 3.5 Integrar seletor de Galpão buscando dados reais.

## 4. Validation & Quality ✅
- [x] 4.1 Validar se o custo total é lançado corretamente no cockpit financeiro.
- [x] 4.2 Garantir que o Lote seja vinculado ao Galpão no banco de dados (relação `houseId`).
- [x] 4.3 Testar UX de preenchimento em dispositivos móveis (densidade dos campos verificada).
- [x] 4.4 Verificar persistência da linhagem (`breed`) e fornecedor no detalhe do lote.

---
**Status Final:** Funcionalidade de gestão profissional de lotes 100% operacional, integrada ao financeiro e com vinculação de ativos (galpões).
