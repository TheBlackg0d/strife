# 0012. Isolation réseau et modèle de confiance des Gateways

Date : 2026-08-15

## Statut

Accepté

## Contexte

Avec deux points d'entrée pour les clients — un pour le HTTP (API Gateway) et un pour les connexions temps réel (Realtime Gateway, voir [ADR-0009](0009-gateway-presence-service.md)) — il fallait décider comment empêcher un client de contourner ces gateways pour accéder directement aux services backend (Auth, Users, Guild, Messaging, Event-Store), et comment propager l'information d'authentification une fois validée par l'API Gateway.

## Décision

**Isolation réseau** : les services backend (Auth, Users, Guild, Messaging, Event-Store) ainsi que l'infrastructure (RabbitMQ, PostgreSQL, Redis) vivent dans un réseau Docker interne, sans port publié vers l'hôte/l'extérieur. Seuls **API Gateway** (HTTP) et **Realtime Gateway** (WebSocket) ont un port exposé publiquement. C'est le seul chemin d'entrée possible dans le système depuis l'extérieur.

**Authentification centralisée** : l'API Gateway valide le JWT une seule fois à l'entrée. Il extrait les informations utiles (ID utilisateur, rôles) et les transmet aux services backend sous forme de headers simples (ex. `X-User-Id`). Les services backend ne revérifient pas la signature du JWT — ils font confiance à ces headers, en s'appuyant sur le fait que le réseau garantit que seul le Gateway peut leur envoyer du trafic.

## Alternatives considérées

**Chaque service revalide le JWT lui-même** — écarté au profit de la validation centralisée, pour éviter la redondance. Reste plus robuste en défense en profondeur, mais jugé pas nécessaire pour ce projet vu l'isolation réseau stricte.

## Conséquences

Toute la sécurité d'authentification repose sur l'isolation réseau : si elle était un jour mal configurée ou contournée, les headers de confiance (`X-User-Id`, etc.) pourraient être forgés sans qu'aucun service ne le détecte, puisqu'aucune vérification cryptographique n'a lieu après le Gateway. C'est un compromis accepté consciemment pour ce projet — à revisiter si le système devait un jour être exposé différemment (ex. plusieurs environnements réseau, services accessibles autrement que via le Gateway).

Le réseau interne doit permettre la communication entre tous les services et l'infrastructure (RabbitMQ, bases de données, Redis) — l'isolation ne bloque que le trafic venant de l'extérieur, pas la communication interne.
