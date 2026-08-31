package com.strife.common.messaging;

/**
 * Noms des exchanges RabbitMQ partagés.
 *
 * <p>
 * Ces constantes doivent être identiques côté publisher et côté consumer : une
 * divergence fait échouer la livraison silencieusement, sans erreur visible.
 */
public final class Exchanges {

    /** Exchange topic principal, sur lequel transitent les events métier. */
    public static final String STRIFE = "strife.exchange";

    private Exchanges() {
    }
}
