# Proposta: SuperAdmin Design System & Sidebar Hardening

## 🎯 Objetivo
Implementar a página mestre de Design System (`/admin/design`) para visualização e teste de componentes de elite, além de restringir o acesso administrativo na interface do produtor, garantindo a integridade operacional da plataforma.

## 🛠️ Escopo Técnico
- **Design System Page (`/admin/design`)**: 
    - Seção de Tipografia e Cores (Design Tokens).
    - Showcase de Botões Premium (Estados: Repouso, Hover, Loading, Destrutivo).
    - Showcase de Bento Cards (Glassmorphism, High-Density, Hover Effects).
    - Showcase de Tabelas Operacionais (Elite Field Book style).
    - Showcase de Formulários e Inputs (Luxury Modern).
- **Hardening de Navegação**:
    - Remoção dos links `/admin` e `/admin/design` da `Sidebar.tsx` (Produtor).
    - Adição do link `Design System` na `AdminSidebar.tsx` (SuperAdmin).
- **Fidelidade Estética**:
    - Uso estrito de `PADRAO_UI_PROJETO.md`.
    - Animações fluidas com `Framer Motion`.
    - Estilização avançada com `SASS` e classes utilitárias.

## 🏗️ Arquitetura
- **Page Component**: Server Component em `/app/admin/design/page.tsx` orquestrando Client Components de showcase.
- **Sidebar Logic**: Ajuste nos arrays de navegação das sidebars para segregação de privilégios.
- **Design Patterns**: Implementação de `BentoWrapper` para garantir o ritmo de design staggered.

## 💎 Valor Agregado
- Centraliza a referência visual para desenvolvedores e stakeholders.
- Reduz bugs de navegação ao esconder rotas administrativas de usuários comuns.
- Fortalece a marca EggTrack através de uma interface de luxo consistente.
