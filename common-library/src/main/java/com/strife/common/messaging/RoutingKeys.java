package com.strife.common.messaging;

/**
 * Routing keys des events, au format {@code <service>.<entité>.<action>}
 * (minuscules, action au passé) — voir doc/adr/0013-routing-key-convention.md.
 *
 * <p>
 * Le matching RabbitMQ est sensible à la casse : passer par ces constantes
 * évite qu'un publisher et un binding divergent sans erreur visible.
 */
public final class RoutingKeys {

    // auth-service
    public static final String AUTH_ACCOUNT_REGISTERED = "auth.account.registered";

    /** Pattern de binding : tous les events de compte publiés par auth-service. */
    public static final String AUTH_ACCOUNT_ALL = "auth.account.*";

    // users-service
    public static final String USERS_PROFILE_CREATED = "users.profile.created";
    public static final String USERS_PROFILE_UPDATED = "users.profile.updated";

    /** Pattern de binding : tous les events de profil publiés par users-service. */
    public static final String USERS_PROFILE_ALL = "users.profile.*";

    private RoutingKeys() {
    }
}
