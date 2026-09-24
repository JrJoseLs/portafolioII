import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly handle: string;
  readonly url: string;
  readonly icon: IconName;
}

/**
 * Datos públicos del perfil. Son los valores por defecto: el panel de edición
 * (`#admin`) puede sobrescribir algunos de ellos mediante `public/content.json`.
 */
export const PROFILE = {
  /** Nombre público. Se muestra en la portada, el pie y los metadatos. */
  name: 'Jose Matos',
  initials: 'JL',
  role: { es: 'Ingeniero de Software', en: 'Software Engineer' } satisfies Localized,
  headline: {
    es: 'Especialista en Operaciones Técnicas y Automatización',
    en: 'Technical Operations & Automation Specialist',
  } satisfies Localized,
  photo: 'images/profile.webp',
  email: 'junior_er@hotmail.es',
  phone: '+1 809 360 3722',
  whatsappNumber: '18093603722',
  /**
   * CV en Google Drive: solo se puede ver, no se descarga desde el sitio.
   * Cámbialo en el panel de edición o aquí mismo.
   */
  cvUrl: 'https://drive.google.com/file/d/1Dz9eCkE8G1VdLvJK_I2iVbxSjRjqtVcP/view',
  /** Número de repositorios públicos en GitHub (actualízalo cuando quieras). */
  publicRepos: 70,
  githubUrl: 'https://github.com/JrJoseLs',
} as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'github', label: 'GitHub', handle: '@JrJoseLs', url: 'https://github.com/JrJoseLs', icon: 'github' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Jose Matos',
    url: 'https://www.linkedin.com/in/jose-luis-isabel-matos-a03840238/',
    icon: 'linkedin',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: PROFILE.phone,
    url: `https://wa.me/${PROFILE.whatsappNumber}`,
    icon: 'whatsapp',
  },
  { id: 'instagram', label: 'Instagram', handle: '@junior_zlb', url: 'https://www.instagram.com/junior_zlb', icon: 'instagram' },
];
