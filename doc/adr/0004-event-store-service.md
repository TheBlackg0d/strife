# 0004. Service Event-Store / historique

Date : 2026-08-15

## Statut

Accepté

## Contexte

RabbitMQ ne garde pas un historique persistant des messages une fois consommés (voir [ADR-0001](0001-message-broker-rabbitmq.md)). Or, le pattern de réplication d'état par events ([ADR-0003](0003-database-per-service-event-carried-state.md)) suppose qu'un nouveau service (ou une nouvelle instance) puisse rejouer l'historique complet des events pertinents pour construire sa copie locale de données.

Il faut donc un endroit qui garde une trace complète et permanente de tous les events du système.

## Décision

Un service dédié — "event-store" / "historique" — persiste chaque event publié dans le système, de façon append-only (on n'écrit jamais par-dessus, on ne supprime jamais), dans sa propre base de données.

Chaque service producteur publie ses events sur son propre exchange RabbitMQ de type topic (un exchange par service producteur — voir aussi [ADR-0008](0008-guild-channel-service-boundary.md) et suivants pour la liste des services). Le service event-store crée sa propre queue et bind avec le pattern `#` (wildcard qui matche tout) sur chacun de ces exchanges, ce qui lui garantit de recevoir une copie de chaque event, peu importe sa routing key — sans avoir à connaître ou énumérer chaque type d'event à l'avance.

Ce service expose aussi une API permettant à un autre service de demander "l'historique complet" (ou depuis un point donné) pour se synchroniser au démarrage (voir [ADR-0007](0007-service-bootstrap-protocol.md)).

## Alternatives considérées

**Utiliser Kafka pour le replay natif** — écarté, voir [ADR-0001](0001-message-broker-rabbitmq.md).

**Fanout exchange au lieu de topic** — écarté au profit de topic : avec un exchange topic, un seul binding `#` donne au service event-store exactly la même couverture qu'un fanout (tout recevoir), mais permet en plus aux consommateurs "métier" de filtrer par routing key au niveau du broker plutôt que dans leur propre code applicatif.

## Conséquences

Ce service devient un point important du système (si un event ne lui parvient jamais, il est perdu de l'historique pour toujours) — il faut soigner sa fiabilité (voir [ADR-0005](0005-message-deduplication.md) pour la gestion des doublons). Sa base de données va grossir indéfiniment (append-only, jamais de suppression) — une stratégie d'archivage/partitionnement pourra être nécessaire plus tard, mais n'est pas un problème pour le scope actuel du projet.
