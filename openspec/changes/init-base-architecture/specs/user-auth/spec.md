## ADDED Requirements

### Requirement: Authentication with Clerk
O sistema SHALL utilizar o Clerk para gerenciamento de identidade, suportando login via Email/Senha e Social (Google).

#### Scenario: Successful login
- **WHEN** um usuário fornece credenciais válidas
- **THEN** uma sessão segura é estabelecida e o usuário é redirecionado ao dashboard.

### Requirement: Role-Based Access Control (RBAC)
O sistema SHALL validar a role do usuário (`super_admin`, `producer`, etc.) antes de permitir o acesso a rotas protegidas.

#### Scenario: Unauthorized access
- **WHEN** um usuário `producer` tenta acessar `/admin`
- **THEN** o sistema SHALL retornar um erro 403 ou redirecionar para o dashboard do produtor.
