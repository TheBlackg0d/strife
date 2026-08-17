# 0003. Database-per-service + réplication d'état par events

Date : 2026-08-15

## Statut

Accepté

## Contexte

Un principe de base des microservices est qu'aucun service ne doit accéder directement à la base de données d'un autre service — chaque service est seul propriétaire de ses données. Mais ça pose une question : quand un service a besoin d'une donnée qui appartient à un autre (ex. le service Messaging a besoin du username/avatar d'un utilisateur pour afficher un message), comment fait-il ?

Deux options : appeler l'autre service en synchrone à chaque fois qu'on a besoin de la donnée, ou garder une copie locale, dénormalisée, de juste ce dont on a besoin.

## Décision

Chaque service est propriétaire exclusif de ses données (aucun accès direct à la DB d'un autre service). Quand un service a besoin de données appartenant à un autre service pour son propre fonctionnement, il garde une copie locale dénormalisée, tenue à jour en écoutant les events publiés par le service propriétaire (pattern "event-carried state transfer"), plutôt que d'appeler ce service en synchrone à chaque lecture.

## Alternatives considérées

**Appel synchrone systématique** — écarté comme approche par défaut : crée un couplage runtime fort (si le service propriétaire est down, tous ses consommateurs échouent aussi sur des opérations qui n'ont rien à voir directement avec lui), et ajoute de la latence à chaque lecture. Reste approprié au cas par cas pour des données qui doivent être fraîches à 100% (voir [ADR-0002](0002-sync-vs-async-communication.md)).

## Conséquences

Ce pattern introduit de la duplication de données (volontaire) et de la cohérence éventuelle — un service peut afficher un username légèrement périmé pendant la fenêtre entre la mise à jour chez le propriétaire et le traitement de l'event chez le consommateur. Ça implique aussi qu'un nouveau service (ou une nouvelle instance) a besoin d'un mécanisme pour reconstruire sa copie locale au démarrage — voir [ADR-0004](0004-event-store-service.md) et [ADR-0007](0007-service-bootstrap-protocol.md).
