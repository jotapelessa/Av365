# Tarefas: Módulo de Galpões de Elite

## 🧱 Fase 1: Banco de Dados & Backend
- [x] Criar migração Prisma para adicionar `width`, `length`, `housingSystem`, `hasClimate`, `hasAutoFeeding`, `lastSanitized` ao modelo `House`.
- [x] Atualizar `src/app/houses/actions.ts` com funções de CRUD (`getHouses`, `upsertHouse`, `deleteHouse`).
- [x] Implementar lógica de validação: impedir exclusão de galpão se houver um lote ativo.

## 🎨 Fase 2: Componentes Elite
- [x] Criar `HouseCardExpert.tsx` seguindo `PADRAO_UI_PROJETO.md`:
  - Raio de 18px, padding p-10, glassmorphism.
  - Exibição do cálculo de densidade.
  - Botão de exclusão com confirmação em 2 passos.
- [x] Criar `HouseForm.tsx` com:
  - Campos de especificações técnicas.
  - Cálculo interativo de área.
- [x] Criar `HouseStatsSummary.tsx` para KPIs no topo da página.

## 🚀 Fase 3: Montagem da Página & Integração
- [x] Refatorar `src/app/houses/page.tsx`:
  - Implementar `DashboardGrid` (padrão 4-3-1).
  - Integrar `HouseStatsSummary`.
  - Buscar e exibir galpões com `HouseCardExpert`.
- [x] Implementar modal/diálogo de "Adicionar Galpão" com estilo elite.

## 🧪 Fase 4: Validação & Polimento
- [x] Criar script de seed para popular 5 galpões realistas (variando sistemas: convencional, automatizado, dark house).
- [x] Auditar o uso de locale `pt-BR` em todas as medidas.
- [x] Revisão final de UI para consistência "Luxury Modern".

## 💎 Fase 5: Detalhes do Galpão (Elite Hub)
- [x] Criar página de detalhes dinâmica `/houses/[id]`.
- [x] Header premium com status em tempo real e KPIs técnicos.
- [x] Cards de Ambiência (Temperatura, Umidade, Ventilação).
- [x] Hub de Ações Rápidas (`HouseQuickActions`).
- [x] Visualizador de Vazio Sanitário com progresso.
- [x] Integração de Checklist Operacional (Tarefas específicas do galpão).
