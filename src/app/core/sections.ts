import type { ShapeName } from '../three/shapes';
import type { IconName } from '../shared/icon/icons';
import type { Localized } from './i18n/lang';

export type SectionId = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact';

export interface SectionDef {
  readonly id: SectionId;
  readonly icon: IconName;
  readonly label: Localized;
  /** Figura que forman las partículas 3D cuando esta sección está en pantalla. */
  readonly shape: ShapeName;
}

/** Orden y metadatos de las secciones: alimenta la navegación, el buscador y la escena 3D. */
export const SECTIONS: readonly SectionDef[] = [
  { id: 'home', icon: 'house', label: { es: 'Inicio', en: 'Home' }, shape: 'planet' },
  { id: 'about', icon: 'user', label: { es: 'Sobre mí', en: 'About' }, shape: 'knot' },
  { id: 'experience', icon: 'briefcase', label: { es: 'Experiencia', en: 'Experience' }, shape: 'dna' },
  { id: 'projects', icon: 'folder-git', label: { es: 'Proyectos', en: 'Projects' }, shape: 'cube' },
  { id: 'skills', icon: 'layers', label: { es: 'Habilidades', en: 'Skills' }, shape: 'network' },
  { id: 'education', icon: 'graduation-cap', label: { es: 'Formación', en: 'Education' }, shape: 'atom' },
  { id: 'contact', icon: 'mail', label: { es: 'Contacto', en: 'Contact' }, shape: 'wave' },
];
