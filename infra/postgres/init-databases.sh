#!/usr/bin/env bash
# Exécuté automatiquement au premier démarrage du conteneur postgres
# (mécanisme standard de l'image officielle : docker-entrypoint-initdb.d).
#
# Une base de données par service, pour respecter "database-per-service"
# (voir doc/adr/0003-database-per-service-event-carried-state.md) même si,
# en dev local, on partage une seule instance Postgres pour rester léger —
# c'est un compromis de commodité locale, pas la topologie de production.
set -e

for db in auth_db users_db guild_db messaging_db eventstore_db; do
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE ${db};
EOSQL
done
