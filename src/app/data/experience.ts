import type { YearMonth } from '../core/format';
import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export interface ExperienceGroup {
  readonly title: Localized;
  readonly items: readonly Localized[];
}

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly role: Localized;
  readonly icon: IconName;
  readonly start: YearMonth;
  /** `null` = trabajo actual. */
  readonly end: YearMonth | null;
  readonly location: Localized;
  readonly summary: Localized;
  readonly groups: readonly ExperienceGroup[];
  /** Logro medible que se destaca en la tarjeta. */
  readonly metric?: { readonly value: string; readonly label: Localized };
  readonly tags: readonly string[];
}

/** Experiencia laboral, de la más reciente a la más antigua. */
export const EXPERIENCE: readonly Experience[] = [
  {
    id: 'sigsim',
    company: 'SIGSIM Tecnología Educativa',
    role: {
      es: 'Especialista en Operaciones Técnicas y Automatización',
      en: 'Technical Operations & Automation Specialist',
    },
    icon: 'workflow',
    start: '2024-01',
    end: null,
    location: {
      es: 'Santo Domingo (Villa Marina) · De híbrido a 100% remoto',
      en: 'Santo Domingo (Villa Marina) · Hybrid to 100% remote',
    },
    summary: {
      es: 'Automatizo la gestión de datos y los reportes del equipo para que las decisiones se tomen con información fiable y a tiempo.',
      en: 'I automate the team’s data management and reporting so decisions are made with reliable, timely information.',
    },
    groups: [
      {
        title: { es: 'Qué hago', en: 'What I do' },
        items: [
          {
            es: 'Extracción y procesamiento automatizado de datos con Google Apps Script y Python.',
            en: 'Automated data extraction and processing with Google Apps Script and Python.',
          },
          {
            es: 'Creación de modelos de datos en Excel y Google Sheets.',
            en: 'Data modeling in Excel and Google Sheets.',
          },
          {
            es: 'Desarrollo de paneles en Tableau para el seguimiento del rendimiento.',
            en: 'Tableau dashboards to track performance.',
          },
          {
            es: 'Optimización de flujos de trabajo y de los procesos de generación de informes.',
            en: 'Optimization of workflows and report generation processes.',
          },
          {
            es: 'Auditoría de conjuntos de datos para identificar riesgos y discrepancias.',
            en: 'Dataset audits to identify risks and discrepancies.',
          },
        ],
      },
    ],
    tags: ['Google Apps Script', 'Python', 'Google Sheets', 'Excel', 'Tableau', 'Data Cleaning', 'Reporting'],
  },
  {
    id: 'inoa',
    company: 'Ferretería Hermanos Inoa',
    role: {
      es: 'Auxiliar Contable y Colaborador Técnico',
      en: 'Accounting Assistant & Technical Collaborator',
    },
    icon: 'wrench',
    start: '2021-11',
    end: '2023-01',
    location: { es: 'Calle Pedro Renville, San Cristóbal, RD', en: 'Pedro Renville St., San Cristóbal, DR' },
    summary: {
      es: 'Combiné la atención comercial y la contabilidad con el soporte técnico de los equipos del negocio.',
      en: 'I combined customer service and accounting with technical support for the business’s computers.',
    },
    groups: [
      {
        title: { es: 'Responsabilidades', en: 'Responsibilities' },
        items: [
          {
            es: 'Soporte y asistencia comercial al público en general.',
            en: 'Commercial support and assistance to the general public.',
          },
          {
            es: 'Gestión de pagos manuales y electrónicos de los clientes.',
            en: 'Managing manual and electronic customer payments.',
          },
          {
            es: 'Operación de programas y formatos electrónicos comerciales.',
            en: 'Operating commercial software and electronic forms.',
          },
          {
            es: 'Manejo de documentos comerciales y distintas formas de pago.',
            en: 'Handling commercial documents and multiple payment methods.',
          },
        ],
      },
      {
        title: { es: 'Logros', en: 'Key accomplishments' },
        items: [
          {
            es: 'Soporte técnico oportuno al personal, que aumentó la productividad general un 20%.',
            en: 'Timely technical support to staff, raising overall productivity by 20%.',
          },
          {
            es: 'Mantenimiento periódico de los equipos, con rendimiento óptimo y mínimo tiempo de inactividad.',
            en: 'Regular computer maintenance, ensuring optimal performance and minimal downtime.',
          },
          {
            es: 'Procedimientos de copia de seguridad que garantizaron la integridad y seguridad de los datos.',
            en: 'Data backup procedures that ensured data integrity and security.',
          },
        ],
      },
    ],
    metric: { value: '+20%', label: { es: 'productividad', en: 'productivity' } },
    tags: ['IT Support', 'Accounting', 'Data Backups', 'Customer Service'],
  },
];
