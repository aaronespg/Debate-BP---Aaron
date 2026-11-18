# Banco de Mociones de Rhetor - UNAL

Repositorio oficial del banco de mociones e infoslides de **Debate Parlamentario Británico (BP)** de **Rhetor - UNAL**, generado a partir de [Torneos BP.xlsx](Torneos%20BP.xlsx).

## Visualizador web (GitHub Pages)

Disponible en: **https://aaronespejosamac-sys.github.io/Debate-BP---Aaron/**

Organizado en tres ventanas internas (*Tabs*):
1. **Sorteador de Mociones**:
   - Muestra primero el **Infoslide** (si la moción tiene uno) manteniendo **oculta la moción** hasta pulsar **“Revelar moción”**.
   - Mantiene ocultos el torneo y la ronda hasta pulsar **“Revelar torneo y ronda”**.
2. **Sorteador de Posiciones**:
   - Permite inscribir los 4 equipos (con soporte para marcar **Iron-person**, duplicando automáticamente el nombre del orador).
   - Asigna aleatoriamente las cámaras: **Alta de Gobierno**, **Alta de Oposición**, **Baja de Gobierno** y **Baja de Oposición**.
3. **Banco de Mociones**:
   - Lectura organizada por torneo y ronda, con buscador de texto y filtros por torneo, idioma y presencia de infoslide.
   - Traducción al español para mociones e infoslides en inglés, conservando el original desplegable.

## Estructura del proyecto

```text
Debate BP/
├── .agent/rules/no-emojis.md           # Regla del proyecto: prohibición de emojis
├── index.html                          # Frontend con navegación por Tabs
├── styles.css                          # Diseño profesional claro/oscuro
├── app.js                              # Lógica de sorteadores, filtros y Tabs
├── data/
│   ├── mociones.json                   # Base estructurada (509 mociones, 42 torneos)
│   └── traducciones_cache.json         # Caché de traducciones EN -> ES
├── extraer_mociones.py                 # Extractor, limpiador y traductor
├── ejecutar_extraccion.bat             # Lanzador rápido en Windows
├── banco_mociones_bp.txt               # Salida en texto plano
├── Torneos BP.xlsx                     # Fuente de enlaces de torneos
├── gestion/
│   ├── planes/PLAN_GENERAL.md          # Plan general del proyecto
│   └── auditorias/AUDITORIA_INICIAL.md # Auditoría técnica de fuentes
└── README.md
```

## Uso local

```powershell
py -X utf8 extraer_mociones.py
py -m http.server 8000
```
