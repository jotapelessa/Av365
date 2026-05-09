# Proposta: Roteamento Inteligente, Planos e Onboarding de Elite

## Contexto
O sistema atual falha ao não distinguir claramente os perfis de acesso e ao esconder a área de planos/assinaturas. O "onboarding" hoje é um obstáculo burocrático em vez de um facilitador de conversão. Esta proposta redefine o fluxo de entrada para ser dinâmico, baseado em papéis (RBAC) e focado em monetização imediata.

## Objetivos
1.  **Roteamento Inteligente**: Redirecionar automaticamente com base no perfil (Superadmin -> `/admin`, Produtor Ativo -> `/dashboard`).
2.  **Planos e Assinaturas**: Integrar a seleção de planos de assinatura como o primeiro passo para novos usuários.
3.  **Eliminar o Limbo**: Garantir que após o login no Clerk, o usuário caia exatamente onde precisa estar.
4.  **Especialista em Avicultura**: O onboarding será um configurador técnico (Linhagem, Finalidade) e não apenas um formulário de nome.
5.  **Refinamento de UI de Elite**: Aplicar o padrão "Luxury Pastel" em toda a jornada de entrada.

### Fluxo de Roteamento (Proxy/Middleware)
- **Se não logado**: Mostra Landing Page com Planos e Preços.
- **Ao Logar (Clerk)**:
    - **Role: `super_admin`**: Redireciona IMEDIATAMENTE para `/admin`.
    - **Role: `producer`**:
        - **Já possui granja configurada?**: Vai direto para `/dashboard`.
        - **Novo usuário?**: Vai para o novo `/setup`.

### Core: O Novo Assistente de Configuração (`/setup`)
- **Etapa 1: Seleção de Plano**: Exibição de cards de planos (Stripe) com benefícios claros.
- **Etapa 2: Configuração Técnica**: Nome da Granja + Dados Zootécnicos (Linhagem, Finalidade, Alojamento).
- **Etapa 3: Ativação**: Checkout/Início de Trial e sincronização Clerk <-> DB.

### Refinamento de UI/UX
- **Cards**: Impor raio de `18px` e Glassmorphism.
- **Botões**: Impor raio de `24px` e tipografia `font-black uppercase tracking-widest`.
- **Formulários**: Implementar um visual profissional de alta densidade com melhores labels e efeitos de transição.
- **Animações**: Usar transições `staggerChildren` e `spring` globalmente.

### Integridade de Dados
- Server Actions atômicas para a configuração.
- Tipagem estrita para todos os novos campos.

## Impacto
- **Produtividade**: Melhores dados desde o primeiro dia para relatórios zootécnicos.
- **Confiança**: Interface profissional que esclarece o estado de "logado".
- **Escalabilidade**: Estrutura limpa para futuros módulos de onboarding (funcionários, cooperativas).

## Critérios de Sucesso
- Zero erros de TypeScript (verificado por `tsc`).
- Rota `/onboarding` excluída e substituída por `/setup`.
- Metadados no Clerk sincronizados corretamente após a conclusão da configuração.
