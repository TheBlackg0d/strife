# 0013. Convention de nommage des routing keys

Date : 2026-08-15

## Statut

Accepté

## Contexte

Chaque service publie ses events sur son propre exchange topic ([ADR-0004](0004-event-store-service.md)). Il fallait fixer une convention de nommage cohérente pour les routing keys avant d'écrire du code, pour éviter des incohérences difficiles à corriger après coup.

## Décision

Format : `<service>.<entité>.<action>`, entièrement en minuscule, action au passé (un event décrit un fait accompli, pas une commande à exécuter).

Exemples :

- `guild.guild.created`, `guild.guild.deleted`
- `guild.channel.created`, `guild.channel.updated`, `guild.channel.deleted`
- `guild.member.joined`, `guild.member.banned`, `guild.member.kicked`, `guild.member.role_updated`
- `messaging.message.posted`, `messaging.message.edited`, `messaging.message.deleted`
- `users.profile.created`, `users.profile.updated`
- `auth.account.registered`

Le service event-store bind avec `#` sur chaque exchange pour tout capter, indépendamment de cette convention ([ADR-0004](0004-event-store-service.md)). Les consommateurs métier peuvent binder sur des patterns plus précis (ex. `guild.member.*` pour tout ce qui touche les membres, sans les channels).

## Alternatives considérées

**Action au présent/impératif (ex. `guild.channel.add`)** — écarté : un routing key RabbitMQ transporte un event (un fait déjà survenu), pas une commande. Le passé rend cette distinction explicite dans le nom lui-même.

**Casse mixte (PascalCase pour l'action)** — écarté : le matching de routing key de RabbitMQ est sensible à la casse pour les segments exacts. Une incohérence de casse entre un publisher et un binding fait échouer silencieusement la livraison, sans erreur visible.

## Conséquences

Chaque nouveau service doit respecter cette convention. La liste d'events ci-dessus n'est pas exhaustive — elle sera complétée dans `doc/architecture/services-overview.md` au fur et à mesure que chaque service est implémenté.
