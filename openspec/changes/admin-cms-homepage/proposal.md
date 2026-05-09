# Proposta: CMS Admin e Gestão de Assinaturas SaaS

## Motivação
Um SaaS de elite exige que o Super Admin tenha controle absoluto não apenas sobre o conteúdo, mas sobre a saúde financeira e o ciclo de vida dos clientes. Esta proposta expande o banco de dados para permitir a gestão manual e detalhada de todas as assinaturas do ecossistema EggTrack.

## Mudanças Propostas
### 1. Banco de Dados & Gestão de Assinaturas (Nível Enterprise)
Para evitar bugs e permitir o controle total, propomos a seguinte estrutura:

- **Configuração Global (`GlobalConfig`)**:
  - CMS da Homepage e Status de Manutenção.
  
- **Assinaturas Detalhadas (`Subscription`)**:
  - `status`: Evolução para `ACTIVE`, `PAUSED`, `CANCELED`, `PAST_DUE`, `TRIAL`.
  - `currentPeriodEnd`: Data exata do próximo faturamento.
  - `cancelAtPeriodEnd`: Booleano para cancelamentos programados.
  - `stripeSubscriptionId`: Link opcional com o gateway para sincronização automática.
  
- **Histórico de Faturamento (`Invoice`)**:
  - Tabela para registrar cada transação: `amount`, `status` (PAID, PENDING, FAILED), `billingDate`, `invoiceUrl`.
  
- **Ações de Super Admin (Controladores)**:
  - **Pausar**: Bloqueia o acesso do produtor sem deletar os dados.
  - **Cancelar**: Encerra o ciclo de faturamento e marca para deleção após 30 dias.
  - **Criar Manualmente**: Permite ao Admin dar acesso VIP ou Trial estendido para produtores estratégicos.

### 2. Cockpit Super Admin (Novas Capacidades)
- **Painel de Clientes**: Lista detalhada com status de pagamento em tempo real.
- **Controle de Ciclo de Vida**: Botões de ação rápida (Pausar/Reativar/Cancelar) em cada perfil de produtor.
- **Log de Auditoria Financeira**: Registro de quem alterou o status de uma assinatura para evitar fraudes ou erros.

### 3. Integração e Segurança
- **Middleware de Bloqueio**: O `proxy.ts` agora verifica se a assinatura está `PAUSED` ou `CANCELED` para impedir o acesso à operação.
- **Sincronização com Stripe**: Webhooks que atualizam esses mesmos modelos para garantir que o Admin e o Gateway falem a mesma língua.

## Critérios de Aceitação
- [ ] Super Admin visualiza o histórico de pagamentos de qualquer produtor.
- [ ] O Admin pode pausar uma assinatura e o produtor perde acesso ao dashboard instantaneamente.
- [ ] Mudanças manuais de assinatura são refletidas nos limites de recursos (lotes/galpões).
- [ ] Log de auditoria registra o motivo de cada cancelamento/pausa manual.
