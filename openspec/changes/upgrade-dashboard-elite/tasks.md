# Tarefas: Upgrade Dashboard Elite

## Fase 1: Estrutura e Navegação
- [x] Mover Funcionários, Clientes e Fornecedores para o topo da Sidebar.
- [x] Atualizar ícones e rotas de navegação ERP.

## Fase 2: Motor de Dados (Server Actions)
- [x] Implementar `getTopPerformers` com cálculo de produtividade real.
- [x] Integrar agregação financeira (Sales/Expenses) no `getDashboardStats`.
- [x] Blindar serialização de tipos Prisma (Decimal/Date) para RSC.

## Fase 3: Interface Elite (UI/UX)
- [x] Implementar Bento Grid Financeiro (Receita, Despesa, Saldo).
- [x] Criar componente `TopPerformersHub` com pódio visual.
- [x] Reconfigurar `DashboardQuickActions` para workflow de especialista avícola.
- [x] Implementar visualização de sensores de ambiência (Temperatura/Umidade) em tempo real.

## Fase 4: Validação e Refinamento
- [x] Testar responsividade do novo layout Grid.
- [x] Validar cálculos financeiros com massa de dados de 1 ano.
- [x] Executar `openspec validate upgrade-dashboard-elite --strict`.
