/**
 * Acceso seguro a localStorage: puede fallar en modo privado o con
 * las cookies bloqueadas, y en ese caso el sitio debe seguir funcionando.
 */
export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* sin persistencia: no pasa nada */
    }
  },
};
