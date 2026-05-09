# Roadmap: Finalização do Ecossistema de Governança (AV365)

Este plano foca em transformar as páginas de configuração e administração de "alta fidelidade visual" em "plena capacidade funcional", integrando segurança, faturamento e persistência de arquivos.

## 🏢 Módulo 1: Identidade & Capital Humano (Polimento)
- [x] **Upload Real de Arquivos**:
    - [x] Configurar um provedor de Storage (ex: Supabase Storage ou S3) para `logoUrl`.
    - [x] Implementar componente de upload visual com Dropzone no `CompanySettingsForm`.
    - [x] Adicionar suporte a upload de PDFs para contratos de funcionários no hub de RH.
- [x] **Validação de Documentos**:
    - [x] Adicionar máscaras de entrada (CNPJ, CPF, Telefone) no client-side para melhor UX.
    - [x] Implementar validação real de dígitos verificadores nas Server Actions.

## 🛡️ Módulo 2: Segurança & Acesso (`/settings/security`)
- [x] **Gestão de Credenciais**:
    - [x] Implementar interface de troca de senha integrada com o Clerk.
    - [x] Adicionar toggle para Autenticação de Dois Fatores (2FA).
- [x] **Logs de Auditoria**:
    - [x] Criar aba de "Sessões Ativas" para controle de dispositivos logados.

## 💳 Módulo 3: Faturamento & Assinaturas (`/settings/billing`)
- [x] **Integração Master Stripe**:
    - [x] Criar Portal do Cliente (Stripe Customer Portal) para troca de planos e cancelamentos.
    - [x] Implementar listagem de faturas (Invoices) com download de PDF.
    - [x] Exibir consumo de limites do plano atual (ex: Aves monitoradas / Limite do plano).

## ⚡ Módulo 4: Infraestrutura Master (`/admin/webhooks`)
- [x] **Engine de Sincronia**:
    - [x] Implementar rota de API de Webhook real para processar eventos do Stripe.
    - [x] Criar Dashboard de Logs de Webhook para monitorar falhas e retentativas.
    - [x] Blindar endpoint com verificação de assinatura SHA512.

## 🧪 Módulo 5: Qualidade & Performance
- [x] Executar `npx tsc --noEmit` para garantir integridade total dos tipos.
- [x] Realizar auditoria de Lighthouse nas novas páginas (Meta: 95+ em todas as métricas).
- [x] Testar fluxos críticos (Contratação -> Faturamento -> Webhook) de ponta a ponta.

