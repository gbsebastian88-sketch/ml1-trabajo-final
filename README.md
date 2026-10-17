# Predicción de sobrecostos en contratos públicos (SECOP II)

Trabajo final de **Machine Learning I** (Maestría).

Modelo de clasificación que estima, **en el momento de adjudicar** un proceso de contratación pública en Colombia, si el contrato terminará costando más de lo adjudicado.

- **Cuaderno:** [`notebooks/sobrecosto_secop.ipynb`](notebooks/sobrecosto_secop.ipynb) · [abrir en Colab](https://colab.research.google.com/github/kimmoreno03/ml1-trabajo-final/blob/main/notebooks/sobrecosto_secop.ipynb)

## Datos

Datos abiertos de [datos.gov.co](https://www.datos.gov.co), descargados por la API Socrata dentro del cuaderno:

| Conjunto | ID | Uso |
|---|---|---|
| [SECOP II - Contratos Electrónicos](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h) | `jbjy-vk9h` | contrato, entidad, proveedor y valor final |
| [SECOP II - Procesos de Contratación](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt) | `p6dx-8zbt` | precio base, valor adjudicado, duración y competencia |

- **Cruce:** `Contratos.proceso_de_compra` = `Procesos.id_del_portafolio`.
- **Muestra:** contratos firmados en 2022 (casi 4 años para terminar de ejecutarse). Solo entran las modalidades competitivas, sin contratación directa ni régimen especial, y solo los procesos con un único contrato.
- **Limpieza:** se descartan 1.743 registros que crecen más de 1,5x, porque superan el tope legal de adiciones y son errores de registro.
- **Resultado:** 60.736 contratos.

## Variable objetivo

```
sobrecosto = valor_del_contrato > valor_total_adjudicacion
```

En SECOP II, `valor_del_contrato` se actualiza con las adiciones. El crecimiento se acumula justo en 1,5x, que es el tope legal de adiciones (art. 40, Ley 80 de 1993). **Tasa de sobrecosto: 25,5%.**

## Exclusión de identificadores y fuga de información

El modelo solo usa información disponible al adjudicar.

- **Identificadores excluidos:** IDs y referencias de contrato, proceso y adjudicación; URL; NIT y código de la entidad; documento, código y nombre del proveedor; datos de representantes, supervisores y ordenadores; BPIN; cuenta bancaria. Las llaves solo se usan para unir las tablas y para separar entrenamiento y prueba por entidad.
- **Fuga excluida (verificada en los datos):**
  - `valor_del_contrato`: es el objetivo.
  - Fuentes de financiación (PGN, SGP, regalías, recursos propios, crédito): suman el valor *final*.
  - `fecha_de_fin_del_contrato` y `duraci_n_del_contrato`: cambian con las prórrogas.
  - `estado_contrato` («Modificado») y `dias_adicionados`.
  - Valores facturados, pagados y pendientes; saldos; estados y fechas de liquidación.

## Resultados

Set de prueba con **entidades no vistas** al entrenar (13.890 contratos, 471 entidades):

| Modelo | ROC-AUC | PR-AUC | F1 |
|---|---:|---:|---:|
| Línea base (tasa promedio) | 0,500 | 0,246 | 0,000 |
| Regresión logística | 0,737 | 0,470 | 0,509 |
| **Gradient Boosting** | **0,768** | **0,527** | **0,532** |

Con el umbral elegido en entrenamiento, el Gradient Boosting detecta el 60% de los sobrecostos (recall) con 48% de precisión. Las variables que más pesan son la familia UNSPSC (el tipo de bien o servicio), la duración pactada, el precio base, el tipo de contrato y el valor adjudicado.

**Efecto de la fuga:** si se agregan las columnas con fuga, el PR-AUC sube a 0,802; si además se agrega el valor final, sube a 0,983. Esas cifras no son válidas y el cuaderno las muestra solo para justificar la exclusión.

## Cómo ejecutarlo

En Colab basta con abrir el cuaderno y ejecutar todo. En local:

```bash
pip install -r requirements.txt
jupyter notebook notebooks/sobrecosto_secop.ipynb
```

El cuaderno tarda pocos minutos: descarga unos 70.000 contratos y 195.000 filas de procesos. Para cambiar el año, edita `ANIO`.

## Limitaciones

- Algunos contratos todavía pueden recibir adiciones, así que su etiqueta puede estar incompleta.
- Solo se usan procesos con un único contrato.
- La contratación directa queda por fuera.

Como trabajo futuro: validación temporal con varios años, el texto del objeto del contrato y un historial de la entidad calculado solo con contratos anteriores.
