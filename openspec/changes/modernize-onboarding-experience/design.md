# Design: Configuração de Elite e Arquitetura de UI

## Mudanças Arquiteturais

### 1. O Novo Fluxo de Roteamento (Proxy Inteligente)
O `src/proxy.ts` deixará de ser apenas um middleware de bloqueio e passará a ser um roteador inteligente:
- **Detecção de Superadmin**: Se o metadado do Clerk ou o banco indicar `role === 'SUPER_ADMIN'`, redireciona para `/admin` sem passar pelo onboarding.
- **Detecção de Produtor Ativo**: Se `producerId` existir no banco/clerk, redireciona para `/dashboard`.
- **Filtro de Novos Usuários**: Se autenticado mas sem `producerId`, redireciona para `/setup`.

### 2. O Assistente de Configuração (Setup Wizard)
O `/setup` será o portal de entrada comercial e técnica:
1.  **Etapa Comercial**: Exibição dos planos de assinatura. A escolha do plano vincula o usuário a uma intenção de assinatura no Stripe.
2.  **Etapa Técnica (Especialista)**: Coleta de dados zootécnicos.
3.  **Etapa de Finalização**: Sincronização Clerk & DB.

### 3. Dados de Especialista em Avicultura
Como especialista em avicultura, a configuração incluirá:
- **Linhagem**: Essencial para curvas de produção (ex: Lohmann, Hy-Line, Ross).
- **Finalidade**: Postura (Ovos), Recria (Frangas), Corte (Carne).
- **Sistema de Alojamento**: Gaiola, Piso, Caipira.

## Implementação dos Padrões de UI/UX

### Bento Cards Elite
Cada card utilizará:
```css
.bento-card-elite {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2.5rem; /* p-10 */
}
```

### Elementos de Formulário Premium
- Inputs com labels flutuantes (estilo meta-data).
- Indicadores de progresso para as etapas do assistente.

## Proteção da Integridade de Dados
- **Operações Atômicas**: Se a atualização no Clerk falhar, devemos tratar o rollback (ou vice-versa).
- **Geração de Slug**: Geração automática de slug a partir do Nome da Granja para futuro suporte a subdomínios.
