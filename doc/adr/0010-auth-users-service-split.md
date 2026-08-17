# 0010. Séparation des services Auth et Users

Date : 2026-08-15

## Statut

Accepté

## Contexte

Auth (identifiants, mots de passe, sessions/tokens) et Users (profil : username, avatar, statut, etc.) sont deux ensembles de données souvent utilisés dans le même flux utilisateur (ex. login puis affichage du profil). Il fallait décider s'ils devaient être un seul service ou deux services séparés.

## Décision

Auth et Users sont deux services séparés.

Raisonnement :

- **Pattern d'accès différent** : une fois qu'un utilisateur est authentifié et possède un token (JWT), les autres services vérifient ce token localement (signature) sans rappeler le service Auth à chaque requête — Auth est donc à trafic relativement faible (login, inscription, refresh de token). Les données de profil (username, avatar), à l'inverse, sont lues très fréquemment par presque tous les autres services du système (affichage d'un message, liste de membres, etc.).
- **Niveau de sensibilité différent** : Auth contient les données les plus sensibles du système (mots de passe hashés, sessions, éventuellement des secrets 2FA plus tard). Users contient des données essentiellement publiques au sein de l'app. Séparer les deux limite le rayon d'exposition (blast radius) si un bug ou une vulnérabilité touchait le service à fort trafic (Users).

## Alternatives considérées

**Un seul service Auth+Users** — écarté après avoir pesé les deux raisons ci-dessus, malgré la simplicité initiale d'un seul service. Une option intermédiaire envisagée était un "modular monolith" (un seul service déployé, mais avec des modules internes et des schémas de BD séparés, pour faciliter une séparation future) — écartée aussi, au profit d'une séparation dès maintenant, dans un but d'apprentissage du découpage microservices.

## Conséquences

Le service Users doit référencer les utilisateurs par l'identifiant émis par le service Auth (voir [ADR-0011](0011-auth-implementation-custom-oauth2.md)) — c'est la clé qui relie "l'identité/les credentials" et "le profil applicatif" à travers les deux services.
