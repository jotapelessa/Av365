# Proposta: Gestão Profissional de Lotes (Elite Avicultura)

## Contexto e Objetivos
O cadastro atual de lotes captura apenas informações nominais. Para uma gestão de precisão (Agrotech), é vital registrar os marcos zero biológicos e financeiros do lote. Esta proposta visa expandir o cadastro de lotes para incluir dados detalhados de linhagem, fornecedor, biometria inicial e inteligência financeira automática.

## Mudanças Propostas

### 1. Modelo de Dados (Prisma)
- **Finalidade (`purpose`)**: Enum (POSTURA, CORTE, RECRIA).
- **Linhagem/Raça (`breed`)**: Nome da genética (ex: Lohmann Brown, Hy-Line, Ross 308).
- **Fornecedor (`supplier`)**: Nome/Empresa de origem das aves.
- **Idade na Chegada (`ageAtArrival`)**: Idade em dias no momento do alojamento.
- **Data de Nascimento (`birthDate`)**: Para controle preciso da idade fisiológica.
- **Data de Aquisição (`acquisitionDate`)**: Data em que o lote chegou à granja.
- **Preço Unitário (`unitPrice`)**: Custo por ave.
- **Custo Total (`totalCost`)**: Calculado (`initialQuantity * unitPrice`).
- **Peso Inicial (`initialWeight`)**: Peso médio na chegada (gramas).
- **Vínculo com Galpão**: Associação ao espaço físico.

### 2. Interface (UI/UX Elite)
- **Grid de Dados**: Organização em 3 colunas para manter a densidade sem perder a clareza.
- **Calculadora em Tempo Real**: Mostrar o Custo Total enquanto o produtor digita o Preço Unitário.
- **Seletores Inteligentes**: Dropdown para Finalidade e Galpões.

### 3. Lógica de Negócio (Actions)
- Criar automaticamente uma `Expense` (Despesa) vinculada ao lote com o valor do `totalCost`.
- Validar se a capacidade do galpão selecionado suporta o `initialQuantity`.

## Resultados Esperados
- Visão real do investimento inicial por lote.
- Rastreabilidade total da performance por fornecedor e idade.
- Automatização do lançamento financeiro de entrada.
