# Proposal: Core UX, Autenticação e Cockpit Admin

## Change ID: `init-core-ux-landing-auth-admin`

## Visão Geral
Esta proposta visa consolidar a identidade visual e a capacidade de governança do EggTrack Elite. Implementaremos uma homepage de alto impacto, um fluxo de autenticação personalizado e o painel administrativo (Super Admin) completo, conectando a interface às tabelas estruturais recém-criadas.

## Problema
Atualmente, a aplicação carece de:
1.  **Vitrine**: A homepage é um rascunho simplificado que não comunica o valor executivo do SaaS.
2.  **Identidade em Auth**: O login utiliza o padrão do Clerk sem a sofisticação visual do "Luxury Admin".
3.  **Governança Centralizada**: Não existe um local para o Super Admin monitorar a saúde do negócio (MRR, Produtores, Logs) ou ajustar configurações globais.

## Solução
1.  **Homepage Elite**: Construir uma landing page moderna com seções de Hero, Features, Pricing (dinâmico) e Footer.
2.  **Custom Auth**: Implementar páginas de `sign-in` e `sign-up` totalmente customizadas com Clerk e SASS Modules.
3.  **Super Admin Dashboard**:
    - **Página Inicial**: Widgets de KPI (Assinantes Ativos, MRR, Crescimento).
    - **Gestão de Produtores**: Tabela interativa para monitorar e apoiar os tenants.
    - **Configuração Global**: Interface para ajustar branding e segurança diretamente no banco de dados.

## Valor de Negócio
- **Conversão**: Uma landing page profissional aumenta a confiança e atrai novos assinantes.
- **Retenção**: Uma interface de login e onboarding fluida reduz a fricção inicial.
- **Controle**: O Super Admin ganha visibilidade total sobre a monetização e o uso da plataforma, permitindo decisões baseadas em dados.

## Impacto
- **UI/UX**: Refatoração da página raiz e páginas de auth.
- **Admin**: Introdução do diretório `/admin` como cockpit central.
- **Dados**: Integração direta com as tabelas `SubscriptionPlan`, `AuditLog` e `GlobalConfig`.
