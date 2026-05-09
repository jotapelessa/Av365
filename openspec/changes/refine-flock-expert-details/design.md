# Design: Dashboard Bio-Operacional do Lote

O cockpit de detalhes do lote será estruturado para priorizar a **inteligência preditiva** e a **saúde produtiva**.

## 🧬 Motor de Inteligência Biológica

### 1. Cálculos de Produção (D/W/M)
- **Daily**: Soma de `eggsTotal` do registro de hoje.
- **Weekly**: Soma de `eggsTotal` dos últimos 7 dias.
- **Monthly**: Soma de `eggsTotal` dos últimos 30 dias.
- **Meta (Standard)**: Comparação entre a produção real e o `prodRate` definido no `LineageStandard` para a semana de vida atual das aves.

### 2. Estimativa de Queda de Produção
- **Lógica**: Comparar a média móvel de 3 dias (`avgLast3Days`) com a média dos 7 dias anteriores (`avgPrevious7Days`).
- **Alerta de Linhagem**: Se a produção estiver > 5% abaixo do padrão da linhagem (`standardsJson`) para a idade atual, disparar alerta de "Queda Bio-Técnica".

### 3. Replacement Timer (Cronômetro de Reposição)
- **Fórmula**: `ReplacementDate = BirthDate + 90 weeks (630 dias)`.
- **Visual**: Contador regressivo em dias, mudando de cor conforme a proximidade (Verde > 60 dias, Amarelo 30-60 dias, Vermelho < 30 dias).

## 🎨 Estrutura da Interface (Luxury Modern)

### 🧱 Grid 4-2-1 Adaptativo
- **Topo (4 Cards)**: 
  - Produção Hoje (KPI com Sparkline).
  - Performance Semanal (KPI com % vs. Meta).
  - Acumulado Mensal (KPI de volume).
  - Replacement Timer (O contador tático).
- **Meio (2 Blocos)**:
  - Curva de Postura (Gráfico AreaChart 15 dias vs. Padrão Linhagem).
  - Hub de Ambiência (Temperatura/Umidade com Glassmorphism).
- **Base (1 Bloco)**:
  - Livro de Campo (Tabela Elite com scroll horizontal e ações rápidas).

## 🛠️ Tecnologias e Padrões
- **Framer Motion**: Animações de entrada em cascata.
- **Recharts**: Gráficos multilinhas (Real vs. Projetado).
- **Lucide Icons**: Iconografia tática para monitoramento biológico.
- **JSON Serialization**: Tratamento de `Decimal` e `Date` para estabilidade no Client Side.
