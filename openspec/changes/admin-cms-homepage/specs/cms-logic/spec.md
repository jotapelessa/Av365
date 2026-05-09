# Spec: Lógica do CMS e Gestão SaaS

## Requisitos MODIFICADOS
### CMS-001: Seção Hero Dinâmica
- #### Cenário: Registro no banco existe
  - **Dado** um `GlobalConfig` com `heroTitle` igual a "Nova Era"
  - **Quando** a homepage carrega
  - **Então** o título "Nova Era" é exibido.

## Requisitos ADICIONADOS
### SAAS-001: Controle de Acesso por Status de Assinatura
O sistema deve impedir o acesso à operação se a assinatura não estiver ativa.
- #### Cenário: Assinatura Pausada
  - **Dado** um produtor com assinatura no status `PAUSED`
  - **Quando** ele tenta acessar o `/dashboard`
  - **Então** o Proxy o redireciona para uma tela de "Conta Pausada - Contate o Suporte".

### SAAS-002: Modo de Manutenção Global
O Super Admin pode bloquear o acesso ao sistema para todos os produtores.
- #### Cenário: Manutenção Ativa
  - **Dado** `GlobalConfig.maintenanceMode` como `true`
  - **Quando** qualquer usuário (exceto Super Admin) acessa o sistema
  - **Então** eles são redirecionados para a página de manutenção.

### SAAS-003: Auditoria Administrativa
Toda ação de alto impacto deve ser registrada.
- #### Cenário: Alteração de Plano Manual
  - **Dado** um Super Admin alterando o plano de um cliente manualmente
  - **Quando** a ação é concluída
  - **Então** um registro é criado na tabela `AdminActionLog` com os detalhes da transação.
