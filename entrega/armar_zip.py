"""Arma ML1_PFI_SECOPE.zip con los documentos de esta carpeta y los datos crudos de data/<fecha>/.

Uso, desde la carpeta del proyecto (PowerShell):
    py entrega/armar_zip.py
    py entrega/armar_zip.py 2026-10-20     # otra carpeta de data/

Los datos crudos no incluyen la contratación directa ni el régimen especial sin ofertas: se excluyeron
desde la consulta a la API. De Procesos solo se incluyen las publicaciones de los procesos que corresponden
a algún contrato descargado. Los parquet se recomprimen (zstd) para que el .zip pese menos; las filas y
columnas son las mismas de la descarga.
"""
import io
import sys
import zipfile
from pathlib import Path

import pandas as pd

ENTREGA = Path(__file__).resolve().parent
RAIZ = ENTREGA.parent
FECHA = sys.argv[1] if len(sys.argv) > 1 else "2026-10-20"
DATOS = RAIZ / "data" / FECHA
SALIDA = ENTREGA / "ML1_PFI_SECOPE.zip"

DOCUMENTOS = ["informe_PFI.pdf", "resumen_ejecutivo_EN.pdf", "cuaderno_PFI.ipynb", "ficha_datos.md",
              "declaracion_IA.md", "anexo_A_enfoque.md", "anexo_B_datos_reales.md",
              "datos_crudos/como_obtener_los_datos.md"]
ADICIONES = ["adiciones_tope.parquet", "adiciones_validacion.parquet", "adiciones_vigentes.parquet"]

faltan = [d for d in DOCUMENTOS if not (ENTREGA / d).exists()]
faltan += [f"data/{FECHA}/{f}" for f in ["contratos.parquet", "procesos.parquet", "descarga.json", *ADICIONES]
           if not (DATOS / f).exists()]
if faltan:
    sys.exit(f"Faltan archivos: {faltan}")


def a_parquet(df):
    buf = io.BytesIO()
    df.to_parquet(buf, index=False, compression="zstd")
    return buf.getvalue()


contratos = pd.read_parquet(DATOS / "contratos.parquet")
procesos = pd.read_parquet(DATOS / "procesos.parquet")
procesos = procesos[procesos.id_del_portafolio.isin(set(contratos.proceso_de_compra))]

with zipfile.ZipFile(SALIDA, "w", zipfile.ZIP_DEFLATED) as z:
    for d in DOCUMENTOS:
        z.write(ENTREGA / d, d)
    z.writestr("datos_crudos/contratos.parquet", a_parquet(contratos))
    z.writestr("datos_crudos/procesos.parquet", a_parquet(procesos))
    for f in ADICIONES:
        z.writestr(f"datos_crudos/{f}", a_parquet(pd.read_parquet(DATOS / f)))
    z.write(DATOS / "descarga.json", "datos_crudos/descarga.json")

print(f"Contratos: {len(contratos):,} filas · Procesos: {len(procesos):,} filas")
with zipfile.ZipFile(SALIDA) as z:
    for i in z.infolist():
        print(f"  {i.filename:45s} {i.compress_size / 1e6:7.1f} MB")
print(f"Listo: {SALIDA} ({SALIDA.stat().st_size / 1e6:.1f} MB)")
