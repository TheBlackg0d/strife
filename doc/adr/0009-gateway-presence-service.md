# 0009. Service Gateway (WebSocket) et gestion de la presence

Date : 2026-08-15

## Statut

Accepté

## Contexte

Contrairement à une API REST classique où le client demande toujours l'information, un clone de Discord doit pousser des mises à jour en temps réel vers les clients connectés (nouveaux messages, changements de presence, etc.), ce qui nécessite des connexions persistantes (WebSocket). Il fallait aussi décider comment gérer la "presence" (statut en ligne/hors ligne/absent/etc.) : un simple état dérivé de la connexion, ou une donnée métier plus riche ?

Il y a en fait deux notions distinctes derrière "presence" : (1) le fait technique qu'une connexion WebSocket soit active, et (2) le statut que l'utilisateur choisit lui-même (en ligne, absent, ne pas déranger, invisible) — un utilisateur peut être connecté mais choisir d'apparaître hors ligne.

## Décision

Un service dédié, **Gateway**, gère les connexions WebSocket des clients. Il est le seul point du système à tenir un état de connexion en temps réel.

L'état de connexion (qui est connecté, à quelle instance) est stocké dans **Redis** plutôt que dans une base de données relationnelle : c'est une donnée à très haute fréquence de lecture/écriture, sans besoin de durabilité au sens classique (si le système redémarre, toutes les connexions sont de toute façon coupées et doivent se reconstruire). Chaque entrée de connexion a un TTL (time-to-live), rafraîchi périodiquement par un heartbeat envoyé par le client — si une instance de Gateway crashe brutalement, elle arrête de rafraîchir ses entrées et elles expirent automatiquement, sans logique de nettoyage explicite à écrire. Redis est partagé entre toutes les instances de Gateway, ce qui permet à n'importe quelle instance de connaître l'état de connexion global.

Le **statut préféré** de l'utilisateur (en ligne/absent/ne pas déranger/invisible) est un attribut de profil stocké dans le service **Users** ([ADR-0010](0010-auth-users-service-split.md)), pas dans un service Presence séparé. Le statut "effectif" affiché aux autres utilisateurs est calculé en combinant ce statut préféré (Users) avec l'état de connexion en temps réel (Gateway/Redis).

## Alternatives considérées

**Service Presence séparé avec sa propre base de données relationnelle** — écarté : la partie "état de connexion" n'a pas besoin de persistance durable et bénéficie d'un store en mémoire avec TTL ; la partie "préférence de statut" est en fait juste un attribut de profil qui appartient déjà logiquement à Users. Il n'y a pas de logique métier substantielle qui justifierait un service à part entière.

**Déduire la presence uniquement de la connexion (sans notion de statut préféré)** — écarté : ne permet pas de supporter un mode "invisible" où l'utilisateur est connecté mais choisit d'apparaître hors ligne.

## Conséquences

Le projet doit faire tourner une instance Redis en plus de RabbitMQ et des bases de données par service. Le calcul du statut "effectif" (préférence + connexion) devient une responsabilité à placer quelque part — probablement dans le Gateway au moment de la diffusion, à préciser lors de l'implémentation.
