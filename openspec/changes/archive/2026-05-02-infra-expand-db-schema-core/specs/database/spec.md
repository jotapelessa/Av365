# Spec Delta: Expansão do Schema de Banco de Dados

## ADDED Requirements

### Requirement: O sistema DEVE permitir a definição de planos de assinatura com limites operacionais (Ref 8.x).
O modelo de dados DEVE suportar a criação de múltiplos planos de serviço (ex: Bronze, Silver, Gold), onde cada plano MUST definir quotas específicas para o número de aves, usuários e galpões permitidos para o tenant.

#### Scenario: Super Admin cria um novo plano
- **Given** que o Super Admin acessa o painel de faturamento.
- **When** ele define um plano "Profissional" com limite de 10.000 aves e 5 galpões.
- **Then** o banco de dados deve persistir esses limites na tabela `SubscriptionPlan`.

### Requirement: Cada saída de insumo DEVE ser rastreável a um lote ou galpão específico (Ref 13.x).
A estrutura de inventário DEVE possibilitar o vínculo de transações de saída diretamente a um lote de aves ou a um galpão físico, e MUST garantir que o cálculo do custo de produção seja automatizado com base nesses registros.

#### Scenario: Registro de consumo de ração
- **Given** um lote de aves alojado no Galpão 01.
- **When** o produtor registra o consumo de 100kg de ração.
- **Then** uma transação deve ser criada em `InventoryMovement` vinculando a saída ao `FlockId` correspondente.

### Requirement: Toda alteração em dados críticos DEVE ser registrada para auditoria (Ref 9.x).
O banco de dados DEVE possuir uma tabela de logs centralizada que MUST armazenar o autor, o IP, a data e o estado anterior/posterior de qualquer entidade modificada no sistema.

#### Scenario: Alteração de papel de usuário
- **Given** que um Super Admin altera a role de um usuário de `PRODUCER` para `VETERINARIAN`.
- **When** a alteração é salva.
- **Then** um novo registro em `AuditLog` deve capturar o estado anterior e o novo estado da entidade.

### Requirement: O sistema DEVE permitir o registro rigoroso de vacinações e emitir alertas de saúde (Ref 12.x).
DEVEM existir modelos específicos para capturar o histórico sanitário, e o sistema MUST permitir registrar quais vacinas foram aplicadas em quais aves, garantindo a rastreabilidade total do manejo.

#### Scenario: Registro de vacinação obrigatória
- **Given** um lote ativo com idade de 10 semanas.
- **When** o veterinário aplica uma vacina.
- **Then** o sistema deve registrar a data, o lote de vacina utilizado e o aplicador em `VaccinationRecord`.
