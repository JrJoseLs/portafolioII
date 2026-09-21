export type Lang = 'es' | 'en';

export const LANGS: readonly Lang[] = ['es', 'en'];

/** Un valor traducido a todos los idiomas del sitio. */
export type Localized<T = string> = Readonly<Record<Lang, T>>;
