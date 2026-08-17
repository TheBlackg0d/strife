# 0002. Communication synchrone vs asynchrone (hybride)

Date : 2026-08-15

## Statut

Accepté

## Contexte

Dans une architecture microservices, chaque interaction entre services (ou entre client et service) peut être synchrone (REST/gRPC, l'appelant attend une réponse) ou asynchrone (event publié sur RabbitMQ, l'appelant continue sans attendre). Il fallait décider si Strife utiliserait un seul style partout ou un mélange des deux.

Aller "tout async" a des coûts réels : cohérence éventuelle partout (les services peuvent voir des états différents pendant un court laps de temps), tracing plus difficile à travers le système, et de la complexité ajoutée (requête-réponse simulée par-dessus une queue, avec correlation ID et timeout) pour des interactions qui sont fondamentalement de simples questions-réponses.

## Décision

Approche hybride, selon la nature de l'interaction :

- **Synchrone (REST/gRPC)** quand l'appelant a besoin d'une réponse immédiate pour continuer — ex. login, validation d'un token, requête directe d'un client pour afficher des données.
- **Asynchrone (events RabbitMQ)** quand une action déclenche des réactions dans d'autres parties du système, mais que l'appelant n'a pas besoin d'attendre ces réactions — ex. diffusion d'un message posté vers les clients connectés, mise à jour de presence, notifications.

## Alternatives considérées

**Tout asynchrone** — écarté : ajoute de la complexité (async request-reply avec correlation ID/timeout) pour des interactions qui sont naturellement des questions-réponses simples, et rend le système plus difficile à débugger sans bénéfice proportionnel pour ce scope de projet.

**Tout synchrone** — écarté : recrée un couplage fort entre services (si un service est down, tous ceux qui l'appellent directement échouent aussi), et ne permet pas le découplage recherché pour les scénarios de fan-out (un event déclenchant plusieurs réactions indépendantes).

## Conséquences

Il faut, pour chaque nouvelle interaction entre deux services, se poser explicitement la question "est-ce que l'appelant attend une réponse pour continuer, ou est-ce qu'il notifie juste le système qu'un fait s'est produit" — et documenter ce choix plutôt que de le faire par habitude.
