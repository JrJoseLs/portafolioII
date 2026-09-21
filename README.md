# JPort — Portafolio de Jose Luis

Portafolio personal de **Jose Luis Isabel Matos**, ingeniero de software. Es una
aplicación de una sola página hecha con [Angular](https://angular.dev) y
publicada en Firebase Hosting.

## Secciones

- **Home**: tarjeta de presentación con enlaces a LinkedIn, GitHub, correo y WhatsApp.
- **Projects**: proyectos destacados con enlace a su demo.
- **Resume (CV)**: educación y experiencia.
- **Skills**: tecnologías que domino.
- **Footer**: información de contacto y redes sociales.

La barra lateral permite navegar entre secciones y activar el **modo oscuro**.

## Tecnologías

| Herramienta | Versión |
| --- | --- |
| Angular (NgModules + zone.js) | 22 |
| TypeScript | 6.0 |
| Font Awesome (CDN) | 6.5 |
| Pruebas | Karma + Jasmine |
| Hosting | Firebase Hosting |

## Requisitos

- **Node.js** `^22.22.3`, `^24.15.0` o `>=26` (los que admite Angular 22)
- **npm** 10 o superior
- **Google Chrome**, solo para ejecutar las pruebas
- **Firebase CLI** (`npm i -g firebase-tools`), solo para desplegar a mano

## Instalación

```bash
git clone https://github.com/JrJoseLs/portafolioII.git
cd portafolioII
npm ci
```

`npm ci` instala las versiones exactas de `package-lock.json`. Usa `npm install`
solo cuando quieras añadir o actualizar dependencias.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm start` | Levanta el servidor de desarrollo en `http://localhost:4200/` con recarga automática. |
| `npm run build` | Genera el build de producción en `dist/j-port/`. |
| `npm run watch` | Recompila en modo desarrollo cada vez que cambias un archivo. |
| `npm test` | Ejecuta las pruebas unitarias con Karma (abre Chrome y queda en modo watch). |
| `npm run test:ci` | Ejecuta las pruebas una sola vez en Chrome headless. |
| `npm run deploy` | Compila y publica en Firebase Hosting (requiere Firebase CLI y `firebase login`). |

## Estructura

```
src/
├── app/
│   ├── services/theme.service.ts   # Estado del modo oscuro
│   └── ui/                         # Componentes de cada sección
│       ├── sidebar/                # Navegación lateral + botón de tema
│       ├── header/                 # Contenedor de las secciones
│       ├── banner/                 # Home / presentación
│       ├── projects/
│       ├── cv/
│       ├── skills/
│       └── footer/
├── assets/img/                     # Imágenes del sitio
├── index.html
└── styles.css                      # Estilos globales y modo oscuro
```

Para generar un componente nuevo: `npx ng generate component ui/nombre`. El
proyecto usa NgModules, así que el CLI ya está configurado para crear
componentes con `standalone: false` y hay que declararlos en `AppModule`.

## Despliegue

El despliegue es automático con GitHub Actions ([.github/workflows](.github/workflows)):

- **Push a `main`**: instala dependencias, compila y publica en el canal `live` de Firebase.
- **Pull request**: publica una vista previa temporal y deja el enlace en el PR.

Ambos flujos necesitan el secreto `FIREBASE_SERVICE_ACCOUNT_JL_PORT` en el
repositorio. Firebase sirve la carpeta `dist/j-port` (ver [firebase.json](firebase.json)).

## Autor

**Jose Luis Isabel Matos**
[LinkedIn](https://www.linkedin.com/in/jose-luis-isabel-matos-a03840238/) ·
[GitHub](https://github.com/JrJoseLs)
