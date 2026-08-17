# 0014. Flux de création de profil à l'inscription (Auth → Users)

Date : 2026-08-15

## Statut

Accepté

## Contexte

Auth et Users sont deux services séparés ([ADR-0010](0010-auth-users-service-split.md)). À l'inscription, Users a besoin d'apprendre qu'un nouveau compte existe pour créer son propre profil. Il fallait décider si ce lien se fait par appel synchrone (Auth appelle Users pendant l'inscription) ou par event asynchrone.

Un appel synchrone avait été envisagé au départ, sous prétexte que le client aurait besoin des infos de base (nom, email) immédiatement après l'inscription. Mais Auth possède déjà ces informations — l'utilisateur vient de les soumettre dans le formulaire d'inscription — donc Auth peut les retourner directement dans sa propre réponse d'inscription, sans avoir besoin d'interroger Users.

## Décision

Flux entièrement asynchrone, sans appel synchrone entre Auth et Users :

1. L'utilisateur s'inscrit ; Auth valide et enregistre le compte dans sa propre base de données.
2. Auth retourne directement au client les infos de base qu'il possède déjà (email, nom, prénom) dans sa réponse d'inscription — le client n'a pas besoin d'attendre que Users ait traité quoi que ce soit pour afficher ces infos.
3. Auth publie un event `auth.account.registered` (voir [ADR-0013](0013-routing-key-convention.md)) contenant ces mêmes infos de base.
4. Users consomme cet event de façon asynchrone pour créer sa propre copie du profil (avec un flag du genre "profil incomplet" pour inviter l'utilisateur à compléter les infos manquantes — avatar, bio, etc. — plus tard).

## Alternatives considérées

**Appel synchrone d'Auth vers Users à l'inscription** — écarté : rendait la réussite de l'inscription dépendante de la disponibilité de Users, sans bénéfice réel puisque Auth peut déjà répondre au client avec les infos dont il dispose. Enlever cette dépendance suit le même principe déjà établi ailleurs ([ADR-0002](0002-sync-vs-async-communication.md), [ADR-0003](0003-database-per-service-event-carried-state.md)) : ne pas coupler la disponibilité d'un service à celle d'un autre quand ce n'est pas nécessaire.

## Conséquences

Il existe une courte fenêtre où le compte existe dans Auth mais où le profil n'existe pas encore dans Users (le temps que l'event soit traité) — cohérent avec le modèle de cohérence éventuelle déjà accepté ailleurs dans le système. Si RabbitMQ ou Users est temporairement indisponible au moment de l'inscription, l'event reste en file (queue durable) et sera traité dès que Users redevient disponible, sans perte ni intervention manuelle.
