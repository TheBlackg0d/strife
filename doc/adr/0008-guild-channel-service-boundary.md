# 0008. Frontière de service : Guild + Channel fusionnés

Date : 2026-08-15

## Statut

Accepté

## Contexte

Dans un clone de Discord, une "guilde" (serveur) contient des channels, des rôles et des membres. Il fallait décider si Guild et Channel devaient être deux services séparés (un par entité) ou un seul service couvrant les deux.

## Décision

Guild et Channel sont gérés par UN SEUL service (pas deux services séparés).

Raisonnement : un channel n'existe jamais sans une guilde parente — sa création dépend de vérifications de permissions/rôles qui appartiennent au contexte de la guilde, et la suppression d'une guilde doit cascader sur ses channels. Séparer les deux forcerait soit des appels synchrones fréquents entre les deux services pour chaque opération sur un channel (couplage runtime fort sur une relation qui est fondamentalement une relation de composition), soit une gestion asynchrone de la suppression en cascade avec une fenêtre de cohérence éventuelle difficile à justifier pour une donnée aussi structurelle. Guild et Channel partagent le même cycle de vie et la même unité de cohérence transactionnelle — ils forment un seul bounded context / aggregate au sens du Domain-Driven Design.

## Alternatives considérées

**Un service par entité (Guild séparé de Channel)** — écarté pour les raisons ci-dessus. Reste une option si, plus tard, les patterns de charge ou d'équipe justifiaient de les séparer — le code interne devrait alors être organisé en modules distincts dès maintenant pour rendre cette séparation future plus mécanique.

## Conséquences

Rôles et permissions (à définir plus en détail) vivront probablement aussi dans ce même service, puisqu'ils sont utilisés pour les vérifications au moment de la création/modification de channels.
