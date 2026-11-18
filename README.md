# Banco de Mociones BP

Repositorio para extraer, traducir, organizar y practicar con mociones e infoslides de torneos de **Debate Parlamentario Británico (BP)** registrados en [Torneos BP.xlsx](Torneos%20BP.xlsx).

## Visualizador web (GitHub Pages)

El proyecto incluye un frontend estático listo para **GitHub Pages** (`index.html`, `styles.css`, `app.js` consumiendo `data/mociones.json`):

- **🎲 Moción Aleatoria (Modo Anónimo)**: sortea una moción ocultando el torneo y la ronda para practicar sin sesgos, con un botón **“Revelar torneo y ronda”** y enlace directo a Calicotab.
- **📚 Lectura Organizada**: agrupa las mociones por torneo y ronda, con buscador de texto y filtros por torneo, idioma y presencia de infoslide.
- **📄 Extracción de Infoslides**: muestra cada infoslide en un bloque destacado debajo de su moción correspondiente.
- **🌐 Traducción EN → ES**: las mociones e infoslides en inglés se muestran traducidos al español, conservando el texto original en inglés en un desplegable para verificación.
- **🌙 Modo claro / oscuro**: pensado para una lectura cómoda.

### Activar GitHub Pages
1. Ve a **Settings → Pages** en el repositorio de GitHub.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`, y guarda.

## Estructura del proyecto

```text
Debate BP/
├── index.html                          # Frontend para GitHub Pages
├── styles.css                          # Estilos del visualizador (claro/oscuro)
├── app.js                              # Lógica de filtros, modo aleatorio y revelación
├── data/
│   ├── mociones.json                   # Base estructurada consumida por el frontend
│   └── traducciones_cache.json         # Caché local de traducciones EN → ES
├── extraer_mociones.py                 # Scraper + limpiador + traductor EN → ES
├── ejecutar_extraccion.bat             # Lanzador rápido en Windows
├── banco_mociones_bp.txt               # Salida en texto plano legible
├── Torneos BP.xlsx                     # Hoja "Banco de mociones" con los enlaces fuente
├── gestion/
│   ├── planes/
│   │   └── PLAN_GENERAL.md             # Plan general del proyecto
│   └── auditorias/
│       └── AUDITORIA_INICIAL.md        # Auditoría inicial de fuentes y calidad de datos
└── README.md
```

## Uso local (actualizar el banco de mociones)

1. Asegúrate de tener Python 3 con las dependencias instaladas:
   ```powershell
   py -m pip install pandas openpyxl requests beautifulsoup4 deep-translator
   ```
2. Haz doble clic en `ejecutar_extraccion.bat` o ejecuta en consola:
   ```powershell
   py -X utf8 extraer_mociones.py
   ```
3. Para probar el visualizador web en local (evitando restricciones de `fetch` sobre `file://`):
   ```powershell
   py -m http.server 8000
   ```
   y abre `http://localhost:8000` en tu navegador.
