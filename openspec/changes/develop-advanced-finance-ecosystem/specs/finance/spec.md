# Especificação Delta: Ecossistema Financeiro Avançado

## Requisitos ADICIONADOS
- **Requisito: Atribuição de Entidade**
  - **Cenário: Vinculando Despesas a Fornecedores**
    - Dado que um administrador está registrando uma despesa de "Ração".
    - Quando ele seleciona um "Fornecedor" no menu suspenso.
    - Então o registro da despesa deve persistir uma referência ao fornecedor para auditoria de custos.
  - **Cenário: Vinculando Vendas a Clientes**
    - Dado que um administrador está registrando uma "Venda de Ovos".
    - Quando ele associa a venda a um "Cliente".
    - Então o sistema deve rastrear o volume total de compras do cliente para análise de CRM.

- **Requisito: Bloqueio Administrativo**
  - **Cenário: Restringindo Edições Financeiras**
    - Dado um usuário com o papel "EMPLOYEE".
    - Quando ele tenta acessar a ação "Editar" em um registro financeiro.
    - Então o sistema deve negar o acesso e mostrar uma mensagem "Contate o Administrador".

- **Requisito: Rastreamento do Ciclo de Vida Financeiro**
  - **Cenário: Gerenciando Contas a Pagar e Receber**
    - Dado que um registro financeiro foi criado.
    - Quando seu status é "PENDENTE".
    - Então ele deve ser destacado visualmente no resumo de "Contas a Pagar/Receber" para alertar sobre o impacto futuro no fluxo de caixa.

## Requisitos MODIFICADOS
- **Requisito: Dashboard Financeiro (Ref 3.4)**
  - **Cenário: Analytics de Alta Densidade**
    - O dashboard agora deve exibir o "Lucro por Ave" subtraindo os custos específicos vinculados a entidades (Funcionários/Fornecedores) das Vendas.
