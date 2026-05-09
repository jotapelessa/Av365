# Spec Delta: Padronização UI/UX Agrotech

## MODIFIED Requirements

### Requirement: Ref 2.11 – Adesa ao Guia de Estilo Oficial
Toda nova interface SHALL seguir rigorosamente as definições de cores, tipografia e componentes estabelecidas no arquivo `PADRAO_UI_PROJETO.md`.

#### Scenario: Novo Dashboard Analítico
- **WHEN** um novo dashboard é solicitado pela IA ou desenvolvedor
- **THEN** o sistema SHALL utilizar os mixins de tipografia e paleta pastel para garantir harmonia visual.

### Requirement: Ref 2.12 – Uso Obrigatório de Design Tokens
O uso de valores literais de cor (hex/rgb) ou espaçamento (px/rem) SHALL ser proibido fora dos arquivos de tokens abstratos.

#### Scenario: Estilização de Novo Card
- **WHEN** um componente de card é criado
- **THEN** ele SHALL referenciar tokens oficiais como `$spacing-md` e `$radius-lg` para garantir consistência.

## ADDED Requirements

### Requirement: Ref 2.13 – Padrão Bento Grid para Dashboards
Telas analíticas SHALL utilizar o padrão Bento Grid com animações de entrada escalonadas (*staggered animations*).

#### Scenario: Estrutura de Dashboard Financeiro
- **WHEN** o dashboard de finanças é renderizado
- **THEN** ele SHALL ser estruturado em blocos `BentoItem` com pesos visuais equilibrados e animações fluidas.

### Requirement: Ref 2.14 – Tabelas de Alta Densidade (High-Density)
Tabelas operacionais SHALL priorizar a densidade de informação, usando cabeçalhos em `uppercase` e `font-black`.

#### Scenario: Visualização de Histórico de Vendas
- **WHEN** a tabela de vendas é exibida
- **THEN** ela SHALL exibir múltiplos KPIs por linha usando tipografia compacta e selos de status padronizados.
