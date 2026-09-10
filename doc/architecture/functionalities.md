# Fonctionnalités par service — Strife

Référence vivante des opérations que chaque service expose, au-delà du CRUD basique sur les entités (voir `data-model.md`). Mise à jour au fur et à mesure de la conception, comme les autres documents de ce dossier.

---

## Auth

| Fonctionnalité | Notes |
|---|---|
| `register` | Créer un compte (email + mot de passe). Retourne les infos de base directement au client, publie `auth.account.registered` — voir [ADR-0014](../adr/0014-auth-users-registration-flow.md). |
| `login` (mot de passe) | |
| `login` (fournisseur externe — Google/Facebook) | Si l'email du fournisseur correspond à un compte existant : **décision encore ouverte** — liaison automatique (si le fournisseur garantit l'email vérifié) ou confirmation explicite demandée à l'utilisateur ? À trancher avant l'implémentation. |
| `linkProvider` | Lier un DEUXIÈME fournisseur (ou en ajouter un) à un compte déjà authentifié — différent du cas de liaison automatique au login. Ajoute un rang `Provider`. |
| `refreshToken` | Émet un nouveau JWT à partir d'un refresh token valide. |
| `logout` | Ajoute le `jti` (JWT ID claim) du token courant à une blacklist Redis (dédiée à Auth/API Gateway — pas celle du Realtime Gateway), avec un TTL égal au temps restant avant expiration naturelle du token. Vérifiée par l'API Gateway au moment de la validation (seul endroit qui valide les JWT — [ADR-0012](../adr/0012-network-isolation-and-gateway-trust.md)), pas par chaque service individuellement. |
| `changePassword` | Exige l'ancien mot de passe. |
| `forgotPassword` / `resetPassword` | Flux séparé de `changePassword`, pour un utilisateur qui n'est pas connecté (lien/code envoyé par email). |
| `changeEmail` | Met à jour `Account.email`, remet `email_verified` à `false` (re-vérification requise), publie un event de mise à jour d'email consommé par Users pour rafraîchir sa copie répliquée. |

---

## Users

| Fonctionnalité | Notes |
|---|---|
| `searchUsers` | Par `username` seul (plusieurs résultats possibles, distingués par discriminateur) ou `username`+`discriminator` (résultat unique). Retourne username, discriminateur, avatar. |
| `completeProfile` (choisir son username) | Fixe `username` ET génère `discriminator` en même temps (pas à la création du profil — voir correction dans `data-model.md`). Bascule `profile_incomplete` à `false`. C'est la SEULE chose requise pour "compléter" le profil — avatar/bio restent optionnels. |
| `updateProfile` (avatar, bio, statut, dm_privacy) | |
| `sendFriendRequest` / `acceptFriendRequest` / `declineFriendRequest` | Crée/modifie un rang `Relationship`. |
| `block` / `unblock` | Voir la règle sur `status_initiator` dans `data-model.md` — seul l'auteur du blocage peut le lever. |

**Décision produit à trancher plus tard, pas bloquante pour l'implémentation** : profil incomplet = juste un rappel/bandeau non-bloquant côté client, ou est-ce que l'API refuse certaines actions tant que `profile_incomplete = true` ? Si bloquant, préciser où c'est appliqué (API elle-même, pas juste le client — voir la leçon sur l'UI qui cache un bouton sans empêcher l'appel API direct).

---

## Guild

| Fonctionnalité | Notes |
|---|---|
| `createGuild` | Le créateur devient `owner_id`. |
| `deleteGuild` | Seul le owner. |
| `transferOwnership` | Le owner ne peut pas quitter sa guilde ([confirmé]) — il doit soit transférer, soit supprimer. |
| `generateInvite` | Lien réutilisable par plusieurs personnes jusqu'à `expires_at` (voir `Invite` dans `data-model.md`). |
| `joinGuild` (via invite) | Vérifie `GuildBan` avant d'accepter, peu importe la validité du lien. |
| `leaveGuild` | Membre non-owner uniquement. |
| `kickMember` | Nécessite la permission adéquate. Retire simplement le rang `Member` — pas de suivi spécial du lien utilisé, un kick n'est pas permanent (la personne peut revenir avec n'importe quel lien valide plus tard). |
| `banMember` / `unbanMember` | Ajoute/retire un rang `GuildBan` — c'est CE mécanisme, pas le kick, qui empêche un retour permanent. |
| `createChannel` / `updateChannel` / `deleteChannel` | |
| `createRole` / `updateRole` / `deleteRole` | |
| `assignRole` / `removeRole` | Ajoute/retire un rang `MemberRole`. |
| `updateMemberNickname` | |

---

## Messaging

| Fonctionnalité | Notes |
|---|---|
| `sendMessage` | Vers un channel, quel que soit son `type` — l'appelant ne distingue pas guilde et DM (voir `Channel` dans `data-model.md`). |
| `editMessage` | Auteur uniquement. |
| `deleteMessage` | Auteur, ou un modérateur (permission bitmask) pour un message dans un channel de guilde. |
| `fetchMessageHistory` | Pagination par curseur sur `message_id` (chronologiquement trié) — "N messages avant tel id", pas de numéros de page. Vérifie d'abord l'appartenance de l'appelant au channel. |
| `listChannels` | Les conversations privées de l'utilisateur (`DM` + `GROUP_DM`) en une seule liste — le client distingue les deux sur `type`, pas sur l'endpoint appelé. |
| Démarrage d'un DM | Recherche-ou-création sur `dm_key` : le `Channel` de type `DM` est créé s'il n'existe pas déjà, sinon l'existant est renvoyé. L'unicité de la paire est garantie en base, pas seulement par cette recherche préalable. |
| Création d'un DM de groupe | `Channel` de type `GROUP_DM`, 3 à 10 participants, créateur propriétaire. |
| `addReaction` / `removeReaction` | |
| Indicateur "en train d'écrire" | **Ne touche jamais Messaging ni sa base de données** — event éphémère qui passe directement par RabbitMQ/Gateway (client → Gateway → diffusion), même raisonnement que l'état de connexion ([ADR-0009](../adr/0009-gateway-presence-service.md)). |

---

## Realtime Gateway

| Fonctionnalité | Notes |
|---|---|
| `connect` | JWT passé dans l'URL (query param) à la poignée de main — les WebSockets ne portent pas facilement des headers personnalisés. À surveiller : un token dans une URL peut finir dans des logs serveur/proxy ; envisager un token de très courte durée dédié à la connexion plutôt que le JWT d'accès complet. |
| `heartbeat` | Signal périodique envoyé par le client pour rafraîchir le TTL de son entrée Redis (voir [ADR-0009](../adr/0009-gateway-presence-service.md)). |
| `disconnect` | Explicite, ou implicite par expiration du TTL (crash non-propre). |
| Index d'appartenance aux guildes | Gateway maintient dans Redis un "set" par `guild_id`, contenant les `user_id` actuellement connectés qui en sont membres — mis à jour à la connexion/déconnexion, et par les events de changement de membership (join/leave/kick/ban) pour rester cohérent même pour un utilisateur déjà connecté. Permet de diffuser un event à "tous les membres connectés de cette guilde" par une consultation directe, plutôt qu'un scan de tous les connectés du système. |
| Diffusion (broadcast) | Consomme les events pertinents depuis RabbitMQ (message posté, réaction, presence, typing, etc.) et pousse aux bons utilisateurs connectés, via l'index de guilde ci-dessus (ou la liste des participants pour un DM). |
| Diffusion de la presence aux amis | Même principe d'index, mais basé sur la liste d'amis (Users) plutôt que l'appartenance à une guilde — à détailler à l'implémentation. |

---

**Fonctionnalités v1 complètes pour les cinq services + Realtime Gateway.**
