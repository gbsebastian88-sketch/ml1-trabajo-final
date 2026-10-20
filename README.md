# Predicción de sobrecostos en contratos públicos (SECOP II)

Trabajo final de **Machine Learning I** (Maestría).

Modelo de clasificación que estima, **en el momento de adjudicar** un proceso de contratación pública en Colombia, si el contrato terminará costando más de lo adjudicado. El objetivo práctico es ordenar los contratos por riesgo para que un equipo de control con capacidad limitada revise primero los más probables.

- **Cuaderno:** [`notebooks/sobrecosto_secop.ipynb`](notebooks/sobrecosto_secop.ipynb) · [abrir en Colab](https://colab.research.google.com/github/kimmoreno03/ml1-trabajo-final/blob/main/notebooks/sobrecosto_secop.ipynb)

## Datos

Datos abiertos de [datos.gov.co](https://www.datos.gov.co), descargados por la API Socrata dentro del cuaderno:

| Conjunto | ID | Uso |
|---|---|---|
| [SECOP II - Contratos Electrónicos](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h) | `jbjy-vk9h` | contrato, entidad, proveedor y valor final |
| [SECOP II - Procesos de Contratación](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt) | `p6dx-8zbt` | precio base, valor adjudicado, duración pactada y competencia |
| SECOP II - Adiciones | `cb9c-h8sn` | fecha de las modificaciones (tope legal) y validación del objetivo |

- **Cruce:** `Contratos.proceso_de_compra` = `Procesos.id_del_portafolio` (última publicación de cada proceso).
- **Período:** contratos firmados entre 2021 y 2024, en las modalidades que tienen valor adjudicado (competitivas y variantes «con ofertas»).
- **Solo contratos terminados:** su fecha de fin pasó antes del 19-sep-2026 (fecha de descarga, 19-oct-2026, menos 30 días), para que la etiqueta no cambie después.
- **Solo procesos con un único contrato:** con varios lotes, el valor adjudicado total no se puede repartir.
- **Tope legal:** se descartan como errores de registro los contratos que crecen más que el tope del art. 40 de la Ley 80 (50 % del valor inicial en salarios mínimos, con el año de la última adición tomado del conjunto de adiciones).

| Paso | Contratos |
|---|---:|
| Descargados (2021-2024, modalidades con valor adjudicado) | 284.719 |
| Un solo contrato por proceso y cruzan con su proceso, valores positivos | 251.805 |
| Terminados | 249.600 |
| Dentro del tope legal (**base del modelo**) | **245.294** |

**Tasa de sobrecosto: 25,5 %**, estable entre años (23,9 % a 26,4 %).

**Cobertura:** la contratación directa y el régimen especial sin ofertas no tienen valor adjudicado registrado y son el 90,5 % de los contratos del período. El modelo aplica al 9,5 % restante.

## Variable objetivo

```
sobrecosto = valor_del_contrato > valor_total_adjudicacion   (tolerancia de 0,1 %)
```

En SECOP II, `valor_del_contrato` se actualiza con las adiciones. Validación con el conjunto de adiciones: el 99,7 % de los contratos con sobrecosto tiene un registro de modificación de valor o general, frente al 30 % de los que no lo tienen.

## Exclusión de identificadores y fuga de información

El modelo solo usa información disponible al adjudicar.

- **Identificadores excluidos:** IDs y referencias de contrato, proceso y adjudicación; URL; NIT y código de la entidad; documento, código y nombre del proveedor; datos de representantes, supervisores y ordenadores; BPIN; cuenta bancaria. El NIT de la entidad solo se usa para separar la validación cruzada.
- **Fuga excluida (verificada en los datos):** `valor_del_contrato` (es el objetivo); fuentes de financiación (suman el valor final); fechas y duración del contrato (cambian con las prórrogas); `estado_contrato` y `dias_adicionados`; valores facturados, pagados y saldos; la cláusula `liquidaci_n`, que se actualiza después de firmar.
- **Duración pactada:** se toma del proceso. Se verificó que no se actualiza con las prórrogas: coincide con la duración final en el 44 % de los contratos sin sobrecosto y solo en el 20 % de los que tienen sobrecosto.
- **Texto libre** (objeto y descripción): no se usa, porque repite la categoría UNSPSC, identifica a la entidad con siglas propias y a veces se edita después de firmar.

**Efecto de la fuga:** con las columnas con fuga, la PR-AUC sube de 0,551 a 0,839, y con el valor final a 0,987. Esas cifras no son válidas; el cuaderno las muestra para justificar la exclusión.

## Metodología

- **Partición temporal:** entrenamiento con contratos firmados en 2021-2023 (177.071 contratos, 2.547 entidades); prueba con 2024 (68.223 contratos, 2.322 entidades), usada una sola vez.
- **Validación cruzada agrupada por entidad** (5 pliegues): elige hiperparámetros, iteraciones del boosting, épocas de la red y el umbral de cada modelo (F1 con predicciones fuera de pliegue).
- **Modelos:** regresión logística, árbol de decisión (poda con regla de un error estándar), bosque aleatorio, Gradient Boosting y red neuronal (perceptrón multicapa).
- **Selección automática del campeón**, con una regla fijada antes de mirar la prueba: mejor PR-AUC en validación; elegibles los modelos a menos de un error estándar pareado del mejor; entre ellos, el más interpretable; la prueba solo confirma.
- **Incertidumbre:** bootstrap por entidad (500 remuestreos) sobre la prueba.

## Resultados (prueba: contratos firmados en 2024)

| Modelo | PR-AUC validación | ROC-AUC | PR-AUC | Precisión en el 10 % más riesgoso | F1 |
|---|---:|---:|---:|---:|---:|
| Línea base (tasa promedio) | 0,255 | 0,500 | 0,255 | 0,261 | 0,000 |
| Regresión logística | 0,501 | 0,742 | 0,487 | 0,584 | 0,520 |
| Árbol de decisión | 0,471 | 0,724 | 0,466 | 0,569 | 0,499 |
| Bosque aleatorio | 0,536 | 0,779 | 0,548 | 0,656 | 0,552 |
| **Gradient Boosting (campeón)** | **0,550** | **0,783** | **0,551** | **0,657** | **0,553** |
| Red neuronal | 0,529 | 0,763 | 0,535 | 0,645 | 0,533 |

- **Campeón: Gradient Boosting.** PR-AUC en prueba 0,550 [IC 95 %: 0,530-0,575], igual a la de validación (0,550).
- **En el 10 % de contratos con mayor puntaje, el 66 % tuvo sobrecosto**, frente al 25 % general.
- Con su umbral: precisión 46 %, exhaustividad 69 %; marca al 38 % de los contratos.
- El bosque aleatorio no se distingue del campeón en la prueba (Δ PR-AUC −0,004 [−0,012; +0,010]). La logística (−0,064), el árbol (−0,086) y la red (−0,017) quedan por debajo.
- **Variables más importantes:** familia UNSPSC (el tipo de bien o servicio), precio base, duración pactada, departamento y sector.

**Robustez:**

| Variante | PR-AUC del campeón |
|---|---:|
| Principal: objetivo legal, 2021-2023 → 2024 | 0,551 |
| Objetivo con corte nominal de 1,5x | 0,544 |
| Segunda ventana: 2021-2022 → 2023 | 0,566 |

Las cinco variables principales coinciden en las tres variantes. El desempeño se mantiene dentro de cada modalidad (ROC-AUC entre 0,64 y 0,79). Pasar del 75 % al 100 % del entrenamiento sube la PR-AUC en 0,009.

## Cómo ejecutarlo

En Colab basta con abrir el cuaderno y ejecutar todo (*Entorno de ejecución → Ejecutar todas*). En local:

```bash
pip install -r requirements.txt
jupyter notebook notebooks/sobrecosto_secop.ipynb
```

La descarga trae unos 285.000 contratos y 510.000 filas de procesos; la ejecución completa toma varios minutos (la descarga, la red neuronal y la sección de robustez son lo más lento).

Parámetros principales (sección 1): `ANIOS_ENTRENAMIENTO`, `ANIO_PRUEBA`, `FECHA_DESCARGA`, `MARGEN_DIAS`, `CORTE_PRINCIPAL`, `BETA` y `CAPACIDAD`.

**Reproducibilidad:** `FECHA_DESCARGA` está fija en la fecha de la corrida reportada. La API publica la versión vigente de los datos, así que una descarga posterior puede traer algunos registros distintos. Para actualizar con datos nuevos, usar `pd.Timestamp.today().normalize()`.

## Limitaciones

- **Cobertura:** no aplica a la contratación directa ni al régimen especial sin ofertas (90,5 % de los contratos).
- **Contratos terminados:** los que siguen vigentes, a menudo por prórrogas, quedan fuera (1,5 % en 2024).
- **Procesos con varios contratos** quedan fuera.
- **Validación parcial del objetivo:** el conjunto de adiciones no trae montos.
- **Prácticas de registro que cambian:** la cláusula de liquidación y la categoría UNSPSC sin código (`UNSPECIFIED` pasa de menos del 1 % en 2021-2022 a cerca del 10 % en 2024). Conviene reevaluar el modelo cada año.
- **Importancia no es causalidad.**

**Trabajo futuro:** usar el campeón para priorizar contratos vigentes que aún no tienen adiciones, incorporar el historial de la entidad y del proveedor (solo con contratos anteriores), evaluar el texto libre controlando que no identifique a la entidad y reevaluar a medida que terminen los contratos de 2025 y 2026.
