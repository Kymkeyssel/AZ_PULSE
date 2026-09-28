/**
 * Configuration transverse du client HTTP.
 *
 * Point d'unification : avant, deux clients API concurrents coexistaient
 * (`services/api.js` sur le port 8000 avec la clé `az_pulse_token`, et
 * `api/client.js` sur le port 8080 avec la clé `token`). Toute divergence de
 * port ou de clé produisait des 401 silencieux difficiles à diagnostiquer.
 *
 * La valeur par défaut reste celle qui fonctionne en développement (port 8000)
 * afin de ne casser aucun écran existant ; elle est surchargeable par
 * `VITE_API_BASE_URL` dans `frontend/.env`.
 */
const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api'
).replace(/\/+$/, '');

/** Clé unique du jeton d'accès dans le localStorage. */
export const TOKEN_KEY = 'az_pulse_token';

export { API_BASE_URL };
