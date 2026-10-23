# Anexo B · Bono de datos reales

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

## 1. Los datos describen hechos observados

Son registros reales de la contratación pública colombiana en SECOP II, el sistema electrónico obligatorio en el que las entidades públicas publican sus procesos y contratos. No son simulados, generados con código ni producidos con inteligencia artificial.

## 2. Procedencia verificable

| Conjunto | Portal y dirección | Publicador | Fecha de acceso |
| --- | --- | --- | --- |
| SECOP II - Contratos Electrónicos (`jbjy-vk9h`) | https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | 20 de octubre de 2026 |
| SECOP II - Procesos de Contratación (`p6dx-8zbt`) | https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | 20 de octubre de 2026 |
| SECOP II - Adiciones (`cb9c-h8sn`) | https://www.datos.gov.co/Gastos-Gubernamentales/SECOP-II-Adiciones/cb9c-h8sn | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | 20 de octubre de 2026 |

- **Cómo se obtuvieron:** directamente de la API oficial del Portal Nacional de Datos Abiertos, desde el cuaderno, sin intermediarios. Las consultas exactas, con sus filtros, están en `datos_crudos/como_obtener_los_datos.md`.
- **Licencia:** datos abiertos publicados en cumplimiento de la Ley 1712 de 2014. El portal indica que sus conjuntos se publican con licencia Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0), que permite reutilizarlos y redistribuirlos citando la fuente y compartiendo los derivados con la misma licencia.
- **Cita en APA 7:** en `ficha_datos.md` y en las referencias del informe.
- **Trazabilidad:** cada contrato del ranking conserva su identificador y el enlace a su página en SECOP II, así que cualquier resultado se puede verificar en la fuente.

## 3. Archivo crudo en el .zip

La carpeta `datos_crudos/` del .zip trae los archivos tal como se descargaron, en formato parquet. No incluye la contratación directa ni el régimen especial sin ofertas, que tampoco se usan en el modelo: se excluyeron desde la consulta a la API.

| Archivo | Filas | Contenido |
| --- | ---: | --- |
| `contratos.parquet` | 442.367 | contratos firmados entre 2021 y octubre de 2026 en las modalidades con valor adjudicado |
| `procesos.parquet` | 650.043 | publicaciones de los procesos que corresponden a esos contratos |
| `adiciones_tope.parquet`, `adiciones_validacion.parquet`, `adiciones_vigentes.parquet` | 35.554 · 2.973 · 12.432 | modificaciones consultadas para el tope legal, la validación de la etiqueta y los contratos vigentes |
| `descarga.json` | — | fecha de descarga, rango de fechas y número de filas |

De Procesos solo se incluyen las publicaciones de los procesos que cruzan con algún contrato descargado; las demás no intervienen en el análisis. Para correr el cuaderno con estos archivos, se copian en `data/2026-10-20/`. El cuaderno también puede volver a descargarlos de la API.

## 4. Datos de personas: tratamiento ético y normativa

- **Normativa aplicable:** Ley Estatutaria 1581 de 2012 (protección de datos personales) y Ley 1712 de 2014 (transparencia y acceso a la información pública).
- **Sin datos personales del contratista:** no se descargaron nombres ni números de documento de los contratistas. Del proveedor solo se usan el tipo de documento y si es pyme o consorcio.
- **Identificadores:** los del contrato, del proceso y de la entidad (NIT) son de entidades públicas y solo sirven para cruzar tablas y agrupar la validación; no son variables del modelo.
- **Texto libre:** el objeto del contrato lo redacta la entidad y puede mencionar a personas naturales. No se usa como variable; en la página se muestra tal como aparece en SECOP II, solo para identificar el contrato.
- **Uso del resultado:** el ranking indica dónde revisar primero. Una probabilidad alta no prueba ninguna irregularidad, y así se advierte en la página y en el informe.
- **Sesgos posibles:** algunas modalidades, sectores y departamentos quedan sobrerrepresentados en la prioridad alta (por ejemplo, la licitación de obra pública, 5,3 veces su peso). Se recomienda revisar también una muestra al azar y vigilar el acierto por grupo.

## 5. Tamaño y diagnóstico de calidad

- **Tamaño:** 244.518 contratos en la base del modelo (176.495 para entrenar y 68.023 para probar) y 31.486 contratos vigentes priorizados.
- **Suciedad real encontrada** (sección 2.2 del informe):
  - 2.032 registros con el valor adjudicado mal digitado: había compras de 114 millones «adjudicadas» por 12.858 billones.
  - 3.655 contratos que crecen más de lo que permite la ley.
  - La categoría UNSPSC sin código pasa de 0,7 % en 2021 a 10,1 % en 2024.
  - 9.208 contratos sin fecha de inicio.
  - Cláusulas que cambian después de firmar.
- **Efecto de la fuga de información:** las cifras infladas por usar columnas que cambian durante la ejecución se muestran solo como advertencia, en el anexo 2 del informe (anexo A del cuaderno).

## 6. Derivados publicados

El repositorio y la página publican un derivado de estos datos: el ranking de contratos vigentes (`docs/datos/ranking_vigentes.csv`), con la entidad, el objeto y el enlace de cada contrato. Se publica citando a SECOP II como fuente y con la misma licencia de los datos de origen.
