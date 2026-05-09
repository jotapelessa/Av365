# Design: Inteligência Avícola no Cadastro de Lotes

## Visão do Especialista
Um lote de aves é o ativo biológico mais importante da granja. Sua gestão começa no "dia 0". A omissão de dados de entrada impossibilita análises avançadas de performance.

### 1. Finalidade (Purpose)
- **POSTURA**: Ativa dashboards de produção de ovos, taxa de quebra e qualidade de casca.
- **CORTE**: Ativa dashboards de ganho de peso diário (GPD) e conversão alimentar carnea.
- **RECRIA**: Foca no desenvolvimento da ave antes da maturidade produtiva.

### 2. Cronologia Biológica (Idade e Nascimento)
Registrar a **Idade na Chegada** e a **Data de Nascimento** permite que o sistema projete automaticamente as janelas de vacinação e as fases de ração (ex: Inicial, Crescimento, Produção).

### 3. Biometria Inicial (Peso)
O peso na chegada é o primeiro indicador de qualidade do fornecedor e o ponto de partida para a curva de crescimento. Sem isso, o cálculo de conversão alimentar (Feed Conversion Ratio - FCR) é impreciso.

### 4. Inteligência Financeira (Preço Unitário)
Capturar o **Preço Unitário** permite ao sistema calcular a depreciação do lote ao longo dos meses. A integração automática com o financeiro garante que o investimento em "imobilizado biológico" (aves) seja computado no fluxo de caixa no momento do alojamento.

### 5. Gestão de Espaço e Sanitária (Galpões)
Vincular o lote a um galpão no cadastro garante que o inventário de capacidade do produtor esteja sempre atualizado, prevenindo superpopulação e problemas sanitários.
