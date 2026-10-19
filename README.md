# Juan Pablo Cejas — Portfolio

Estudiante de programación en la UNLP, enfocado en desarrollo backend.


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

## Tecnologías

HTML5 · CSS3 · JavaScript (ES modules) · Google Apps Script
