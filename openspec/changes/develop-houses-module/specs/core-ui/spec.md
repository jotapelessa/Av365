# Spec Delta: UI Core e Métricas para Galpões

## ADDED Requirements

### Requirement: Visualização de Galpão Elite
O sistema MUST exibir os galpões usando cards de alta fidelidade que seguem estritamente o `PADRAO_UI_PROJETO.md`.

#### Scenario: Consistência Visual
- **Dado** que o usuário está na página `/houses`.
- **Então** cada card de galpão deve ter exatamente `18px` de border radius.
- **E** o padding deve ser `p-10`.
- **E** o fundo deve usar os tokens de glassmorphism definidos.

### Requirement: Cálculo Dinâmico de Densidade
O sistema MUST calcular e exibir a densidade de aves (aves/m²) para cada galpão habitado.

#### Scenario: Precisão do Cálculo
- **Dado** um galpão com `12m` de largura e `100m` de comprimento (1200m²).
- **And** que ele está habitado por um lote de `12.000` aves.
- **Então** o card deve exibir uma densidade de `10,00 aves/m²`.
- **And** o valor deve estar formatado no locale `pt-BR`.

### Requirement: Gestão de Status Sanitário
O sistema MUST diferenciar visualmente os galpões com base em seu status operacional.

#### Scenario: Identificação de Status
- **Dado** que um galpão está em "Vazio Sanitário".
- **Então** o card deve mostrar um badge "Pronto para Alojamento" com estilo esmeralda.
- **And** deve exibir o número de dias desde a última sanitização.

### Requirement: Segurança em Ações Críticas
Ações destrutivas em registros de galpões MUST exigir uma camada extra de confirmação.

#### Scenario: Excluindo um Galpão
- **Dado** que o usuário clica no botão "Excluir" em um card de galpão.
- **Então** o botão deve mudar para "Confirmar?" e iniciar uma contagem regressiva de 3s.
- **And** apenas um segundo clique dentro desta janela disparará a exclusão.
- **And** a exclusão MUST ser bloqueada se o galpão possuir um lote ativo vinculado.
