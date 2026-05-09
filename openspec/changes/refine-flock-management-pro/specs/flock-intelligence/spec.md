# Especificação: Inteligência de Lotes

## ADDED Requirements

### Requirement: KPIs de Desempenho Especialista
The system SHALL calculate and display expert poultry KPIs including Viability (%), Daily Intake (g/bird/day), and Feed Conversion Ratio (FCR).
#### Scenario: Calculando Viabilidade e Consumo
- **Dado** um lote com 10.000 aves iniciais.
- **Quando** a mortalidade total é 200.
- **Então** a UI deve exibir uma **Viabilidade** de 98,0%.
- **Quando** 1.100 kg de ração são consumidos em um dia por 9.800 aves.
- **Então** a UI deve exibir um **Consumo** de 112,2 g/ave/dia.

### Requirement: Lançamento Retroativo de Produção
The system SHALL allow producers to record production and mortality for dates other than the current day.
#### Scenario: Registrando produção para uma data anterior
- **Dado** que a data atual é 02/05/2026.
- **Quando** um produtor seleciona 01/05/2026 no formulário de registro.
- **Then** o registro deve ser persistido com a data de 01/05/2026.

### Requirement: Sincronização de Inventário
The system SHALL automatically deduct feed consumption from the inventory stock whenever a production record is created.
#### Scenario: Atualização automática de estoque de ração
- **Dado** um item de inventário "Ração Postura" com 5.000 kg.
- **Quando** um produtor registra um consumo de 1.200 kg para um lote.
- **Then** o estoque de inventário deve ser automaticamente atualizado para 3.800 kg.
- **And** um `InventoryMovement` do tipo `OUT` deve ser criado.

### Requirement: Mortality Guard
The system MUST prevent users from recording mortality counts that exceed the current number of birds in the flock.
#### Scenario: Prevenindo contagens de mortalidade inválidas
- **Dado** um lote com 50 aves restantes.
- **Quando** um produtor tenta registrar 51 mortes.
- **Then** o sistema deve rejeitar a operação com um erro de validação.

## MODIFIED Requirements

### Requirement: Dashboard Visualization (Ref 3.x)
The dashboard and detail views SHALL include dense analytical visualizations using multi-metric cards and dual-axis charts.
#### Scenario: Visualizando nutrição vs produção
- **Dado** uma página de detalhes do lote.
- **Quando** visualizando o gráfico de desempenho.
- **Then** o sistema MUST exibir tanto a taxa de produção quanto o consumo de ração em um gráfico de linhas de eixo duplo para permitir a análise de correlação.
