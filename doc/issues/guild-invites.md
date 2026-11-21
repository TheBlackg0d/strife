# Invitations de guilde : générer un lien et rejoindre une guilde

## Pourquoi
Aujourd'hui, une guilde n'a que son créateur : personne ne peut la rejoindre.
Un membre doit pouvoir partager un lien, et la personne qui le reçoit doit pouvoir entrer dans la guilde
en un clic, sauf si elle en a été bannie.

Référence : `doc/architecture/functionalities.md` (Guild : `generateInvite`, `joinGuild`)
et `doc/architecture/data-model.md` (`Invite`, `GuildBan`).

## Contrat d'API (fixé ici pour que back et front avancent en parallèle)
Toutes les routes sont derrière l'API Gateway, préfixe `/api/v1/guild`. L'utilisateur courant vient de `JwtPrincipal`.

| Méthode | Route | Qui | Réponse |
|---|---|---|---|
| `POST` | `/{guildId}/invites` body `{ "expiresInHours": 24 }` (1 à 168, défaut 24) | owner ou membre avec `ADMIN` | `201 { code, url, expiresAt }` · `403` sinon · `404` guilde inconnue |
| `GET` | `/invites/{code}` | tout utilisateur connecté | `200 { guildId, guildName, memberCount, expiresAt }` · `404` code inconnu · `410` expiré |
| `POST` | `/invites/{code}/join` | tout utilisateur connecté | `200 GuildDetailDTO` · `403` banni · `404` · `410` · déjà membre → `200` sans doublon |

Le `code` est aléatoire et non devinable (ex. 10 caractères base62 avec `SecureRandom`), unique en base.

## Back-end (guild-service) — agent 1
- [ ] Nouveaux changesets Liquibase : table `invite` et table `guild_ban` (unicité `guild_id, user_id`), selon `data-model.md`.
- [ ] Entités, repositories, service, contrôleur pour les 3 routes ci-dessus.
- [ ] La vérification du ban se fait dans `joinGuild`, **peu importe le lien présenté**.
- [ ] Tests (au minimum) :
  - un non-membre ou un membre sans `ADMIN` ne peut pas créer d'invitation (403) ;
  - invitation expirée → 410 ;
  - **un utilisateur banni qui appelle directement `POST /invites/{code}/join` reçoit 403**, même avec un lien valide ;
  - rejoindre deux fois ne crée pas deux `Member` ;
  - le `userId` du nouveau membre vient du JWT, jamais du corps de la requête.

## Front-end (frontend-v2) — agent 2
- [ ] `app/api/guild/` : requêtes, clés et hooks pour les 3 routes (même patron que l'existant).
- [ ] Bouton « Inviter » dans la barre de la guilde → modale qui génère le lien et permet de le copier.
- [ ] Route `/invite/:code` : aperçu de la guilde (nom, nombre de membres) et bouton « Rejoindre » → redirige vers la guilde.
- [ ] États gérés : chargement, lien expiré (410), banni (403), lien inconnu (404).
- [ ] Le front ne fait aucune vérification de droits « à la place » de l'API : il affiche ce que l'API répond.
- [ ] Tests Vitest sur la logique (gestion des codes d'erreur → message affiché).

## Hors portée (ne pas faire dans cette PR)
- Endpoints `ban` / `kick` (les tests insèrent un `GuildBan` directement en base ou via le repository).
- Diffusion temps réel de l'arrivée d'un membre (event `guild.member.joined` pour le Realtime Gateway) : issue séparée.
- Révocation ou liste des invitations.

## Terminé quand
- `mvn -pl guild-service -am verify` et `npm run typecheck && npm test` passent, CI verte.
- Deux PR séparées (back, puis front), chacune < 400 lignes si possible.
- La description de chaque PR dit ce qui a été testé et ce qui ne l'a pas été.
