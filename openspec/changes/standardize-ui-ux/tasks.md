# Tarefas: Padronização UI/UX Agrotech

## Fase 1: Inventário e Consolidação
- [x] Realizar inventário final de todos os valores hex/rgb no diretório `src/styles/`.
- [x] Realizar auditoria visual e técnica de todas as abas e módulos do projeto (Dashboard, Financeiro, Galpões, Admin e Auth padronizados).
- [x] Criar o arquivo `src/styles/abstracts/_standard_tokens.scss` unificando `_variables.scss` e `_tokens.scss`.
- [x] Migrar para Tailwind v4 `@theme` como motor principal de tokens.

## Fase 2: Documentação do Design System
- [x] Gerar o arquivo `PADRAO_UI_PROJETO.md` com a especificação completa.
- [x] Adicionar diretrizes para uso de animações (Framer Motion).
- [x] Consolidar variantes pastel no `globals.css`.

## Fase 3: Validação e Refinamento
- [x] Auditar `src/app/flocks/[id]/page.tsx` para garantir conformidade com o novo padrão.
- [x] Verificar se as Server Actions continuam gerando estilos consistentes nos logs/auditoria.
- [x] Validar responsividade do Bento Grid e Sidebar em resoluções mobile (320px - 768px).
- [x] Implementar Sidebar responsiva com Slide-in e Overlay.
