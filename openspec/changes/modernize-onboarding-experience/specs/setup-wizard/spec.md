# Spec: Assistente de Configuração e Padrões de UI

## Requisitos MODIFICADOS

### Req: Roteamento Inteligente e Conversão (Ref 1.10)
- **Descrição**: O sistema deve encaminhar o usuário para o destino correto com base no seu papel e estado de assinatura.
- **Requisito**: Implementar lógica de roteamento no `src/proxy.ts`.
- **Critério**: Superadmins NUNCA devem ver a tela de onboarding/setup. Novos usuários DEVEM ver os planos de assinatura antes de configurar a granja.

#### Cenário: Acesso direto Superadmin
- **Dado** que um usuário logado possui a role `super_admin`
- **Quando** ele acessa a URL raiz `/` ou qualquer página interna
- **Então** o sistema DEVE redirecioná-lo IMEDIATAMENTE para `/admin`.

#### Cenário: Funil de Conversão (Planos)
- **Dado** que um novo produtor iniciou o `/setup`
- **Quando** ele entrar na primeira etapa
- **Então** o sistema DEVE exibir os planos de assinatura disponíveis.

#### Cenário: Coleta de Dados Especializada
- **Dado** que um produtor está na Etapa 2 do Assistente de Configuração
- **Quando** ele selecionar "Postura" como sua finalidade
- **Então** o sistema DEVE fornecer opções para linhagens de postura comuns (ex: Lohmann, Hy-Line, Isa Brown).

### Req: Sistema de Design de Elite (Ref 2.11)
- **Descrição**: A interface deve seguir os padrões "Luxury Pastel" e "Executive High-Density".
- **Requisito**: Todos os cards DEVEM ter um raio de 18px e efeito glassmorphism. Todos os botões DEVEM ter um raio de 24px e tipografia em negrito maiúsculo.
- **Critério**: 100% de conformidade com o `PADRAO_UI_PROJETO.md`.

#### Cenário: Consistência Visual
- **Dado** que um novo card de dashboard está sendo renderizado
- **Quando** o componente é montado
- **Então** ele DEVE usar o estilo `bento-card-elite` e seguir a regra de preenchimento 10px (p-10) para densidade.
