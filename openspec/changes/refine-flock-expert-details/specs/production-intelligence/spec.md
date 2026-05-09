# Spec: Inteligência de Produção do Lote

Esta especificação define o comportamento do motor de cálculos e previsões para a página de detalhes do lote.

## ADDED Requirements

### Requirement: O sistema DEVE calcular a produção agregada (D/W/M) do lote.
The system MUST calculate egg production volumes across three distinct time windows for operational visibility.

#### Scenario: Visualização de Produção Diária
- **Given** um lote com ID `X` e registros para o dia atual.
- **When** o produtor acessa a página do lote.
- **Then** o sistema deve exibir a soma de `eggsTotal` do dia atual.

#### Scenario: Comparativo Semanal vs. Linhagem
- **Given** o lote `X` e o padrão da linhagem `StandardsJson`.
- **When** o sistema calcula a produção média da última semana.
- **Then** deve exibir a porcentagem de eficácia em relação ao padrão esperado para a idade atual.

### Requirement: O sistema DEVE projetar a data de reposição do plantel (Replacement Timer).
The system MUST project the estimated replacement date based on a standard 90-week lifecycle.

#### Scenario: Cálculo de Reposição Padrão
- **Given** um lote com `birthDate` definido.
- **When** o sistema calcula a data de reposição.
- **Then** deve projetar a data para exatas 90 semanas após o nascimento.

### Requirement: O sistema DEVE disparar alertas de anomalia biológica.
The system MUST identify production drops that require immediate intervention.

#### Scenario: Alerta de Queda Brusca
- **Given** uma queda > 10% na produção em relação aos últimos 3 dias.
- **When** a página do lote é carregada.
- **Then** deve exibir um alerta tático de "Anomalia Biológica Identificada".

## MODIFIED Requirements

### Requirement: O Livro de Campo DEVE ser apresentado com layout Elite.
The operational records table MUST follow the project's luxury design standards.

#### Scenario: Tabela Elite
- **Given** o histórico de registros do lote.
- **When** exibido na página de detalhes.
- **Then** deve utilizar layout Glassmorphism com cabeçalhos fixos e tipografia premium.
