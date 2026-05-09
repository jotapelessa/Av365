# Especificação de Design: Elite SaaS Cockpit

## 1. Visão Geral
O cockpit deve transmitir a sensação de uma "Central de Comando" de alta tecnologia. O design é focado em produtividade executiva, utilizando contrastes de alta fidelidade e superfícies táteis.

## 2. Paleta de Cores (Elite Palette)
- **Background**: `Slate 950` (#020617) - Profundidade absoluta.
- **Surface**: `Slate 900` com 50% de opacidade e Blur de 20px.
- **Primary**: `Indigo 600` (#4f46e5) -> `Indigo 400` (#818cf8) para estados ativos.
- **Success**: `Emerald 500` com efeito de glow suave.
- **Danger/Admin**: `Rose 600` (#e11d48) - Cor de destaque do Super Admin.
- **Border**: `Slate 800` com brilho sutil em 1px.

## 3. Componentes de Elite

### A. Elite Cards (Glassmorphism)
- **Estrutura**: `bg-slate-900/50 border border-slate-800/50 backdrop-blur-xl`.
- **Borda**: Gradiente linear sutil de cima para baixo (`Slate 700/50` -> `Slate 800/20`).
- **Sombra**: `shadow-2xl shadow-black/40`.
- **Corner Radius**: `32px` (Suavidade executiva).

### B. Tabelas Administrativas
- **Header**: Fundo Slate 900/80 com tipografia em `Tracking-Widest` e `Font-Black`.
- **Rows**: Hover com `bg-indigo-500/5` e transição de opacidade da borda.
- **Status Badges**: Fundo colorido com 10% de opacidade e texto vibrante com `Shadow-Inner`.

### C. Formulários & Inputs
- **Fundo**: `Slate 950` sólido para máximo contraste.
- **Foco**: Borda Indigo 500 com `Ring-Indigo-500/20` e expansão suave.
- **Label**: Tipografia Slate 500, movendo-se levemente ao focar (se possível) ou destacando-se com Font-Bold.

### D. Botões de Ação
- **Primário**: Gradiente de `Indigo 600` para `Indigo 700` com sombra projetada.
- **Interação**: `active:scale-95 transition-all duration-300`.
- **Iconografia**: Uso consistente de Lucide com `StrokeWidth={2.5}`.

## 4. Tipografia
- **Heading**: `Inter` ou `Outfit`, com Kerning negativo (`tracking-tighter`) para títulos grandes.
- **Body**: `Inter` médio para legibilidade máxima.
- **Labels**: Uppercase, Bold, com espaçamento extra para um ar industrial de luxo.
