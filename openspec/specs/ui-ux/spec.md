# ui-ux Specification

## Purpose
TBD - created by archiving change init-core-ux-landing-auth-admin. Update Purpose after archive.
## Requirements
### Requirement: A Homepage DEVE ser uma vitrine profissional e responsiva (Ref 11.x).
A página raiz MUST apresentar os valores do EggTrack Elite de forma clara, utilizando design de alta densidade e elementos visuais de luxo para garantir a percepção de valor.

#### Scenario: Usuário não autenticado acessa a raiz
- **Given** um visitante acessa `https://eggtrack.elite/`.
- **When** a página carrega.
- **Then** ele DEVE ver o Hero, Features, Planos e botões claros de login/registro.

### Requirement: O fluxo de autenticação DEVE ser customizado e seguro (Ref 6.x).
As telas de login e registro MUST utilizar a identidade visual do sistema (Indigo/Slate) e DEVE sobrescrever os estilos padrão do provedor para garantir consistência visual.

#### Scenario: Produtor realiza login
- **Given** um produtor na página `/sign-in`.
- **When** he insere as credenciais.
- **Then** ele DEVE ser redirecionado para o `/dashboard` ou `/onboarding` conforme seu estado.

