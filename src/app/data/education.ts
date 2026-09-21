import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export interface Degree {
  readonly id: string;
  readonly title: Localized;
  readonly school: string;
  readonly period: string;
  readonly location: string;
  readonly description: Localized;
  readonly icon: IconName;
}

export interface Certification {
  readonly title: Localized;
  readonly issuer: string;
  readonly icon: IconName;
}

export interface Language {
  readonly name: Localized;
  readonly level: Localized;
  /** De 0 a 1, para la barra de nivel. */
  readonly value: number;
}

export const DEGREES: readonly Degree[] = [
  {
    id: 'unapec',
    title: { es: 'Ingeniería en Software', en: 'B.S. in Software Engineering' },
    school: 'Universidad APEC (UNAPEC)',
    period: '2018 – 2025',
    location: 'Santo Domingo, RD',
    description: {
      es: 'Estructuras de datos, algoritmos, bases de datos, arquitectura y diseño de software, ciberseguridad y desarrollo web y móvil.',
      en: 'Data structures, algorithms, databases, software architecture and design, cybersecurity, and web and mobile development.',
    },
    icon: 'graduation-cap',
  },
  {
    id: 'high-school',
    title: { es: 'Bachillerato', en: 'High school diploma' },
    school: 'Colegio Taller Victoria Montás',
    period: '2017',
    location: 'San Cristóbal, RD',
    description: {
      es: 'Formación secundaria completa.',
      en: 'Completed secondary education.',
    },
    icon: 'award',
  },
];

export const CERTIFICATIONS: readonly Certification[] = [
  { title: { es: 'Responsive Web Design', en: 'Responsive Web Design' }, issuer: 'freeCodeCamp', icon: 'laptop' },
  { title: { es: 'Bases de datos', en: 'Databases' }, issuer: 'UNAPEC · Microsoft Learn', icon: 'database' },
  { title: { es: 'Auxiliar de Contabilidad', en: 'Accounting Assistant' }, issuer: 'Instituto Politécnico Loyola', icon: 'table' },
];

export const LANGUAGES: readonly Language[] = [
  { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' }, value: 1 },
  { name: { es: 'Inglés', en: 'English' }, level: { es: 'Competente', en: 'Proficient' }, value: 0.7 },
];
