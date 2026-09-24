-- ============================================================
-- Base dédiée à n8n
-- Ce script est exécuté uniquement lors de l'initialisation
-- du volume PostgreSQL.
-- ============================================================

DO
$$
BEGIN

    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'azpulse_n8n'
    ) THEN

        CREATE ROLE azpulse_n8n
        LOGIN
        PASSWORD 'n8n_dev_password';

    END IF;

END
$$;


SELECT 'CREATE DATABASE n8n OWNER azpulse_n8n'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'n8n'
)\gexec