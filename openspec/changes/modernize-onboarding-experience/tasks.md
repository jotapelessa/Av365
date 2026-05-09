# Tarefas: Modernizar Onboarding e Refinamento de UI

## Fase 1: Inteligência de Roteamento e Limpeza
- [x] Refatorar `src/proxy.ts` para implementar o Roteamento Baseado em Papéis (Superadmin vs Produtor).
- [x] Configurar redirecionamento automático pós-login no Clerk para o Proxy.
- [x] Verificar e limpar o banco de dados de produtores cadastrados incorretamente no fluxo antigo.

## Fase 2: Implementação do Portal de Configuração (`/setup`)
- [x] Construir a Etapa 1: Vitrine de Planos (Cards Premium "Luxury Pastel").
- [x] Construir a Etapa 2: Formulário de Especialista (Zootecnia & Operacional).
- [x] Implementar a Server Action `completeSetup` integrada com Stripe (Trial) e Clerk.

## Fase 3: Refinamento Global de UI
- [x] Auditar e refatorar `src/components/ui/` (LuxuryButton, LuxuryTable) para corresponder ao `PADRAO_UI_PROJETO.md`.
- [x] Refinar `DashboardCard` e `BentoWrapper` para o raio de 18px e glassmorphism.
- [x] Migrar tabelas críticas (Admin, Financeiro) para o novo sistema `LuxuryTable`.

## Fase 4: Finalização
- [x] Excluir a pasta `src/app/onboarding`. (Concluído)
- [ ] Executar `npx tsc --noEmit` para garantir zero erros de tipo.
- [x] Realizar um walkthrough manual do novo fluxo de configuração. (Concluído)
