## ADDED Requirements

### Requirement: Data Isolation (Multi-tenancy)
O sistema SHALL isolar os dados de cada produtor utilizando um identificador único `producerId` em todas as tabelas de domínio.

#### Scenario: Cross-tenant data leak prevention
- **WHEN** uma query é executada pelo produtor A
- **THEN** o sistema SHALL garantir que apenas registros vinculados ao `producerId` de A sejam retornados.

### Requirement: Middleware Tenant Context
O sistema SHALL injetar o contexto do tenant atual (ID e configurações) em cada requisição autenticada.

#### Scenario: Context injection
- **WHEN** uma requisição chega ao backend
- **THEN** o middleware SHALL extrair o `producerId` da sessão e torná-lo disponível para o Prisma ORM.
