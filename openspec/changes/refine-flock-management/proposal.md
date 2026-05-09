# OpenSpec: Elite Flock Management UI/UX

## Context & Objectives
Após a consolidação do Dashboard Analítico com estética de luxo e alta densidade, o módulo de Gestão de Lotes (Flocks) precisa ser refinado para manter a consistência visual e funcional. O objetivo é transformar a listagem e o gerenciamento de lotes em uma experiência de alta fidelidade, otimizando o uso do espaço e a hierarquia da informação.

## UI/UX Standards (Elite Compact)
- **Grid System**: Utilizar `DashboardGrid` com gaps de 20px (`gap-5`).
- **Card Design**: Adotar a classe `ui-card` com arredondamento de 24px (`rounded-2xl`).
- **Typography**: Hierarquia clara com títulos `text-black` e metadados em `text-slate-400`.
- **Loading State**: Implementar Skeletons para evitar layout shift.

## Tasks

### 1. Page Refactoring
- [ ] 1.1 Migrar `FlocksPage` para utilizar `DashboardContainer` e `DashboardGrid`.
- [ ] 1.2 Padronizar os cards de lote utilizando a classe `ui-card` e variáveis dinâmicas de design.
- [ ] 1.3 Refinar o cabeçalho da página com botões de ação compactos e breadcrumbs de luxo.

### 2. Interaction & Feedback
- [ ] 2.1 Implementar `loading.tsx` com Skeletons específicos para os cards de lote.
- [ ] 2.2 Adicionar estados vazios (empty states) com ilustrações geradas e estética premium.
- [ ] 2.3 Refinar modais de lançamento e edição para utilizarem o novo Design System.

### 3. Data Intelligence
- [ ] 3.1 Adicionar indicadores de performance (taxa de postura atual) diretamente no card do lote.
- [ ] 3.2 Implementar sistema de filtragem rápida (Ativos, Finalizados, Quarentena).

## Validation Gates
- [ ] Consistência visual com o Dashboard.
- [ ] Responsividade em dispositivos mobile (touch-first).
- [ ] Performance de renderização e carregamento.
