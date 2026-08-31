# common-library

Bibliothèque partagée entre les services Strife. Ce module ne démarre pas : c'est
un jar de dépendance (le `repackage` de spring-boot-maven-plugin y est désactivé).

## Ce qu'on y met

Uniquement du code qui doit être **identique** dans plusieurs services :

- **Contrats d'events** (`com.strife.common.event`) — un event publié par un
  service et consommé par un autre est un contrat ; le dupliquer des deux côtés
  fait diverger les champs sans erreur de compilation.
- **Constantes de messaging** (`com.strife.common.messaging`) — noms d'exchange
  et routing keys ([ADR-0013](../doc/adr/0013-routing-key-convention.md)). Le
  matching RabbitMQ est sensible à la casse : une divergence entre publisher et
  binding fait échouer la livraison silencieusement.
- **JWT** (`com.strife.common.security`) — auth-service signe, api-gateway
  vérifie ([ADR-0012](../doc/adr/0012-network-isolation-and-gateway-trust.md)) ;
  les deux doivent partager la même dérivation de clé et le même algorithme.
- **Forme des réponses HTTP** (`com.strife.common.dto`,
  `com.strife.common.exception`) — pour que le frontend voie la même structure
  d'erreur quel que soit le service qui répond.

## Ce qu'on n'y met pas

Les entités JPA, les repositories, les DTO d'API propres à un service, la config
de sécurité. Un service possède sa base et son modèle
([ADR-0003](../doc/adr/0003-database-per-service-event-carried-state.md)) :
partager une entité recrée le couplage que le découpage en services évite.

## Utilisation

```xml
<dependency>
    <groupId>com.strife</groupId>
    <artifactId>common-library</artifactId>
    <version>latest</version>
</dependency>
```

Les dépendances de ce module sont toutes `optional` : chaque service déclare
lui-même spring-web, spring-security ou jjwt s'il en a besoin. Les
auto-configurations sont conditionnées en conséquence et ne s'activent que sur
ce qui est réellement présent.

### Auto-configurations

| Classe | S'active si | Fournit |
| --- | --- | --- |
| `CommonWebAutoConfiguration` | application **servlet** (donc pas api-gateway, qui est WebFlux) | `GlobalExceptionHandler`, et `SecurityExceptionHandler` si spring-security-core est présent |
| `CommonJwtAutoConfiguration` | jjwt présent **et** `jwt.secret` renseigné | `JwtUtility` construit depuis `JwtProperties` |

Les deux beans sont `@ConditionalOnMissingBean` : un service qui définit le sien
garde la main.

### Propriétés

```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: 300000        # ms, défaut 300000
  refresh-token:
    expiration: 604800      # secondes, défaut 604800
```

## Migration des services existants

Le code dupliqué n'a pas encore été retiré des services. À faire, un service à
la fois :

- **auth-service** — remplacer `com.strife.auth.dto.ErrorResponseDTO` /
  `ResponseDTO`, `com.strife.auth.exception.*` et
  `com.strife.auth.security.JwtUtility` par leurs équivalents `com.strife.common.*`,
  puis supprimer les originaux. `UserDTO.fromEntity(...)` peut retourner un
  `AccountRegisteredEvent`.
- **users-service** — remplacer `dto.userDTO` par `AccountRegisteredEvent` dans
  `AccountEventListener`, et les constantes de `RabbitMqConfig` par
  `Exchanges.STRIFE` / `RoutingKeys.AUTH_ACCOUNT_ALL`.
- **api-gateway** — remplacer `com.strife.gateway.api.security.JwtUtility` par
  le bean auto-configuré (WebFlux : seul le JWT est repris, pas les handlers).

Attention en migrant : `users-service` publie aujourd'hui sur la queue
`user_queue` avec le binding `auth.account.*` alors qu'`auth-service` publie sur
`strife.exchange` — vérifier que les constantes reprises correspondent bien à ce
qui tourne avant de redéployer.
