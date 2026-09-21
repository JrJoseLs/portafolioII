import type { Localized } from '../core/i18n/lang';
import type { IconName } from '../shared/icon/icons';

export type ProjectCategory = 'three' | 'web' | 'data';

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: Localized;
  readonly category: ProjectCategory;
  readonly year: number;
  readonly tags: readonly string[];
  /** Captura en `public/images/projects/` (opcional: sin imagen se dibuja una portada). */
  readonly image?: string;
  /** Icono de la portada cuando no hay imagen. */
  readonly icon: IconName;
  readonly demo?: string;
  readonly code?: string;
  /** Aviso corto, p. ej. "Requiere credenciales". */
  readonly note?: Localized;
}

const GITHUB = 'https://github.com/JrJoseLs';
const PAGES = 'https://jrjosels.github.io';

/**
 * Proyectos destacados, en el orden en que aparecen.
 *
 * Para añadir uno nuevo: copia un bloque, cambia los datos y, si tienes una
 * captura, guárdala en `public/images/projects/` (WebP, 960×600 recomendado).
 */
export const FEATURED_PROJECTS: readonly Project[] = [
  {
    id: 'solar-system',
    title: 'Sistema Solar 3D',
    description: {
      es: 'Simulador orbital interactivo con texturas y efemérides de la NASA/JPL. Sigue planetas, viaja en el tiempo entre 1800 y 2050 y controla la velocidad de la simulación.',
      en: 'Interactive orbital simulator with NASA/JPL textures and ephemerides. Follow planets, time-travel between 1800 and 2050 and control the simulation speed.',
    },
    category: 'three',
    year: 2026,
    tags: ['Three.js', 'WebGL', 'JavaScript', 'NASA/JPL data'],
    image: 'images/projects/solar.webp',
    icon: 'orbit',
    demo: `${PAGES}/Ss/`,
    code: `${GITHUB}/Ss`,
  },
  {
    id: 'mimic-night',
    title: 'La Noche del Mímico',
    description: {
      es: 'Juego 3D asimétrico en el navegador: los supervivientes deben encender cinco braseros mientras un impostor se disfraza de objetos o roba el rostro de los vecinos.',
      en: 'Asymmetric 3D browser game: survivors must light five braziers while an impostor disguises as objects or steals the villagers’ faces.',
    },
    category: 'three',
    year: 2026,
    tags: ['Three.js', 'Game design', 'JavaScript'],
    image: 'images/projects/mimic.webp',
    icon: 'gamepad',
    demo: `${PAGES}/RunB/`,
    code: `${GITHUB}/RunB`,
  },
  {
    id: 'driftrunner',
    title: 'DRIFTRUNNER',
    description: {
      es: 'Endless runner hecho 100% con Canvas: personajes y mundo generados por código, efectos de partículas y sonido sintetizado con la Web Audio API. Controles de teclado y táctiles.',
      en: 'Endless runner built entirely with Canvas: procedurally drawn characters and world, particle effects and sound synthesized with the Web Audio API. Keyboard and touch controls.',
    },
    category: 'three',
    year: 2026,
    tags: ['Canvas 2D', 'Web Audio API', 'JavaScript'],
    image: 'images/projects/drift.webp',
    icon: 'rocket',
    demo: `${PAGES}/DRIFTRUNNER/`,
    code: `${GITHUB}/DRIFTRUNNER`,
  },
  {
    id: 'erp-crm',
    title: 'ERP/CRM Dominicana',
    description: {
      es: 'Sistema de gestión empresarial full-stack con autenticación JWT, API REST en Express con Sequelize y MySQL, y exportación de documentos a PDF.',
      en: 'Full-stack business management system with JWT authentication, an Express REST API with Sequelize and MySQL, and PDF document export.',
    },
    category: 'web',
    year: 2025,
    tags: ['React', 'Express', 'Sequelize', 'MySQL', 'JWT'],
    image: 'images/projects/erp.webp',
    icon: 'blocks',
    demo: 'https://my-erp-nine.vercel.app',
    code: `${GITHUB}/myErp`,
  },
  {
    id: 'vifomipymes',
    title: 'Sistema VIFOMIPYMES',
    description: {
      es: 'Propuesta de diseño de un sistema de gestión para el Viceministerio de Fomento a las MIPYMES: casos de uso, requisitos, diagramas de secuencia y flujo, modelo E/R, infraestructura y arquitectura.',
      en: 'System design proposal for the Dominican Vice Ministry for MSME Promotion: use cases, requirements, sequence and flow diagrams, E/R model, infrastructure and architecture.',
    },
    category: 'data',
    year: 2025,
    tags: ['Software architecture', 'UML', 'E/R modeling', 'HTML/CSS'],
    image: 'images/projects/vifo.webp',
    icon: 'workflow',
    demo: 'https://vifomipymes.vercel.app',
    code: `${GITHUB}/VIFOMIPYMES`,
  },
  {
    id: 'readiness-comparator',
    title: 'Comparador de Preparación Profesional',
    description: {
      es: 'Herramienta web que procesa archivos Excel y CSV de estudiantes, clases y carreras para comparar su preparación profesional en un espacio de trabajo organizado.',
      en: 'Web tool that processes Excel and CSV files of students, classes and careers to compare their professional readiness in an organized workspace.',
    },
    category: 'data',
    year: 2026,
    tags: ['JavaScript', 'SheetJS', 'Excel / CSV'],
    icon: 'table',
    demo: `${PAGES}/PP/`,
    code: `${GITHUB}/PP`,
    note: { es: 'Acceso con credenciales', en: 'Requires credentials' },
  },
];

/** Proyectos anteriores y prácticas: se muestran en una lista compacta. */
export const MORE_PROJECTS: readonly Project[] = [
  {
    id: 'inventory',
    title: 'Inventory & Sales Manager',
    description: { es: 'App de inventario y ventas.', en: 'Inventory and sales app.' },
    category: 'web',
    year: 2024,
    tags: ['Ionic', 'Angular', 'Firebase'],
    icon: 'box',
    code: `${GITHUB}/InventorySalesManager`,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce React',
    description: { es: 'Práctica de tienda en línea con React y Firebase.', en: 'Online store practice with React and Firebase.' },
    category: 'web',
    year: 2024,
    tags: ['React', 'Firebase'],
    icon: 'shopping-bag',
    code: `${GITHUB}/react-practicaII-eCommerce`,
  },
  {
    id: 'crud-node',
    title: 'CRUD React + Node',
    description: { es: 'Frontend en React + Vite y API en Node con MySQL.', en: 'React + Vite frontend and a Node API with MySQL.' },
    category: 'web',
    year: 2024,
    tags: ['React', 'Vite', 'Node.js', 'MySQL'],
    icon: 'server',
    code: `${GITHUB}/crud_react-back`,
  },
  {
    id: 'media-anime',
    title: 'Media Anime',
    description: { es: 'Cliente React para una API en C# documentada con Swagger.', en: 'React client for a C# API documented with Swagger.' },
    category: 'web',
    year: 2024,
    tags: ['C#', 'Swagger', 'React'],
    icon: 'laptop',
    code: `${GITHUB}/media-anime-project-front`,
  },
  {
    id: 'picalonga',
    title: "Restaurante D' Santana Picalonga",
    description: { es: 'Sitio web de restaurante con PHP y MySQL.', en: 'Restaurant website with PHP and MySQL.' },
    category: 'web',
    year: 2024,
    tags: ['PHP', 'MySQL', 'JavaScript'],
    icon: 'globe',
    code: `${GITHUB}/restaurante-picalonga`,
  },
  {
    id: 'shopping-cart',
    title: 'Shopping Cart',
    description: { es: 'Carrito de compras con JavaScript puro.', en: 'Shopping cart in vanilla JavaScript.' },
    category: 'web',
    year: 2024,
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'images/projects/cart.webp',
    icon: 'shopping-bag',
    demo: `${PAGES}/shopping-cart/`,
    code: `${GITHUB}/shopping-cart`,
  },
  {
    id: 'react-three',
    title: 'React + Three.js',
    description: { es: 'Prácticas de escenas 3D con React.', en: '3D scene practice with React.' },
    category: 'three',
    year: 2024,
    tags: ['React', 'Three.js'],
    icon: 'shapes',
    code: `${GITHUB}/react-threejs-practica`,
  },
  {
    id: 'excel-sql',
    title: 'Excel a SQL',
    description: { es: 'Importa hojas de Excel a una base de datos MySQL.', en: 'Imports Excel sheets into a MySQL database.' },
    category: 'data',
    year: 2024,
    tags: ['PHP', 'MySQL', 'Excel'],
    icon: 'database',
    code: `${GITHUB}/excel_a_sql`,
  },
];
