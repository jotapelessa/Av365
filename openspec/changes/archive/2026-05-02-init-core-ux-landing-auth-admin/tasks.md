# Tasks: UI Core & Admin Cockpit

## Fase 1: Branding e Autenticação
- [x] Criar arquivo de variáveis CSS globais baseadas em `GlobalConfig`.
- [x] Implementar a página de Login (`/sign-in`) customizada com Split-screen.
- [x] Implementar a página de Registro (`/sign-up`) customizada.
- [x] Configurar middleware para proteger rotas `/admin`.

## Fase 2: Homepage (Landing Page)
- [x] Desenvolver Componente `HeroSection`.
- [x] Desenvolver Componente `FeaturesBentoGrid`.
- [x] Desenvolver Componente `PricingSection` (consumindo `SubscriptionPlan`).
- [x] Montar a nova `src/app/page.tsx` integrada.

## Fase 3: Cockpit do Super Admin
- [x] Criar Layout base para `/admin` (Sidebar + Navbar Executiva).
- [x] Implementar Página Inicial do Admin com Widgets de KPI.
- [x] Criar Página `/admin/producers` com tabela de gestão de clientes.
- [x] Criar Página `/admin/plans` para edição de planos SaaS.
- [x] Criar Página `/admin/settings` integrada à tabela `GlobalConfig`.

## Fase 4: Polimento e Transições
- [x] Implementar animações de entrada com Framer Motion em todas as novas telas.
- [x] Validar responsividade mobile da Homepage e do Painel Admin.
- [x] Realizar teste de fluxo completo: Homepage -> Registro -> Onboarding -> Dashboard.
