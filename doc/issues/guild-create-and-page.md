# Bogue : après la création d'une guilde, sa page et ses salons ne s'affichent pas

## Ce qui se passe
1. Je me connecte, j'ouvre la modale « Créer une guilde » (`CreateGuildModal`), je choisis un nom et des amis, puis je valide.
2. Le front redirige vers `/guild/:guildId`.
3. La page n'affiche pas la guilde ni son salon `general` (message « Ce salon n'existe pas » ou erreur du loader).

## Ce qui est attendu
- Le créateur arrive sur la page de la guilde, avec la liste des salons à gauche et le salon `general` ouvert.
- Le créateur et les amis choisis apparaissent dans la liste des membres.
- Un autre membre de la guilde voit la guilde dans sa liste et peut ouvrir la même page.
- Un utilisateur qui **n'est pas membre** ne peut ni voir la guilde dans sa liste ni ouvrir sa page (refus de l'API, pas seulement de l'interface).

## Parcours concerné
`frontend-v2` (modale de création, `routes/app/guild.$guildId`) → `api-gateway` → `guild-service`
→ événement `guild.channel.created` sur RabbitMQ → `messaging-service` (`GuildConsumer`, `ChannelService`).
Voir ADR-0003 (database-per-service), ADR-0008 (frontière guild/channel), ADR-0013 (routing keys).

## Démarche demandée
1. Trouver la cause en suivant le parcours ci-dessus. Écrire la cause dans la PR **avant** de corriger.
2. Écrire d'abord un test qui échoue et qui reproduit le problème, puis corriger.
3. Garder la correction minimale : pas de refactoring qui n'est pas nécessaire au bogue.

## Tests attendus (au minimum)
- Créer une guilde produit une guilde dont le créateur et les membres choisis sont des `Member`.
- Le propriétaire et le créateur viennent du JWT (`JwtPrincipal`), **jamais** du corps de la requête.
- L'événement `ChannelCreatedEvent` publié contient bien les membres.
- `GET /api/v1/guild/list` ne renvoie que les guildes dont l'utilisateur est membre.
- `GET /api/v1/guild/{id}` renvoie 403 (ou 404) à un non-membre.

## Hors portée
- Invitations (voir `doc/issues/guild-invites.md`), rôles, permissions avancées.
- Création ou renommage de salons depuis l'interface.

## Terminé quand
- Les tests ci-dessus passent, `mvn -pl guild-service -am verify` et `cd frontend-v2 && npm run typecheck && npm test` passent, CI verte.
- La description de la PR explique la cause, la correction, ce qui a été testé et ce qui ne l'a pas été
  (notamment ce qui a besoin de RabbitMQ en vrai pour être vérifié).
