# Proposal: Infraestrutura de Dados Core (Expandida)

## Change ID: `infra-expand-db-schema-core`

## Visão Geral
Esta mudança implementa a fundação estrutural completa do banco de dados do EggTrack Elite, garantindo que todas as entidades descritas no `openspec/project.md` estejam presentes no schema Prisma. Isso elimina o risco de erros de tempo de execução por falta de tabelas e prepara o terreno para o desenvolvimento acelerado das funcionalidades de SaaS, Inventário, Saúde e Tarefas.

## Problema
O schema atual possui apenas os modelos básicos de domínio (Lotes, Galpões, Registros Diários). Faltam tabelas críticas para:
1.  **SaaS Management**: Gestão de planos, limites e assinaturas Stripe.
2.  **Segurança e Auditoria**: Logs imutáveis de ações críticas.
3.  **Operação Profissional**: Controle de estoque de insumos, calendário de tarefas e registros sanitários.
4.  **Configuração Global**: Gestão de branding e parâmetros do sistema pelo Super Admin.

## Solução
Expandir o `schema.prisma` para incluir 4 novos módulos de dados:
1.  **Módulo SaaS**: `SubscriptionPlan`, `Subscription`.
2.  **Módulo de Governança**: `AuditLog`, `GlobalConfig`, `Cooperativa`.
3.  **Módulo de Insumos**: `InventoryItem`, `InventoryMovement`, `InventoryCategory`.
4.  **Módulo Operacional**: `Task`, `VaccinationRecord`, `HealthAlert`.

## Valor de Negócio
- **Escalabilidade**: Permite o onboarding imediato de múltiplos planos de preço.
- **Conformidade**: Atende aos requisitos de auditoria e segurança nível bancário.
- **Robustez**: Evita refatorações dolorosas no futuro ao já prever as relações complexas de inventário e saúde.
- **Time-to-Market**: Desenvolvedores e IAs poderão focar na lógica de negócio, pois o banco já estará pronto.

## Impacto
- **Banco de Dados**: Migração estrutural com adição de ~12 novas tabelas.
- **Desenvolvimento**: Necessário rodar `npx prisma generate` após a aplicação.
- **Compatibilidade**: Sem quebras nos dados existentes (apenas adições e enriquecimento).
