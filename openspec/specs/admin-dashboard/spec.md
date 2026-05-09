# admin-dashboard Specification

## Purpose
TBD - created by archiving change init-core-ux-landing-auth-admin. Update Purpose after archive.
## Requirements
### Requirement: Somente usuários com role SUPER_ADMIN DEVEM acessar o diretório /admin (Ref 7.x).
O acesso à área administrativa MUST ser restrito e validado no nível do servidor e do middleware.

#### Scenario: Usuário comum tenta acessar o admin
- **Given** um usuário logado com `role: PRODUCER`.
- **When** ele tenta acessar `https://eggtrack.elite/admin`.
- **Then** o sistema DEVE redirecioná-lo para o dashboard comum ou exibir "Não Autorizado".

### Requirement: O Painel Admin DEVE prover visibilidade sobre a saúde do SaaS (Ref 11.x).
O dashboard admin MUST exibir métricas consolidadas de produtores, faturamento (simulado ou real) e logs de atividade.

#### Scenario: Super Admin visualiza lista de produtores
- **Given** um Super Admin no cockpit.
- **When** ele acessa a aba "Produtores".
- **Then** ele DEVE ver uma tabela com nome, plano atual, status e data de adesão de todos os tenants.

### Requirement: Mudanças em GlobalConfig DEVEM refletir instantaneamente (Ref 9.x).
Alterações de branding ou status de manutenção MUST ser persistidas e propagadas para todos os usuários.

#### Scenario: Ativação de Modo Manutenção
- **Given** o Super Admin nas configurações globais.
- **When** ele ativa o "Modo Manutenção".
- **Then** todos os usuários (exceto admins) DEVEM ver a tela de manutenção ao recarregar a aplicação.

