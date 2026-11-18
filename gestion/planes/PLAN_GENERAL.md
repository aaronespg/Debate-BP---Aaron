# Plan General — Banco de Mociones BP y Visualizador Web

## 1. Objetivo
Construir un flujo completo y mantenible para extraer mociones e infoslides de torneos de Debate Parlamentario Británico (BP) desde `Torneos BP.xlsx`, traducir al español el contenido en inglés y publicarlo en un visualizador web agradable en **GitHub Pages** orientado tanto a la lectura organizada como al entrenamiento ciego.

## 2. Arquitectura propuesta

1. **Capa de datos (`extraer_mociones.py` + `Torneos BP.xlsx`)**
   - Lectura de la hoja `"Banco de mociones"` (encabezado en fila 4, columnas `Torneo` y `Link de mociones`).
   - Scraping tolerante a las dos variantes de Calicotab/Tabbycat (`/motions/statistics/` y `/motions/`).
   - Separación limpia de:
     - **Ronda** (ej. `Round 1`, `Octofinals`, `Grand Final`).
     - **Moción** (limpia de barras de estadísticas y botones de modal).
     - **Infoslide** (asociado directamente a su moción, excluyendo modales de idioma).
   - Detección de idioma (`es` / `en`) y traducción automática `EN → ES` con caché persistente (`data/traducciones_cache.json`).
   - Generación dual:
     - `data/mociones.json` (fuente estructurada para el frontend).
     - `banco_mociones_bp.txt` (respaldo legible en texto plano).

2. **Capa de presentación (GitHub Pages en raíz `/`)**
   - Frontend estático sin dependencias de build (`index.html`, `styles.css`, `app.js`).
   - **Modo Moción Aleatoria Anónima**:
     - Oculta por defecto torneo y ronda.
     - Botón **“Revelar torneo y ronda”** con enlace directo a la fuente.
     - Opción de sortear sobre todo el banco o sobre los filtros activos.
   - **Lectura Organizada**:
     - Agrupación por torneo y etiquetas de ronda.
     - Buscador en tiempo real (moción, traducción e infoslide).
     - Filtros por torneo, idioma y existencia de infoslide.
     - Desplegable opcional para consultar el original en inglés cuando aplica.
     - Modo claro/oscuro con preferencia guardada en `localStorage`.

3. **Capa de gestión (`gestion/`)**
   - `gestion/planes/`: planes de evolución, mejoras y roadmap.
   - `gestion/auditorias/`: auditorías de enlaces caídos (404), calidad de traducciones y cobertura de infoslides.

## 3. Fases de ejecución

| Fase | Alcance | Estado |
| :--- | :--- | :--- |
| **Fase 1: Extracción base** | Corrección de lectura de `Torneos BP.xlsx`, eliminación de dependencia Colab, script `.bat` y salida `.txt`. | Completada |
| **Fase 2: Limpieza, Infoslides y Traducción** | Extracción estructurada a JSON, limpieza de estadísticas incrustadas y traducción `EN → ES` con caché. | En ejecución / Verificación |
| **Fase 3: Frontend GitHub Pages** | Visualizador web con lectura organizada, modo aleatorio anónimo y revelación de torneo/ronda. | Implementado |
| **Fase 4: Publicación y QA** | Verificación de `data/mociones.json`, auditoría de enlaces y `push` a `main` para GitHub Pages. | Pendiente de push final |

## 4. Mejoras futuras sugeridas
- **Etiquetado temático**: clasificar mociones por tema (Economía, RR.II., Política, Filosofía, etc.) para filtrar en práctica.
- **Temporizador de preparación BP (15 minutos)** integrado dentro del modo de moción aleatoria.
- **Revisión manual de traducciones** en `data/traducciones_cache.json` para afinar términos técnicos de debate (ej. *THW*, *THBT*, *THR*).
