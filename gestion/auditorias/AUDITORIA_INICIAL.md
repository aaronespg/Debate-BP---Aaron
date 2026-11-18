# Auditoría Inicial de Fuentes y Extracción

## 1. Fuente analizada
- Archivo: `Torneos BP.xlsx`
- Hoja: `Banco de mociones`
- Estructura detectada: filas 1–3 vacías; encabezados en fila 4 (`Torneo ` en columna B, `Link de mociones` en columna C).
- Total de torneos listados: **42**.

## 2. Hallazgos técnicos iniciales
1. **Desfase de encabezados**: el script original leía `df.columns[0]` y `df.columns[1]` sin indicar `header=3`, provocando que no se procesara ningún enlace.
2. **Contaminación de texto en `/motions/statistics/`**: los bloques `.list-group-item` incluyen tablas/barras de resultados (`Average Points per bench`, `OG results`, etc.) y el `.modal-body` del infoslide anidado, además del modal global de idiomas (`#language-modal`). Se corrigió extrayendo `h4` / `.lead` de forma aislada y filtrando `#language-modal`.
3. **Enlaces con error HTTP 404** (verificados durante la ejecución):
   - `CMUDE 2024`: `https://cmude2024.calicotab.com/cmude2024/motions/statistics/`
   - `CMUDE 2025`: `https://cmude2025.calicotab.com/cmude2025/motions/statistics/`
   - `CMUDE 2026`: `https://cmude2026.calicotab.com/cmude2026/motions/statistics/`
   *(Tampoco respondieron bajo `/motions/` ni `/_/motions/statistics/`).*

## 3. Recomendaciones
- Actualizar en `Torneos BP.xlsx` las URLs de `CMUDE 2024`, `CMUDE 2025` y `CMUDE 2026` si se publican en otro subdominio o slug de Calicotab.
- Mantener `data/traducciones_cache.json` versionado en el repositorio para evitar re-traducir en cada ejecución y permitir correcciones manuales de estilo.
