# 0001. Choix du message broker : RabbitMQ

Date : 2026-08-15

## Statut

Accepté

## Contexte

Strife est un clone de Discord bâti comme projet d'apprentissage (Spring Boot, microservices, architecture événementielle). Il faut un broker de messages pour la communication asynchrone entre services. Les deux candidats naturels sont RabbitMQ et Kafka.

Kafka offre un log persistant et rejouable nativement, du très haut débit et du partitionnement — mais au prix d'une complexité opérationnelle plus élevée (plus de pièces mobiles à faire tourner et comprendre en local, courbe d'apprentissage plus raide).

RabbitMQ est un broker de messages plus traditionnel (exchanges, queues, bindings), plus simple à installer et à faire tourner localement (un seul conteneur Docker), avec un modèle de routage flexible (topic, fanout, direct).

## Décision

On utilise RabbitMQ comme broker de messages pour Strife.

## Alternatives considérées

**Kafka** — écarté pour ce projet : le volume de données et le débit attendus pour un projet d'apprentissage ne justifient pas la complexité opérationnelle de Kafka. RabbitMQ permet d'apprendre les concepts d'architecture événementielle (pub/sub, routing, découplage) sans la surcharge d'infrastructure.

## Conséquences

RabbitMQ ne garde pas un historique persistant des messages nativement (contrairement à Kafka) — une fois un message consommé et acquitté, il disparaît de la queue. Pour compenser et pouvoir rejouer l'historique complet des events (nécessaire pour démarrer un nouveau service — voir [ADR-0004](0004-event-store-service.md) et [ADR-0007](0007-service-bootstrap-protocol.md)), il faut construire soi-même un service dédié qui persiste chaque event dans sa propre base de données.

Si le projet évoluait vers un besoin de très haut débit ou de replay natif à grande échelle, il faudrait reconsidérer Kafka.
