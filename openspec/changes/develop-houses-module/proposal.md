# Proposta: Desenvolvimento do Módulo de Galpões de Elite (Aviários)

## 🐣 Visão Geral
Transformar a seção `/houses` em um hub profissional de gestão avícola. Este módulo gerenciará a infraestrutura física (galpões), vinculando-os aos lotes biológicos, monitorando o status operacional e calculando métricas técnicas como densidade e eficiência de equipamentos.

## 🎯 Objetivos
1. **UI/UX de Elite**: Padronizar a interface seguindo o `PADRAO_UI_PROJETO.md` (Raio de 18px, Grid 4-3-1, Padding p-10).
2. **Precisão Técnica**: Capturar métricas profissionais (dimensões, tipo de equipamento, densidade).
3. **Fluxo Operacional**: Gerenciar o ciclo de vida de um galpão (Ocupado, Vazio Sanitário, Manutenção).
4. **Integridade de Dados**: Aprimorar o schema do banco de dados para suportar estas funcionalidades profissionais.

## 🛠️ Mudanças Propostas

### 1. Schema do Banco de Dados (Prisma)
- **Dimensões**: Adicionar `width` (largura) e `length` (comprimento) para calcular área.
- **Tipo de Sistema**: Adicionar `housingSystem` (Enum: CONVENCIONAL, AUTOMATIZADO, DARK_HOUSE).
- **Equipamentos**: Adicionar flags para `hasClimateControl` (climatização) e `hasAutomatedFeeding` (alimentação automática).
- **Status Sanitário**: Adicionar `lastSanitizationDate` (data da última sanitização).

### 2. Refinamento de UI/UX
- **Cards de Galpão**:
  - Cards Elite de 18px com Grid 4-3-1.
  - Cálculo de densidade em tempo real (`quantidade_aves_atual / (largura * comprimento)`).
  - Badges de status com estilo de luxo (Vazio Sanitário, Ativo, Manutenção).
- **Dashboard de Gestão**:
  - Cards de resumo no topo (Capacidade Total, Área Total, Galpões Ativos).
  - Botões de acesso rápido para "Lançar Registro Diário" para o galpão específico.
- **Formulário (Estilo Elite)**:
  - Campos agrupados (Informações Gerais, Especificações Técnicas, Equipamentos).
  - Preview interativo de densidade conforme o usuário digita a capacidade e dimensões.

### 3. Padrões Técnicos
- **Locale**: Forçar `pt-BR` para todas as medidas de área e capacidade.
- **Segurança**: Confirmação em 2 passos para desativação de galpões ou atualizações críticas.

### 4. Página de Detalhes do Galpão (`/houses/[id]`)
- **Dashboard de Unidade**: Visão focada em um único galpão com métricas de ambiência específicas.
- **Gestão de Vazio Sanitário**: Contador visual para o período de descanso sanitário após a saída de um lote.
- **Histórico de Lotes**: Lista de lotes anteriores que passaram por aquela infraestrutura.
- **Manutenção & Ativos**: Seção para agendar reparos em equipamentos específicos (climatizadores, silos, correias).

## ✅ Critérios de Sucesso
- Implementação pixel-perfect seguindo o padrão "Luxury Modern".
- Cálculo automático de densidade funcionando corretamente.
- Integração perfeita com o modelo `Flock` (Lote) existente.
