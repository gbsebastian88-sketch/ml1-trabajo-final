# Anexo A · Bono de enfoque: intraemprendimiento

**Equipo:** SECOPE · Machine Learning I · Universidad EAN
**Enfoque declarado:** intraemprendimiento: transformar un proceso interno de una organización pública con un modelo de machine learning.

Este anexo reúne las evidencias que pide la caja del bono. El informe (`informe_PFI.pdf`) desarrolla cada punto en las secciones indicadas.

## 1. Organización y usuario

| Elemento | Contenido |
| --- | --- |
| Organización | Oficina de control interno de una entidad pública que contrata por SECOP II con modalidades competitivas. También sirve a una contraloría territorial o a una veeduría ciudadana. |
| Usuario | El jefe de la oficina de control interno y su equipo de auditores. |
| Proceso que se transforma | La selección de los contratos vigentes que se auditan cada período. Hoy se hace con reglas intuitivas, como empezar por los contratos más grandes, y la capacidad no alcanza para revisarlos todos. |

Informe: sección 1 (tabla de la decisión) y sección 1.1.

## 2. Propuesta de valor

Una lista ordenada por riesgo de sobrecosto de los contratos vigentes, que dice a la oficina qué revisar primero con la capacidad que tiene. Es gratuita (datos abiertos y código abierto), se actualiza cada año y se consulta en una página web con filtros por departamento, modalidad, sector y tipo de contrato, búsqueda por entidad u objeto, descarga en CSV y enlace a cada contrato en SECOP II.

Lo que cambia para el usuario: pasa de elegir por tamaño o por intuición a elegir por una probabilidad estimada con 244.518 contratos terminados, sin dejar de revisar los contratos más grandes, que concentran el monto.

Informe: secciones 1.1, 5.3 y 6.1.

## 3. Hipótesis de mejora

> Con la misma capacidad de revisión, priorizar los contratos con el modelo encuentra más contratos que terminan con sobrecosto que la regla actual de revisar primero los contratos más grandes.

La hipótesis es medible (precisión en el 10 % revisado) y tiene un criterio de aceptación explícito (superar el 45,0 % que logra la regla de los más grandes).

Informe: secciones 1.1 y 6.4.

## 4. Estimación del impacto

Validación retrospectiva con los contratos de 2024 (68.023 contratos, que el modelo no vio al entrenar):

| Revisando el 10 % (6.802 contratos) | Sobrecostos encontrados | Precisión | Monto adicionado cubierto |
| --- | ---: | ---: | ---: |
| Al azar (esperado) | ≈ 1.730 | 25,5 % | ≈ 10 % |
| Regla actual: contratos más grandes | 3.060 | 45,0 % | 87,0 % |
| **Ranking del modelo** | **4.411** | **64,8 %** | **65,1 %** (≈ 3,0 de 4,6 billones) |

- **Frente a la regla actual:** 1.351 sobrecostos más encontrados con la misma capacidad, un 44 % más.
- **Frente al azar:** 2,5 veces más acierto.
- **Complementariedad:** la regla de los más grandes cubre más monto, porque el modelo estima si ocurre un sobrecosto y no su tamaño. Por eso la propuesta combina los dos criterios.

**Supuestos declarados:**

1. La oficina puede revisar el 10 % de los contratos vigentes; con otra capacidad, las cifras cambian (informe, sección 5.3, tabla con el 1 %, 10 % y 20 %).
2. Los contratos futuros se comportan como los de 2024; la sección 5.4 del informe muestra que el desempeño se mantiene en otra ventana temporal.
3. El impacto se mide como sobrecostos y monto **bajo revisión**, no como dinero ahorrado: revisar un contrato no garantiza evitar una adición, y no hay datos para estimar ese efecto.
4. El modelo solo aplica a contratos con valor adjudicado (el 9,5 % de los contratos del período); no cubre la contratación directa.

Informe: secciones 1.1, 5.3 y 5.4.

## 5. Ruta para validar la hipótesis con usuarios reales

Piloto de un año con una oficina de control interno:

| Etapa | Qué se hace | Qué se mide |
| --- | --- | --- |
| 1. Línea base (mes 1) | Registrar qué contratos vigentes revisaría la oficina con su regla actual y, en paralelo, cuáles señala el ranking, con la misma capacidad. | Coincidencia entre ambas listas. |
| 2. Operación (meses 2 a 6) | La oficina revisa la unión de las dos listas y una muestra al azar del 1 %, sin saber de qué lista viene cada contrato. | Hallazgos por revisión y horas por revisión, según la lista de origen. |
| 3. Cierre (meses 7 a 12) | Esperar a que terminen los contratos revisados y comparar cuáles tuvieron adiciones. | Precisión de cada lista. Se acepta la hipótesis si el ranking supera a la regla actual. |
| 4. Adopción | Entrevistar a los auditores sobre la utilidad y la claridad de la página, y ajustar los filtros. | Satisfacción de los usuarios y decisión de adoptar el proceso. |

Condición para dejar de usarlo: si el acierto del 10 % más riesgoso baja de 45 %, se reentrena antes de seguir (informe, sección 6.2).

Informe: sección 6.4.

## 6. Cómo usé lo aprendido en las microcredenciales

| Microcredencial EanX | Técnica o herramienta | Dónde se aplicó en el proyecto |
| --- | --- | --- |
| **Creatividad y Pensamiento Crítico con Prompting Engineering** | Definir el reto, explorar alternativas y cerrar con una propuesta de valor | El reto se redefinió de «predecir sobrecostos» a «decidir qué revisar primero con capacidad limitada» y se cerró con la propuesta de valor de este anexo. Se exploraron tres definiciones del objetivo (valor final frente a precio base, frente a lo facturado y frente a lo adjudicado) y se eligió la última con evidencia. Se descartó una calculadora de parámetros en favor de un ranking prescriptivo. |
| | Prompting con criterio propio: verificar lo que propone la IA | Las propuestas de la IA sobre columnas con fuga se contrastaron con los datos antes de aceptarlas (las fuentes de financiación suman el valor final; la fecha de fin se mueve con las prórrogas). Lo aceptado y lo descartado está en `declaracion_IA.md`. |
| **Investigación 1: Proponente en Investigación** | Formulación de hipótesis verificables | La hipótesis de mejora de la sección 3 se planteó de forma medible y se contrastó con los datos de 2024. |
| | Definición y operacionalización de variables; búsqueda bibliográfica | La variable dependiente se operacionalizó con una regla explícita (valor final > adjudicado × 1,001) y las 30 independientes se definieron con su unidad y el momento en que se conocen (informe, sección 3.1 y anexo 1). La elección de la PR-AUC se sustentó en la literatura (Saito y Rehmsmeier, 2015; Davis y Goadrich, 2006). |
| **Investigación 2: Analiza tu investigación** | Gestión y depuración de bases de datos | Depuración en cinco pasos documentados, con el número de registros que sale en cada uno (informe, sección 2.2). |
| | Diseño y validación de instrumentos; discusión de resultados | La etiqueta se validó con una fuente independiente, el conjunto de adiciones, en una muestra de 600 contratos. El piloto de la sección 5 define los instrumentos para recoger evidencia con usuarios (registro de hallazgos por revisión y entrevistas). Los resultados se discuten frente a la regla actual y a la literatura (informe, sección 5). |

Informe: sección 8.

## 7. Evidencia de la solución construida

La propuesta no se queda en el papel: el ranking está publicado y se puede usar.

- **Página:** https://kimmoreno03.github.io/ml1-trabajo-final/ (copia de respaldo: https://gbsebastian88-sketch.github.io/ml1-trabajo-final/).
- **Código:** carpeta `docs/` del repositorio https://github.com/kimmoreno03/ml1-trabajo-final.
- **Qué muestra:** los 31.486 contratos vigentes de 2025-2026 sin adiciones de valor, ordenados por probabilidad; con el 10 % de capacidad son 3.149 contratos.
- **Cómo se actualiza:** el cuaderno (`cuaderno_PFI.ipynb`, sección 16) exporta los resultados a `docs/datos/`; al fusionar los cambios en `main`, GitHub Pages publica la página en uno o dos minutos. Se recomienda reentrenar cada año.

## Referencias

Davis, J., y Goadrich, M. (2006). The relationship between precision-recall and ROC curves. En *Proceedings of the 23rd International Conference on Machine Learning* (pp. 233-240). ACM. https://doi.org/10.1145/1143844.1143874

Saito, T., y Rehmsmeier, M. (2015). The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets. *PLOS ONE, 10*(3), e0118432. https://doi.org/10.1371/journal.pone.0118432
