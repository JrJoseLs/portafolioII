import type { Localized } from '../core/i18n/lang';

/**
 * Cambios de contenido que se aplican encima de los datos por defecto
 * (`profile.ts` y los textos de `ui-strings.ts`).
 *
 * Se guardan en `public/content.json`, que el sitio carga al arrancar. El panel
 * de edición (`#admin`) permite editarlos sin tocar código y descargar el
 * archivo ya listo para subir al repositorio.
 *
 * Todos los campos son opcionales: lo que no esté aquí mantiene su valor por defecto.
 */
export interface ContentOverrides {
  /** Nombre público. */
  name?: string;
  /** Cargo que aparece bajo la foto. */
  headline?: Localized;
  /** Texto de la etiqueta de ubicación en la portada. */
  location?: Localized;
  email?: string;
  /** Enlace al CV (Google Drive, solo visualización). */
  cvUrl?: string;
  /** Ruta de la foto (`images/…`) o una imagen incrustada en formato data URL. */
  photo?: string;
  /** Párrafos de la sección "Sobre mí". */
  about?: Localized<readonly string[]>;
  /** Enlaces de redes sociales, por id: `{ "github": "https://…" }`. */
  socials?: Readonly<Record<string, string>>;
}

export const EMPTY_OVERRIDES: ContentOverrides = {};
