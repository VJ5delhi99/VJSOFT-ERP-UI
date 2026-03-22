# Mobile Foundation

This folder holds the React Native / Expo-oriented mobile shell for the ERP.

The mobile app is designed around the same shared module registry used by the web app:

- `packages/shared/src/modules.ts` defines business modules, route intent, and mobile priority.
- `packages/shared/src/mobile.ts` defines the mobile workboard and quick actions.
- Mobile screens are intentionally optimized for approvals, quick review, and operational follow-up instead of mirroring dense desktop layouts one-to-one.

Suggested next step when dependencies are ready:

1. Add the Expo / React Native runtime packages for this app.
2. Wire authentication and API clients to the shared domain layer.
3. Extend the starter screens here into role-aware approval, alerts, finance, and inventory flows.
