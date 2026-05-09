# Plano de Implementação: Centro de Comando e Homepage Elite (AV365)

Este plano detalha a finalização do overhaul UI/UX do Centro de Comando de Tarefas e o refinamento da Homepage para o padrão "Elite", focando em inteligência avícola tática e rastreabilidade total.

## Visão Geral
Transformar a aplicação em um ecossistema de alta performance para avicultura, integrando design de luxo com dados operacionais de alta fidelidade.

- **Tipo de Projeto:** WEB (Next.js 15+ App Router)
- **Status:** Em andamento (Overhaul UI/UX)

## Critérios de Sucesso
- [ ] Homepage com sessões de "Poder SaaS" (Biosseguridade, Ambiência, Ciclos, ROI) totalmente funcionais visualmente.
- [ ] `TasksClient.tsx` sem erros de sintaxe e com layout Bento Grid 100% alinhado ao `PADRAO_UI_PROJETO.md`.
- [ ] Calendário tático com interatividade aprimorada (Popovers com detalhes da missão ao clicar).
- [ ] Log de Auditoria visualmente rico com timeline detalhada.
- [ ] Banco de dados povoado com dados de exemplo de alta fidelidade.

## Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **UI/Styling:** Tailwind CSS + Framer Motion
- **Database:** Prisma (PostgreSQL/Supabase)
- **Icons:** Lucide React
- **Date Handling:** date-fns

## Estrutura de Arquivos Relevante
- `src/app/page.tsx`: Homepage
- `src/app/tasks/TasksClient.tsx`: Centro de Comando
- `src/app/tasks/actions.ts`: Server Actions (Audit Log logic)
- `prisma/producer-seed.ts`: Seed Script

## Task Breakdown

### Fase 1: Estabilização e Auditoria (P0)
| ID | Tarefa | Agente | Skills | Prioridade | Dependências |
|:---|:---|:---|:---|:---|:---|
| T1.1 | Corrigir erros de sintaxe em `TasksClient.tsx` (returns duplicados e chaves órfãs) | `backend-specialist` | `clean-code` | P0 | - |
| T1.2 | Verificar integridade dos dados no banco (Seed Audit) | `database-architect` | `prisma-expert` | P0 | - |

### Fase 2: Homepage "Expert Poultry" (P1)
| ID | Tarefa | Agente | Skills | Prioridade | Dependências |
|:---|:---|:---|:---|:---|:---|
| T2.1 | Refinar Hero Section com tipografia Elite e marketing focado em ROI avícola | `frontend-specialist` | `ui-ux-pro-max`, `frontend-design` | P1 | - |
| T2.2 | Implementar sessões de "Poder SaaS" (Biosseguridade, Ambiência, Ciclos, Custos) com micro-interações | `frontend-specialist` | `frontend-design`, `tailwind-patterns` | P1 | T2.1 |
| T2.3 | Adicionar cards de KPIs em tempo real (GPD, CA, Mortalidade) com visual Luxury Pastel | `frontend-specialist` | `ui-ux-pro-max` | P1 | T2.2 |

### Fase 3: Centro de Comando Tático (P1)
| ID | Tarefa | Agente | Skills | Prioridade | Dependências |
|:---|:---|:---|:---|:---|:---|
| T3.1 | Implementar Glassmorphism e Bento Grid rigoroso em `TasksClient.tsx` | `frontend-specialist` | `ui-ux-pro-max`, `frontend-design` | P1 | T1.1 |
| T3.2 | Melhorar interatividade do Calendário (Popovers com detalhes da missão ao clicar) | `frontend-specialist` | `react-best-practices` | P1 | T3.1 |
| T3.3 | Refinar Log de Auditoria lateral com timeline visual e metadados de sistema | `frontend-specialist` | `ui-ux-pro-max` | P1 | T3.1 |

### Fase 4: Polimento e Verificação (P2)
| ID | Tarefa | Agente | Skills | Prioridade | Dependências |
|:---|:---|:---|:---|:---|:---|
| T4.1 | Aplicar locale `pt-BR` em todas as exibições de data e valores | `frontend-specialist` | `clean-code` | P2 | - |
| T4.2 | Executar scripts de auditoria (`ux_audit.py`, `checklist.py`) | `qa-automation-engineer` | `lint-and-validate` | P2 | T3.3 |

## Plano de Rollback
1. Manter cópias de segurança dos arquivos principais antes de grandes refatorações.
2. Utilizar `git checkout` para reverter mudanças se houver erros de runtime críticos.
3. Verificar logs do console em tempo real.

---
## ✅ Fase X: Verificação Final
- [ ] Sem erros de lint/typescript
- [ ] Mobile responsive (320px+)
- [ ] Sem cores púrpuras proibidas (Purple Ban)
- [ ] Animações fluidas (Framer Motion)
