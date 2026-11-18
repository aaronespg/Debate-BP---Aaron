# Plan General — Banco de Mociones de Rhetor - UNAL

## 1. Objetivo
Construir y mantener un banco de mociones e infoslides de Debate Parlamentario Británico (BP) para **Rhetor - UNAL**, con extracción automatizada desde `Torneos BP.xlsx`, traducción al español (`EN -> ES`), y una aplicación web profesional en **GitHub Pages** con navegación por pestañas (*Tabs*), práctica ciega de mociones y sorteador de posiciones BP.

## 2. Reglas de diseño y código
- **Cero emojis**: queda prohibido el uso de emojis en frontend, backend y documentación (ver `.agent/rules/no-emojis.md`).
- **Iconografía profesional**: la interfaz web utiliza iconos vectoriales SVG (estilo Lucide) con trazo limpio y consistente.

## 3. Arquitectura del sistema

1. **Capa de datos (`extraer_mociones.py` + `Torneos BP.xlsx`)**
   - Lectura de los **42 torneos** (incluyendo **CMUDE 2022–2026**, corrigiendo las rutas `/open/` para 2024–2026).
   - Extracción limpia de **509 mociones** y **343 infoslides** hacia `data/mociones.json` y `banco_mociones_bp.txt`.
   - Omisión automática de etiquetas de tema entre paréntesis (`<small>`) al final de las mociones.
   - Traducción `EN -> ES` con múltiples motores (`bing`, `alibaba`, `reverso`, `GoogleTranslator`, `MyMemoryTranslator`) y caché persistente en `data/traducciones_cache.json`.

2. **Capa de presentación (GitHub Pages en raíz `/`)**
   - Navegación por **Tabs (ventanas internas)**:
     1. **Sorteador de Mociones**:
        - Muestra el **Infoslide** de inmediato cuando la moción cuenta con uno.
        - Mantiene **oculta la moción** hasta que el usuario pulsa **“Revelar moción”**.
        - Mantiene **ocultos torneo y ronda** hasta que el usuario pulsa **“Revelar torneo y ronda”**.
     2. **Sorteador de Posiciones**:
        - Registro de **4 equipos** (Orador 1 y Orador 2).
        - Opción **Iron-person** por equipo: al marcarla, duplica automáticamente el nombre del orador en la segunda posición y lo mantiene sincronizado.
        - Sorteo aleatorio (Fisher-Yates) de las 4 cámaras BP: **Alta de Gobierno**, **Alta de Oposición**, **Baja de Gobierno** y **Baja de Oposición**, presentado en rejilla de debate y con botón para copiar el resultado.
     3. **Banco de Mociones (Lectura Organizada)**:
        - Agrupación por torneo y ronda.
        - Buscador en tiempo real y filtros por torneo, idioma y presencia de infoslide.
        - Desplegable opcional para consultar el original en inglés.
   - Selector de tema **Claro / Oscuro** y tipografía editorial profesional.

3. **Capa de gestión (`gestion/`)**
   - `gestion/planes/`: planificación y evolución del proyecto.
   - `gestion/auditorias/`: auditorías técnicas de fuentes y calidad de datos.

## 4. Estado de fases

| Fase | Alcance | Estado |
| :--- | :--- | :--- |
| **Fase 1: Extracción base** | Lectura de `Torneos BP.xlsx`, script local y `.bat`. | Completada |
| **Fase 2: Limpieza, CMUDE 2024–2026 y Traducción** | 42/42 torneos (509 mociones, 343 infoslides), sin etiquetas de tema y traducción con caché. | Completada |
| **Fase 3: UI/UX Profesional con Tabs y Sorteadores** | Nombre oficial Rhetor - UNAL, cero emojis, iconos SVG, Tabs, ocultamiento de moción previa revelación y sorteador de posiciones con Iron-person. | Completada |
| **Fase 4: Publicación en GitHub Pages** | Commit y push a `main` y verificación en producción. | Siguiente paso |
