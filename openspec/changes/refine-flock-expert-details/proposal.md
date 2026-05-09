# Proposta: Refino de Detalhes do Lote (Especialista em Avicultura)

Esta proposta visa transformar a página de detalhes do lote em um cockpit de inteligência biológica e operacional, seguindo o `PADRAO_UI_PROJETO.md`.

## 🎯 Objetivos
- **Visibilidade de Produção (D/W/M)**: Implementar cards de resumo de ovos coletados por dia, semana e mês.
- **Predição de Performance**: Calcular estimativas de queda de produção baseadas na linhagem (breed) e idade das aves.
- **Gestão de Ciclo de Vida**: Adicionar um contador regressivo (Replacement Timer) para reposição de pintainhas.
- **Excelência em UI/UX**: Refatorar tabelas, cards e formulários para o padrão Luxury Modern.

## 🛠️ Mudanças Técnicas
- **Server Actions**: Criar/Ajustar funções para cálculos estatísticos de produção agrupada (Daily, Weekly, Monthly).
- **Componentes Táticos**:
  - `FlockVitalStats`: Novo componente para métricas D/W/M.
  - `ProductionPrediction`: Componente de inteligência biográfica da ave.
  - `ReplacementCountdown`: Timer tático de renovação de plantel.
- **Refino de UI**:
  - Tabelas com Glassmorphism e hover effects.
  - Animações Staggered no carregamento dos dados.

## 📦 Entregáveis
1. **Bio-Stats Hub**: Painel superior com 3 KPIs densos de produção.
2. **Predictive Analytics**: Seção de projeção de postura vs. linhagem padrão.
3. **Replacement Monitor**: Widget de contagem regressiva para renovação.
4. **Elite Table**: Refatoração do Livro de Campo com filtros e visualização premium.

## 🛡️ Segurança de Dados
- Garantir que todos os cálculos de agregados (sum/avg) considerem apenas o lote atual e o tenant do produtor.
- Validação rigorosa dos tipos `Decimal` para evitar erros de hidratação.

---
*Assinado: Especialista em Avicultura & Engenharia de Elite* 🐣🛡️✨
