import json
import os
import re
import time
import pandas as pd
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator, MyMemoryTranslator

EXCEL_PATH = "Torneos BP.xlsx"
SHEET_NAME = "Banco de mociones"
ARCHIVO_TXT = "banco_mociones_bp.txt"
ARCHIVO_JSON = os.path.join("data", "mociones.json")
ARCHIVO_CACHE = os.path.join("data", "traducciones_cache.json")
HEADERS = {"User-Agent": "Mozilla/5.0"}

PALABRAS_EN = {
    "the", "of", "and", "to", "in", "that", "should", "would", "with", "for",
    "is", "are", "their", "from", "this", "house", "believes", "prefers",
    "opposes", "supports", "regrets", "where", "which", "have", "has", "will",
}
PALABRAS_ES = {
    "el", "la", "los", "las", "de", "del", "que", "en", "y", "un", "una",
    "por", "con", "para", "esta", "casa", "cree", "prefiere", "opone",
    "apoya", "lamenta", "como", "sobre", "entre", "sus", "este", "esta",
}


def limpiar_texto(elemento):
    return " ".join(elemento.get_text(" ", strip=True).split())


def es_ingles(texto):
    if not texto:
        return False
    t_lower = texto.lower().strip()
    if t_lower.startswith(("this house", "thw ", "thbt ", "thp ", "tho ", "thr ", "ths ")):
        return True
    palabras = re.findall(r"[a-záéíóúñ]+", t_lower)
    if not palabras:
        return False
    score_en = sum(1 for p in palabras if p in PALABRAS_EN)
    score_es = sum(1 for p in palabras if p in PALABRAS_ES)
    return score_en > score_es


def cargar_cache():
    if os.path.exists(ARCHIVO_CACHE):
        try:
            with open(ARCHIVO_CACHE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def guardar_cache(cache):
    os.makedirs(os.path.dirname(ARCHIVO_CACHE), exist_ok=True)
    with open(ARCHIVO_CACHE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def dividir_en_fragmentos(texto, max_len=450):
    if len(texto) <= max_len:
        return [texto]
    fragmentos = []
    actual = ""
    for palabra in texto.split(" "):
        if len(actual) + len(palabra) + 1 <= max_len:
            actual = f"{actual} {palabra}".strip()
        else:
            if actual:
                fragmentos.append(actual)
            actual = palabra
    if actual:
        fragmentos.append(actual)
    return fragmentos


_google_disponible = True


def traducir_a_es(texto, translator, cache, fallback_translator=None):
    global _google_disponible
    if not texto:
        return None
    if texto in cache:
        return cache[texto]

    # Intentar primero con GoogleTranslator (se desactiva en esta ejecución si bloquea por rate-limit)
    if _google_disponible:
        try:
            if len(texto) <= 4500:
                trad = translator.translate(texto)
            else:
                partes = dividir_en_fragmentos(texto, 4000)
                trad = " ".join(translator.translate(p) for p in partes)
            cache[texto] = trad
            time.sleep(0.35)
            return trad
        except Exception:
            _google_disponible = False

    # Respaldo con MyMemoryTranslator (límite ~500 caracteres por petición)
    if fallback_translator is not None:
        try:
            partes = dividir_en_fragmentos(texto, 450)
            trad = " ".join(fallback_translator.translate(p) for p in partes)
            cache[texto] = trad
            time.sleep(0.15)
            return trad
        except Exception as e:
            print(f"  [Aviso] No se pudo traducir: {e}", flush=True)

    return None


def extraer_mociones_de_html(html, torneo, url):
    soup = BeautifulSoup(html, "html.parser")
    items = []
    vistas = set()
    ronda_actual = "Sin ronda especificada"

    for lang_modal in soup.select("#language-modal, [id*='lang']"):
        lang_modal.decompose()

    bloques = soup.select(".list-group-item, tr")

    for b in bloques:
        infoslide = None
        modal = b.select_one(".modal-body")
        if modal:
            infoslide = limpiar_texto(modal)

        es_ronda = (
            "disabled" in b.get("class", [])
            or b.select_one(".card-title") is not None
        )

        # Extraer primero h4/.lead antes de limpiar contenedores de estadísticas (.row, table)
        objetivo = b.select_one("h4, .lead")
        if objetivo is not None:
            for extra in objetivo.select(".modal, [data-toggle='modal']"):
                extra.decompose()
            texto = limpiar_texto(objetivo)
        else:
            for extra in b.select(".modal, [data-toggle='modal'], .row, table, .progress"):
                extra.decompose()
            texto = limpiar_texto(b)

        if not texto:
            continue

        if es_ronda and len(texto) <= 60:
            ronda_actual = texto
            continue

        if len(texto) <= 25 or texto in vistas:
            continue

        vistas.add(texto)
        items.append({
            "torneo": torneo,
            "ronda": ronda_actual,
            "url": url,
            "mocion": texto,
            "infoslide": infoslide,
        })

    return items


def main():
    os.makedirs("data", exist_ok=True)
    df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=3)
    df.columns = df.columns.astype(str).str.strip()

    col_torneo = "Torneo" if "Torneo" in df.columns else df.columns[1]
    col_link = "Link de mociones" if "Link de mociones" in df.columns else df.columns[2]

    cache = cargar_cache()
    translator = GoogleTranslator(source="en", target="es")
    fallback_translator = MyMemoryTranslator(source="en-GB", target="es-ES")

    todas_mociones = []
    errores = []
    salida_txt = []

    for _, fila in df.iterrows():
        torneo = str(fila[col_torneo]).strip()
        url = str(fila[col_link]).strip()
        if not url.startswith("http"):
            continue

        print(f"Extrayendo: {torneo}...", flush=True)
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()

            items = extraer_mociones_de_html(r.text, torneo, url)
            salida_txt.append(f"\n{'='*60}\nTORNEO: {torneo}\nURL: {url}\n{'='*60}\n")

            if not items:
                salida_txt.append("(No se detectaron mociones con la estructura estándar)")
                continue

            ronda_prev = None
            for item in items:
                idioma = "en" if es_ingles(item["mocion"]) else "es"
                mocion_es = (
                    traducir_a_es(item["mocion"], translator, cache, fallback_translator)
                    if idioma == "en"
                    else item["mocion"]
                )
                infoslide_es = None
                if item["infoslide"]:
                    if idioma == "en" or es_ingles(item["infoslide"]):
                        infoslide_es = traducir_a_es(
                            item["infoslide"], translator, cache, fallback_translator
                        )
                    else:
                        infoslide_es = item["infoslide"]

                registro = {
                    "id": len(todas_mociones) + 1,
                    "torneo": item["torneo"],
                    "ronda": item["ronda"],
                    "url": item["url"],
                    "idioma": idioma,
                    "mocion": item["mocion"],
                    "mocion_es": mocion_es or item["mocion"],
                    "tiene_infoslide": bool(item["infoslide"]),
                    "infoslide": item["infoslide"],
                    "infoslide_es": infoslide_es,
                }
                todas_mociones.append(registro)

                if item["ronda"] != ronda_prev:
                    salida_txt.append(f"\n[{item['ronda']}]")
                    ronda_prev = item["ronda"]

                salida_txt.append(f"- {item['mocion']}")
                if idioma == "en" and mocion_es:
                    salida_txt.append(f"  [ES]: {mocion_es}")
                if item["infoslide"]:
                    salida_txt.append(f"  Infoslide: {item['infoslide']}")
                    if infoslide_es and infoslide_es != item["infoslide"]:
                        salida_txt.append(f"  Infoslide [ES]: {infoslide_es}")

        except Exception as e:
            msg = f"Error al acceder: {e}"
            errores.append({"torneo": torneo, "url": url, "error": str(e)})
            salida_txt.append(f"\n{'='*60}\nTORNEO: {torneo}\nURL: {url}\n{msg}\n{'='*60}\n")

        guardar_cache(cache)
        time.sleep(0.3)

    guardar_cache(cache)

    payload = {
        "generado_en": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_mociones": len(todas_mociones),
        "total_torneos": len({m["torneo"] for m in todas_mociones}),
        "total_con_infoslide": sum(1 for m in todas_mociones if m["tiene_infoslide"]),
        "total_traducidas": sum(1 for m in todas_mociones if m["idioma"] == "en"),
        "errores": errores,
        "mociones": todas_mociones,
    }

    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    with open(ARCHIVO_TXT, "w", encoding="utf-8") as f:
        f.write("\n".join(salida_txt))

    print(
        f"¡Listo! {len(todas_mociones)} mociones guardadas en {ARCHIVO_JSON} y {ARCHIVO_TXT}."
    )


if __name__ == "__main__":
    main()
