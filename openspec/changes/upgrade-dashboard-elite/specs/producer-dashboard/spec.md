## ADDED Requirements

### Requirement: O Dashboard do Produtor DEVE ser um Cockpit Bio-Financeiro (Ref 11.x, 14.x)
O Dashboard MUST apresentar de forma consolidada os indicadores biológicos (performance de lotes) e financeiros (fluxo de caixa) seguindo o padrão Luxury Pastel e Executive High-Density.

#### Scenario: Produtor visualiza o Hub Financeiro
- **WHEN** o produtor acessa o Dashboard.
- **THEN** o sistema DEVE exibir cards de Bento Grid com Receita Bruta Mensal, Despesas Totais e Saldo Líquido.

#### Scenario: Ranking de Lotes (Top Performers)
- **WHEN** o sistema processa os dados de produção.
- **THEN** o Dashboard DEVE exibir um ranking dos 3 lotes com maior taxa de postura acumulada no período.

### Requirement: A Sidebar DEVE priorizar a gestão ERP (Ref 15.x)
O menu lateral MUST destacar Clientes, Fornecedores e Funcionários como categorias principais para facilitar o acesso à gestão de parceiros e equipe.

#### Scenario: Navegação ERP rápida
- **WHEN** o usuário interage com a Sidebar.
- **THEN** ele DEVE encontrar Funcionários, Clientes e Fornecedores no topo do menu.
