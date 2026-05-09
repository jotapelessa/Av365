# Tarefas: Refino de Detalhes do Lote Expert

## 🧱 Fase 1: Backend & Data Intel
- [x] Criar `src/app/flocks/[id]/flockActions.ts` com funções agregadoras:
  - `getFlockStats(id)`: Retorna D/W/M e comparação com meta de linhagem.
  - `getFlockPredictions(id)`: Calcula estimativa de queda e data de reposição.
- [x] Implementar utilitário de cálculo de idade biológica exata por semanas.

## 🎨 Fase 2: Componentes de Elite
- [x] Criar `FlockVitalStatsHub.tsx`: Cards de monitoramento D/W/M.
- [x] Criar `ReplacementTimerCard.tsx`: Widget de contagem regressiva.
- [x] Criar `PredictiveProductionChart.tsx`: Gráfico de Real vs. Ideal de Linhagem.

## 🚀 Fase 3: Orquestração & UI
- [x] Refatorar `src/app/flocks/[id]/page.tsx` para o layout 4-2-1.
- [x] Implementar a "Elite Table" para o Livro de Campo:
  - Estilização Glassmorphism.
  - Hover states refinados.
  - Paginação/Lazy loading se necessário.
- [x] Integrar Alertas Bio-Técnicos baseados nas novas predições.

## 🧪 Fase 4: Polimento & Validação
- [x] Validar serialização de Decimais nos novos componentes.
- [x] Testar responsividade (4-2-1) em Mobile/Tablet.
- [x] Adicionar animações Framer Motion em todos os blocos de dados.
