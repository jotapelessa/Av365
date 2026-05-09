# Design: Expansão do Schema Multi-tenant

## Arquitetura de Dados
O sistema continuará utilizando uma abordagem de **Banco de Dados Único com Isolamento de Linha (RLS)**. Todas as novas tabelas operacionais (Tenant Level) obrigatoriamente incluirão a coluna `producerId`.

### 1. Módulo SaaS (Admin Global)
- **`SubscriptionPlan`**: Modelo desacoplado do Stripe para permitir flexibilidade de exibição, mas com mapeamento via `stripePriceId`.
- **`Subscription`**: Estado da arte para controle de acesso. O middleware de segurança consultará esta tabela para validar features.

### 2. Módulo de Inventário (Tenant)
- **Hierarquia**: `InventoryCategory` -> `InventoryItem` -> `InventoryMovement`.
- **Cálculo de Custo**: O sistema deve permitir o vínculo de movimentos de saída com `Flock` ou `DailyRecord` para automação do custo de produção (Ref 13.3).

### 3. Módulo de Saúde e Sanidade (Tenant)
- **`VaccinationRecord`**: Vínculo obrigatório com `Flock` e `InventoryItem` (tipo VACINA/MEDICAMENTO).
- **`HealthAlert`**: Motor de notificação baseado em desvios de `DailyRecord`.

### 4. Módulo de Auditoria (Global)
- **`AuditLog`**: Armazenamento em JSON dos campos `dataBefore` e `dataAfter` para permitir "diffs" visuais no futuro.

## Decisões Técnicas
- **Enums**: Utilização extensiva de Enums (PostgreSQL) para garantir integridade (ex: `TaskStatus`, `SubscriptionStatus`, `MovementType`).
- **Indexação**: Índices compostos `(producerId, createdAt)` em todas as tabelas de alta volumetria (AuditLog, InventoryMovement, Task).
- **Relacionamentos**: Uso de `ON DELETE CASCADE` controlado para evitar órfãos em deletação de Tenants, mas `RESTRICT` em tabelas financeiras para preservação histórica.

## Diagrama de Relações (Resumo)
- `Producer` 1:N `Subscription`
- `Producer` 1:N `InventoryItem`
- `InventoryItem` 1:N `InventoryMovement`
- `Flock` 1:N `Task`
- `Flock` 1:N `VaccinationRecord`
- `User` 1:N `AuditLog`
