# 0005. Déduplication des messages

Date : 2026-08-15

## Statut

Accepté

## Contexte

RabbitMQ garantit une livraison "at-least-once" avec les acquittements manuels — ça veut dire qu'un message peut être livré plus d'une fois à un consommateur (ex. si le consommateur crash après avoir traité un message mais avant d'envoyer l'acquittement, RabbitMQ va le renvoyer). Les consommateurs qui écrivent en base de données (notamment le service event-store, [ADR-0004](0004-event-store-service.md)) doivent donc être capables de gérer des doublons sans corrompre leurs données.

## Décision

Chaque event porte un identifiant unique (message ID), généré UNE SEULE FOIS par le service qui publie l'event, au moment de la publication — pas régénéré à chaque redelivery, ni par le consommateur.

Les consommateurs qui doivent être idempotents (notamment l'event-store) appliquent une contrainte d'unicité au niveau de la base de données sur ce champ (pas une vérification applicative "je regarde si ça existe, puis j'insère" en deux étapes séparées). La BD rejette (ou ignore, selon le mécanisme utilisé — ex. `ON CONFLICT DO NOTHING`) toute tentative d'insertion d'un message ID déjà vu.

## Alternatives considérées

**Vérification applicative en deux étapes (check-then-insert)** — écartée : présente une race condition si plusieurs instances du même service consomment en parallèle (deux instances peuvent toutes les deux vérifier "n'existe pas" avant qu'aucune des deux n'ait inséré). La contrainte d'unicité en base de données rend l'opération atomique et évite ce problème sans logique supplémentaire.

## Conséquences

Chaque service producteur doit générer un identifiant unique (ex. UUID) pour chaque event au moment de la publication, et le transporter avec le message. Chaque consommateur qui a besoin d'idempotence doit avoir une contrainte d'unicité correspondante dans son schéma de base de données.
