# Modèle de données — Strife

Référence vivante des entités de chaque service, mise à jour au fur et à mesure de la conception (comme `services-overview.md`). Rappel : chaque service est propriétaire exclusif de ses tables — aucun service n'accède directement à la base de données d'un autre (voir [ADR-0003](../adr/0003-database-per-service-event-carried-state.md)).

---

## Auth (`auth_db`)

### Account

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | Identifiant unique du compte, généré à la création. |
| `email` | String, unique | |
| `password_hash` | String, nullable | Nullable si le compte n'a jamais eu de mot de passe local (créé uniquement via un fournisseur externe). Jamais le mot de passe en clair. |
| `email_verified` | boolean | |
| `version` | integer | Incrémenté à chaque changement — permet à Users (qui réplique `email`) de savoir si un event reçu est plus récent que ce qu'il a déjà ([ADR-0006](../adr/0006-entity-versioning-for-reconciliation.md)). |

### Provider

Un compte peut être lié à plusieurs fournisseurs externes (Google, Facebook, ...) — relation un-à-plusieurs depuis `Account`.

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `account_id` | UUID (FK → Account) | |
| `provider_type` | String | ex. `google`, `facebook`. |
| `provider_user_id` | String | ID donné par le fournisseur externe. |

Contrainte d'unicité sur (`provider_type`, `provider_user_id`) — un même compte externe ne peut être lié qu'à un seul compte Strife.

**Notes de design** :
- Le username N'EST PAS stocké ici — il appartient à Users (voir [ADR-0010](../adr/0010-auth-users-service-split.md)), ce qui a évité d'avoir à imposer une contrainte d'unicité globale sur le username entre deux services.
- Discriminateur à 4 chiffres (façon ancien Discord `username#1234`), pour permettre à deux utilisateurs d'avoir le même username : voir section Users ci-dessous, il est généré et stocké là-bas, pas ici — voir [ADR-0014](../adr/0014-auth-users-registration-flow.md).

---

## Users (`users_db`)

### Profile

| Champ | Type | Notes |
|---|---|---|
| `user_id` | UUID (PK) | = `id` d'Auth ; jamais généré localement. |
| `username` | String, nullable | Non-unique globalement (façon ancien Discord). Nullable — vide tant que le profil est incomplet ; Auth ne le collecte jamais, donc il n'existe pas encore au moment de la création initiale du profil (voir [ADR-0014](../adr/0014-auth-users-registration-flow.md)). |
| `discriminator` | String (4 chiffres), nullable | Généré par Users EN MÊME TEMPS que l'utilisateur choisit son `username` (pas à la création du profil — corrigé : on ne peut pas générer un discriminateur unique "parmi les profils qui partagent ce username" avant de savoir quel username est choisi). Unique seulement parmi les profils qui partagent déjà ce `username`. |
| `email` | String | Copie en lecture seule répliquée depuis Auth (event `auth.account.registered`, puis tout futur event de mise à jour d'email). Users ne modifie jamais ce champ directement — un changement d'email passe toujours par Auth. |
| `status_preference` | enum (`ONLINE`, `AWAY`, `DND`, `INVISIBLE`) | Voir [ADR-0009](../adr/0009-gateway-presence-service.md) — combiné à l'état de connexion du Realtime Gateway pour calculer le statut affiché aux autres. |
| `avatar` | String, nullable | URL/référence de l'image. |
| `bio` | String, nullable | |
| `dm_privacy` | enum (à détailler : ex. `EVERYONE`, `FRIENDS_ONLY`, `NOBODY`) | Qui peut envoyer un DM à cet utilisateur — dépend de `Relationship` ci-dessous. |
| `profile_incomplete` | boolean | `true` à la création (voir [ADR-0014](../adr/0014-auth-users-registration-flow.md)), jusqu'à ce que l'utilisateur complète son profil. |
| `version` | integer | Incrémenté à chaque changement — permet à Guild (qui réplique `username`/`discriminator`) de réconcilier correctement ([ADR-0006](../adr/0006-entity-versioning-for-reconciliation.md)). Sert aussi pour tout changement de `dm_privacy` consommé par Messaging. |

Contrainte d'unicité composite sur (`username`, `discriminator`).

### Relationship

Amitié et blocage entre deux utilisateurs — une seule entité pour les deux, distinguée par `status`.

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `friend_id_1` | UUID | Toujours le plus petit des deux UUID (ordre canonique) — évite qu'une même paire soit représentée par deux rangs différents, (A,B) et (B,A). |
| `friend_id_2` | UUID | Toujours le plus grand des deux UUID. |
| `status` | enum (`PENDING`, `ACCEPTED`, `BLOCKED`) | |
| `status_initiator` | UUID | Qui a causé le statut actuel : le demandeur si `PENDING`, celui qui a bloqué si `BLOCKED`. Seul lui peut changer un statut `BLOCKED` (l'autre ne peut pas se débloquer lui-même). |
| `version` | integer | Incrémenté à chaque changement de statut — permet à Messaging (qui réplique le statut de blocage pour les DM) de réconcilier correctement. |

Contrainte d'unicité sur (`friend_id_1`, `friend_id_2`).

**Note de scope** : amis + DM ont été ajoutés au scope v1 (initialement prévus pour plus tard, comme la voix) — voir mise à jour dans `services-overview.md`. Le modèle de données des DM eux-mêmes (une conversation privée entre deux utilisateurs, distincte d'un channel de guilde) reste à définir dans Messaging.

---

## Guild (`guild_db`)

### Invite

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `guild_id` | UUID (FK → Guild) | |
| `code` | String, unique | Le token/code utilisé dans le lien d'invitation. |
| `created_by` | UUID | Membre ayant créé l'invitation. |
| `expires_at` | timestamp | Réutilisable par plusieurs personnes jusqu'à cette date. |

### GuildBan

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `guild_id` | UUID (FK → Guild) | |
| `user_id` | UUID | |
| `banned_by` | UUID | |
| `banned_at` | timestamp | |

Contrainte d'unicité sur (`guild_id`, `user_id`). Vérifiée systématiquement par l'opération "rejoindre une guilde", indépendamment du lien d'invitation présenté — un ban est permanent et ne dépend pas d'un lien spécifique, contrairement à un kick (voir `functionalities.md`).

### Guild

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `owner_id` | UUID | Référence l'utilisateur (Auth/Users) propriétaire. |
| `name` | String | |

### Channel

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `guild_id` | UUID (FK → Guild) | |
| `name` | String | |
| `type` | enum | `TEXT` pour v1 ; structuré pour accueillir `VOICE` plus tard sans migration. |

### Member

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `guild_id` | UUID (FK → Guild) | |
| `user_id` | UUID | = l'id Auth/Users. |
| `nickname` | String, nullable | Pseudo propre à cette guilde (différent du username global). |
| `username` | String | Copie en lecture seule, répliquée depuis les events de Users (event-carried state transfer, [ADR-0003](../adr/0003-database-per-service-event-carried-state.md)) — évite un appel synchrone à Users pour afficher une liste de membres. |
| `discriminator` | String | Copie en lecture seule, même origine. |
| `joined_at` | timestamp | |
| `permissions_version` | integer | Version de l'état de permission EFFECTIF (combiné) de ce membre — incrémentée par Guild à chaque changement qui affecte ses permissions, que ce soit un changement sur un de ses rôles ou un ajout/retrait de rôle. Guild calcule le bitmask combiné final et le publie avec cette seule version ; Messaging (qui réplique ça pour vérifier le droit de poster) n'a pas besoin de connaître la structure interne Role/MemberRole, juste ce résultat déjà combiné. Voir discussion : verser une version séparée par Role ET par MemberRole ne fonctionne pas dès qu'un membre a plusieurs rôles (plusieurs valeurs indépendantes à comparer, pas une seule). |

Contrainte d'unicité sur (`guild_id`, `user_id`) — un utilisateur ne peut être membre d'une même guilde qu'une seule fois.

**Note de design — pas de champ `is_friend`** : l'amitié est relative à la personne qui consulte la liste (ami DE QUI ?), donc ça ne peut pas être une colonne fixe sur un rang Member qui n'a pas de notion de "qui regarde en ce moment". Le rapprochement "est-ce que ce membre est un de mes amis" se calcule à l'affichage, en croisant la liste de membres (Guild) avec la liste d'amis du viewer (Users), pas en le stockant ici.

### Role

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `guild_id` | UUID (FK → Guild) | |
| `name` | String | |
| `permissions` | bitmask | Chaque bit représente une permission. |

**Note de design — pourquoi pas de permission par (membre, channel)** : lier les permissions directement à chaque paire (membre, channel) exploserait en volume (une guilde de 100 membres × 20 channels = 2000 rangs juste pour l'accès par défaut). Les permissions vivent sur le Role (niveau guilde), pas sur des combinaisons individuelles. Les exceptions par channel (permission overrides) sont repoussées à v2.

### MemberRole (jointure)

| Champ | Type | Notes |
|---|---|---|
| `member_id` | UUID (FK → Member) | |
| `role_id` | UUID (FK → Role) | |

Clé primaire composite sur (`member_id`, `role_id`) — un membre peut avoir plusieurs rôles.

---

## Messaging (`messaging_db`)

### Message

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID | Format Snowflake (encodage timestamp + séquence, façon Discord/Twitter) à explorer plus tard comme alternative — changerait juste le type/la génération de cet id. |
| `sender_id` | UUID | Référence Auth/Users. |
| `content` | String | |
| `media` | String, nullable | |
| `timestamp` | timestamp | |
| `edited_at` | timestamp, nullable | |

### ChannelMessage

| Champ | Type | Notes |
|---|---|---|
| `channel_id` | UUID | Référence externe vers Guild — pas de vraie contrainte FK possible (bases de données séparées), juste une valeur stockée. |
| `message_id` | UUID (FK → Message) | |

### PrivateChannel

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `participant_1_id` | UUID | Ordre canonique — toujours le plus petit UUID. |
| `participant_2_id` | UUID | Toujours le plus grand UUID. |

Contrainte d'unicité sur (`participant_1_id`, `participant_2_id`).

### PrivateMessage

| Champ | Type | Notes |
|---|---|---|
| `private_channel_id` | UUID (FK → PrivateChannel) | Vraie FK — local à Messaging. |
| `message_id` | UUID (FK → Message) | |

### Reaction

| Champ | Type | Notes |
|---|---|---|
| `reaction_id` | UUID (PK) | |
| `message_id` | UUID (FK → Message) | |
| `user_id` | UUID | Référence Auth/Users (pas `member_id` — une réaction doit fonctionner autant sur un message de channel que sur un DM, où il n'y a aucun concept de membre de guilde). |
| `emoji` | String | |

Contrainte d'unicité sur (`user_id`, `message_id`, `emoji`).

**À préciser à l'implémentation (pas figé maintenant)** : la forme exacte des copies locales répliquées — permissions par membre/channel depuis Guild (event-carried state transfer), et `dm_privacy`/statut de blocage depuis Users, pour les vérifications avant d'accepter un message.

---

## Event-Store (`eventstore_db`)

### StoredEvent

Un seul type de rang, append-only — jamais modifié ni supprimé.

| Champ | Type | Notes |
|---|---|---|
| `event_id` | UUID (PK) | Généré par le service publicateur au moment de la publication ([ADR-0005](../adr/0005-message-deduplication.md)) — la contrainte d'unicité sur cette clé primaire assure la déduplication (pas de vérification applicative en deux étapes). |
| `service_name` | String | Service d'origine — dénormalisé pour permettre de filtrer sans reparser `event_routing_key`. |
| `event_routing_key` | String | Voir [ADR-0013](../adr/0013-routing-key-convention.md). |
| `entity_id` | UUID | L'entité concernée par l'event (extraite du payload et dénormalisée ici) — permet de retrouver facilement "l'historique complet, en ordre, de CETTE entité" sans fouiller le JSON. |
| `version` | integer | La version ([ADR-0006](../adr/0006-entity-versioning-for-reconciliation.md)) de l'entité au moment de cet event — permet à un nouveau service qui rejoue l'historique de savoir dans quel ordre appliquer les events pour une même entité ([ADR-0007](../adr/0007-service-bootstrap-protocol.md)). |
| `payload` | JSON | Contenu complet de l'event. |
| `timestamp` | timestamp | |

**Modèle de données v1 complet.** Les cinq services (Auth, Users, Guild, Messaging, Event-Store) ont maintenant leurs entités définies. Prochaine étape : commencer l'implémentation (Auth suggéré en premier, aucune dépendance).
