import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly handle: string;
  readonly url: string;
  readonly icon: IconName;
}

export interface CvFile {
  readonly id: 'cv' | 'resume';
  readonly label: Localized;
  readonly description: Localized;
  /** Ruta relativa dentro de `public/`. */
  readonly file: string;
}

export const PROFILE = {
  name: 'José Luis Isabel Matos',
  firstName: 'José Luis',
  lastName: 'Isabel Matos',
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
  /** Número de repositorios públicos en GitHub (actualízalo cuando quieras). */
  publicRepos: 70,
  githubUrl: 'https://github.com/JrJoseLs',
} as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'github', label: 'GitHub', handle: '@JrJoseLs', url: 'https://github.com/JrJoseLs', icon: 'github' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'José Luis Isabel Matos',
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

/** Currículums descargables (los PDF están en `public/cv/`). */
export const CV_FILES: readonly CvFile[] = [
  {
    id: 'cv',
    label: { es: 'CV actualizado', en: 'Updated CV' },
    description: { es: 'PDF · Español · Versión más reciente', en: 'PDF · Spanish · Latest version' },
    file: 'cv/jose-luis-isabel-cv.pdf',
  },
  {
    id: 'resume',
    label: { es: 'Resume en inglés', en: 'English résumé' },
    description: { es: 'PDF · Inglés', en: 'PDF · English' },
    file: 'cv/jose-luis-isabel-resume-en.pdf',
  },
];
