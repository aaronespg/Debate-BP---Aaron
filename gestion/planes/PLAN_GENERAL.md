# Plan General — Banco de Mociones de Rhetor - UNAL

## 1. Objetivo
Construir y mantener un banco de mociones e infoslides de Debate Parlamentario Británico (BP) para **Rhetor - UNAL**, con extracción automatizada desde `Torneos BP.xlsx`, traducción al español (`EN -> ES`), y una aplicación web profesional en **GitHub Pages** con navegación por pestañas (*Tabs*), práctica ciega de mociones y sorteador de posiciones BP.

## 2. Reglas de diseño y código
- **Cero emojis**: queda prohibido el uso de emojis en frontend, backend y documentación (ver `.agent/rules/no-emojis.md`).
- **Identidad visual oficial**: el encabezado y el favicon de la página utilizan `LOGO RHETOR.png` como imagen principal de **Rhetor - UNAL**, acompañada de iconos vectoriales SVG uniformes en controles y pestañas.
- **Publicación**: desplegado en GitHub Pages bajo `https://aaronespg.github.io/Debate-BP---Aaron/`.

## 3. Arquitectura del sistema

1. **Capa de datos (`extraer_mociones.py` + `Torneos BP.xlsx`)**
   - Lectura de los **42 torneos** (incluyendo **CMUDE 2022–2026**, corrigiendo las rutas `/open/` para 2024–2026).
   - Extracción limpia de **509 mociones** y **343 infoslides** hacia `data/mociones.json` y `banco_mociones_bp.txt`.
   - Omisión automática de etiquetas de tema entre paréntesis (`<small>`) al final de las mociones.
   - Traducción `EN -> ES` al 100% (509/509 mociones y 343/343 infoslides cubiertos tras la auditoría de `NUDC 2023` y `NUDC 2024`) con múltiples motores (`bing`, `alibaba`, `reverso`, `GoogleTranslator`, `MyMemoryTranslator`) y caché persistente en `data/traducciones_cache.json`.
   - Exportación adicional en Markdown para Gemini Gem en `data/banco_mociones_gem.md`.

2. **Capa de presentación (GitHub Pages en raíz `/`)**
   - Navegación por **Tabs (ventanas internas)**:
     1. **Sorteador de Mociones**:
        - Cuenta con filtros propios independientes según **Tema** (Economía y Trabajo, Política y Estado, Relaciones Internacionales, Tecnología e IA, Sociedad y Derechos, Educación y Salud, Medioambiente, General), **Tipo de moción** (Política/Acción, Valor/Creencia, Preferencia, Lamento/Oposición, Apoyo, Otro) y **presencia de Infoslide**, con contador de mociones disponibles.
        - Muestra el **Infoslide** de inmediato cuando la moción cuenta con uno.
        - Mantiene **oculta la moción** hasta que el usuario pulsa **"Revelar moción"**.
        - Mantiene **ocultos torneo y ronda** hasta que el usuario pulsa **"Revelar torneo y ronda"**.
     2. **Sorteador de Posiciones**:
        - Registro de **4 equipos** (Orador 1 y Orador 2).
        - Opción **Iron-person** por equipo: al marcarla, duplica automáticamente el nombre del orador en la segunda posición y lo mantiene sincronizado.
        - Sorteo aleatorio (Fisher-Yates) de las 4 cámaras BP: **Alta de Gobierno**, **Alta de Oposición**, **Baja de Gobierno** y **Baja de Oposición**, presentado en rejilla de debate y con botón para copiar el resultado.
     3. **Banco de Mociones (Lectura Organizada)**:
        - Agrupación por torneo y ronda.
        - Buscador en tiempo real y filtros por torneo, idioma y presencia de infoslide.
        - Desplegable opcional para consultar el original en inglés.
     4. **Manual CMUDE 2026**:
        - Guía explicativa organizada por capítulos (formato BP y roles, tiempos/POIs/Iron-person, VPI y persuasión, tipos oficiales de moción de la Sección 2.7, modelos y deliberación), con opción de descarga y visor PDF.
     5. **Tablas de Calificación**:
        - Pestaña dedicada exclusivamente a los Apéndices A y B del Manual CMUDE 2026: **Escala de Persona Oradora (50–100)**, **Tabla de Feedback a Juezas Principales (1–10)** y **Tabla de Feedback a Juezas Panelistas y Trainee (1–10)**.

3. **Capa de gestión (`gestion/`)**
   - `gestion/planes/`: planificación y evolución del proyecto.
   - `gestion/auditorias/`: auditorías técnicas de fuentes y calidad de datos.

## 4. Estado de fases

| Fase | Alcance | Estado |
| :--- | :--- | :--- |
| **Fase 1: Extracción base** | Lectura de `Torneos BP.xlsx`, script local y `.bat`. | Completada |
| **Fase 2: Limpieza, CMUDE 2024–2026 y Traducción** | 42/42 torneos (509 mociones, 343 infoslides), sin etiquetas de tema y traducción con caché. | Completada |
| **Fase 3: UI/UX Profesional con Tabs y Sorteadores** | Nombre oficial Rhetor - UNAL, cero emojis, iconos SVG, Tabs, ocultamiento de moción previa revelación y sorteador de posiciones con Iron-person. | Completada |
| **Fase 4: Publicación y Auditoría de Traducciones** | Despliegue en GitHub Pages (`https://aaronespg.github.io/Debate-BP---Aaron/`), auditoría de `NUDC 2023–2024` (`gestion/auditorias/AUDITORIA_TRADUCCIONES.md`) y traducción al 100%. | Completada |

## 5. Matterfile Maestro BP

### Objetivo
Construir un matterfile de consulta para discursos medios de BP, compilado en `Matterfile_Maestro_BP_Rhetor_UNAL.docx`, a partir del banco de 509 mociones y la taxonomía de `matterfile/content/OUTLINE.json`.

### Reglas de contenido
- Cada subtema debe presentar 3 a 4 pares de choque con premisa, mecanismo causal etiquetado, impacto, refutación y caso opositor.
- Cada ficha termina con ponderación, blindaje para VPM/VLO y rutas exclusivas para MG/MO.
- Las mociones representativas deben provenir del banco; no se inventan datos empíricos ni se usan emojis.

### Estado de avance al 21 de noviembre de 2026

| Bloque | Alcance | Estado |
| :--- | :--- | :--- |
| Esquema, taxonomía y compilador | `OUTLINE.json`, esquema de redacción y generador DOCX. | Completado |
| Macrotema 1.1 Economía y Finanzas | 9 subtemas y 27 pares de choque. | Completado |
| Macrotemas 1.3 Tecnología, 1.4 Relaciones Internacionales y 1.6 Medioambiente | 19 subtemas y 76 pares de choque. | Completado |
| Macrotema 1.2 Democracia, Política e Instituciones | 7 subtemas. | Completado |
| Macrotema 1.5 Seguridad, Justicia y Derechos Humanos | 6 subtemas, 18 pares de choque, JSON validado e integrado en compilación de control. | Completado |
| Macrotema 1.7 Movimientos Sociales, Identidad y Politica Social | 7 subtemas, 21 pares de choque, JSON validado e integrado en compilación de control. | Completado |
| Macrotema 1.8 Bioética, Filosofía, Cultura y Relaciones Humanas | 7 subtemas, 21 pares de choque, JSON validado e integrado en compilación de control. | Completado |
| Sección 1 completa | 8 macrotemas desarrollados, validados e integrados en compilación de control. | Completado |
| Sección 2 Temas específicos recurrentes | 32 de 32 fichas redactadas y validadas (T01–T32); `sec2.json` completo (192 KB). | Completado |
| Secciones 3 a 5 | Principios, conflictos y dossier regional. | Pendiente |
| Maquetación final | Compilación completa y revisión visual del DOCX. | Pendiente |

### Próxima secuencia
1. Redactar `sec3.json` (Principios transversales de BP) con subagentes.
2. Redactar `sec4.json` (Conflictos y casos de debate) con subagentes.
3. Redactar `sec5.json` (Dossier Regional Colombia / Cali) con subagentes.
4. Ejecutar `scripts/compilar_docx.py` y revisar visualmente el DOCX final.

### Protocolo de avance continuo
- Antes de iniciar un bloque, registrar su estado como **En curso**.
- Redactar fichas con tres pares de choque mínimos por subtema, mecanismos causales completos y cierres utilizables en sala.
- Validar todos los JSON después de cada bloque y ejecutar una compilación de control cuando se complete un macrotema.
- Actualizar el estado y las métricas del plan tras cada hito antes de iniciar el siguiente.
- Priorizar precisión causal, comparaciones claras y utilidad para VPM/VLO y MG/MO por encima de cubrir contenido superficialmente.
