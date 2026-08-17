# 0006. Versioning par entité pour la réconciliation d'état

Date : 2026-08-15

## Statut

Accepté

## Contexte

Les services qui gardent une copie locale de données appartenant à un autre service ([ADR-0003](0003-database-per-service-event-carried-state.md)) doivent parfois traiter des events dans le désordre (ex. pendant le bootstrap, voir [ADR-0007](0007-service-bootstrap-protocol.md)), ou recevoir un event en retard. Il faut un moyen de savoir si un event reçu représente un état plus récent ou plus ancien que ce que le service a déjà.

Utiliser un timestamp (horloge murale) pour cette comparaison a un défaut : ça suppose que les horloges de tous les services/instances qui génèrent ces timestamps sont parfaitement synchronisées, ce qui n'est pas garanti dans un système distribué (clock skew).

## Décision

Chaque entité (ex. un profil utilisateur) porte un numéro de version, incrémenté par le service propriétaire à chaque modification. Les services qui gardent une copie locale de cette entité comparent la version reçue à la version qu'ils ont déjà : s'ils reçoivent une version inférieure ou égale à celle qu'ils connaissent déjà, ils l'ignorent (déjà appliquée ou périmée) ; s'ils reçoivent une version supérieure, ils l'appliquent (last-write-wins par version).

Cette même logique s'applique aussi bien pendant le fonctionnement normal (protection contre le désordre/doublons) que pendant le bootstrap d'un nouveau service.

## Alternatives considérées

**Timestamp (horloge murale)** — écarté à cause du risque de clock skew entre services/instances : deux events de deux sources différentes ne sont pas forcément comparables de façon fiable par leur timestamp.

## Conséquences

Le service propriétaire d'une entité doit gérer l'incrémentation de version de façon fiable (typiquement via un verrou optimiste sur son propre schéma de base de données) pour éviter que deux écritures concurrentes se retrouvent avec le même numéro de version.

**Important — distinction à ne pas perdre** : cette logique de version s'applique dans les services qui construisent une copie/lecture locale d'une entité (read model). Elle ne s'applique PAS au service event-store lui-même, dont le rôle est de garder TOUS les events sans exception — voir [ADR-0004](0004-event-store-service.md).
