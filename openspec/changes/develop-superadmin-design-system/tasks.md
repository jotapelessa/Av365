# Tarefas: SuperAdmin Design System

## 🔒 Fase 1: Hardening de Navegação
- [ ] Refatorar `src/components/layout/Sidebar.tsx`:
    - Remover link "Admin" (`/admin`).
    - Remover link "Design System" (`/admin/design`).
- [ ] Refatorar `src/components/layout/AdminSidebar.tsx`:
    - Adicionar link "Design System" (`/admin/design`) com ícone `Palette` ou `Settings2`.

## 🏗️ Fase 2: Infraestrutura da Página
- [ ] Criar diretório `src/app/admin/design/`.
- [ ] Criar `page.tsx` base com `DashboardContainer` e `BentoWrapper`.
- [ ] Implementar seções de esqueleto (Layout vertical com gaps padronizados).

## 🎨 Fase 3: Showcases de Componentes
- [ ] Implementar `DesignTokensShowcase`: Cores e Tipografia.
- [ ] Implementar `ButtonsShowcase`: Botões Premium e Ações Críticas.
- [ ] Implementar `CardsShowcase`: Variantes de Bento Cards e Glassmorphism.
- [ ] Implementar `TablesShowcase`: Exemplo de tabela de alta densidade.
- [ ] Implementar `FormsShowcase`: Inputs, Selects e validações visuais.

## 🧪 Fase 4: Polimento & Validação
- [ ] Revisar conformidade com `PADRAO_UI_PROJETO.md`.
- [ ] Testar animações de entrada (Staggered) e interações (Hover).
- [ ] Validar responsividade em Mobile/Tablet/Desktop.
- [ ] Verificar integridade dos dados (mock data para showcase).
