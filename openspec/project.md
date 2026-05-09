# OpenSpec – Agrotech SaaS (EggTrack)
## Especificação completa para desenvolvimento orientado por IA

## Visão geral
Este documento especifica cada aspecto da plataforma EggTrack, desde a visão do produto até detalhes de implementação. Cada seção é imutável e rastreável (Ref).

---

## 1. Introdução e posicionamento

### Ref 1.1 – Plataforma e marca
- **Descrição**: Agrotech SaaS, marca EggTrack, digitalização do setor avícola.
- **Requisito**: Oferecer solução integrada para produtores de todos os portes.
- **Critério**: Produtores com menos de 500 aves até grandes granjas devem encontrar valor.

### Ref 1.2 – Origem
- **Descrição**: Modernizar processos manuais (planilhas, anotações físicas).
- **Requisito**: Eliminar papel e erros de transcrição.
- **Critério**: Migrar dados históricos de planilhas via importação CSV.

### Ref 1.3 – Interface e recursos
- **Descrição**: Visão clara desde saúde das aves até rentabilidade.
- **Requisito**: Dashboard unificado com KPIs de produção, sanidade, financeiro.
- **Critério**: Tempo para visualizar lucro do dia < 3 segundos.

### Ref 1.4 – Eficiência operacional
- **Descrição**: Decisões baseadas em dados reais e atualizados em tempo real.
- **Requisito**: Dados de produção devem ser sincronizados em até 1 minuto após registro.
- **Critério**: Webhooks ou polling eficiente.

### Ref 1.5 – Escalabilidade
- **Descrição**: Arquitetura que suporta crescimento sem perda de performance ou segurança.
- **Requisito**: Suporte horizontal para 10x mais usuários sem alteração de código.
- **Critério**: Teste de carga com 10.000 tenants simultâneos.

### Ref 1.6 – Documento guia
- **Descrição**: Este documento é o guia técnico e funcional definitivo.
- **Requisito**: Manter este spec como fonte única da verdade.
- **Critério**: Qualquer decisão de implementação deve referenciar a Ref correspondente.

### Ref 1.7 – Nome EggTrack
- **Descrição**: Rastreamento completo de cada lote de produção.
- **Requisito**: Rastreabilidade desde o ovo até o consumidor.
- **Critério**: Gerar QR code por lote com auditoria de qualidade.

### Ref 1.8 – Parceiro estratégico
- **Descrição**: Insights de mercado e otimização de custos fixos/variáveis.
- **Requisito**: Módulo de recomendações com base em histórico e benchmarks.
- **Critério**: Sugestão automática de redução de custo por dúzia.

### Ref 1.9 – Segurança como prioridade
- **Descrição**: Camadas de proteção contra acessos não autorizados e falhas sistêmicas.
- **Requisito**: Implementar segurança em camadas (rede, aplicação, dados).
- **Critério**: Análise de vulnerabilidade semestral + testes de penetração.

### Ref 1.10 – Transformação digital
- **Descrição**: Ferramenta que capacita produtor a novos níveis de profissionalismo e lucratividade.
- **Requisito**: Onboarding com tutorial interativo e metas de lucro personalizáveis.
- **Critério**: Aumento médio de 15% na margem líquida dos primeiros 6 meses (self-report).

---

## 2. Base tecnológica

### Ref 2.1 – Next.js (App Router)
- **Tecnologia**: Next.js última versão estável com App Router.
- **Decisão**: Renderização híbrida (SSR/SSG/ISR) e navegação fluida.
- **Critério**: Lighthouse Performance score ≥ 90 em rotas principais.

### Ref 2.2 – TypeScript
- **Tecnologia**: TypeScript 5+ com strict mode.
- **Decisão**: Erros de tipo em tempo de compilação.
- **Critério**: Zero `any` no código aprovado em PR.

### Ref 2.3 – Prisma + PostgreSQL (Supabase)
- **Tecnologia**: Prisma ORM, PostgreSQL via Supabase.
- **Decisão**: Consultas tipadas e migrações versionadas.
- **Critério**: Tempo médio de query < 100ms em 95% das operações.

### Ref 2.4 – SASS Modules
- **Tecnologia**: SASS com CSS Modules.
- **Decisão**: Isolamento de estilos, sem vazamento de CSS.
- **Critério**: Build de CSS otimizado sem conflitos de classe.

### Ref 2.5 – Clerk para autenticação
- **Tecnologia**: Clerk SDK + webhooks.
- **Decisão**: MFA, sessões seguras, gerenciamento de usuários pronto.
- **Critério**: Login via Google, email/senha, 2FA opcional.

### Ref 2.6 – Stripe para pagamentos
- **Tecnologia**: Stripe Billing + Customer Portal.
- **Decisão**: Assinaturas recorrentes, webhooks de evento.
- **Critério**: Sincronização de status de pagamento < 5 segundos.

### Ref 2.7 – Lucide React + Framer Motion
- **Tecnologia**: Lucide para ícones, Framer Motion para animações.
- **Decisão**: Interface visualmente atraente e interativa.
- **Critério**: Animações com duração ≤ 200ms e respeitando `prefers-reduced-motion`.

### Ref 2.8 – API RESTful
- **Decisão**: Rotas protegidas com validação de permissão por usuário.
- **Requisito**: Documentação OpenAPI gerada automaticamente.
- **Critério**: Cada endpoint retorna status HTTP correto e mensagem de erro padronizada.

### Ref 2.9 – Vercel deployment (Edge Functions)
- **Decisão**: Edge Functions para baixa latência global.
- **Requisito**: Conteúdo estático servido do CDN mais próximo.
- **Critério**: TTFB médio < 80ms (global).

### Ref 2.10 – Equilíbrio performance, segurança, velocidade
- **Decisão**: Ciclo de iterações rápidas baseado em feedback.
- **Requisito**: Feature flags para deploy contínuo.
- **Critério**: Deploy em produção até 3x por dia sem downtime.

### Ref 2.11 – Elite Design System (Executive High-Density)
- **Descrição**: Estética executiva de luxo com alta densidade de informação para tomada de decisão rápida.
- **Requisito**: Uso de tipografia `font-black`, `uppercase` para metadados e hierarquia visual clara.
- **Critério**: Interfaces devem transmitir autoridade e precisão técnica.

### Ref 2.12 – Dynamic Design DNA (Tokens)
- **Descrição**: Interface regida por tokens dinâmicos injetados no `:root`.
- **Requisito**: Uso obrigatório da classe `.ui-card` e componentes `DashboardGrid`/`DashboardCard`.
- **Variáveis**: `--radius-ui`, `--spacing-ui-gap`, `--spacing-ui-padding` (gerenciados via Super Admin).
- **Critério**: 100% da interface deve responder às mudanças de arredondamento e espaçamento em tempo real sem refatoração.

---

## 3. Arquitetura multi-tenant

### Ref 3.1 – Isolamento de dados
- **Decisão**: Mesma infraestrutura, dados isolados por tenant.
- **Requisito**: Cada produtor tem `producerId` único.
- **Critério**: Teste de cross-tenant: usuário A não vê dados de B.

### Ref 3.2 – Vinculação no banco
- **Decisão**: Toda tabela de domínio possui coluna `producerId`.
- **Requisito**: Inserções automáticas do ID via contexto da sessão.
- **Critério**: Auditoria garante que nenhuma query esquece o filtro.

### Ref 3.3 – Row Level Security (RLS)
- **Tecnologia**: PostgreSQL RLS no Supabase.
- **Decisão**: Políticas que usam `current_setting('app.producer_id')`.
- **Critério**: Mesmo se aplicação falhar, banco impede vazamento.

### Ref 3.4 – Middlewares e extensões Prisma
- **Decisão**: Extensão Prisma que injeta `producerId` em todas as consultas.
- **Requisito**: Desenvolvedor não precisa lembrar de adicionar `where: { producerId }`.
- **Critério**: Log de queries mostra filtro aplicado.

### Ref 3.5 – Relatórios e agregações seguras
- **Decisão**: Operações complexas respeitam contexto de tenant.
- **Requisito**: Funções de agregação (SUM, AVG) devem ser escopadas.
- **Critério**: Teste de integridade com dados mistos.

### Ref 3.6 – Configurações por tenant
- **Decisão**: Cada granja tem preferências de notificação e interface.
- **Requisito**: Tabela `producer_settings` JSONB.
- **Critério**: Alteração em uma granja não afeta as demais.

### Ref 3.7 – Escalabilidade horizontal
- **Decisão**: Adicionar novo produtor = apenas um registro no banco.
- **Requisito**: Sem provisionamento de nova VM/container.
- **Critério**: Onboarding de 1000 produtores em 1 minuto.

### Ref 3.8 – Atualizações globais
- **Decisão**: Migrações e feature flags atingem todos os tenants simultaneamente.
- **Requisito**: Rollback rápido via flag.
- **Critério**: Tempo de rollback < 2 minutos.

### Ref 3.9 – Monitoramento individual
- **Decisão**: Métricas de performance por tenant (uso de CPU, IO, queries).
- **Requisito**: Alertas quando um tenant excede limite razoável.
- **Critério**: Isolamento de tenant ruidoso (throttling).

### Ref 3.10 – Redução de custos e preço competitivo
- **Decisão**: Multi-tenant reduz custo operacional, repassado ao produtor.
- **Requisito**: Plano inicial a partir de R$ 49/mês.
- **Critério**: Margem bruta > 70% após 1 ano.

---

## 4. Painel do Super Admin

### Ref 4.1 – Centro de comando
- **Funcionalidade**: Visão holística da plataforma em tempo real.
- **Requisito**: Widgets de saúde do sistema e negócio.
- **Critério**: Atualização automática a cada 30s.

### Ref 4.2 – Layout cockpit executivo
- **Decisão**: Métricas críticas em destaque (MRR, Churn, AOV).
- **Requisito**: Gráficos comparativos mês a mês.
- **Critério**: Exportável para CSV/PDF.

### Ref 4.3 – Paleta Luxury Admin
- **Design**: Indigo, Dark Grey, toques de esmeralda/violeta.
- **Requisito**: Tema escuro padrão, com opção de claro.
- **Critério**: Contraste WCAG AA.

### Ref 4.4 – Monitoramento de APIs e banco
- **Widgets**: Status de APIs externas (Stripe, Clerk, Supabase), latência do banco.
- **Requisito**: Alertas de degradação.
- **Critério**: Notificação por e-mail se latência > 500ms por 5 min.

### Ref 4.5 – MRR e LTV
- **Exibição**: Receita Recorrente Mensal e Lifetime Value.
- **Requisito**: Cálculo automático baseado em assinaturas ativas e histórico de cancelamento.
- **Critério**: MRR atualizado via webhook do Stripe.

### Ref 4.6 – Feed de atividades
- **Registros**: Novos produtores, ativação de planos, logs de segurança.
- **Requisito**: Busca e filtro por tipo, data, administrador.
- **Critério**: Feed ilimitado com paginação.

### Ref 4.7 – Insights estratégicos (churn, expansão)
- **Algoritmo**: Identifica padrões de risco de cancelamento.
- **Requisito**: Recomendação de ação (e-mail promocional, suporte proativo).
- **Critério**: Taxa de acerto > 70% em previsão de churn.

### Ref 4.8 – Carregamento assíncrono
- **Arquitetura**: Dados carregados via SWR ou React Query.
- **Requisito**: Skeleton screens durante carregamento.
- **Critério**: Interface não trava mesmo com 10k registros.

### Ref 4.9 – Densidade de informação
- **UX**: Gráficos compactos, tooltips, selos de status.
- **Requisito**: Evitar scroll horizontal em monitores 1080p.
- **Critério**: Teste de usabilidade com administradores.

### Ref 4.10 – Motor de estratégia
- **Conceito**: Não apenas monitoramento, mas ferramenta de crescimento.
- **Requisito**: Módulo de recomendações de preço, plano, marketing.
- **Critério**: Ações sugeridas implementáveis em 1 clique.

---

## 5. Gestão financeira do admin

### Ref 5.1 – Saúde econômica
- **Análises**: Faturamento, custos, margem líquida.
- **Requisito**: Dashboards de P&L da operadora.
- **Critério**: Comparação com orçamento anual.

### Ref 5.2 – Integração Stripe tempo real
- **Dados**: Assinaturas ativas, pagamentos pendentes, falhas.
- **Requisito**: Sincronização via webhooks + fallback batch.
- **Critério**: Atraso máximo de 2 minutos.

### Ref 5.3 – Faturamento bruto consolidado
- **Visualização**: Curva mensal e comparação YOY.
- **Requisito**: Identificar sazonalidade.
- **Critério**: Exportação para Excel com fórmulas.

### Ref 5.4 – Churn Rate
- **Cálculo**: % de produtores que cancelaram no período.
- **Requisito**: Detalhamento churn voluntário vs involuntário (pagamento falho).
- **Critério**: Alerta quando churn > 5% mensal.

### Ref 5.5 – Cupons e ARPU
- **Funcionalidade**: Gerenciar cupons de desconto, ver impacto no ARPU.
- **Requisito**: Relatório de eficácia de cada campanha.
- **Critério**: Cálculo do LTV ajustado por desconto.

### Ref 5.6 – Relatórios exportáveis
- **Conciliação contábil**: Transações individuais, taxas Stripe, reembolsos.
- **Requisito**: Formato CSV compatível com sistemas contábeis (Domínio, QuickBooks).
- **Critério**: Exportação de até 1 ano de dados.

### Ref 5.7 – Alertas financeiros atípicos
- **Eventos**: Picos de estorno, assinaturas suspeitas.
- **Requisito**: Score de fraude baseado em histórico.
- **Critério**: Bloqueio automático temporário se risco alto.

### Ref 5.8 – Faturas manuais e customizadas
- **Suporte**: Cooperativas, planos especiais.
- **Requisito**: Interface para criar fatura avulsa e registrar pagamento offline.
- **Critério**: Integração com Stripe Invoices para controle.

### Ref 5.9 – Análise de LTV vs CAC
- **LTV**: Lifetime Value médio.
- **CAC**: Custo de Aquisição por Cliente (input manual ou integração com Google Ads/Meta).
- **Critério**: Dashboard de payback em meses.

### Ref 5.10 – Inteligência de mercado
- **Saída**: Dados transacionais transformados em insights.
- **Requisito**: Recomendar investimentos baseado em ROI esperado.
- **Critério**: Simulação de aumento de preço e impacto no churn.

---

## 6. Gestão de usuários e permissões (Super Admin)

### Ref 6.1 – Governança e segurança
- **Funcionalidade**: Visualizar todos os usuários de todos os tenants.
- **Requisito**: Busca global por e-mail, role, status, último acesso.
- **Critério**: Página carrega < 1s para até 10k usuários.

### Ref 6.2 – Filtros avançados
- **Filtros**: por email, role (Super Admin, Produtor, Funcionário, Cooperativa), status, data último acesso.
- **Requisito**: Combinação AND entre filtros.
- **Critério**: Exportar resultados filtrados.

### Ref 6.3 – Gerenciamento de roles
- **Ações**: Alterar role de um usuário, revogar acesso.
- **Requisito**: Log de auditoria de cada mudança de permissão.
- **Critério**: Novo acesso deve refletir em até 1 minuto (invalidação de sessão).

### Ref 6.4 – Intervenção em suporte
- **Ações**: Resetar senha, bloquear conta, auditar logs de acesso.
- **Requisito**: Reset de senha dispara e-mail para o usuário.
- **Critério**: Bloqueio imediato impede novas requisições.

### Ref 6.5 – Histórico de acessos e dispositivos
- **Dados**: IP, user-agent, localização aproximada, data/hora.
- **Requisito**: Detectar múltiplas sessões geograficamente distantes.
- **Critério**: Alerta de possível compartilhamento de conta.

### Ref 6.6 – Vínculo hierárquico produtor
- **Exibir**: Para cada usuário, mostrar granjas que gerencia.
- **Requisito**: Suporte a um usuário gerir múltiplas granjas.
- **Critério**: Interface de troca de granja (context switch).

### Ref 6.7 – Edição de usuário intuitiva
- **Campos**: Metadados (telefone, avatar), permissões customizadas.
- **Requisito**: Formulário com validação em tempo real.
- **Critério**: Sem necessidade de recarregar página.

### Ref 6.8 – Deslogar de todas as sessões
- **Ação**: Botão "Force logout all sessions".
- **Requisito**: Revoga todos os tokens de sessão ativos.
- **Critério**: Próxima requisição de qualquer dispositivo retorna 401.

### Ref 6.9 – Controle centralizado
- **Escala**: Administrar milhares de perfis.
- **Requisito**: Seleção em massa (bloquear, alterar role).
- **Critério**: Operação em lote com confirmação e progresso.

---

## 7. Gestão de produtores (Super Admin)

### Ref 7.1 – Acompanhamento da base
- **Entidade**: Cada produtor/granja é tratado como organização única.
- **Requisito**: Próprio conjunto de configurações, limites de uso, histórico de faturamento.
- **Critério**: Tela de detalhes do produtor mostra tudo.

### Ref 7.2 – Listagem detalhada
- **Colunas**: Nome da fazenda, CNPJ/CPF, localização geográfica, plano ativo, status.
- **Requisito**: Ordenação e paginação.
- **Critério**: Busca textual com fuzzy matching.

### Ref 7.3 – Indicadores de saúde do produtor
- **Métrica**: Tempo desde o último registro de produção.
- **Requisito**: Classificação: Saudável (≤ 3 dias), Atenção (4-7 dias), Risco (>7 dias).
- **Critério**: Alertar equipe de CS se risco.

### Ref 7.4 – Gestão de limites técnicos
- **Limites**: Número máximo de aves, armazenamento de arquivos, funcionários.
- **Requisito**: Aumentar limites via ação admin (e registrar motivo).
- **Critério**: Produtor excede limite → notificação e bloqueio até contato.

### Ref 7.5 – Verificação de documentação
- **Status**: Documentação validada (CNPJ, inscrição estadual).
- **Requisito**: Upload de documentos no onboarding, revisão manual ou automática.
- **Critério**: Acesso a recursos críticos apenas se verificado.

### Ref 7.6 – Espelhamento da visão do produtor
- **Suporte**: Admin pode visualizar exatamente o que o produtor vê.
- **Requisito**: Modo "Superuser" com permissão especial, registrado em log.
- **Critério**: Produtor não pode ver ações do admin.

### Ref 7.7 – Monitoramento de infraestrutura por produtor
- **Dados**: Uso de banco de dados (consultas, armazenamento), requisições de API.
- **Requisito**: Gráfico histórico de consumo.
- **Critério**: Alertar se estourar quota do plano.

### Ref 7.8 – Suporte a cooperativas
- **Estrutura**: Cooperativa como entidade guarda-chuva, produtores vinculados.
- **Requisito**: Relatórios agregados para cooperativa, faturamento único.
- **Critério**: Permissões hierárquicas (admin cooperativa vê todos os produtores).

### Ref 7.9 – Controle total
- **Finalidade**: Saber quem usa, como usa, nível de satisfação.
- **Requisito**: Integração com NPS e tickets de suporte.
- **Critério**: Score de satisfação por produtor.

---

## 8. Gestão de planos e preços

### Ref 8.1 – Flexibilidade de monetização
- **Funcionalidade**: Criar/editar planos, features, preços.
- **Requisito**: Sincronização automática com Stripe.
- **Critério**: Mudança de preço afeta novos assinantes, mantém legados.

### Ref 8.2 – Destaque "Mais Popular" / "Melhor Valor"
- **UI**: Selos visuais nos cards de preço.
- **Requisito**: Configurável por plano.
- **Critério**: A/B test para otimizar conversão.

### Ref 8.3 – Intervalos de faturamento
- **Opções**: Mensal, anual (com desconto % configurável).
- **Requisito**: Renovação automática, upgrade/downgrade pro rata.
- **Critério**: Webhook trata mudança de plano.

### Ref 8.4 – Features por nível
- **Definição**: Lista de capacidades (ex: "Até 5000 aves", "Relatórios avançados").
- **Requisito**: Validação de acesso baseado no plano do produtor.
- **Critério**: Middleware que bloqueia rota se feature não permitida.

### Ref 8.5 – Planos legacy
- **Comportamento**: Não disponíveis para novos, mas mantidos para antigos.
- **Requisito**: Migração voluntária para novos planos com desconto.
- **Critério**: Tabela de preços com flag `is_active` e `is_legacy`.

### Ref 8.6 – Cupons de desconto
- **Tipos**: Porcentagem, valor fixo, trial estendido.
- **Requisito**: Aplicáveis a planos específicos ou todos.
- **Critério**: Rastreamento de uso por produtor.

### Ref 8.7 – IDs internos do Stripe
- **Visualização técnica**: Exibir price_id, product_id na interface admin.
- **Requisito**: Facilitar depuração de sincronização.
- **Critério**: Ferramenta de "re-sync" manual.

### Ref 8.8 – Ativação/desativação instantânea
- **Ação**: Botão para desativar plano (não aparecer no checkout).
- **Requisito**: Permite testes de ofertas.
- **Critério**: Mudança reflete em até 10s (cache revalidado).

### Ref 8.9 – Adaptação ao mercado
- **Objetivo**: Reajustar preços conforme flutuação do setor avícola.
- **Requisito**: Simulador de impacto financeiro antes de alterar.
- **Critério**: Notificar produtores afetados com antecedência.

---

## 9. Log de auditoria

### Ref 9.1 – Guardião da integridade
- **Registro**: Ações críticas de administradores e usuários.
- **Requisito**: Imutável (append-only).
- **Critério**: Armazenamento em tabela separada com assinatura digital.

### Ref 9.2 – Interface de linha do tempo forense
- **Categorias**: Segurança (roxo), Financeiro (verde), Operações Técnicas (azul).
- **Requisito**: Filtros por categoria, data, usuário.
- **Critério**: Exportação em formato JSON para auditoria externa.

### Ref 9.3 – Eventos de segurança
- **Exemplos**: Login sucesso/falha, alteração de permissão, criação de novo perfil.
- **Requisito**: Registrar IP, user-agent, localização.
- **Critério**: Alerta em tempo real para login suspeito.

### Ref 9.4 – Eventos financeiros
- **Exemplos**: Criação de assinatura, upgrade, webhook de pagamento, falha.
- **Requisito**: Rastrear correlação com Stripe event id.
- **Critério**: Link direto para evento no Stripe Dashboard.

### Ref 9.5 – Eventos operacionais
- **Exemplos**: Criação de produtor, alteração de configuração global, sincronização externa.
- **Requisito**: Quem, quando, o quê (antes/depois em JSON).
- **Critério**: Reverter ação específica (se possível).

### Ref 9.6 – Metadados precisos
- **Campos obrigatórios**: `user_id`, `action`, `timestamp`, `ip_address`, `data_before`, `data_after`.
- **Requisito**: Todo endpoint mutável deve chamar o logger.
- **Critério**: 100% de cobertura em ações críticas.

### Ref 9.7 – Códigos de cores e ícones
- **UX**: Varredura visual rápida.
- **Requisito**: Manter consistência de cores em todo o sistema.
- **Critério**: Acessibilidade: dicas de texto para daltônicos.

### Ref 9.8 – Imutabilidade e prova técnica
- **Casos de uso**: Disputas judiciais, auditorias externas, investigações internas.
- **Requisito**: Assinatura hash encadeada (blockchain-like).
- **Critério**: Verificação de integridade periódica.

### Ref 9.9 – Filtragem avançada
- **Filtros**: Período, usuário específico, tipo de ação.
- **Requisito**: Interface responsiva com busca em texto livre.
- **Critério**: Resultados paginados e exportáveis.

### Ref 9.10 – Confiança de investidores
- **Valor**: Demonstra transparência e segurança.
- **Requisito**: Relatório de conformidade anual.
- **Critério**: Certificação ISO 27001 no primeiro ano.

---

## 10. Configurações globais do sistema

### Ref 10.1 – Ajuste fino sem código
- **Escopo**: Branding, segurança, infraestrutura.
- **Requisito**: Painel de configurações com permissão restrita a Super Admin.
- **Critério**: Sem necessidade de redeploy para alterar textos/marcas.

### Ref 10.2 – Branding
- **Campos**: Nome do sistema, cores primária/secundária, logotipos (claro/escuro), favicon.
- **Requisito**: Pré-visualização ao vivo.
- **Critério**: Herdado por todos os produtores (mas podem customizar? Opcional).

### Ref 10.3 – Segurança avançada
- **Configurações**: Tempo de expiração de sessão (minutos), exigir MFA para admins, política de senha (comprimento, caracteres).
- **Requisito**: Aplicar a todos os usuários na próxima autenticação.
- **Critério**: Forçar logout quando expiração global muda.

### Ref 10.4 – Notificações globais
- **Webhooks de monitoramento**: Alertar equipe externa (Slack, PagerDuty) em eventos críticos.
- **Requisito**: Endpoint customizável, secret para assinatura.
- **Critério**: Teste de envio manual.

### Ref 10.5 – Modo de Manutenção
- **Comportamento**: Bloquear acesso de usuários, exibir página de manutenção.
- **Requisito**: Permitir IPs de desenvolvedores para testes.
- **Critério**: Agendamento de janela de manutenção com notificação prévia.

### Ref 10.6 – E-mails administrativos
- **Destinos**: Faturamento, segurança, suporte.
- **Requisito**: Configurar lista de e-mails (separados por vírgula).
- **Critério**: Teste de envio de e-mail de exemplo.

### Ref 10.7 – Interface moderna
- **Componentes**: Toggles, color pickers, input de texto.
- **Requisito**: Sem manipulação de HEX.
- **Critério**: Alterações aplicadas em tempo real (pós confirmação).

### Ref 10.8 – Log de auditoria de alterações
- **Registro**: Toda mudança nas configurações globais deve ser auditada.
- **Requisito**: Mostrar diff entre valores antigo e novo.
- **Critério**: Possibilidade de reverter para configuração anterior.

### Ref 10.9 – Autonomia da Agrotech
- **Objetivo**: Manter excelência do serviço.
- **Requisito**: Ajustes sem depender de deploy.
- **Critério**: Tempo médio para ativar nova feature global < 5 min.

---

## 11. Dashboard do produtor

### Ref 11.1 – Visão imediata da granja
- **Métricas**: Total de ovos do dia, mortalidade média, balanço financeiro previsto.
- **Requisito**: Atualização em tempo real (polling a cada 30s ou websocket).
- **Critério**: Informações exibidas antes de qualquer interação.

### Ref 11.2 – Cards modulares
- **Funcionalidade**: Produtor pode reorganizar os cards por ordem de importância.
- **Requisito**: Layout salvo por usuário.
- **Critério**: Drag and drop responsivo.

### Ref 11.3 – Alertas de tarefas pendentes
- **Exibir**: Vacinações programadas, estoque baixo de ração, manutenções.
- **Requisito**: Destaque visual e notificação push.
- **Critério**: Click no alerta leva à ação correspondente.

### Ref 11.4 – Gráficos de tendência
- **Evolução**: Produção diária, mortalidade, consumo de ração nas últimas semanas.
- **Requisito**: Possibilidade de comparar com semanas anteriores.
- **Critério**: Zoom e exportação.

### Ref 11.5 – Status de lotes ativos
- **Mostrar**: Fase (cria, recria, postura), eficiência alimentar, idade em semanas.
- **Requisito**: Cor verde/amarela/vermelha conforme saúde.
- **Critério**: Link para gestão do lote.

### Ref 11.6 – Lucro/prejuízo tempo real
- **Cálculo**: Vendas de ovos - custos insumos/mão de obra.
- **Requisito**: Integração com módulo financeiro.
- **Critério**: Atualização a cada novo registro de venda ou compra.

### Ref 11.7 – Responsividade mobile
- **Prioridade**: Dados acessíveis pelo celular durante manejo.
- **Requisito**: Design mobile-first, touch targets ≥ 44px.
- **Critério**: Todas as funcionalidades do desktop disponíveis no mobile.

### Ref 11.8 – Transformação em empresa orientada a dados
- **Resultado esperado**: Produtor toma decisões baseadas em dados.
- **Requisito**: Tutorias e dicas de interpretação de gráficos.
- **Critério**: Pesquisa de satisfação > 80% "entendo meus dados".

---

## 12. Gestão de lotes (Flocks)

### Ref 12.1 – Cadastro de lote profissional
- **Campos Técnicos**: Linhagem genética, finalidade (Postura/Recria/Corte), data de nascimento, fornecedor/origem, idade na chegada (dias), peso médio inicial (biometria).
- **Campos Financeiros**: Preço unitário por ave, investimento total (calculado).
- **Vínculo de Ativos**: Seleção obrigatória ou opcional de galpão de alojamento (`houseId`).
- **Automação**: Lote criado define metas de produção baseadas na linhagem e gera despesa automática no financeiro.
- **Critério**: Validação de datas retroativas (nascimento) e bloqueio de datas futuras.

### Ref 12.2 – Idade cronológica automática
- **Cálculo**: Dias e semanas desde a data de nascimento.
- **Requisito**: Atualização diária via script agendado.
- **Critério**: Metas de produção (ovos/ave/dia) seguem curva da linhagem.

### Ref 12.3 – Registros diários
- **Dados**: Ovos comerciais, ovos descartados, consumo de ração (kg), mortalidade.
- **Requisito**: Entrada rápida via formulário otimizado.
- **Critério**: Possibilidade de registrar dias retroativos (até 7 dias).

### Ref 12.4 – Análise de produtividade por lote
- **Comparação**: Entre galpões ou linhagens.
- **Requisito**: Gráfico de cost-benefit (custo por ovo vs. produção).
- **Critério**: Exportar comparação em PDF.

### Ref 12.5 – Encerramento de lote
- **Relatório final**: Conversão alimentar total, custo por dúzia, rentabilidade líquida.
- **Requisito**: Armazenar dados históricos mesmo após encerramento.
- **Critério**: Link para relatório em PDF legível.

### Ref 12.6 – Alerta de final da vida produtiva
- **Base**: Parâmetros da linhagem (ex: 80 semanas).
- **Requisito**: Notificação com sugestão de descarte ou muda forçada.
- **Critério**: Produtor pode postergar ou aceitar.

### Ref 12.7 – Status visual de saúde e produção
- **Cores**: Verde (normal), amarelo (queda de postura >5%), vermelho (queda >15%).
- **Requisito**: Ícone específico para alerta sanitário.
- **Critério**: Ferramenta para registrar suspeita de doença.

### Ref 12.8 – Movimentações entre galpões
- **Rastreabilidade**: Registrar entrada/saída de lotes de um galpão para outro.
- **Requisito**: Histórico de alojamento.
- **Critério**: Motivo obrigatório (crescimento, isolamento sanitário).

### Ref 12.9 – Certificação de qualidade
- **Objetivo**: Granularidade necessária para certificações (ex: bem-estar animal).
- **Requisito**: Exportar histórico completo do lote.
- **Critério**: Integração com órgãos certificadores via API.

---

## 13. Controle de estoque e inventário

### Ref 13.1 – Gestão de insumos
- **Tipos**: Ração, medicamentos, vacinas, embalagens, equipamentos.
- **Requisito**: Categorias customizáveis pelo produtor.
- **Critério**: Unidade de medida variável (kg, unidade, litro).

### Ref 13.2 – Entradas de estoque
- **Registro**: Nota fiscal (anexo PDF), foto do produto, data de validade, lote.
- **Requisito**: Leitura de código de barras via câmera (PWA).
- **Critério**: Cálculo automático de custo médio ponderado.

### Ref 13.3 – Saídas automáticas
- **Origem**: Consumo de ração vinculado ao registro diário do lote.
- **Saídas manuais**: Vendas, perdas, devoluções.
- **Critério**: Rastreabilidade do lote de insumo consumido por lote de aves.

### Ref 13.4 – Alertas de estoque mínimo
- **Configuração**: Produtor define nível crítico por item.
- **Notificação**: E-mail e push quando atingido.
- **Critério**: Botão "sugerir pedido de compra" com cálculo de quantidade.

### Ref 13.5 – Inventário financeiro
- **Valor total imobilizado**: Soma (quantidade × custo médio).
- **Requisito**: Gráfico de evolução do valor em estoque.
- **Critério**: Alerta se valor muito alto (capital de giro travado).

### Ref 13.6 – Validade de produtos perecíveis
- **Rastreamento**: Alertas 30, 15, 7 dias antes do vencimento.
- **Requisito**: Sugerir uso prioritário ou descarte.
- **Critério**: Impedir uso após vencimento (bloqueio se tentar consumir).

### Ref 13.7 – Rastreabilidade de insumos
- **Problemas de produção**: Identificar qual lote de ração/medicamento foi usado em cada grupo de aves.
- **Requisito**: Relatório de correlação.
- **Critério**: Botão "Investigar lote" que mostra todas as aves alimentadas.

### Ref 13.8 – Auditoria de estoque físico
- **Processo**: Produtor conta fisicamente e insere no sistema.
- **Gera divergência**: Saldo teórico vs real.
- **Critério**: Ajuste manual com justificativa e registro de quem ajustou.

### Ref 13.9 – Profissionalismo logístico
- **Resultado**: Evitar desperdícios e garantir continuidade.
- **Requisito**: Dashboard de giro de estoque por item.
- **Critério**: Sugestão de compra baseada em lead time do fornecedor.

---

## 14. Gestão financeira para o produtor

### Ref 14.1 – Receitas e despesas
- **Receitas**: Venda de ovos, aves de descarte, esterco.
- **Despesas**: Ração, medicamentos, embalagens, energia, mão de obra, impostos.
- **Automação de Aquisição**: Toda criação de lote com valor financeiro gera automaticamente uma despesa na categoria 'Outros' ou 'Aves'.
- **Critério**: Categorias flexíveis (custos fixos vs variáveis).

### Ref 14.2 – DRE mensal
- **Demonstrativo de Resultados**: Receita bruta, deduções, CMV, margem bruta, despesas operacionais, lucro líquido.
- **Requisito**: Comparativo com mês anterior e orçado.
- **Critério**: Exportação para contador em formato padronizado.

### Ref 14.3 – Custo por dúzia (métrica de ouro)
- **Cálculo**: (Custo total de produção / dúzias de ovos comercializáveis).
- **Requisito**: Exibir na dashboard principal e comparar com mercado (benchmark).
- **Critério**: Quebra de custo por componente (ração, energia, etc).

### Ref 14.4 – Contas a pagar e a receber
- **Calendário**: Vencimentos, alertas de atraso.
- **Requisito**: Conciliação bancária (upload de extrato).
- **Critério**: Previsão de fluxo de caixa para 30, 60, 90 dias.

### Ref 14.5 – Fluxo de caixa projetado
- **Planejamento**: Investimentos futuros (galpões, equipamentos).
- **Requisito**: Simulação de financiamento.
- **Critério**: Gráfico de caixa acumulado.

### Ref 14.6 – Apoio a crédito agrícola
- **Extração de dados**: Consolidado de receitas/despesas.
- **Requisito**: Gerar relatório em formato padrão bancário (ex: CNA).
- **Critério**: Aprovação de crédito facilitada.

### Ref 14.7 – Múltiplos centros de custo
- **Separação**: Granja vs pessoal.
- **Requisito**: Relatórios por centro de custo.
- **Critério**: Evitar contaminação de despesas pessoais.

### Ref 14.8 – Empresário do agronegócio
- **Resultado**: Controle total sobre números e margens.
- **Requisito**: Meta de rentabilidade personalizável.
- **Critério**: Notificação quando meta for alcançada.

---

## 15. Gestão de tarefas e calendário operacional

### Ref 15.1 – Tarefas recorrentes e pontuais
- **Exemplos recorrentes**: Coleta de ovos (diária), limpeza de bebedouros (semanal).
- **Exemplos pontuais**: Vacinação, manutenção de gerador.
- **Critério**: Associação a lotes e galpões específicos.

### Ref 15.2 – Delegação a funcionários
- **Funcionalidade**: Atribuir tarefa a um funcionário (role "Funcionário").
- **Recebem notificação** push ou e-mail.
- **Critério**: Marcar conclusão com foto comprobatória.

### Ref 15.3 – Calendário visual
- **Visões**: Semanal, mensal.
- **Requisito**: Cores por tipo de tarefa.
- **Critério**: Arrastar para reagendar (com permissão de gestor).

### Ref 15.4 – Banco de Boas Práticas
- **Sugestões automáticas**: Baseadas em alertas climáticos (ex: onda de calor → verificar nebulização).
- **Requisito**: Integração com API de previsão do tempo.
- **Critério**: Produtor pode aprovar ou recusar.

### Ref 15.5 – Biosseguridade
- **Tarefas críticas**: Limpeza de pedilúvios, troca de desinfetante.
- **Registro histórico** utilizado em auditorias.
- **Critério**: Exportar atestado de conformidade.

### Ref 15.6 – Produtividade da equipe
- **Métricas**: Tarefas concluídas no prazo, tempo de atraso.
- **Requisito**: Ranking interno (anônimo opcional).
- **Critério**: Bônus sugerido baseado em performance.

### Ref 15.7 – Redução de ansiedade do produtor
- **Benefício**: Granja opera como relógio suíço.
- **Requisito**: Checklist diário automático.
- **Critério**: Produtor avalia "sensação de controle" > 9/10.

### Ref 15.8 – Workflow operacional padronizado
- **Fator crítico**: Sanidade animal e excelência produtiva.
- **Requisito**: Template de rotina para cada fase do lote.
- **Critério**: Desvios do padrão geram alerta.

---

## 16. Relatórios e BI para produtor

### Ref 16.1 – Relatórios pré-configurados
- **Tipos**: Produtividade, eficiência alimentar, taxa de postura, curvas de mortalidade.
- **Requisito**: Comparação com padrões da linhagem.
- **Critério**: Gráficos interativos (zoom, filtro por data).

### Ref 16.2 – Relatórios customizados
- **Cruzamento**: Dados de produção x custos.
- **Exemplo**: ROI por marca de ração.
- **Critério**: Salvar consultas para reuso.

### Ref 16.3 – Comparação entre lotes
- **Identificar** melhores práticas.
- **Requisito**: Matriz de correlação (lote A vs B vs C).
- **Critério**: Botão "aplicar configurações do lote vencedor".

### Ref 16.4 – Conformidade sanitária
- **Consolidar**: Vacinações, descarte de resíduos.
- **Requisito**: Documento pronto para órgão regulador (PDF/A).
- **Critério**: Assinatura digital.

### Ref 16.5 – Exportação PDF / Excel
- **Compartilhar** com consultores, veterinários, contadores.
- **Requisito**: Preservar formatação e fórmulas (Excel).
- **Critério**: Exportação em lote (múltiplos relatórios em ZIP).

### Ref 16.6 – Benchmarking anônimo
- **Comparar** produtividade com média regional.
- **Requisito**: Sem exposição de dados individuais.
- **Critério**: Gráfico de percentil (ex: 80% melhor que a região).

### Ref 16.7 – Análises preditivas
- **Projetar** produção futura de ovos.
- **Requisito**: Previsão de 4 semanas com intervalo de confiança.
- **Critério**: Acurácia > 90% em dados históricos.

### Ref 16.8 – Análise sazonal
- **Identificar** períodos de queda natural.
- **Requisito**: Sugerir intervenções técnicas (ex: muda programada).
- **Critério**: Baseado em 2 anos de histórico.

### Ref 16.9 – Gestão profissional de riscos
- **Resultado**: Minimizar riscos e maximizar resultados.
- **Requisito**: Simulação de cenários (ex: aumento do preço do milho).
- **Critério**: Dash de risco personalizável.

---

## 17. Autenticação e gestão de identidade (Clerk)

### Ref 17.1 – Segurança nível bancário
- **Provedor**: Clerk.
- **Recursos**: MFA, sessões seguras, proteção contra brute force.
- **Critério**: Certificação SOC2 Type II.

### Ref 17.2 – Fluxos prontos
- **Registro, login, recuperação de senha**.
- **Requisito**: Customização da interface para seguir identidade Agrotech.
- **Critério**: Onboarding concluído em < 2 minutos.

### Ref 17.3 – Múltiplos métodos
- **Social**: Google, eventualmente Facebook.
- **Email/senha** com validação de domínio (opcional).
- **Critério**: Possibilidade de desabilitar social via configuração global.

### Ref 17.4 – 2FA
- **Métodos**: SMS, TOTP (Google Authenticator, etc).
- **Requisito**: Obrigatório para Super Admin, opcional para produtores.
- **Critério**: Códigos de backup gerados.

### Ref 17.5 – Gestão de sessões
- **Usuário pode** ver dispositivos conectados e encerrar remotamente.
- **Requisito**: Notificação ao logar de novo dispositivo.
- **Critério**: Forçar logout após expiração configurada.

### Ref 17.6 – Proteção de rotas Next.js
- **SDK Clerk**: uso de `auth()` e `currentUser()`.
- **Requisito**: Middleware que redireciona para login se não autenticado.
- **Critério**: Rotas protegidas retornam 401 via API.

### Ref 17.7 – Metadata personalizada
- **Armazenar**: role, producerId (ou array de producerIds).
- **Requisito**: Sincronizar com nosso banco via webhook.
- **Critério**: A cada login, metadados atualizados.

### Ref 17.8 – Organizações (Teams)
- **Produtor** cria equipe, convida funcionários com roles diferentes.
- **Requisito**: Membros herdam permissões do tenant.
- **Critério**: Funcionário não vê dados financeiros (role configurável).

### Ref 17.9 – Interface de login customizada
- **UI** consistente com identidade Agrotech.
- **Requisito**: Usar componentes Clerk com tema próprio (CSS variables).
- **Critério**: Redirecionamento pós-login para dashboard correto.

### Ref 17.10 – Robustez inviável construir do zero
- **Justificativa**: Clerk oferece segurança de alto nível acelerando desenvolvimento.
- **Requisito**: Contrato de nível de serviço (SLA 99.99%).
- **Critério**: Plano de contingência (fallback) se Clerk ficar indisponível.

---

## 18. Integração Stripe (pagamentos)

### Ref 18.1 – Automação total
- **Ciclo de vida**: Trial → assinatura ativa → renovação → cancelamento.
- **Requisito**: Webhooks tratam todos os eventos.
- **Critério**: Atraso máximo no processamento do webhook: 2 segundos.

### Ref 18.2 – Stripe Customer Portal
- **Produtor** gerencia cartão, faturas, cancelamentos.
- **Requisito**: Redirect para portal hospedado pelo Stripe com return URL.
- **Critério**: Sincronização de mudanças via webhook.

### Ref 18.3 – Precificação dinâmica
- **Exemplo**: Por número de aves (ex: R$ 0,01 por ave acima de 1000).
- **Requisito**: Stripe Usage-based billing.
- **Critério**: Fatura mensal calculada pro rata.

### Ref 18.4 – Webhooks monitorados
- **Eventos**: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`.
- **Requisito**: Sistema de retry com exponential backoff.
- **Critério**: Dashboard admin com falhas de webhook.

### Ref 18.5 – Métodos de pagamento Brasil
- **Cartão de crédito**, **Boleto**, **PIX**.
- **Requisito**: Stripe suporta todos via gateway local.
- **Critério**: Boleto tem 3 dias para pagamento; PIX confirmação instantânea.

### Ref 18.6 – Dunning automático
- **Stripe** envia e-mails de lembrete, tenta cobranças falhas.
- **Requisito**: Suspensão de acesso após limite de tentativas (configurável).
- **Critério**: E-mail personalizado com link para atualizar pagamento.

### Ref 18.7 – Relatórios financeiros consolidados
- **MRR, churn, crescimento** sem ferramenta externa.
- **Requisito**: Exportar métricas para CSV.
- **Critério**: Gráficos interativos no admin.

### Ref 18.8 – PCI Compliance Nível 1
- **Responsabilidade Stripe**: Agrotech nunca toca em número de cartão.
- **Requisito**: Usar Stripe Elements ou Checkout.
- **Critério**: Auditoria de segurança demonstra ausência de dados sensíveis.

### Ref 18.9 – Escalabilidade do negócio
- **Foco**: Inovação, enquanto receita flui com segurança.
- **Requisito**: Monitoramento de falhas de pagamento por assinante.
- **Critério**: Recuperação de receita perdida > 20% via dunning.

---

## 19. Camada de dados: Prisma + Supabase PostgreSQL

### Ref 19.1 – Ponte tipada
- **Benefício**: Cada consulta validada em compile-time.
- **Requisito**: Schemas definidos em `schema.prisma`.
- **Critério**: Zero SQL puro (exceto queries complexas otimizadas).

### Ref 19.2 – Injeção automática de contexto produtor
- **Extensão Prisma**: Adiciona `where: { producerId }` para todos os models.
- **Requisito**: Extensão configurada no cliente Prisma singleton.
- **Critério**: Teste unitário comprova injeção.

### Ref 19.3 – Alta disponibilidade Supabase
- **Backups automáticos**, PITR (Point-in-Time Recovery).
- **Requisito**: SLA 99.95% para plano pago.
- **Critério**: Drill de recuperação a cada 6 meses.

### Ref 19.4 – Otimização para milhões de logs
- **Índices**: `(producerId, created_at)`, `(flock_id, date)`.
- **Partição de tabelas** por mês para `daily_records`.
- **Critério**: Consulta agregada de 1 ano < 2 seg.

### Ref 19.5 – RLS como última barreira
- **Políticas**: `(producer_id = current_setting('app.producer_id')::int)`.
- **Requisito**: Ativar RLS em todas as tabelas.
- **Critério**: Tentativa de bypass via SQL direto falha.

### Ref 19.6 – Prisma Migrations
- **Histórico de migrações** versionado.
- **Requisito**: Migrations são aplicadas via CI/CD após review.
- **Critério**: Rollback de migration testado.

### Ref 19.7 – Connection Pooler do Supabase
- **Gerencia conexões** em ambiente serverless (Vercel).
- **Requisito**: Configurar `pgBouncer` modo transação.
- **Critério**: Limite de conexões não é estourado.

### Ref 19.8 – Triggers e funções armazenadas
- **Uso**: Cálculos pesados (ex: conversão alimentar por lote) executados no banco.
- **Requisito**: Funções escritas em PL/pgSQL.
- **Critério**: Testes de performance comparando com aplicação.

### Ref 19.9 – Estado da arte em desenvolvimento moderno
- **Resultado**: Confiabilidade para volumes massivos de dados agrícolas.
- **Requisito**: Monitoramento de deadlocks e queries lentas (pg_stat_statements).
- **Critério**: P99 query time < 200ms.

---

## 20. Identidade visual (SASS Modules)

### Ref 20.1 – Filosofia Luxury Admin
- **Cores**: Deep Indigo (`#1E1B4B`), Dark Slate (`#0F172A`), toques de esmeralda (`#10B981`) e violeta (`#8B5CF6`).
- **Requisito**: Contraste WCAG AA+.
- **Critério**: Tema escuro padrão com alternância para claro.

### Ref 20.2 – Glassmorphism
- **Efeito**: Fundo semi-transparente com blur, bordas suaves.
- **Requisito**: Aplicado em cards e painéis.
- **Critério**: Fallback para navegadores que não suportam backdrop-filter.

### Ref 20.3 – Tipografia
- **Fontes**: Inter (títulos), Roboto (corpo).
- **Requisito**: Fallback system-ui.
- **Critério**: Legibilidade em telas pequenas.

### Ref 20.4 – Sistema de design baseado em tokens
- **Variáveis SASS**: Cores, espaçamento (4px base), sombras.
- **Requisito**: Centralizado em `_tokens.scss`.
- **Critério**: Mudança de token reflete globalmente em 1 minuto (recompilação).

### Ref 20.5 – Micro-animações
- **Hover**, transições de estado, skeleton loading.
- **Requisito**: Duração ≤ 200ms, easing suave.
- **Critério**: Respeita `prefers-reduced-motion`.

### Ref 20.6 – Responsividade nativa
- **Mobile**: Layout fluido, pontuação mobile-first no Lighthouse.
- **Requisito**: Breakpoints: 640px, 768px, 1024px, 1280px.
- **Critério**: Componentes reorganizam-se automaticamente.

### Ref 20.7 – CSS Grid + Flexbox
- **Layouts complexos** estáveis.
- **Requisito**: Uso de Grid para páginas de lista, Flex para componentes internos.
- **Critério**: Sem necessidade de media queries excessivas.

### Ref 20.8 – Isolamento via CSS Modules
- **Sem efeitos colaterais** entre componentes.
- **Requisito**: Cada componente tem seu `*.module.scss`.
- **Critério**: Build final sem conflitos de classe.

### Ref 20.9 – Excelência visual
- **Tratamento** da ferramenta do produtor com respeito e estética.
- **Requisito**: Design system documentado no Storybook.
- **Critério**: Revisão de design por profissional.

---

## 21. Middlewares de segurança (Next.js)

### Ref 21.1 – Sentinelas de requisição
- **Middleware roda** antes de cada requisição (páginas, API, assets).
- **Requisito**: Configurado em `middleware.ts` no root.
- **Critério**: Log de cada verificação.

### Ref 21.2 – Autenticação via Clerk
- **Valida token** JWT antes de acessar qualquer rota privada.
- **Requisito**: `auth()` retorna nulo → redireciona para /login.
- **Critério**: Protege rotas de API também.

### Ref 21.3 – RBAC
- **Verifica role** do usuário com base em metadata.
- **Requisito**: Rota `/admin` só acessível se `role === 'super_admin'`.
- **Critério**: Tentativa de acesso não autorizado retorna 403.

### Ref 21.4 – Extração de producerId
- **Middleware lê** `producerId` da sessão e injeta no header `x-producer-id`.
- **Requisito**: O cliente Prisma usa esse header para configurar `app.producer_id` na conexão.
- **Critério**: Se producerId não presente e rota exige, retorna 400.

### Ref 21.5 – Proteções XSS e CSRF
- **Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy`.
- **Requisito**: Configurar CSP report-only inicialmente.
- **Critério**: Varredura de vulnerabilidades.

### Ref 21.6 – Proteção de assets privados
- **Arquivos estáticos** (PDFs, fotos de NF) servidos via API e verificação de permissão.
- **Requisito**: URLs de assets não adivinhatóveis.
- **Critério**: Tentativa de acesso direto retorna 401.

### Ref 21.7 – Redirecionamentos inteligentes
- **Páginas de erro amigáveis** (403, 404).
- **Requisito**: Manter query string para redirecionamento pós-login.
- **Critério**: UX sem loops.

### Ref 21.8 – Performance em Edge
- **Middleware otimizado** para rodar em edge runtime.
- **Requisito**: Evitar operações pesadas (acesso a banco).
- **Critério**: Latência adicional < 10ms.

### Ref 21.9 – Segurança em camadas
- **Dados** protegidos de forma robusta e atualizada.
- **Requisito**: Revisão de regras de middleware a cada release.
- **Critério**: Testes de penetração anuais.

---

## 22. Rotas de API (Route Handlers)

### Ref 22.1 – Endpoints atômicos
- **Princípio**: Cada endpoint faz uma coisa bem feita.
- **Requisito**: Organização por domínio (ex: `/api/flocks`, `/api/records`).
- **Critério**: Código do endpoint ≤ 150 linhas.

### Ref 22.2 – Validação de entrada (Zod)
- **Schemas** para body, query, params.
- **Requisito**: Retorno 422 com detalhamento dos erros de validação.
- **Critério**: Tipos inferidos do Zod e usados em todo o código.

### Ref 22.3 – Tratamento de erros centralizado
- **Função wrapper** captura erros, loga e retorna padrão.
- **Requisito**: Erros não tratados retornam 500 com correlationId.
- **Critério**: Estrutura `{ success: false, error: { code, message } }`.

### Ref 22.4 – Rate Limiting
- **Limites** configuráveis por rota (ex: 100 req/min para relatórios).
- **Requisito**: Armazenamento via Upstash Redis ou Vercel KV.
- **Critério**: Retorna 429 com `Retry-After`.

### Ref 22.5 – Integração tipada com Prisma
- **Uso** do cliente Prisma gerado a partir do schema.
- **Requisito**: Evitar `any` ou `unknown`.
- **Critério**: Cobertura de tipos 100%.

### Ref 22.6 – Operações complexas assíncronas
- **Geração de relatórios pesados** em background (BullMQ ou Vercel Queue).
- **Requisito**: Endpoint retorna `202 Accepted` com jobId.
- **Critério**: Job pode ser consultado para status.

### Ref 22.7 – Proteção por token JWT
- **Wrapper de autenticação** valida token do Clerk.
- **Requisito**: Em cada rota, extrair `userId` e `producerId`.
- **Critério**: Token expirado → 401.

### Ref 22.8 – Documentação atualizada
- **OpenAPI** gerada via `next-swagger-doc` ou similar.
- **Requisito**: Endpoint `/api/docs` interativo (Swagger UI).
- **Critério**: Atualização automática após mudanças de rota.

### Ref 22.9 – Backend escalável
- **Motor invisível** que sustenta a complexidade.
- **Requisito**: Monitoramento de latência e erro por endpoint.
- **Critério**: SLI de 99.9% de disponibilidade para APIs críticas.

---

## 23. Progressive Web App (PWA)

### Ref 23.1 – Instalação direta
- **Manifesto** configurado (ícones, tema, start_url).
- **Requisito**: Prompt de instalação no navegador.
- **Critério**: Teste em Android Chrome e iOS Safari.

### Ref 23.2 – Otimização mobile para campo
- **Botões ≥ 44px**, gestos de swipe para navegação.
- **Requisito**: Load rápido mesmo com 3G.
- **Critério**: First Contentful Paint < 1.5s em 3G.

### Ref 23.3 – Caching inteligente (offline)
- **Service Worker** cache de rotas principais e dados recentes.
- **Requisito**: Estratégia stale-while-revalidate.
- **Critério**: Produtor consegue registrar produção mesmo offline (sincronização posterior).

### Ref 23.4 – Notificações push
- **Push API** para alertas de tarefas, clima, faturamento.
- **Requisito**: Permissão do usuário, fallback para e-mail.
- **Critério**: Entrega de notificação em até 30s.

### Ref 23.5 – Integração com câmera
- **Capturar** fotos de ocorrências sanitárias, escanear código de barras.
- **Requisito**: Usar `getUserMedia` ou `input` com `capture`.
- **Critério**: Imagens otimizadas e anexadas ao registro.

### Ref 23.6 – Atualizações silenciosas
- **Service Worker** atualiza em segundo plano.
- **Requisito**: Notificar usuário após nova versão estar pronta.
- **Critério**: Sem perda de dados não sincronizados.

### Ref 23.7 – Democratização do acesso
- **Granjas remotas** podem usar tecnologia de ponta.
- **Requisito**: Funcionalidade offline-first.
- **Critério**: Teste em cenário de conectividade intermitente.

### Ref 23.8 – Mobilidade refletindo realidade
- **Produtor** passa tempo em movimento.
- **Requisito**: Navegação por voz? (futuro)
- **Critério**: Pesquisa de satisfação sobre uso em campo.

---

## 24. Deployment e infraestrutura (Vercel)

### Ref 24.1 – Global Edge Network
- **CDN** da Vercel serve estático do data center mais próximo.
- **Requisito**: Configurar domínios customizados.
- **Critério**: Latência média < 50ms nos principais mercados (BR, US, EU).

### Ref 24.2 – Funções Serverless escaláveis
- **Auto-scaling** baseado em tráfego.
- **Requisito**: Sem cold starts perceptíveis (uso de Edge Functions).
- **Critério**: Pico de 1000 req/s sustentável.

### Ref 24.3 – CI/CD
- **Integração contínua**: Cada push para `main` roda testes e deploy em staging.
- **Requisito**: Aprovação manual para produção.
- **Critério**: Rollback automático se saúde da aplicação degradar.

### Ref 24.4 – Logs e monitoramento
- **Logs de borda** e métricas em tempo real (Vercel Analytics).
- **Requisito**: Integração com Sentry para erros.
- **Critério**: Alerta quando erro 500 > 0.1% das requisições.

### Ref 24.5 – SSL automático
- **Certificados** renovados automaticamente.
- **Requisito**: Forçar HTTPS e HSTS.
- **Critério**: Grade A+ no SSL Labs.

### Ref 24.6 – Variáveis de ambiente seguras
- **Chaves de API** criptografadas e acessíveis apenas no servidor.
- **Requisito**: Nunca expor no client.
- **Critério**: Rotação de chaves a cada 90 dias.

### Ref 24.7 – Otimização de imagens em tempo real
- **Next.js Image** com otimização via Vercel.
- **Requisito**: Transformar imagens para WebP, redimensionamento.
- **Critério**: Tamanho médio de imagem < 100KB.

### Ref 24.8 – Suporte nativo ao Next.js
- **Uso máximo** do framework (ISR, Server Components, etc).
- **Requisito**: Configuração `output: 'standalone'`.
- **Critério**: Build otimizado para redução de lambda size.

### Ref 24.9 – Equipe enxuta
- **Focus** em inovação em vez de gerenciar servidores.
- **Requisito**: Documentação de runbooks mínimos.
- **Critério**: Custo de infraestrutura < 15% da receita.

---

## Fim da especificação OpenSpec

**Próximos passos:** Cada seção (Ref) deve ser implementada em ordem. Utilize este documento como contrato entre equipe de desenvolvimento e IA. Para cada pull request, referencie as Refs alteradas.




# OpenSpec – Tecnologias e Segurança do Agrotech SaaS (EggTrack)
## Guia definitivo para a stack técnica e medidas de proteção

Este documento consolida todas as decisões tecnológicas e de segurança extraídas do detalhamento técnico. Utilize como referência única para arquitetura, desenvolvimento e governança da plataforma.

---

## 1. Tecnologias da plataforma

### 1.1. Frontend
| Componente       | Tecnologia                              | Finalidade                                                                 |
|-----------------|-----------------------------------------|-----------------------------------------------------------------------------|
| Framework       | Next.js (última estável) com App Router | Renderização híbrida (SSR/SSG/ISR), navegação fluida, rotas protegidas      |
| Linguagem       | TypeScript 5+ (strict mode)             | Tipagem estática, erros em tempo de compilação, manutenibilidade            |
| Estilização     | SASS Modules + CSS Grid + Flexbox       | Isolamento de estilos, layout responsivo, tokens de design                  |
| Efeitos visuais | Glassmorphism (backdrop-filter: blur)   | Profundidade e sofisticação visual                                         |
| Iconografia     | Lucide React                            | Ícones minimalistas e consistentes                                         |
| Animações       | Framer Motion                           | Transições suaves (hover, página, micro-interações)                        |
| PWA             | Service Workers + Manifest              | Instalação direta, cache offline, notificações push, acesso à câmera       |

### 1.2. Backend
| Componente         | Tecnologia                                     | Finalidade                                                                 |
|--------------------|------------------------------------------------|-----------------------------------------------------------------------------|
| API                | Next.js Route Handlers (RESTful)               | Endpoints atômicos e tipados                                                |
| Validação de dados | Zod                                            | Schemas de entrada, segurança e padronização                               |
| Tratamento de erro | Centralizado com correlationId                 | Logs estruturados, respostas padronizadas                                  |
| Rate limiting      | Upstash Redis / Vercel KV                      | Proteção contra abusos (ex: 100 req/min em rotas críticas)                 |
| Tarefas pesadas    | BullMQ ou Vercel Queue                         | Processamento assíncrono (relatórios, exportações CSV)                     |
| Monitoramento      | Sentry + Vercel Analytics                      | Erros em tempo real, logs de borda                                         |

### 1.3. Banco de dados
| Componente          | Tecnologia                                      | Finalidade                                                                 |
|---------------------|-------------------------------------------------|-----------------------------------------------------------------------------|
| ORM                 | Prisma (última versão)                         | Ponte tipada entre TypeScript e PostgreSQL, migrations versionadas         |
| Extensões Prisma    | Injeção automática de `producerId`             | Garantia de isolamento multi-tenant nas queries                            |
| Banco de dados      | PostgreSQL via Supabase                        | Alta disponibilidade, backups automáticos, PITR                            |
| Segurança de linha  | Row Level Security (RLS)                        | Última barreira contra vazamento de dados entre tenants                    |
| Pool de conexões    | Supabase Connection Pooler (pgBouncer)         | Gerencia conexões em ambiente serverless                                   |
| Otimização          | Índices compostos, partição mensal de tabelas  | Suporte a milhões de logs diários com baixa latência                       |
| Funções avançadas   | Triggers e funções PL/pgSQL                    | Cálculos pesados executados no banco (ex: conversão alimentar)             |

### 1.4. Autenticação e identidade
| Componente        | Tecnologia          | Finalidade                                                                 |
|-------------------|---------------------|-----------------------------------------------------------------------------|
| Provedor de Auth  | Clerk               | Fluxo completo (registro, login, MFA), sessões seguras, organizações       |
| Métodos suportados| Email/senha, Google | Onboarding simplificado, 2FA via SMS ou TOTP                               |
| Metadados         | Custom metadata     | Armazenamento de `role` e `producerId` para controle de acesso             |

### 1.5. Pagamentos e assinaturas
| Componente          | Tecnologia          | Finalidade                                                                 |
|---------------------|---------------------|-----------------------------------------------------------------------------|
| Processamento       | Stripe Billing      | Assinaturas recorrentes, trial, upgrade/downgrade pro rata                 |
| Customer Portal     | Stripe Customer Portal | Autogestão de pagamentos e faturas                                        |
| Precificação        | Dinâmica (uso-based)| Cálculo automático baseado em número de aves ou funcionalidades            |
| Webhooks            | Stripe webhooks + retry | Sincronização de eventos (`invoice.paid`, `payment_failed`, etc.)          |
| Métodos de pagamento| Cartão, boleto, PIX | Adaptado ao mercado brasileiro                                             |
| Dunning             | Automático (Stripe) | E-mails de lembrete e tentativas antes de suspensão                        |

### 1.6. Infraestrutura e deploy
| Componente          | Tecnologia          | Finalidade                                                                 |
|---------------------|---------------------|-----------------------------------------------------------------------------|
| Hospedagem          | Vercel (Edge Network) | Baixa latência global (TTFB < 80ms), serverless functions                 |
| CI/CD               | Vercel + GitHub     | Deploy contínuo com staging, rollback automático                           |
| SSL/TLS             | Automático (Vercel) | Certificados renovados automaticamente, HSTS                               |
| Variáveis de ambiente| Criptografadas      | Proteção de chaves de API (Stripe, Clerk, Supabase)                        |
| Otimização de assets| Next.js Image + Vercel | Redimensionamento e conversão para WebP                                  |

---

## 2. Segurança da plataforma

### 2.1. Autenticação e controle de acesso
- **MFA obrigatório** para Super Admin, opcional para produtores (via SMS ou TOTP)
- **Gestão de sessões**: Usuário pode ver dispositivos conectados e encerrar sessões remotamente
- **Expiração configurável**: Tempo de sessão global ajustável pelo Super Admin
- **Bloqueio por força bruta**: Clerk bloqueia tentativas repetidas de login

### 2.2. Autorização (RBAC)
- **Roles definidas**: `super_admin`, `producer`, `employee`, `cooperative`
- **Middleware Next.js** valida role antes de acessar qualquer rota ou API
- **Rotas protegidas**: `/admin` apenas para Super Admin; rotas de produtor exigem `producerId` ativo
- **Metadados do Clerk** armazenam role e vínculo com granja

### 2.3. Isolamento multi-tenant (proteção de dados entre produtores)
- **Camada de banco**: Toda tabela possui coluna `producerId`
- **Prisma extension** injeta automaticamente `where: { producerId }` em todas as queries
- **Row Level Security (RLS)** no PostgreSQL como última barreira – políticas usam `current_setting('app.producer_id')`
- **Middleware extrai `producerId`** da sessão e injeta no header `x-producer-id`
- **Testes obrigatórios** de cross-tenant garantem que um produtor nunca veja dados de outro

### 2.4. Proteção de dados em trânsito e repouso
- **Em trânsito**: TLS 1.3 + HSTS, certificados automáticos (Vercel)
- **Em repouso**: Criptografia de disco no PostgreSQL (Supabase) e backups criptografados
- **Arquivos sensíveis** (fotos de NF, PDFs de relatórios) servidos via API com verificação de permissão; URLs não adivinhatóveis

### 2.5. Logs de auditoria (imutáveis)
- **Estrutura**: Append-only, com assinatura hash encadeada (blockchain-like)
- **Categorias**: Segurança (roxo), Financeiro (verde), Operações Técnicas (azul)
- **Metadados obrigatórios**: `user_id`, `action`, `timestamp`, `ip_address`, `data_before`, `data_after`
- **Eventos registrados**:
  - Segurança: login (sucesso/falha), alteração de permissão, criação de usuário
  - Financeiro: criação de assinatura, upgrade, webhook de pagamento, falha
  - Operações: criação de produtor, alteração de configuração global, sincronização externa
- **Interface forense**: Filtros por período, usuário, tipo de ação; exportação para JSON

### 2.6. Proteção contra ataques comuns da web
- **XSS**: Escape automático pelo React/Next.js + CSP (Content Security Policy)
- **CSRF**: Headers + tokens stateful (Clerk e Stripe)
- **SQL injection**: Prevenida pelo Prisma ORM (queries parametrizadas) + RLS
- **DDoS / Brute force**: Rate limiting por IP e por usuário
- **Força bruta em login**: Clerk bloqueia após tentativas configuráveis

### 2.7. Segurança financeira (Stripe)
- **PCI Compliance Nível 1**: Agrotech nunca armazena números de cartão
- **Webhooks assinados**: Verificação de assinatura para evitar falsificação
- **Monitoramento de fraudes**: Alertas de picos de estorno ou assinaturas suspeitas

### 2.8. Conformidade e certificações
- **Objetivo**: ISO 27001 no primeiro ano de operação
- **Relatórios de conformidade sanitária** para produtores atendem a exigências legais
- **Auditoria externa anual** de segurança por terceiros

### 2.9. Plano de resposta a incidentes
- **Comprometimento de credenciais**: Super Admin pode deslogar todas as sessões imediatamente
- **Vazamento de dados**: RLS e isolamento multi-tenant limitam o dano a um único produtor
- **Backups automáticos** (Supabase PITR) permitem recuperação point-in-time
- **Logs de auditoria** imutáveis para investigação forense

---

## 3. Observabilidade e monitoramento

| Aspecto               | Ferramenta / Método                              |
|-----------------------|--------------------------------------------------|
| Logs de aplicação     | Vercel Edge Logs + Sentry                       |
| Métricas de banco     | Supabase Insights (pg_stat_statements)          |
| Performance frontend  | Lighthouse CI + Vercel Analytics                |
| Alertas               | PagerDuty / Slack (via webhook configurável)    |
| Health checks         | Endpoint `/api/health` (verifica banco, Stripe, Clerk) |
| Rastreamento de erros | Sentry (integração com Next.js)                 |

---

## 4. Resumo para implementação

- **Toda tecnologia listada acima é obrigatória** e deve ser configurada conforme as versões estáveis mais recentes.
- **Todas as medidas de segurança** devem ser implementadas antes do lançamento em produção.
- **A arquitetura multi-tenant** é o pilar central – qualquer nova feature deve respeitar o isolamento via `producerId`.
- **Os logs de auditoria** devem ser acionados em cada ação crítica (mutável) do sistema.
- **A conformidade PCI** é automática ao usar Stripe, mas a equipe deve garantir que nenhum dado de cartão transite pelos próprios servidores.

**Fim da especificação de Tecnologias e Segurança.**




# OpenSpec – UI/UX do Agrotech SaaS (EggTrack)
## Diretrizes consolidadas para design de interface e experiência do usuário

Este documento contém todas as decisões visuais e de interação extraídas do detalhamento técnico de UI/UX. Utilize como guia único para construir uma aplicação "linda", profissional e de alta performance.

---

## 1. Filosofia de design

### 1.1. Luxury Admin
- **Descrição**: Design que prioriza densidade de informação sem perder elegância operativa.
- **Paleta principal**: Tons profundos de Slate (`#0F172A` a `#1E293B`) e Indigo (`#1E1B4B` a `#4F46E5`)
- **Destaques**: Esmeralda (`#10B981`) e Violeta (`#8B5CF6`) para ações positivas e gradientes
- **Contraste**: Fundo Slate-950 com elementos Indigo-500 → ambiente focado e profissional

### 1.2. Glassmorphism (Vidro jateado)
- **Aplicação**: Cards, modais, painéis
- **Efeito**: `backdrop-filter: blur(20px)` com fundo semi-transparente
- **Bordas**: Cores semi-transparentes (ex: `border-color: rgba(255,255,255,0.1)`) para integração suave
- **Bordas duplas** em elementos de destaque: borda interna sutil simulando brilho de vidro polido

---

## 2. Layout e estruturação

### 2.1. CSS Grid para cockpit executivo
- **Uso obrigatório**: Dashboard administrativo, páginas com múltiplos widgets
- **Objetivo**: Distribuição geométrica impecável, cada widget ocupa espaço com precisão matemática

### 2.2. Flexbox para alinhamento interno
- **Uso**: Alinhamento vertical de textos e ícones em listas complexas, cartões de produtores
- **Proporção áurea**: Elementos internos de cartões mantêm proporção áurea independente da densidade de conteúdo

### 2.3. Sidebar colapsável
- **Comportamento**: Colapsa de forma inteligente, maximizando área de trabalho sem perder acesso a ferramentas críticas
- **Offset rígido**: Sidebar nunca sobrepõe conteúdo central, mesmo em telas menores

### 2.4. Margens e espaçamento
- **Grade rígida de 8px**: Todos os espaçamentos (padding, margin, gap) seguem múltiplos de 8px
- **Escala moderna**: Controle rigoroso eliminando qualquer desalinhamento visual
- **Respiro visual**: Margens internas (padding) em cards de dados otimizadas para evitar sobrecarga informativa
- **Margens externas** entre seções principais: conteúdo consumido em blocos lógicos

---

## 3. Componentes de UI

### 3.1. Botões
- **Raio de borda**: 12px (generoso, formas orgânicas)
- **Gradientes lineares complexos** com realce de borda de 1px para efeito de elevação sutil
- **Efeito hover**: Transição de escala sutil (ex: `transform: scale(1.02)`) com timing `cubic-bezier`
- **Pseudo-elementos** para brilho e reflexo em botões premium

### 3.2. Cards e painéis
- **Glassmorphism** com blur de 20px
- **Sombras suaves multicamadas** para hierarquia tridimensional
- **Bordas arredondadas de 24px** em cards principais (suavizam a rigidez da grade)

### 3.3. Formulários e entradas de dados
- **Estados de foco vibrantes**: Guiam o cursor do usuário
- **Eficiência de entrada**: Campos com validação em tempo real, máscaras automáticas
- **Componentes customizados**: Seletor de datas e calendários totalmente estilizados para integrar à paleta escura, sem choque visual

### 3.4. Tabelas e listas
- **Truncamento inteligente** de texto com tooltips informativos
- **Ícones de status** com filtro de brilho (`drop-shadow`) para destaque em baixa luminosidade

### 3.5. Modais e sobreposições
- **Backdrop-filter** para criar modais flutuantes, mantendo contexto com conteúdo de fundo
- **Sobreposição escura** que elimina distrações e foca na tomada de decisão

### 3.6. Sistema de busca reativa
- **Animações de entrada** que destacam novos resultados encontrados
- **Transições de opacidade** para resultados de busca fluida

### 3.7. Indicadores de progresso e estatísticas
- **Gradientes suaves** entre tons de Indigo e Violeta, simbolizando evolução técnica da granja

### 3.8. Selos de verificação e indicadores de status
- **Verde Esmeralda saturado** para selo de granja verificada
- **Cores semânticas para notificações** (sucesso, alerta, erro) com ajustes de saturação alinhados à estética premium

### 3.9. Planos de assinatura
- **Gradientes distintos** para Free, Pro, Enterprise, comunicando valor visualmente

---

## 4. Tipografia

### 4.1. Família principal
- **Inter**: Escolhida por legibilidade superior em ambientes digitais, transmitindo modernidade e autoridade técnica

### 4.2. Hierarquia
- **Variações de peso** para guiar o usuário pelos módulos

### 4.3. Escala responsiva
- **Uso de `clamp()` e `min-max`** para fontes se adaptarem organicamente ao tamanho da viewport

### 4.4. Gradientes de texto metálicos
- **Uso em títulos principais** para elevar percepção de valor

---

## 5. Animações e transições

### 5.1. Transição entre páginas
- **Fade-in + slide-up** suave, reforçando robustez e rapidez

### 5.2. Micro-animações de hover
- **Cubic-bezier personalizado** para transições suaves, reforçando reatividade
- **Escala sutil** em botões

### 5.3. Loaders e skeletons
- **Feedback visual** garante que usuário nunca se sinta perdido durante processamento

---

## 6. Responsividade

### 6.1. Prioridade absoluta
- **Breakpoints específicos** para tablets e desktops de grande formato
- **Layout fluido** mantém integridade em qualquer cenário

### 6.2. Flexibilidade
- **Flexbox** para alinhamento interno, adaptando-se a diferentes resoluções
- **Fontes responsivas** com clamp

---

## 7. Temas e variáveis CSS

### 7.1. Custom Properties
- **Centralização de temas** e tokens de design para ajustes globais ágeis

### 7.2. Cores semânticas
- **Notificações**: Verde (sucesso), Amarelo (alerta), Vermelho (erro), ajustados para estética premium

---

## 8. Arquitetura de estilos (SASS Modules)

### 8.1. Isolamento de escopo
- **Cada componente** tem seu próprio `*.module.scss`
- **Evita vazamento de CSS** e facilita manutenção

### 8.2. Organização de arquivos
- **Tokens globais** em `_tokens.scss`
- **Módulos independentes** para cada componente funcional

---

## 9. Diretrizes de acessibilidade

### 9.1. Contraste
- **Paleta Luxury Admin testada** para garantir alto contraste e acessibilidade
- **Identificação de alertas críticos em milissegundos**

### 9.2. Redução de movimento
- **Respeitar `prefers-reduced-motion`**: Desabilitar animações quando solicitado pelo sistema operacional.

---

## 10. Iconografia

### 10.1. Biblioteca Lucide React
- **Símbolos consistentes e minimalistas** para navegação intuitiva
- **Todos os ícones seguem mesma linha visual** (stroke-width consistente, tamanhos padronizados)

---

## 11. Diretrizes de implementação técnica (resumo)

### 11.1. Tecnologias UI obrigatórias
- **SASS Modules** com tokens
- **CSS Grid** para layouts principais
- **Flexbox** para alinhamentos internos
- **Framer Motion** para animações controladas
- **Lucide React** para ícones

### 11.2. Variáveis CSS para temas
- **Custom Properties** para cores, espaçamento, bordas, sombras

---

## 12. Checklist de qualidade visual

- [ ] Todos os cards possuem efeito glassmorphism com blur 20px.
- [ ] Botões têm raio 12px e gradiente linear com borda de destaque.
- [ ] Hover de botões aplica escala sutil (1.02) com transição suave.
- [ ] Sidebar é colapsável e respeita offset rígido.
- [ ] Espaçamentos seguem múltiplos de 8px.
- [ ] Fontes usam Inter e sistema de pesos hierárquico.
- [ ] Contraste mínimo WCAG AA em todos os textos.
- [ ] Transições de página com fade-in + slide-up.
- [ ] Modais utilizam backdrop-filter e sobreposição escura.
- [ ] Seletor de datas e calendários completamente customizado (sem componentes padrão do navegador).
- [ ] Todos os ícones vêm da Lucide React.
- [ ] Tema escuro é padrão, com possibilidade de tema claro futuro.
- [ ] Layout é responsivo e testado em 320px, 768px, 1024px, 1440px.
- [ ] Loaders e skeletons existem para todas as operações assíncronas.
- [ ] Nenhum vazamento de CSS entre componentes (SASS Modules).

---

**Fim da especificação UI/UX.** A implementação deve seguir estas diretrizes rigorosamente para garantir a estética "Luxury Admin" e a experiência profissional descrita.