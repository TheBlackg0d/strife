# Strife

Clone de Discord, projet d'apprentissage — Spring Boot, microservices, RabbitMQ.

Toute l'architecture est documentée dans [`doc/`](doc/README.md) : décisions ([ADR](doc/adr/)) et [vue d'ensemble des services](doc/architecture/services-overview.md).

## Structure

Projet Maven multi-module, un module par service :

| Module | Rôle | Port par défaut |
|---|---|---|
| `api-gateway` | Point d'entrée HTTP, routing + validation JWT | 8080 |
| `auth-service` | Authentification | 8081 |
| `users-service` | Profils utilisateurs | 8082 |
| `guild-service` | Guildes (serveurs) + channels | 8083 |
| `messaging-service` | Messages | 8084 |
| `realtime-gateway` | Connexions WebSocket, temps réel | 8085 |
| `event-store-service` | Historique complet des events | 8086 |

Chaque module est un squelette Spring Boot minimal (juste de quoi compiler et démarrer) — pas de logique métier, pas de dépendances de persistance/messaging pré-ajoutées. Voir les commentaires dans chaque `pom.xml` pour les dépendances probables à ajouter toi-même selon le rôle du service.

## Démarrer l'infrastructure locale

```
docker compose up -d
```

Ça démarre RabbitMQ (AMQP sur `5672`, interface de gestion sur [http://localhost:15672](http://localhost:15672), identifiants `strife`/`strife`), PostgreSQL (`5432`, une base par service — voir `infra/postgres/init-databases.sh`), et Redis (`6379`).

## Builder

```
mvn clean install
```

(Le premier build télécharge les dépendances Spring Boot depuis Maven Central — connexion internet requise.)

## Prochaines étapes

Voir la section "Questions ouvertes" de [`doc/architecture/services-overview.md`](doc/architecture/services-overview.md), et commencer à implémenter un premier service (Auth est un bon point de départ, vu qu'il ne dépend d'aucun autre service).
