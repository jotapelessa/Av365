## ADDED Requirements

### Requirement: Modular Dashboard Grid
O dashboard SHALL ser construído sobre um sistema de grid modular que suporta cards de diferentes tamanhos (1x1, 2x1, 2x2) mantendo o alinhamento rígido.

#### Scenario: Card responsiveness
- **WHEN** o dashboard é visualizado em um dispositivo móvel
- **THEN** o sistema SHALL empilhar os cards verticalmente respeitando um gap de 24px.

### Requirement: Standardized Spacing Scale
O sistema SHALL utilizar exclusivamente uma escala de espaçamento baseada em múltiplos de 8px para margens e paddings.

#### Scenario: Visual breathing
- **WHEN** um card de métrica (KPI) é renderizado
- **THEN** ele SHALL possuir um padding interno de 40px para garantir a estética de luxo.

### Requirement: Dynamic Operational Feed
O dashboard SHALL exibir um feed operacional dinâmico que integra tarefas pendentes e alertas de saúde do lote.

#### Scenario: Alert visibility
- **WHEN** uma queda de postura > 5% é detectada
- **THEN** o dashboard SHALL exibir um alerta crítico (Rose/Red) no feed operacional com link direto para o lote afetado.
