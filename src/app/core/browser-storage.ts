/**
 * Acceso seguro a localStorage: en modo privado o con cookies bloqueadas el
 * navegador puede lanzar excepciones, y el sitio debe seguir funcionando.
 */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sin persistencia: la preferencia solo dura esta visita.
  }
}
