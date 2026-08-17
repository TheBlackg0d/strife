# 0007. Protocole de démarrage d'un nouveau service ("subscribe-then-backfill")

Date : 2026-08-15

## Statut

Accepté

## Contexte

Quand un nouveau service (ou une nouvelle instance) démarre et doit construire sa copie locale de données à partir des events ([ADR-0003](0003-database-per-service-event-carried-state.md)), il doit à la fois (a) récupérer l'historique complet depuis l'event-store ([ADR-0004](0004-event-store-service.md)) et (b) commencer à écouter les events qui arrivent en direct. Si ces deux étapes sont faites dans le mauvais ordre, il existe une fenêtre de temps où un event publié pendant la récupération de l'historique pourrait être définitivement perdu — le message publié sur un exchange RabbitMQ n'est routé que vers les queues déjà bindées au moment de la publication ; si la queue du nouveau service n'existe pas encore, ce message n'attend personne, il est perdu pour ce service.

## Décision

Au démarrage, un service suit cet ordre strict :

1. Créer sa queue et confirmer que le binding vers le(s) exchange(s) pertinent(s) est actif — les events live commencent à s'accumuler dans la queue à partir de ce moment, même s'ils ne sont pas encore traités.
2. Seulement après, demander le snapshot/historique complet à l'event-store.
3. Appliquer le snapshot comme état de référence.
4. Traiter (drainer) les events accumulés dans la queue pendant l'étape 2, en les réconciliant avec l'état de référence via la comparaison de version ([ADR-0006](0006-entity-versioning-for-reconciliation.md)) — certains seront déjà reflétés dans le snapshot (version inférieure ou égale, ignorés), d'autres seront plus récents (version supérieure, appliqués).
5. Continuer à traiter la queue normalement en régime établi, avec la même logique de réconciliation par version.

## Alternatives considérées

**Récupérer l'historique d'abord, puis créer le binding** — écarté : laisse une fenêtre où des events publiés entre les deux étapes sont perdus définitivement, sans espoir de les rattraper.

**Fusionner les deux flux (historique + live) par comparaison de timestamp** — écarté au profit de la comparaison de version ([ADR-0006](0006-entity-versioning-for-reconciliation.md)) : ne règle pas le problème de perte de message (un event manquant reste manquant, peu importe comment on trie ce qu'on a reçu), et est en plus sensible au clock skew.

## Conséquences

Ce protocole s'inspire du pattern "snapshot + streaming" utilisé par des outils de Change Data Capture comme Debezium. Chaque service qui construit une copie locale de données doit implémenter cette séquence au démarrage — ce n'est pas automatique, il faut y penser explicitement pour chaque nouveau service.
