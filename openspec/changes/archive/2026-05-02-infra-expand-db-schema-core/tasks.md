# Tasks: Expansão Estrutural do Banco de Dados

## Fase 1: Enums e Infraestrutura Base
- [x] Adicionar novos Enums ao `schema.prisma`: `SubscriptionStatus`, `TaskStatus`, `InventoryMovementType`, `InventoryUnit`, `AuditCategory`.
- [x] Criar modelo `GlobalConfig` para parâmetros do sistema.
- [x] Criar modelo `AuditLog` para rastro de segurança.
- [x] Validar integridade do schema com `npx prisma validate`.

## Fase 2: Módulo SaaS e Governança
- [x] Criar modelo `SubscriptionPlan` (Preços e Limites).
- [x] Criar modelo `Subscription` vinculado ao `Producer`.
- [x] Criar modelo `Cooperativa` e relacionar com `Producer`.
- [x] Atualizar modelo `Producer` para suportar novos vínculos.

## Fase 3: Módulo de Inventário e Operações
- [x] Criar modelo `InventoryCategory`.
- [x] Criar modelo `InventoryItem` (Estoque).
- [x] Criar modelo `InventoryMovement` (Entradas/Saídas).
- [x] Criar modelo `Task` (Calendário).

## Fase 4: Módulo de Saúde e Sanidade
- [x] Criar modelo `VaccinationRecord`.
- [x] Criar modelo `HealthAlert`.
- [x] Adicionar índices de performance recomendados no `design.md`.

## Fase 5: Validação e Geração
- [x] Executar `npx prisma format` para padronização.
- [x] Gerar migração de teste (shadow database) se possível.
- [x] Rodar `npx prisma generate` para atualizar o Client.
