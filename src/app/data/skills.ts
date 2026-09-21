import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export interface Skill {
  readonly name: string | Localized;
  /** Logo de la tecnología; si no hay, se muestra un punto de color. */
  readonly icon?: IconName;
}

export interface SkillGroup {
  readonly id: string;
  readonly icon: IconName;
  readonly title: Localized;
  readonly description: Localized;
  readonly skills: readonly Skill[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'data',
    icon: 'chart',
    title: { es: 'Datos y automatización', en: 'Data & automation' },
    description: {
      es: 'Lo que uso a diario para que los datos trabajen solos: automatizaciones, modelos, limpieza y paneles.',
      en: 'What I use every day to make data work on its own: automations, models, cleaning and dashboards.',
    },
    skills: [
      { name: 'Google Apps Script', icon: 'apps-script' },
      { name: 'Google Sheets', icon: 'google-sheets' },
      { name: 'Excel', icon: 'table' },
      { name: 'Tableau Public', icon: 'chart' },
      { name: 'SQL', icon: 'database' },
      { name: { es: 'Limpieza de datos', en: 'Data cleaning' }, icon: 'sparkles' },
      { name: { es: 'Análisis de datos', en: 'Data analysis' }, icon: 'brain' },
      { name: { es: 'Auditoría de datos', en: 'Data auditing' }, icon: 'badge-check' },
      { name: { es: 'Generación de informes', en: 'Reporting' }, icon: 'file-text' },
    ],
  },
  {
    id: 'dev',
    icon: 'code',
    title: { es: 'Desarrollo de software', en: 'Software development' },
    description: {
      es: 'Lenguajes y frameworks con los que construyo aplicaciones web, APIs y experiencias 3D.',
      en: 'Languages and frameworks I use to build web apps, APIs and 3D experiences.',
    },
    skills: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Angular', icon: 'angular' },
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express', icon: 'express' },
      { name: 'Three.js', icon: 'threejs' },
      { name: 'C# / .NET', icon: 'dotnet' },
      { name: 'PHP', icon: 'php' },
      { name: 'HTML', icon: 'html5' },
      { name: 'CSS', icon: 'css' },
      { name: { es: 'Programación orientada a objetos', en: 'Object-oriented programming' }, icon: 'shapes' },
    ],
  },
  {
    id: 'platforms',
    icon: 'cloud',
    title: { es: 'Bases de datos y plataformas', en: 'Databases & platforms' },
    description: {
      es: 'Bases de datos, nube y herramientas para versionar, desplegar y diseñar.',
      en: 'Databases, cloud and tools to version, deploy and design.',
    },
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'SQL Server', icon: 'database' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Azure', icon: 'cloud' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'CI / CD', icon: 'workflow' },
      { name: 'Microsoft Office', icon: 'file-text' },
      { name: 'Adobe', icon: 'palette' },
      { name: 'Blender', icon: 'blender' },
    ],
  },
  {
    id: 'commerce',
    icon: 'shopping-bag',
    title: { es: 'E-commerce y operaciones', en: 'E-commerce & operations' },
    description: {
      es: 'Experiencia operativa en comercio: inventario, pedidos, pagos y atención al cliente.',
      en: 'Hands-on commerce operations: inventory, orders, payments and customer care.',
    },
    skills: [
      { name: { es: 'Plataforma Etsy', en: 'Etsy platform' }, icon: 'etsy' },
      { name: { es: 'Inventario digital', en: 'Digital inventory tracking' }, icon: 'box' },
      { name: { es: 'Gestión de pedidos', en: 'Order fulfillment' }, icon: 'send' },
      { name: { es: 'Atención al cliente', en: 'Customer support' }, icon: 'users' },
      { name: { es: 'Contabilidad', en: 'Accounting' }, icon: 'table' },
      { name: { es: 'Soporte técnico', en: 'IT support' }, icon: 'wrench' },
    ],
  },
  {
    id: 'soft',
    icon: 'sparkles',
    title: { es: 'Habilidades blandas', en: 'Soft skills' },
    description: {
      es: 'La forma en que trabajo con personas y problemas.',
      en: 'How I work with people and problems.',
    },
    skills: [
      { name: { es: 'Resolución de problemas', en: 'Problem solving' }, icon: 'zap' },
      { name: { es: 'Pensamiento abstracto', en: 'Abstract thinking' }, icon: 'brain' },
      { name: { es: 'Adaptabilidad', en: 'Adaptability' }, icon: 'shuffle' },
      { name: { es: 'Principios ágiles', en: 'Agile principles' }, icon: 'rocket' },
      { name: { es: 'Diagramación', en: 'Diagramming' }, icon: 'workflow' },
      { name: { es: 'Trabajo en equipo', en: 'Teamwork' }, icon: 'users' },
      { name: { es: 'Aprendizaje rápido', en: 'Fast learner' }, icon: 'graduation-cap' },
      { name: { es: 'Gestión del tiempo', en: 'Time management' }, icon: 'clock' },
      { name: { es: 'Escucha activa', en: 'Active listening' }, icon: 'hand' },
    ],
  },
];

/** Logos que se desplazan en la cinta animada de la sección de habilidades. */
export const STACK_MARQUEE: readonly Skill[] = [
  { name: 'Angular', icon: 'angular' },
  { name: 'React', icon: 'react' },
  { name: 'Three.js', icon: 'threejs' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'NestJS', icon: 'nestjs' },
  { name: 'Apps Script', icon: 'apps-script' },
  { name: 'Google Sheets', icon: 'google-sheets' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Git', icon: 'git' },
  { name: '.NET', icon: 'dotnet' },
  { name: 'PHP', icon: 'php' },
  { name: 'Blender', icon: 'blender' },
];
