# Architecture Rules

## Follow the Existing System

- Identify which module, service, or process currently owns the responsibility before deciding where to make changes.
- Extend the existing owner when it can naturally accommodate the new behavior; do not create a second parallel implementation.
- Preserve existing dependency directions and boundaries. If you find bypassed layers, circular dependencies, or implicit shared state, confirm the root cause rather than masking it with new global state.
- Prefer local evolution of stable systems; do not rewrite them unless existing boundaries can no longer ensure correctness.

## Responsibilities and Interfaces

- Each responsibility should have a clear owner and a single source of truth; avoid maintaining the same rule across multiple locations.
- Expose only the minimum interface needed to fulfill a module's responsibility; do not leak internal details to callers.
- Make cross-boundary data, errors, and state explicit. Do not rely on call ordering or hidden conventions for correctness.
- Explain compatibility effects and migration approaches when public interfaces, persisted data, configuration, or event formats change.

## Control Complexity

- Introduce abstractions only for actual requirements, not general frameworks for possible hosts, modes, providers, or workflows.
- Before adding a layer, service, queue, cache, or state machine, show that the existing structure cannot solve the problem simply and completely.
- Before removing duplicate capabilities, confirm caller and data migration; do not merely remove a surface entry point while leaving two sources of truth.
- Directory and class names are not the architecture itself; judge boundaries by responsibilities, data ownership, and observable behavior.

## High-Risk Changes

For changes involving authentication, authorization, payments, shared components, data migration, external interfaces, or release workflows:

1. Search all known callers and dependencies;
2. Identify failure effects and rollback approaches;
3. Maintain least privilege and data safety;
4. Verify success, failure, interruption, and recovery paths;
5. If key facts cannot be confirmed, stop and ask rather than continuing on a guess.
