# Auditoría de Traducciones (EN -> ES)

**Fecha:** 2026-11-25  
**Fuente auditada:** `data/mociones.json` (509 mociones en 42 torneos, 343 con infoslide)

## 1. Hallazgos antes de la corrección
Durante la revisión del banco estructurado se detectaron **19 mociones en inglés sin traducir** y **12 infoslides en inglés sin traducir**, concentradas únicamente en dos torneos que habían alcanzado el límite temporal de peticiones durante la extracción previa:

| Torneo | Mociones sin traducir | Infoslides sin traducir |
| :--- | :---: | :---: |
| **NUDC 2023** | 10 | 6 |
| **NUDC 2024** | 9 | 6 |
| **Total pendiente** | **19** | **12** |

El resto de los 40 torneos (incluyendo WUDC 2022–2026, EUDC 2022–2026, NUDC 2025–2026, CMUDE 2022–2026, TODI, TIPIS IV, TRD, TND y Round Robin) ya contaba con el 100% de sus mociones e infoslides en español.

## 2. Acción correctiva aplicada
1. Se tradujeron las **19 mociones** y los **12 infoslides** de `NUDC 2023` y `NUDC 2024` al español.
2. Se actualizaron `data/traducciones_cache.json`, `data/mociones.json` (incluyendo reclasificación de `tema` y `tipo_mocion` sobre los textos ya traducidos) y `data/banco_mociones_gem.md`.
3. Se verificó **0 mociones** y **0 infoslides** en inglés pendientes de traducción tras la corrida.
