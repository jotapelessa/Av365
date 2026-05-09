# Change: Initial Base Architecture & Auth

## Why
Estabelecer a fundação técnica do projeto EggTrack conforme especificado no `project.md`. Sem essa base (Next.js, Clerk, Prisma, Multi-tenant), não é possível desenvolver as funcionalidades de negócio.

## What Changes
- [x] Configuração inicial do Next.js (App Router, TS, SCSS Modules).
- [x] Integração com Clerk para Autenticação (Ref 17.x).
- [x] Configuração do Prisma ORM com Supabase (Ref 19.x).
- [x] Implementação do Middleware de Multi-tenancy (Ref 3.x e 21.x).
- [x] Criação do Layout Base "Luxury Admin" (Ref 20.x).

## Impact
- **Specs Afetadas**: `user-auth`, `multi-tenant`, `core-layout`.
- **Arquivos-chave**: `middleware.ts`, `prisma/schema.prisma`, `app/layout.tsx`.
