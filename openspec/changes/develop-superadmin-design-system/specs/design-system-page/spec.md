# Spec: SuperAdmin Design System

## MODIFIED Requirements
### Requirement: Restrict Administrative Links
Administrative and design links SHALL NOT be visible in the producer's sidebar to prevent operational confusion and potential security bypasses.

#### Scenario: Producer sidebar access
- **Given** a user is logged in as a Producer.
- **When** the sidebar is rendered.
- **Then** the "Admin" and "Design System" links MUST NOT be present.

### Requirement: Centralize Design Tools for SuperAdmin
The Design System showcase SHALL be easily accessible only for users with SuperAdmin privileges through their dedicated navigation.

#### Scenario: SuperAdmin sidebar access
- **Given** a user is logged in as a SuperAdmin.
- **When** the AdminSidebar is rendered.
- **Then** the "Design System" link MUST be visible.

## ADDED Requirements
### Requirement: Component Catalog Visualization
The Design System page SHALL provide a comprehensive view of all UI primitives to ensure visual consistency across the platform.

#### Scenario: Visualizing Design Tokens
- **Given** the user is at `/admin/design`.
- **Then** they MUST see the platform's color palette and typography scales.

#### Scenario: Interaction Testing
- **Given** the user is at `/admin/design`.
- **When** hovering over a "Premium Button".
- **Then** it MUST display the magnetic elevation and indigo shadow effect.
