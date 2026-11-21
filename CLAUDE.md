# Strife — instructions pour les agents

Strife est un clone de Discord en microservices : Spring Boot 4 / Java 26 côté serveur,
React 19 + TypeScript (React Router 8, TanStack Query) dans `frontend-v2/`.
`frontend/` est l'ancienne version : **ne pas y toucher**.

## Où trouver le contexte (à lire AVANT de coder)
- `doc/architecture/functionalities.md` — ce que chaque service doit exposer, et les décisions encore ouvertes.
- `doc/architecture/data-model.md` — le modèle de données de référence (champs, contraintes).
- `doc/adr/` — les décisions d'architecture. Ne pas les contredire. Si une tâche semble l'exiger, s'arrêter et le signaler.
- La tâche en cours est décrite dans l'issue GitHub (ou `doc/issues/`).

## Commandes
- Backend, tout : `mvn -B -ntp verify` (depuis la racine)
- Backend, un service : `mvn -B -ntp -pl guild-service -am verify`
- Front : `cd frontend-v2 && npm run typecheck && npm test`

## Conventions
- **Migrations Liquibase** : ne jamais modifier un changeset existant (ils sont déjà appliqués).
  Créer un nouveau fichier numéroté dans `db/changelog/changes/` et l'inclure dans `db.changelog-master.xml`.
- **Droits d'accès** : toute règle (membre, owner, permission, ban) est vérifiée **dans l'API**.
  Cacher un bouton dans l'interface n'est jamais suffisant. Chaque règle a un test qui appelle l'API directement.
- **Utilisateur courant** : `JwtPrincipal` (id, email, username) du `SecurityContext`. Ne jamais faire confiance
  à un `userId` envoyé par le client.
- **Événements** : routing keys selon ADR-0013. Ne pas modifier les events de `common-library` sans le signaler :
  d'autres services en dépendent.
- **Front** : suivre le patron `app/api/<domaine>/` → `*.requests.ts` (axios), `*.keys.ts`, `*.hooks.ts` (TanStack Query),
  `*.types.ts`. Composants UI : shadcn dans `app/components/ui`.

## Façon de travailler
1. Lire l'issue et la doc ci-dessus. Écrire un court plan dans la PR avant de coder.
2. Pour un bogue : écrire d'abord un test qui échoue, puis corriger.
3. **Ne jamais modifier ou supprimer un test existant pour le faire passer.** Si un test semble faux, s'arrêter et expliquer pourquoi.
4. Petites PR (idéalement < 400 lignes), une préoccupation par PR. Branche `agent/<sujet>`.
5. Terminé = tests et typecheck verts en local + CI verte + description de PR qui dit ce qui a été testé
   et ce qui ne l'a pas été.

## Interdits
- Lire, afficher ou modifier un `.env` (un hook le bloque). Utiliser `.env.example` pour connaître les noms de variables.
- Mettre un secret, un token ou un mot de passe dans le code, un test, un log ou une PR.
- `git push --force`, push direct sur `main`, merge de PR.

## Quand s'arrêter et demander
- Une décision produit n'est pas tranchée (voir « décision encore ouverte » dans `functionalities.md`).
- La tâche exige de contredire un ADR ou de changer un contrat entre services.
- Le même test échoue après 3 tentatives de correction : résumer ce qui a été essayé et s'arrêter.
