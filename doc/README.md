# Documentation — Strife

Ce dossier contient la documentation d'architecture du projet Strife.

## Vue d'ensemble

[`architecture/services-overview.md`](architecture/services-overview.md) — référence vivante de l'état actuel des services, mise à jour au fur et à mesure (contrairement aux ADR ci-dessous, qui sont un journal historique de décisions).

[`architecture/data-model.md`](architecture/data-model.md) — référence vivante des entités/tables de chaque service.

[`architecture/functionalities.md`](architecture/functionalities.md) — référence vivante des fonctionnalités/opérations de chaque service, au-delà du CRUD.

## Architecture Decision Records (ADR)

Les décisions d'architecture sont documentées sous forme d'ADR (Architecture Decision Record) dans `adr/`. Un ADR est un court document qui capture une décision, le contexte qui l'a motivée, les alternatives considérées, et les conséquences (bonnes et mauvaises) d'avoir pris cette décision.

L'intérêt : dans six mois, quand on se demande "pourquoi on a fait ça de même", la réponse est écrite quelque part au lieu d'être perdue.

### Index des décisions

| # | Titre | Statut |
|---|-------|--------|
| [0001](adr/0001-message-broker-rabbitmq.md) | Choix du message broker : RabbitMQ | Accepté |
| [0002](adr/0002-sync-vs-async-communication.md) | Communication synchrone vs asynchrone (hybride) | Accepté |
| [0003](adr/0003-database-per-service-event-carried-state.md) | Database-per-service + réplication par events | Accepté |
| [0004](adr/0004-event-store-service.md) | Service Event-Store / historique | Accepté |
| [0005](adr/0005-message-deduplication.md) | Déduplication des messages | Accepté |
| [0006](adr/0006-entity-versioning-for-reconciliation.md) | Versioning par entité pour la réconciliation d'état | Accepté |
| [0007](adr/0007-service-bootstrap-protocol.md) | Protocole de démarrage d'un nouveau service | Accepté |
| [0008](adr/0008-guild-channel-service-boundary.md) | Frontière de service : Guild + Channel fusionnés | Accepté |
| [0009](adr/0009-gateway-presence-service.md) | Service Gateway (WebSocket) et gestion de la presence | Accepté |
| [0010](adr/0010-auth-users-service-split.md) | Séparation des services Auth et Users | Accepté |
| [0011](adr/0011-auth-implementation-custom-oauth2.md) | Implémentation de l'Auth : maison + OAuth2 client | Accepté |
| [0012](adr/0012-network-isolation-and-gateway-trust.md) | Isolation réseau et modèle de confiance des Gateways | Accepté |
| [0013](adr/0013-routing-key-convention.md) | Convention de nommage des routing keys | Accepté |
| [0014](adr/0014-auth-users-registration-flow.md) | Flux de création de profil à l'inscription (Auth → Users) | Accepté |

### Comment ajouter un nouvel ADR

Copier `adr/template.md`, lui donner le prochain numéro disponible, remplir les sections, et l'ajouter à la table ci-dessus.

## Note

Ces documents sont un premier jet basé sur les discussions d'architecture — à relire, corriger et compléter par toi. Le but n'est pas qu'ils soient parfaits tout de suite, mais qu'ils reflètent fidèlement ta compréhension et tes décisions une fois que tu les auras révisés.
