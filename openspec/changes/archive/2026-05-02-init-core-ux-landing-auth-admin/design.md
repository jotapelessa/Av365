# Design: UI Core & Admin Cockpit

## Arquitetura de Interface

### 1. Homepage (Landing Page)
- **Visual**: Fundo com gradientes sutis, tipografia "Inter/Outfit" em pesos variados e micro-animações (Framer Motion).
- **Seções**:
  - `Hero`: Título de impacto e CTA primário.
  - `Features Grid`: Bento grid apresentando os módulos (Lotes, Financeiro, Saúde).
  - `Social Proof`: Logos de parceiros e depoimentos.
  - `Pricing`: Cards dinâmicos puxando dados do `SubscriptionPlan`.

### 2. Fluxo de Autenticação
- **Customização Clerk**: Sobrescrever estilos padrão com variáveis CSS do sistema.
- **Layout**: Tela dividida (Split-screen) com imagem aspiracional da produção avícola de um lado e formulário minimalista do outro.

### 3. Cockpit do Super Admin (`/admin`)
- **Segurança**: Proteção via middleware do Clerk (somente usuários com `role: SUPER_ADMIN`).
- **Navegação**: Sidebar dedicada, separada do dashboard do produtor.
- **Estrutura de Páginas**:
  - `/admin`: Dashboard Executivo (Gráficos de Receita e Usuários).
  - `/admin/producers`: Gestão de tenants (Ativação/Inativação).
  - `/admin/plans`: Configuração de preços e limites.
  - `/admin/settings`: Branding e Manutenção global.

## Integração de Dados
- **Server Actions**: Manipulação direta das tabelas administrativas.
- **Real-time**: Atualização de KPIs via polling ou SWR para o dashboard admin.
- **Branding Dinâmico**: A `GlobalConfig` do banco DEVE alimentar as variáveis de cor e logo em toda a aplicação.

## Design System (Ref 11.x)
- **Cores**: Indigo (#4F46E5) como primária, Slate como neutra.
- **Radius**: Consistência com o valor definido no `DesignAdminPage` (padrão 24px).
