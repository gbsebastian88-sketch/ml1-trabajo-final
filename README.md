# Priorización de contratos públicos con riesgo de sobrecosto (SECOP II)

Trabajo final de **Machine Learning I** (Maestría, Universidad EAN) · **Equipo SECOPE:** Sebastián Gómez (jefe), Kimberly Moreno (líder) y Luly Castiblanco (crack).

Modelo de clasificación que estima, **en el momento de adjudicar** un proceso de contratación pública en Colombia, la probabilidad de que el contrato termine costando más de lo adjudicado. Con esa probabilidad se **ordenan por riesgo los contratos vigentes de 2025 y 2026 que todavía no tienen adiciones**, para que un equipo de control con capacidad limitada revise primero los más riesgosos. El modelo estima si ocurre un sobrecosto, **no su monto**.

- **Cuaderno:** [`notebooks/sobrecosto_secop.ipynb`](notebooks/sobrecosto_secop.ipynb) · [abrir en Colab](https://colab.research.google.com/github/kimmoreno03/ml1-trabajo-final/blob/main/notebooks/sobrecosto_secop.ipynb)
- **Entrega:** [`entrega/`](entrega/): informe, resumen ejecutivo en inglés, ficha de datos, declaración de IA y anexos de bonos. El archivo `ML1_PFI_SECOPE.zip`, con los datos crudos, se arma con `py entrega/armar_zip.py` y no se sube a git por su tamaño (unos 66 MB)
- **Página de resultados:** [kimmoreno03.github.io/ml1-trabajo-final](https://kimmoreno03.github.io/ml1-trabajo-final/) · código en [`docs/`](docs/); los datos de [`docs/datos/`](docs/datos/) los genera el cuaderno

## Datos

Datos abiertos de [datos.gov.co](https://www.datos.gov.co), publicados por la Agencia Nacional de Contratación Pública - Colombia Compra Eficiente (licencia CC BY-SA 4.0), descargados por la API Socrata dentro del cuaderno y guardados en parquet. El ranking de `docs/datos/` es un derivado de estos datos y se comparte con la misma licencia. Los archivos crudos de la descarga van en `datos_crudos/` del .zip de la entrega:

| Conjunto | ID | Uso |
|---|---|---|
| [SECOP II - Contratos Electrónicos](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h) | `jbjy-vk9h` | contrato, entidad, proveedor y valor final (incluye adiciones) |
| [SECOP II - Procesos de Contratación](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt) | `p6dx-8zbt` | precio base, valor adjudicado, duración pactada y competencia |
| [SECOP II - Adiciones](https://www.datos.gov.co/Gastos-Gubernamentales/SECOP-II-Adiciones/cb9c-h8sn) | `cb9c-h8sn` | fechas de las modificaciones: tope legal, validación del objetivo y filtro de contratos vigentes |

**Contratos usados** (descarga del 20-oct-2026):

- **Para entrenar y evaluar:** contratos firmados entre 2021 y 2024 y ya terminados, para que la etiqueta no cambie después de la descarga.
- **Para priorizar:** contratos firmados en 2025-2026 que siguen en ejecución y no tienen adiciones de valor.

| Paso | Contratos 2021-2024 |
|---|---:|
| Descargados (modalidades con valor adjudicado) | 284.715 |
| Un contrato por proceso, cruzan con su proceso, valores positivos | 251.794 |
| Valor adjudicado coherente con el precio base | 250.344 |
| Terminados | 248.173 |
| Dentro del tope legal (**base del modelo**, tasa de sobrecosto 25,5 %) | **244.518** |

Contratos vigentes priorizados: **31.486** (firmados en 2025-2026, en ejecución y sin adiciones de valor).

**Limpieza:**

- **Cruce:** `Contratos.proceso_de_compra` = `Procesos.id_del_portafolio`, con la última publicación de cada proceso.
- **Un solo contrato por proceso:** con varios lotes, el valor adjudicado total no se puede repartir.
- **Valor adjudicado coherente con el precio base:** entre 0,1 y 1,5 veces. Fuera de ese rango hay errores de digitación de varios órdenes de magnitud; en los datos aparecen compras menores «adjudicadas» por miles de billones de pesos. Afecta a cerca del 0,5 % de los registros.
- **Tope legal de adiciones:** se descartan como errores los contratos que crecen más que el tope del art. 40 de la Ley 80 (50 % del valor inicial en salarios mínimos), con el año de la última adición tomado del conjunto de adiciones.

### Por qué no se incluyen la contratación directa ni el régimen especial sin ofertas

Son cerca del 90 % de los contratos del período, pero no se puede medir su sobrecosto:

- **Cómo funcionan.** En la **contratación directa** (Ley 1150 de 2007) la entidad elige al contratista sin concurso, en causales fijadas por la ley; más del 90 % son prestación de servicios, en su mayoría con personas naturales. Las entidades de **régimen especial** (hospitales públicos, empresas de servicios públicos, universidades públicas, entre otras) contratan con sus propios manuales y no les aplica el tope de adiciones de la Ley 80.
- **Falta el valor inicial.** Sin competencia no hay adjudicación: el valor adjudicado es 0 en estas modalidades. El precio base es el presupuesto estimado, no el valor firmado, y no está validado que coincidan. El conjunto de adiciones no trae montos. Sin valor inicial no hay etiqueta.
- **Serían otro problema.** Sus adiciones son sobre todo prórrogas de contratos de servicios personales, un fenómeno distinto que pediría un modelo aparte.

## Variable objetivo

```
sobrecosto = valor_del_contrato > valor_total_adjudicacion   (tolerancia de 0,1 %)
```

En SECOP II, `valor_del_contrato` se actualiza con las adiciones. El conjunto de adiciones lo confirma: en una muestra de 600 contratos, el 99,7 % de los que tienen sobrecosto tiene un registro de modificación de valor o general, frente al 32,3 % de los que no lo tienen.

## Variables y fuga de información

El modelo solo usa información disponible al adjudicar: características de la entidad, del contrato y del proceso, categoría UNSPSC, precio base, valor adjudicado, duración pactada, competencia (oferentes) y tipo de proveedor.

- **Excluidos:** identificadores de contrato, proceso, entidad, proveedor y personas; columnas que se actualizan durante la ejecución (valor final, fuentes de financiación, fechas y duración del contrato, estado, días adicionados, pagos) y la cláusula de liquidación, que cambia después de firmar.
- **Verificado:** la duración pactada del proceso no se actualiza con las prórrogas, y el valor `UNSPECIFIED` en la categoría UNSPSC, que crece desde 2023, es un cambio de registro y no un error.
- **Texto libre** (objeto y descripción): no se usa, porque repite la categoría UNSPSC, identifica a la entidad y a veces se edita después de firmar.
- **Efecto de la fuga** (anexo académico): con las columnas con fuga, la PR-AUC sube de 0,55 a 0,84, y con el valor final a 0,99. Esas cifras no son válidas.

## Metodología

- **Partición temporal:** entrenamiento con contratos firmados en 2021-2023; prueba con los de 2024, usada una sola vez. Una segunda ventana (2021-2022 → 2023) sirve como robustez.
- **Validación cruzada agrupada por entidad** (5 pliegues): elige hiperparámetros, iteraciones, épocas y el umbral de cada modelo con predicciones fuera de pliegue.
- **Modelos:** regresión logística, árbol de decisión, bosque aleatorio, Gradient Boosting y red neuronal.
- **Selección automática del campeón**, con una regla fijada antes de mirar la prueba: mejor PR-AUC en validación; elegibles los modelos a menos de un error estándar pareado del mejor; entre ellos, el más interpretable; la prueba solo confirma.
- **Incertidumbre:** bootstrap por entidad sobre la prueba.
- **Modelo final:** el campeón se reentrena con todos los contratos con etiqueta (2021-2024) y ordena los contratos vigentes.

## Resultados (prueba: contratos firmados en 2024)

| Modelo | PR-AUC validación | ROC-AUC | PR-AUC | Precisión en el 10 % más riesgoso |
|---|---:|---:|---:|---:|
| Línea base (tasa promedio) | 0,255 | 0,500 | 0,255 | 0,261 |
| Regresión logística | 0,504 | 0,745 | 0,490 | 0,586 |
| Árbol de decisión | 0,475 | 0,726 | 0,469 | 0,571 |
| Bosque aleatorio | 0,537 | 0,779 | 0,548 | 0,656 |
| **Gradient Boosting (campeón)** | **0,551** | **0,783** | **0,551** | **0,648** |
| Red neuronal | 0,536 | 0,769 | 0,533 | 0,641 |

- **Campeón: Gradient Boosting**, PR-AUC en prueba 0,551 [IC 95 %: 0,529-0,575]. El bosque aleatorio no se distingue de él; los demás quedan por debajo.
- **Valor de priorizar (2024):** revisando el 10 % de contratos con mayor probabilidad, el 65 % tuvo sobrecosto (2,5 veces la tasa general del 25 %) y se encuentra el 25 % de todos los sobrecostos, frente al 18 % si se revisan primero los contratos de mayor valor.
- **En pesos de sobrecosto**, revisar primero los contratos más grandes captura más monto, porque las adiciones se concentran en pocos contratos grandes. Los dos criterios se complementan.
- **Qué impulsa el riesgo:** familia UNSPSC (el tipo de bien o servicio), precio base, duración pactada, departamento y sector.
- **Robustez:** el resultado se mantiene con el corte nominal del objetivo (PR-AUC 0,544), en la segunda ventana temporal (0,568) y dentro de cada modalidad.
- **Magnitud:** las adiciones de valor suman 19,7 billones de pesos en 2021-2024 (16-20 % de lo adjudicado cada año); el 10 % de los sobrecostos de mayor monto concentra el 82 % de los pesos.

## Cómo ejecutarlo

En local (Windows, PowerShell):

```powershell
py -m pip install -r requirements.txt
code notebooks/sobrecosto_secop.ipynb
```

En la sección 1 del cuaderno se elige qué hacer:

| `DESCARGAR_DATOS` | `ENTRENAR_MODELOS` | Qué hace |
|---|---|---|
| `True` | `True` | descarga todo de la API, lo guarda en `data/<fecha>/`, entrena y guarda una corrida en `corridas/<fecha_hora>/` |
| `False` | `True` | reentrena con los datos guardados, sin descargar |
| `False` | `False` | carga la última corrida y sus datos: solo muestra resultados (uno o dos minutos) |

Con `EXPORTAR_WEB = True`, la sección 16 escribe en `docs/datos/` los archivos de la página web, incluido el ranking completo de contratos vigentes en CSV.

En Colab hay que montar Google Drive y apuntar `RAIZ` a la carpeta del proyecto (instrucciones en la sección 1); lo que se guarde fuera de Drive se borra al cerrar la sesión.

Si la carpeta no tiene datos ni corridas guardados (por ejemplo, en un equipo nuevo), el cuaderno activa la descarga y el entrenamiento automáticamente, así que corre de principio a fin desde un núcleo reiniciado. La descarga y el entrenamiento completos tardan varias horas.

**Reproducibilidad:** semilla 42; la corrida reportada (`2026-10-21_1326`) usó Python 3.13.5, scikit-learn 1.8.0, pandas 2.3.3 y numpy 2.3.5, y cada corrida guarda sus versiones en `registro.json`. La asignación de entidades a los pliegues depende de cómo numpy ordena grupos de igual tamaño, que puede variar entre procesadores: en otro equipo, la PR-AUC de validación del campeón dio 0,549 en vez de 0,551, sin cambios en la prueba, el campeón ni el ranking.

## Estructura del repositorio

```
notebooks/sobrecosto_secop.ipynb   análisis, modelos, priorización y exportación
docs/                              página web (GitHub Pages): index.html, app.js, estilos.css
docs/datos/                        resultados que lee la página (JSON y CSV), generados por el cuaderno
entrega/                           documentos de la entrega y script que arma ML1_PFI_SECOPE.zip
data/                              datos descargados en parquet (no se versiona)
corridas/                          modelos y resultados de cada corrida (no se versiona)
```

## Limitaciones

- **Cobertura:** no aplica a la contratación directa ni al régimen especial sin ofertas.
- **Contratos terminados:** los que siguen vigentes, a menudo por prórrogas, quedan fuera del entrenamiento.
- **Procesos con varios contratos** quedan fuera.
- **Validación parcial del objetivo:** el conjunto de adiciones no trae montos.
- **Prácticas de registro que cambian:** la cláusula de liquidación y la categoría UNSPSC sin código. Conviene reevaluar el modelo cada año.
- **Contratos vigentes:** son más recientes y más largos que los de entrenamiento, y su registro puede tener rezagos. El ranking se lee como orden de prioridad, no como probabilidad exacta.
- **Importancia no es causalidad.**

**Trabajo futuro:** incorporar el historial de la entidad y del proveedor (solo con contratos anteriores), evaluar el texto libre controlando que no identifique a la entidad, validar el precio base como valor inicial en la contratación directa y, como propuesta de operación, monitorear el modelo: reentrenarlo cada año y comparar el ranking con lo que ocurra cuando esos contratos terminen.
