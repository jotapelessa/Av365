# Proposta: Dashboard Elite V2 (Cockpit Bio-Operacional)

## 🎯 Objetivo
Transformar o dashboard inicial em uma central de inteligência avícola de alta densidade, integrando os novos módulos de Galpões e Tarefas com uma estética de luxo executivo.

## 🏗️ Estrutura Bento Grid (Layout 4-3-1)

### 1. Header & Quick Analytics (Línea de Comando)
- **KPIs Técnicos**: 4 cards de alta visibilidade.
  - Ovos Totais (Hoje)
  - Taxa de Postura (%)
  - Mortalidade Acumulada (%)
  - Conversão Alimentar (FCR) estimada.
- **Sparklines**: Pequenos gráficos de tendência integrados aos cards.

### 2. Hub de Operações (Centro de Ação)
- **Checklist Real**: Lista de tarefas vindas do banco de dados (prioridade do dia).
- **Botões Premium**: Acesso rápido para lançamentos críticos (Mortalidade, Consumo, Coleta).

### 3. Analytics & Infraestrutura (Visão Macro)
- **Gráfico de Produção**: Gráfico de área luxuoso com comparação entre produção real e meta da linhagem.
- **Status da Infraestrutura**: Resumo visual dos galpões (Ocupados, Livres, Alerta).

### 4. Lotes em Destaque
- Cards de lotes com mais informações técnicas: Idade (semanas), Linhagem e Consumo de Água/Ração.

## 🛠️ Mudanças Técnicas
- **Data Fetching**: Buscar tarefas reais e status de galpões via Prisma.
- **Cálculos Avícolas**: Implementar lógica para calcular mortalidade e conversão em tempo real.
- **Estilo**: Aplicar estritamente o `PADRAO_UI_PROJETO.md` (radius 18px, padding p-10, glassmorphism).

## 📅 Cronograma de Implementação
- [x] Fase 1: Backend & Data Preparation (Novas Server Actions).
- [x] Fase 2: Refatoração dos KPIs e Sparklines (Estrutura Base).
- [x] Fase 3: Integração do Hub de Infraestrutura e Tarefas Reais.
- [ ] Fase 4: Polimento Visual & Animações Framer Motion.
