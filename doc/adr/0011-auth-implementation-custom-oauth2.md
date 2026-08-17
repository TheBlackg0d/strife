# 0011. Implémentation de l'Auth : maison + OAuth2 client (pas de Keycloak)

Date : 2026-08-15

## Statut

Accepté

## Contexte

Deux objectifs d'apprentissage motivent ce projet en matière d'authentification : (1) comprendre la mécanique d'authentification elle-même (hashing de mot de passe, émission/validation de JWT, gestion de sessions), et (2) supporter le login via des fournisseurs tiers (Google, Facebook).

Un fournisseur d'identité externe comme Keycloak aurait pu gérer les deux — Keycloak a un support natif pour le login social ("Identity Brokering") — mais dans ce cas, Keycloak gère le hashing, l'émission de tokens et les sessions en interne : le premier objectif d'apprentissage ne serait pas atteint.

## Décision

Le service Auth est construit à la main avec Spring Security :

- **Login classique (email/mot de passe)** : hashing de mot de passe, émission et validation de JWT, gestion de sessions/refresh tokens — implémentés directement dans le service.
- **Login social (Google, Facebook, etc.)** : utilisation du support "OAuth2 Client" de Spring Security pour gérer le flow d'autorisation avec chaque fournisseur (redirection, échange du code d'autorisation, récupération des infos de profil). Après réception des infos du fournisseur tiers, le service Auth décide lui-même de créer ou lier un compte local, puis émet SON PROPRE JWT pour le reste du système — il ne fait pas que relayer le token du fournisseur tiers.

## Alternatives considérées

**Keycloak (ou un autre IdP externe : Auth0, Okta, Cognito)** — écarté pour ce projet : simplifierait le login social mais déléguerait la mécanique d'authentification à un outil externe, ce qui va à l'encontre du premier objectif d'apprentissage. Reste une option intéressante à explorer sur un futur projet, une fois la mécanique "from scratch" maîtrisée.

## Conséquences

Plus de travail d'implémentation que d'utiliser un IdP externe, mais un apprentissage plus complet des deux mécanismes (auth maison + intégration OAuth2 client). Le service Auth émet l'identifiant utilisateur (ex. un UUID) qui sert de clé de référence pour le service Users ([ADR-0010](0010-auth-users-service-split.md)), peu importe la méthode de login utilisée (locale ou sociale).
