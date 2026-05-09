# Design: Padronização UI/UX Agrotech

## Arquitetura de Estilos
O projeto utiliza **Tailwind v4** com o motor `@theme` para gerenciar tokens dinâmicos, integrado com **SASS Modules** para lógica complexa.

### 1. Hierarquia de Tokens (Tailwind v4 @theme)
O sistema foi unificado utilizando variáveis CSS nativas, permitindo reatividade total e performance "Elite".

- **Core Tokens**:
  - `--color-primary`: `#4f46e5` (Acento e Botões)
  - `--color-success`: `#10b981` (Crescimento/Ativos)
  - `--color-danger`: `#f43f5e` (Alertas Críticos)
  - `--color-warning`: `#f59e0b` (Atenção Sanitária)

- **Surface & Pastel Variants**:
  - `--color-primary-bg`: `rgba(79, 70, 229, 0.08)`
  - `--color-success-bg`: `rgba(16, 185, 129, 0.1)`
  - `--color-success-text`: `#065f46`
  - `--color-danger-bg`: `rgba(244, 63, 94, 0.1)`
  - `--color-danger-text`: `#9f1239`
  - `--color-warning-bg`: `rgba(245, 158, 11, 0.1)`
  - `--color-warning-text`: `#92400e`
  - `--color-card`: `rgba(255, 255, 255, 0.7)` (Glassmorphism)

### 2. Componentes Estruturais
- **Bento Grid**: Sistema de grids dinâmicos responsivos (`grid-cols-1 md:grid-cols-2 lg:grid-cols-12`).
- **Premium Cards**: Uso obrigatório de `.ui-card` com blur alto (24px-40px) e bordas suaves (`rounded-[48px]`).
- **Analytic Ribbon**: Faixa de KPIs responsiva com estados sanitários vinculados a tokens pastel.

### 3. Tipografia (EggTrack Elite)
- **Main**: `Inter` (Sans-serif) para legibilidade executiva.
- **Hierarchy**:
  - Títulos: `font-black`, `tracking-tight`.
  - Metadados: `text-[10px]`, `font-black`, `uppercase`, `tracking-[0.2em]`.
