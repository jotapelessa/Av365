# 🐣 AV365: Proposta de Continuidade - Expansão Operacional Elite

Esta fase foca em fechar as lacunas de controle total e refinamento estético para o produtor e seus funcionários.

## 📦 1. Estoque Advanced (Controle de Validade & Lote) (EM ANDAMENTO)
Otimização do fluxo de entrada via NF-e para incluir dados críticos de segurança alimentar e custo.

- [ ] **Data Model Extension**:
    - Adicionar `batchNumber` (lote) e `expiryDate` (validade) ao `InventoryMovement`.
- [ ] **Alerta de Validade**:
    - Criar widget no dashboard de estoque para itens com vencimento em < 30 dias.
- [ ] **UI de Entrada NF-e**:
    - Adicionar campos de lote e validade na tela de conciliação de produtos.

## 📅 2. Task Orchestrator (Orquestração Avançada) (EM ANDAMENTO)
Transformar a agenda em uma ferramenta de gestão de recursos humanos dinâmica.

- [ ] **Fluxos de Status**:
    - **Pausa**: Implementar botão de pausa com registro de "tempo parado" ou status visual claro.
    - **Transferência**: Modal para delegar tarefa a outro funcionário ou vincular a outro galpão.
- [ ] **Recorrência Inteligente**:
    - Gerador de tarefas recorrentes (Diário, Semanal, Mensal, Bimestral, Semestral, Anual).
    - Implementar lógica para criar instâncias de tarefas futuras no banco de dados.

## 📱 3. Modo Campo Pro Max (UI Industrial) (EM ANDAMENTO)
Refinar a interface do funcionário para máxima eficiência em condições de campo.

- [ ] **UI High-Contrast**:
    - Aumentar hit-targets (botões) e usar fontes de alta legibilidade.
    - Estética "Industrial Luxury": Tons de slate escuro com acentos em Neon (Emerald para sucesso, Amber para pendência).
- [ ] **Fluxo de Conclusão Rápida**:
    - Checklist simplificado com feedback tátil (animações Framer Motion).

## 💉 4. Saúde & Vigor (Dashboard Técnico)
- [ ] **Curva de Crescimento**:
    - Gráfico de Peso Real vs Peso Padrão da Linhagem (se disponível no registro diário).
