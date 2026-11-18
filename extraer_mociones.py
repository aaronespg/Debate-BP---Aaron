import time
import pandas as pd
import requests
from bs4 import BeautifulSoup

EXCEL_PATH = "Torneos BP.xlsx"
SHEET_NAME = "Banco de mociones"
ARCHIVO_FINAL = "banco_mociones_bp.txt"
HEADERS = {"User-Agent": "Mozilla/5.0"}


def limpiar_texto(elemento):
    return " ".join(elemento.get_text(" ", strip=True).split())


def extraer_mociones_de_html(html):
    soup = BeautifulSoup(html, "html.parser")
    lineas = []
    vistas = set()

    # Eliminar el modal de selección de idioma para no contaminar infoslides
    for lang_modal in soup.select("#language-modal, [id*='lang']"):
        lang_modal.decompose()

    bloques = soup.select(".list-group-item, tr")
    encontradas = 0

    for b in bloques:
        # Detectar si el bloque contiene un modal de infoslide asociado
        infoslide = None
        modal = b.select_one(".modal-body")
        if modal:
            infoslide = limpiar_texto(modal)

        # Clonar/limpiar botones "View Info Slide" y modals del bloque para leer solo la moción o ronda
        for extra in b.select(".modal, button[data-toggle='modal'], [data-toggle='modal']"):
            extra.decompose()

        texto = limpiar_texto(b)
        if not texto or texto in vistas:
            continue

        # Detectar encabezados de ronda cortos (ej. "Round 1", "Grand Final", "Final Novata")
        es_ronda = (
            "disabled" in b.get("class", [])
            or b.select_one(".card-title") is not None
        )

        if es_ronda and len(texto) <= 60:
            vistas.add(texto)
            lineas.append(f"\n[{texto}]")
        elif len(texto) > 25:
            vistas.add(texto)
            lineas.append(f"- {texto}")
            if infoslide:
                lineas.append(f"  Infoslide: {infoslide}")
            encontradas += 1

    return lineas, encontradas


def main():
    # La tabla en "Banco de mociones" empieza en la fila 4 (índice 3)
    df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=3)
    df.columns = df.columns.astype(str).str.strip()

    col_torneo = "Torneo" if "Torneo" in df.columns else df.columns[1]
    col_link = "Link de mociones" if "Link de mociones" in df.columns else df.columns[2]

    salida = []

    for _, fila in df.iterrows():
        torneo = str(fila[col_torneo]).strip()
        url = str(fila[col_link]).strip()
        if not url.startswith("http"):
            continue

        print(f"Extrayendo: {torneo}...")
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()

            salida.append(f"\n{'='*60}\nTORNEO: {torneo}\nURL: {url}\n{'='*60}\n")
            lineas, encontradas = extraer_mociones_de_html(r.text)
            salida.extend(lineas)

            if encontradas == 0:
                salida.append("(No se detectaron mociones con la estructura estándar)")

        except Exception as e:
            salida.append(f"\n{'='*60}\nTORNEO: {torneo}\nURL: {url}\nError al acceder: {e}\n{'='*60}\n")

        time.sleep(0.5)

    with open(ARCHIVO_FINAL, "w", encoding="utf-8") as f:
        f.write("\n".join(salida))

    print(f"¡Listo! Archivo guardado en: {ARCHIVO_FINAL}")


if __name__ == "__main__":
    main()
