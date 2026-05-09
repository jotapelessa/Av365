# 🐣 Padronização UI/UX Agrotech (EggTrack)

Este documento define os padrões obrigatórios para o sistema de design **EggTrack**. Toda nova interface SHALL seguir estas diretrizes para garantir a estética "Luxury Pastel" e "Executive High-Density".

## 1. Paleta de Cores (Standard Tokens)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `$color-primary` | `#4f46e5` | Ação principal, Brand, Destaques |
| `$color-bg-light` | `#f8fafc` | Fundo principal das páginas |
| `$color-bg-dark` | `#020617` | Sidebar Admin, Temas escuros |
| `$color-success` | `#10b981` | KPIs positivos, Sucesso, Ativo |
| `$color-danger` | `#f43f5e` | Alertas críticos, Mortalidade, Erro |
| `$color-text-main` | `#1e293b` | Texto base e Títulos |
| `$color-text-muted`| `#64748b` | Legendas e metadados |

### Tons Pastel (Categorização)
- **Emerald**: `#dcfce7` (Saúde/Bio)
- **Violet**: `#ede9fe` (Gestão/Admin)
- **Blue**: `#e0f2fe` (Financeiro)
- **Amber**: `#fef3c7` (Logística/Alertas)

## 2. Tipografia

- **Fonte Principal**: `Inter`, sans-serif.
- **Títulos (Headings)**: `font-black` (900), `tracking-tight`.
- **Metadados/Labels**: `text-[10px]`, `font-black`, `uppercase`, `tracking-[0.2em]`.
- **Corpo**: `text-base` ou `text-sm`, `font-medium`, `text-slate-600`.

## 3. Componentes Padrão

### Bento Grid Cards
- **Radius**: `18px` (Padrão universal para todos os cards do projeto).
- **Background**: Glassmorphism (`rgba(255, 255, 255, 0.7)` + `blur(24px)`).
### Elite Chart & Operational Cards
- **Padding**: `p-10` (Uso obrigatório para cards de alta densidade como gráficos).
- **Header Structure**:
  - **Ícone**: Container pastel (`primary-bg`) com bordas `rounded-2xl`.
  - **Título**: `text-2xl font-black italic`.
  - **Metadados (Subtítulo)**: `text-[10px] font-black uppercase tracking-[0.2em]`.
- **Hover**: Elevação de `-8px` com sombra índigo suave.

### Botões Premium
- **Estilo**: `uppercase`, `font-black`, `tracking-widest`.
- **Radius**: `24px`.
- **Sombra**: `shadow-[0_10px_20px_-10px_rgba(79,70,229,0.4)]`.

### Tabelas Operacionais
- **Cabeçalho**: Fundo `slate-50/50`, texto em `uppercase` meta-data style.
- **Linhas**: Hover em `indigo-50/30`, bordas suaves `slate-50`.

## 4. Diretrizes de Animação (Framer Motion)

Para manter a estética "Premium & Fluid", todas as transições devem seguir:
- **Entrada de Página**: `fade-in` com `duration: 700ms`.
- **Bento Items**: `staggerChildren: 0.1s` para entradas escalonadas.
- **Interações (Hover)**: `transition: { type: "spring", stiffness: 300, damping: 20 }`.
- **Efeito Magnético**: Elementos interativos devem ter micro-escalonamento (`scale: 1.02`) e elevação de sombra no hover.

## 5. Regras de Implementação para IA

1. **PROIBIDO** usar cores hex ou rgba diretamente no TSX. Use classes utilitárias ou SASS variables.
2. **OBRIGATÓRIO** usar a classe `.bento-card-elite` para containers principais de dashboard.
3. **OBRIGATÓRIO** usar animações de entrada escalonadas (*staggered*) via `BentoWrapper` em novas telas.
4. **DESIGN RHYTHM**: Use sempre múltiplos de `8px` para gaps e paddings.

## 6. Layout & Responsividade

- **Grid de Listagem (High Density)**: 
  - **Desktop**: 4 colunas (`cols-4`) para máxima visibilidade.
  - **Tablet**: 3 colunas (`cols-3`) para dispositivos em modo paisagem.
  - **Mobile**: 1 coluna (`cols-1`) para foco total na informação.
  - **Gap Padrão**: `gap-8` (32px) para garantir o "ritmo de design".

## 7. Formatação de Dados & Estabilidade (Hydration)

- **Locale Universal**: Toda exibição numérica (`toLocaleString`) ou de data SHALL forçar o locale `'pt-BR'` para evitar descompassos entre servidor e cliente.
- **Serialização de Decimais**: Dados vindos do Prisma (Server Components) que contenham campos `Decimal` devem ser serializados via `JSON.parse(JSON.stringify())` antes de serem passados para Client Components.
- **DOM Safety**: A tag `<html>` deve possuir o atributo `suppressHydrationWarning` para neutralizar interferências de extensões de navegador (ex: Jetski, Grammarly).

## 8. Experiência de Ações Críticas (Destructive Actions)

- **Confirmação em 2 Passos**: Botões de exclusão ou ações irreversíveis devem implementar:
  1. Primeiro clique: Altera o estado para "Confirmar?" e inicia um timer de 3 segundos.
  2. Segundo clique (dentro da janela): Executa a ação via `useTransition` com feedback visual de carregamento.
  3. Reset: Se não houver o segundo clique em 3s, o botão retorna ao estado de repouso.

---
*Ultima atualização: 03/05/2026*
