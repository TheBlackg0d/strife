# Vue d'ensemble des services — Strife

Ce document est une référence vivante de l'architecture actuelle : contrairement aux ADR (`../adr/`) qui documentent chaque décision et son raisonnement dans le temps, ce fichier décrit l'état actuel du système et est mis à jour au fur et à mesure que l'architecture évolue.

Statut : architecture v1 complète (2026-08-15).

---

## Auth

**Responsabilité** : authentification — inscription, login (email/mot de passe), login social (Google/Facebook via OAuth2 Client), émission et validation de JWT, refresh tokens.

**Données possédées** : identifiants (email), mots de passe hashés, sessions/tokens, liens vers les comptes des fournisseurs OAuth2 tiers.

**Expose (sync)** : endpoints REST pour register/login/refresh/callback OAuth2. La réponse d'inscription retourne directement les infos de base (email, nom, prénom) au client — pas besoin d'attendre Users.

**Publie (async)** : `auth.account.registered` après une inscription réussie, avec les infos de base — consommé par Users pour créer sa copie du profil (et par l'event-store). Pas d'appel synchrone entre Auth et Users.

**Voir** : [ADR-0010](../adr/0010-auth-users-service-split.md), [ADR-0011](../adr/0011-auth-implementation-custom-oauth2.md), [ADR-0014](../adr/0014-auth-users-registration-flow.md)

---

## Users

**Responsabilité** : profil applicatif de l'utilisateur.

**Données possédées** : username, avatar, bio, statut préféré (online/away/dnd/invisible), et toute autre donnée de profil future. Référence l'utilisateur par l'ID émis par Auth.

**Expose (sync)** : endpoints REST pour lire/modifier un profil.

**Consomme (async)** : `auth.account.registered` pour créer le profil initial (marqué "incomplet" jusqu'à ce que l'utilisateur ajoute avatar/bio/etc.).

**Scope étendu (2026-08-15)** : Users gère aussi les relations d'amitié et le blocage entre utilisateurs (entité `Relationship`, voir `data-model.md`) — amis et DM ont été ajoutés au scope v1.

**Voir** : [ADR-0010](../adr/0010-auth-users-service-split.md), [ADR-0009](../adr/0009-gateway-presence-service.md), [ADR-0014](../adr/0014-auth-users-registration-flow.md)

---

## Guild (inclut Channel)

**Responsabilité** : gestion des serveurs (guildes), de leurs channels, membres, rôles/permissions.

**Données possédées** : guildes, channels, membres, rôles.

**Voir** : [ADR-0008](../adr/0008-guild-channel-service-boundary.md)

**TBD** : détail des endpoints exposés, modèle de rôles/permissions.

---

## Messaging

**Responsabilité** : persistance et diffusion des messages postés dans un channel.

**Données possédées** : messages (contenu, channel, auteur, timestamp). Garde aussi une copie locale (read-model) des permissions/membres par channel, répliquée par events depuis Guild — plutôt qu'un appel synchrone à Guild à chaque post, vu la fréquence très élevée de cette opération.

**Expose (sync)** : endpoint REST pour poster un message — le client attend la confirmation que le message est sauvegardé.

**Publie (async)** : un event `MessagePosted` (ou similaire) après sauvegarde, consommé par Gateway (diffusion temps réel aux clients connectés) et par l'event-store.

**Limite connue (acceptée pour v1)** : la copie locale de permissions étant répliquée de façon asynchrone, il existe une fenêtre de temps où un utilisateur qui vient d'être banni/kické peut encore réussir à poster un message avant que la mise à jour ne soit traitée. Une invalidation synchrone ciblée pour les actions de modération a été envisagée mais écartée pour v1 (complexité : gestion d'échec de l'appel, et plusieurs instances de Messaging à invalider, pas juste une) — à reconsidérer en v2.

**Voir** : [ADR-0003](../adr/0003-database-per-service-event-carried-state.md)

**TBD (scope étendu)** : modèle de données pour les DM (conversation privée entre deux utilisateurs, distincte d'un channel de guilde) — amis/DM ajoutés au scope v1, voir `data-model.md`.

---

## Realtime Gateway (WebSocket)

**Responsabilité** : connexions temps réel des clients, diffusion des events (nouveaux messages, changements de presence, etc.) vers les clients connectés. Exposé publiquement (voir section Réseau ci-dessous).

**Données possédées** : aucune base de données relationnelle propre — état de connexion dans Redis (partagé entre instances, TTL rafraîchi par heartbeat).

**Voir** : [ADR-0009](../adr/0009-gateway-presence-service.md), [ADR-0012](../adr/0012-network-isolation-and-gateway-trust.md)

---

## API Gateway (HTTP)

**Responsabilité** : point d'entrée HTTP unique pour les clients. Route les requêtes vers le bon service backend (Auth, Users, Guild, Messaging). Valide le JWT une seule fois à l'entrée, extrait les infos utiles (ID utilisateur, rôles) et les transmet aux services backend via des headers — les services backend leur font confiance sans revalider, en s'appuyant sur l'isolation réseau.

**Données possédées** : aucune — composant de routing/sécurité, pas de logique métier.

**Voir** : [ADR-0012](../adr/0012-network-isolation-and-gateway-trust.md)

---

## Réseau / déploiement

Auth, Users, Guild, Messaging, Event-Store, ainsi que RabbitMQ, PostgreSQL et Redis vivent dans un réseau Docker interne sans port publié vers l'extérieur. Seuls API Gateway et Realtime Gateway sont exposés publiquement — c'est le seul chemin d'entrée possible dans le système.

**Voir** : [ADR-0012](../adr/0012-network-isolation-and-gateway-trust.md)

---

## Event-Store / Historique

**Responsabilité** : persiste tous les events du système de façon append-only ; permet à un nouveau service de rejouer l'historique complet au démarrage.

**Données possédées** : log complet de tous les events publiés par tous les services.

**Voir** : [ADR-0004](../adr/0004-event-store-service.md), [ADR-0007](../adr/0007-service-bootstrap-protocol.md)

---

## Convention d'events

Format des routing keys : `<service>.<entité>.<action>`, minuscule, action au passé. Voir [ADR-0013](../adr/0013-routing-key-convention.md) pour la liste d'exemples et le catalogue à compléter au fur et à mesure de l'implémentation.

## Questions ouvertes / à clarifier

- v2 : invalidation synchrone ciblée pour les actions de modération dans Messaging (voir section Messaging ci-dessus).

**L'architecture v1 est considérée complète.** Prochaine étape : scaffolding du repo.
