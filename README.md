# JPort — Portafolio de Jose Matos

Portafolio personal interactivo de **Jose Matos**, ingeniero de software
especializado en automatización de datos y operaciones técnicas.

🔗 **Sitio:** https://jrjosels.github.io/portafolioII/

## Características

- **Escena 3D con Three.js**: miles de partículas que cambian de forma según la
  sección (planeta, nudo, ADN, cubo, red, átomo y onda), reaccionan al ratón y
  lanzan una onda expansiva al hacer clic en el fondo.
- **Modo exploración 3D**: oculta el contenido para girar la figura, acercarla
  y elegir entre 8 formas, incluida una galaxia.
- **Buscador de comandos** (`Ctrl + K` / `⌘ + K`): navega por las secciones,
  cambia el tema o el idioma, descarga el CV o copia el correo con el teclado.
- **Tema claro y oscuro** con transición circular (View Transitions API). Sigue
  el tema del sistema hasta que eliges uno.
- **Español e inglés**, con detección del idioma del navegador.
- **Diseño responsive**: barra flotante en escritorio y barra de pestañas
  inferior tipo iOS en móvil.
- **Accesible**: navegación por teclado, enlace para saltar al contenido,
  etiquetas ARIA y respeto de `prefers-reduced-motion`.
- **Panel de edición privado** (`#admin`): cambia la foto, los textos y los
  enlaces del sitio sin tocar código.
- **Rápido**: Three.js se carga de forma diferida (≈ 89 kB comprimidos en la
  carga inicial) y la animación se pausa cuando la pestaña no está visible.

## Tecnologías

| Área | Herramienta |
| --- | --- |
| Framework | Angular 22 (componentes standalone, signals, sin zone.js) |
| 3D | Three.js con shaders GLSL propios |
| Lenguaje | TypeScript 6 (modo estricto) |
| Estilos | CSS moderno: variables, `color-mix()`, scroll-driven animations |
| Iconos | Lucide (interfaz), Simple Icons y Font Awesome (marcas) |
| Pruebas | Karma + Jasmine |
| Despliegue | GitHub Pages con GitHub Actions |

## Requisitos

- **Node.js** `^22.22.3`, `^24.15.0` o `>=26`
- **npm** 10 o superior
- **Google Chrome**, solo para ejecutar las pruebas

## Instalación y uso

```bash
git clone https://github.com/JrJoseLs/portafolioII.git
cd portafolioII
npm ci
npm start          # http://localhost:4200
```

| Comando | Qué hace |
| --- | --- |
| `npm start` | Servidor de desarrollo con recarga automática. |
| `npm run build` | Build de producción en `dist/j-port/` (para servir desde la raíz de un dominio). |
| `npm run build:gh-pages` | Build con `base-href` `/portafolioII/` para GitHub Pages. |
| `npm test` | Pruebas unitarias en modo watch. |
| `npm run test:ci` | Pruebas una sola vez en Chrome headless. |
| `npm run deploy:firebase` | (Opcional) Publica en Firebase Hosting. |

## Estructura

```
public/                       Archivos estáticos (se copian tal cual al build)
├── content.json              Cambios hechos desde el panel de edición
├── images/                   Foto de perfil, imagen para redes y capturas de proyectos
└── favicon.svg

src/
├── index.html                SEO, Open Graph y script que aplica tema/idioma sin parpadeo
├── styles.css                Sistema de diseño: colores, botones, tarjetas, utilidades
└── app/
    ├── app.ts / app.html     Estructura de la página y atajos de teclado
    ├── admin/                Panel de edición privado (#admin)
    ├── data/                 ✏️ CONTENIDO DEL PORTAFOLIO (edita aquí)
    │   ├── profile.ts        Nombre, contacto, redes y archivos de CV
    │   ├── experience.ts     Experiencia laboral
    │   ├── projects.ts       Proyectos destacados y secundarios
    │   ├── skills.ts         Habilidades por categoría y cinta de logos
    │   └── education.ts      Estudios, certificaciones e idiomas
    ├── core/                 Lógica compartida
    │   ├── i18n/             Idiomas y textos de la interfaz (ui-strings.ts)
    │   ├── theme.service.ts  Tema claro/oscuro
    │   ├── scroll-spy.service.ts  Sección activa y desplazamiento
    │   ├── sections.ts       Orden de secciones y figura 3D de cada una
    │   └── …
    ├── sections/             Una carpeta por sección: hero, about, experience,
    │                         projects, skills, education, contact
    ├── layout/               Navegación, buscador de comandos, pie y avisos
    ├── shared/               Icono, encabezado de sección, contador y directivas
    │                         (appReveal: aparición al hacer scroll; appTilt: inclinación 3D)
    └── three/                Escena 3D
        ├── particle-scene.ts Componente que carga Three.js de forma diferida
        ├── particle-engine.ts Motor: render, interacción y transiciones
        ├── shaders.ts        Shaders GLSL de las partículas
        ├── shapes.ts         Generadores matemáticos de las figuras
        └── explore-hud.ts    Controles del modo exploración
```

## Cómo editar el contenido

Todo el contenido está en `src/app/data/`, separado del diseño. Cada texto
visible se escribe en los dos idiomas:

```ts
description: { es: 'Texto en español', en: 'English text' },
```

### Añadir un proyecto

1. Si tienes una captura, guárdala en `public/images/projects/` (WebP de
   960×600 recomendado).
2. Abre `src/app/data/projects.ts` y añade un objeto a `FEATURED_PROJECTS`
   (tarjeta grande) o a `MORE_PROJECTS` (lista compacta):

```ts
{
  id: 'mi-proyecto',
  title: 'Mi proyecto',
  description: { es: 'Qué hace…', en: 'What it does…' },
  category: 'web',            // 'three' | 'web' | 'data'
  year: 2026,
  tags: ['Angular', 'Firebase'],
  image: 'images/projects/mi-proyecto.webp',   // opcional
  icon: 'rocket',             // se usa si no hay imagen
  demo: 'https://…',          // opcional
  code: 'https://github.com/JrJoseLs/…',       // opcional
},
```

Los filtros y contadores se actualizan solos. Los iconos disponibles están en
`src/app/shared/icon/icons.ts`.

### Actualizar el CV

El CV no se descarga desde el sitio: el botón abre un enlace de Google Drive en
modo lectura. Para cambiarlo, usa el panel de edición o edita `cvUrl` en
`src/app/data/profile.ts`. En Drive, comparte el archivo como
**"Cualquier persona con el enlace · Lector"**.

### Cambiar la foto

Dos formas, la que prefieras:

1. **Desde el panel de edición** (`#admin`): eliges la imagen, se recorta sola a
   512×512 y se guarda dentro de `content.json`.
2. **Reemplazando el archivo**: guarda tu foto como `public/images/profile.webp`
   (cuadrada, 512×512 recomendado).

### Textos de la interfaz

Los botones, títulos y mensajes están en `src/app/core/i18n/ui-strings.ts`. Si
añades un texto en español y olvidas su traducción al inglés, el proyecto no
compila.

## Panel de edición (`#admin`)

Añade `#admin` a la dirección del sitio
(`https://jrjosels.github.io/portafolioII/#admin`) y se abre un panel privado
para cambiar la foto, el nombre, el cargo, la ubicación, el correo, el enlace
del CV, los textos de "Sobre mí" y los enlaces de redes.

Como el sitio es estático (sin servidor ni base de datos), el panel funciona así:

1. **Guardar** aplica los cambios al instante y los recuerda **en tu navegador**.
2. **Descargar content.json** genera el archivo con esos cambios.
3. Guarda ese archivo en `public/content.json`, haz commit y push: así quedan
   publicados para todo el mundo.
4. **Restablecer** descarta lo que tengas guardado en el navegador.

> El panel no tiene contraseña a propósito: en un sitio estático cualquier clave
> sería visible en el código y daría una falsa sensación de seguridad. No expone
> nada, porque solo edita información que ya es pública, y nadie más que tú puede
> publicar cambios: para eso hace falta acceso al repositorio.

## Despliegue en GitHub Pages

El workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
ejecuta las pruebas, compila y publica en cada push a `main`. En los pull
requests solo compila y prueba.

**Configuración inicial (una sola vez):** en el repositorio de GitHub, ve a
**Settings → Pages → Build and deployment** y en **Source** elige
**GitHub Actions**.

> Si el sitio muestra este README en lugar del portafolio, **Source** sigue en
> "Deploy from a branch": GitHub está publicando el README con Jekyll y el
> workflow falla al desplegar con un error 404. Cámbialo a "GitHub Actions" y
> vuelve a ejecutar el workflow desde la pestaña **Actions**.

### ¿GitHub Pages o Firebase Hosting?

Este sitio es estático (no tiene backend ni base de datos), así que **GitHub
Pages** es la opción más simple: es gratis, el código y el sitio viven en el
mismo lugar y se publica solo con cada push. Firebase Hosting conviene si más
adelante necesitas un dominio con cabeceras personalizadas, vistas previas por
rama o servicios como autenticación y base de datos. La configuración de
Firebase (`firebase.json`) se conserva por si quieres publicar ahí con
`npm run deploy:firebase`.

## Créditos

- Iconos de interfaz: [Lucide](https://lucide.dev) (ISC).
- Logos de marcas: [Simple Icons](https://simpleicons.org) (CC0) y
  [Font Awesome Free](https://fontawesome.com) (CC BY 4.0) para LinkedIn.
- Tipografía: [Inter](https://rsms.me/inter/) (en dispositivos Apple se usa SF Pro).

## Autor

**Jose Matos** ·
[LinkedIn](https://www.linkedin.com/in/jose-luis-isabel-matos-a03840238/) ·
[GitHub](https://github.com/JrJoseLs) ·
[junior_er@hotmail.es](mailto:junior_er@hotmail.es)
