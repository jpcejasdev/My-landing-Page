# Juan Pablo Cejas — Portfolio

Landing personal: estudiante de programación en la UNLP, enfocado en desarrollo backend.

**Sitio:** https://juampycejas.github.io

## Características

- Modo claro / oscuro y español / inglés (se recuerda la elección)
- Carrusel de proyectos con avance automático, alimentado desde un archivo de datos
- Formulario "Contratá mis servicios" que llega por WhatsApp sin exponer el número
- Accesible (navegación con teclado, `aria-*`, respeta "reducir movimiento") y responsive
- Sin frameworks ni build: HTML, CSS y JavaScript con módulos ES

## Estructura

```
├── index.html                 Estructura y contenido de la página
├── css/
│   └── styles.css             Estilos (tokens de color, componentes, responsive)
├── js/
│   ├── theme-init.js          Aplica tema/idioma antes del render (evita parpadeo)
│   ├── main.js                Punto de entrada: inicializa los módulos
│   ├── config.js              Configuración (URL del formulario, tiempos)
│   ├── data/
│   │   ├── projects.js        Proyectos del carrusel
│   │   └── translations.js    Textos en español e inglés
│   ├── modules/
│   │   ├── i18n.js            Cambio de idioma
│   │   ├── theme.js           Cambio de tema
│   │   ├── carousel.js        Carrusel genérico
│   │   ├── projects.js        Tarjetas de proyectos
│   │   ├── contact-form.js    Validación y envío del formulario
│   │   ├── profile-terminal.js  Terminal decorativa del inicio
│   │   └── reveal.js          Animaciones de entrada
│   └── utils/
│       ├── dom.js             Helpers de DOM y escape de HTML
│       └── storage.js         localStorage seguro
├── assets/
│   └── favicon.svg
└── apps-script/
    └── Code.gs                Relay del formulario → WhatsApp (corre en Google)
```

## Correr localmente

El JavaScript usa **módulos ES**, que los navegadores no cargan abriendo el archivo con doble clic (`file://`). Hace falta un servidor local, cualquiera de estos:

- **VS Code:** instalá la extensión *Live Server* (el proyecto la recomienda al abrirlo) → clic derecho en `index.html` → *Open with Live Server*.
- **Python:** en la carpeta del proyecto, `python -m http.server 8000` y entrá a http://localhost:8000
- **Node:** `npx serve .`

## Agregar un proyecto

Editá `js/data/projects.js` y agregá un objeto a la lista:

```js
{
  title: { es: 'API de turnos', en: 'Appointments API' },
  description: {
    es: 'API REST para gestionar turnos con autenticación JWT.',
    en: 'REST API to manage appointments with JWT authentication.',
  },
  url: 'https://github.com/JuampyCejas/api-turnos',
  image: 'assets/projects/api-turnos.png', // opcional
  tags: ['Java', 'Spring Boot', 'PostgreSQL'],
},
```

Mientras la lista esté vacía, se muestra una tarjeta de "Próximamente" que lleva a GitHub.

## Cambiar textos

Todos los textos están en `js/data/translations.js`, en español (`es`) e inglés (`en`). En el HTML se referencian con el atributo `data-i18n="clave"`.

## Formulario de contacto

```
Formulario (GitHub Pages) → Google Apps Script (número guardado en privado) → CallMeBot → WhatsApp
```

1. **API key de CallMeBot:** agendá el número del bot que figure en callmebot.com y mandale por WhatsApp `I allow callmebot to send me messages`. Te responde con tu `apikey`.
2. **Script en Google:** en https://script.google.com creá un proyecto y pegá `apps-script/Code.gs`. En *Configuración del proyecto → Propiedades del script* agregá:
   - `WHATSAPP_PHONE` → tu número con código de país
   - `CALLMEBOT_APIKEY` → tu key
3. **Probar:** ejecutá la función `probarWhatsApp` desde el editor y aceptá los permisos.
4. **Publicar:** *Implementar → Nueva implementación → Aplicación web*, ejecutar como **Yo**, acceso **Cualquier persona**. Copiá la URL que termina en `/exec`.
5. **Conectar:** pegá esa URL en `formEndpoint` dentro de `js/config.js`.

> Si modificás el script, publicá una nueva versión en *Implementar → Gestionar implementaciones → Editar → Nueva versión*.

**Seguridad:** el número y la key viven solo en Google, nunca en el repositorio. El formulario valida los datos en el navegador y en el servidor, tiene un campo trampa anti-bots y un límite de envíos por hora.

## Publicar con GitHub Pages

1. Creá un repositorio llamado **`JuampyCejas.github.io`**.
2. Subí todo el contenido de esta carpeta a la rama `main`.
3. En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
4. En unos minutos el sitio queda en https://juampycejas.github.io

## Tecnologías

HTML5 · CSS3 (custom properties, grid, scroll-snap) · JavaScript (ES modules) · Google Apps Script
