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
| `dm_privacy` | enum (`EVERYONE`, `FRIENDS`, `FRIENDS_OF_FRIENDS`) | Qui peut envoyer un DM à cet utilisateur — dépend de `Relationship` ci-dessous. Valeurs fixées à l'implémentation (`common-library`), répliquées vers Messaging qui les applique à l'ouverture d'un DM. |
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

**Note de scope** : amis + DM ont été ajoutés au scope v1 (initialement prévus pour plus tard, comme la voix) — voir mise à jour dans `services-overview.md`. Le modèle de données des DM est défini dans Messaging : ce n'est pas une entité distincte d'un channel de guilde, mais le même `Channel` avec un `type` différent (voir section Messaging).

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
| `sender_id` | UUID (FK → User) | Pointe la copie locale répliquée. Comme celle-ci a l'id d'Auth/Users pour clé primaire, la colonne porte l'id d'origine tout en gardant une vraie FK locale. |
| `channel_id` | UUID (FK → Channel), NOT NULL | Rattachement unique, quel que soit le type de conversation. Vraie FK — locale à Messaging. Indexé avec `timestamp` décroissant (lecture principale : l'historique d'un channel). |
| `content` | text | |
| `media` | text, nullable | |
| `timestamp` | timestamp | |
| `edited_at` | timestamp, nullable | |

**Note de design — un seul rattachement, pas un par type de conversation** : une version précédente de ce document portait deux colonnes nullables (`channel_id` pour la guilde, `private_channel_id` pour le DM) plus une contrainte CHECK garantissant qu'exactement une des deux était renseignée. L'arrivée des DM de groupe a ajouté une troisième colonne et transformé le CHECK en somme à trois termes — le signe que le modèle ne passait pas à l'échelle : chaque nouvelle forme de conversation coûtait une colonne, un index, une branche dans le CHECK, et une branche dans tout code qui lit un message.

Avec un `Channel` unique (voir ci-dessous), le rattachement redevient une FK simple et non-nullable. Le CHECK disparaît : l'invariant « un message appartient à exactement un channel » est désormais porté par la colonne elle-même.

**Note de design — pourquoi pas de table de liaison** : une version encore antérieure décrivait deux tables `ChannelMessage` et `PrivateMessage`. Elles ont été repliées dans `Message` parce que la cardinalité réelle est 1-N, pas N-N : un message appartient à exactement un channel, donc chacune de ces tables n'aurait jamais contenu qu'un seul rang par message — elles ne normalisaient rien. Modéliser ça en N-N (message ↔ channel) a été écarté pour la même raison : ça autoriserait explicitement le cas qu'on veut interdire — un même message rattaché à deux channels à la fois.

### Channel

**Une seule entité pour les trois formes de conversation**, distinguées par `type` : DM à deux, DM de groupe, channel de guilde. Un channel de guilde reste une copie locale répliquée depuis Guild ([ADR-0003](../adr/0003-database-per-service-event-carried-state.md)) — Messaging ne lit jamais la base de Guild ; les deux autres types sont possédés par Messaging.

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `type` | enum (`DM`, `GROUP_DM`, `GUILD_TEXT`) | Discriminateur. |
| `name` | String, nullable | Nom du groupe ou du channel de guilde ; toujours `NULL` pour un DM à deux, qui s'affiche sous le nom de l'autre participant. |
| `dm_key` | String, unique, nullable | Signature de la paire pour un `DM` (voir note ci-dessous). `NULL` pour les autres types. |
| `guild_id` | UUID, nullable | Renseigné pour un `GUILD_TEXT`. Pas de FK — Guild est un autre service. |
| `owner_id` | UUID (FK → User), nullable | Propriétaire d'un `GROUP_DM`. |
| `show_channel` | boolean | Visibilité du DM dans la liste latérale — repassé à `false` quand la relation d'amitié est rompue. |

Les participants sont portés par la table de jointure `channel_members` (voir ci-dessous).

Contrainte CHECK `ck_channel_shape` : chaque `type` impose sa forme — un `DM` a un `dm_key` et rien d'autre (pas de nom, pas de propriétaire, pas de guilde), un `GROUP_DM` a un nom et un propriétaire, un `GUILD_TEXT` a un nom et un `guild_id`. L'invariant « un DM n'a pas de nom » est donc tenu en base, pas seulement dans le service.

**Note de design — pourquoi une seule entité** : une version précédente de ce document décrivait trois entités séparées (`Channel` de guilde, `PrivateChannel`, et un `GroupPrivateChannel` ajouté ensuite). Chacune avait sa table, son repository, son DTO et sa branche dans les contrôleurs. Le coût réel s'est manifesté vite : `Message` portait trois FK nullables, la liste des conversations d'un utilisateur demandait deux requêtes et deux mappings recousus dans un DTO d'enveloppe, et toute fonctionnalité au niveau du channel (accusés de lecture, épingles, sourdine, pointeur de dernier message lu) aurait coûté trois fois le travail.

Ces trois formes sont pourtant la même chose : **un ensemble de participants auquel on envoie des messages**. Les différences (un nom, un propriétaire, une guilde) sont des attributs optionnels, pas des types distincts. Ce qu'on perd en repliant tout — la sécurité de type à la compilation — est récupéré côté applicatif par un constructeur privé et des fabriques (`Channel.dm`, `Channel.groupDm`, `Channel.guildText`), et côté base par le CHECK ci-dessus.

**Note de design — `dm_key` et l'unicité de la paire** : la version précédente notait, à raison, qu'**une table de jointure ne peut pas exprimer « une seule conversation par ensemble de participants »** — rien n'empêchait deux DM distincts entre les deux mêmes personnes, alors que le démarrage d'un DM est une recherche-ou-création qui a précisément besoin de cette garantie. La note concluait qu'il fallait compenser dans le service.

C'est désormais tenu en base. `dm_key` contient les deux UUID triés et concaténés (`"uuid_bas:uuid_haut"`), sous contrainte d'unicité. Deux bénéfices : la double conversation devient impossible quel que soit le code appelant, et la recherche du DM existant devient une égalité indexée sur une colonne unique, au lieu d'une requête à quatre prédicats en OU sur deux colonnes de participants.

Le tri des deux UUID se fait sur leur **représentation textuelle canonique**, pas via `UUID.compareTo` en Java : `compareTo` traite les deux moitiés comme des entiers **signés**, ce qui ne correspond pas à l'ordre par octets non signés utilisé par PostgreSQL. Comparer les chaînes fait coïncider les deux ordres — sans quoi Java et SQL ne s'accorderaient pas sur lequel des deux membres est « le premier ».

**Point ouvert — réplication des channels de guilde** : `Channel.id` est généré localement, ce qui convient aux DM mais pas à un `GUILD_TEXT`, dont l'id doit venir de Guild et jamais être généré ici. La colonne `version` des copies répliquées ([ADR-0006](../adr/0006-entity-versioning-for-reconciliation.md)) n'existe pas non plus sur cette table. À trancher quand Guild sera implémenté : id assigné à l'insertion pour ce type précis, et ajout d'une `version` réservée aux `GUILD_TEXT`.

### ChannelMember (jointure)

| Champ | Type | Notes |
|---|---|---|
| `channel_id` | UUID (FK → Channel) | |
| `user_id` | UUID (FK → User) | |

Clé primaire composite sur (`channel_id`, `user_id`). Index dédié sur `user_id` pour la traversée inverse — « la liste des conversations de cet utilisateur » est la requête la plus fréquente du service.

Les règles de cardinalité dépendent du `type` et sont tenues dans le service, pas en base : exactement 2 participants pour un `DM`, de 3 à 10 pour un `GROUP_DM`.

### User

Copie locale répliquée des utilisateurs connus de Messaging — auteurs de messages et participants aux conversations.

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | = l'id Auth/Users ; jamais généré localement. |
| `username` | String | Copie en lecture seule, répliquée depuis les events de Users. |
| `dm_privacy` | enum (`EVERYONE`, `FRIENDS`, `FRIENDS_OF_FRIENDS`) | Copie répliquée depuis Users — consultée avant d'autoriser la création d'un DM. |
| `version` | integer | Pour la réconciliation ([ADR-0006](../adr/0006-entity-versioning-for-reconciliation.md)). |

Le graphe d'amitié est lui aussi répliqué localement, dans la table de jointure `user_friends` (`user_id`, `friend_id`) — Users reste la source de vérité, Messaging n'en garde qu'une copie alimentée par `RelationshipChangeEvent`, pour ne pas appeler Users à chaque DM.

**Note de nommage** : cette entité s'appelait `Member` dans une version précédente de ce document, avec un `id` local distinct du `user_id`. Le nom prêtait à confusion avec le `Member` de Guild (qui est un membre *de guilde*, une notion sans objet dans un DM), et l'id local en doublon n'apportait rien. L'implémentation utilise `User`, avec l'id d'Auth/Users comme clé primaire directe.

### Reaction

| Champ | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `message_id` | UUID (FK → Message) | Vraie FK, locale. Supprimer un message supprime ses réactions (cascade). |
| `user_id` | UUID (FK → User) | Pointe la copie locale répliquée — c'est déjà ce que référence `Message.sender_id`. |
| `emoji` | String | |

Contrainte d'unicité sur (`message_id`, `user_id`, `emoji`).

**Note de design — pointer la copie locale plutôt qu'un id nu** : le débat portait sur `user_id` (id Auth/Users, sans FK) contre un id de copie locale. Il est devenu sans objet depuis que la copie locale a l'id d'Auth/Users pour clé primaire (voir `User` ci-dessus) : la colonne porte bien l'id d'origine *et* une vraie FK, sans stocker deux fois la même identité sous deux formes différentes.

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
