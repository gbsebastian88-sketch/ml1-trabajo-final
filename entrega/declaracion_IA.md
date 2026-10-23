# Declaración de uso de inteligencia artificial

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

## Sebastián Gómez (Jefe)

**Herramienta:** Claude (Anthropic), en la aplicación de escritorio de Claude (modo Cowork), conectada a la carpeta del proyecto. Entre el 19 y el 23 de octubre de 2026.

**Para qué se usó:**

1. Escribir y ajustar el código del cuaderno: descarga por la API con caché en parquet, limpieza y cruce de tablas, validación cruzada agrupada por entidad, búsqueda de hiperparámetros, regla automática del campeón, intervalos por bootstrap, priorización de contratos vigentes y exportación de resultados.
2. Construir la página de resultados en GitHub Pages (HTML, CSS y JavaScript con Chart.js).
3. Redactar la guía teórica y práctica del proyecto, el README y estas fichas.
4. Explicar conceptos (PR-AUC frente a ROC-AUC, calibración, validación por entidad) y guiar el uso de git y GitHub.
5. Verificar que el cuaderno corre de principio a fin: la IA lo ejecutó con los datos y la corrida del integrante, y agregó que descargue y entrene automáticamente cuando no hay datos ni corridas guardados.

**Prompts representativos** (textuales):

- «la idea es que la vista sea gerencial, donde la pagina tenga pestañas por los modulos a presentar, con un orden "cronologico"»
- «si, genera dichas correciones al valor adjudicado, ajsuta el readme y el texto sobre la no utilización de contratación directa y de regimen especial»
- «genera un artifact para mi, donde me generes una explicación teorica y practica de todos los modulos del proyecto [...] el por qué se usó el PR-AUC y no el ROC-AUC para seleccionar el modelo [...]»
- «me gustaría agregar está grafica, con el formato de la presentación en la pestaña 1. el problema»

**Qué se aceptó:**

- El diseño de validación (partición temporal 2021-2023 → 2024 y validación cruzada agrupada por entidad), la PR-AUC como métrica principal y la regla del campeón fijada antes de ver la prueba.
- Los filtros de calidad: un contrato por proceso, valor adjudicado coherente con el precio base (0,1 a 1,5 veces), contratos terminados y tope legal de adiciones en salarios mínimos.
- El código del cuaderno y de la página, después de ejecutarlo de principio a fin en el equipo del integrante y revisar sus resultados.
- La estructura y la redacción de los documentos, revisadas por el integrante.

**Qué se descartó o se modificó:**

- Usar la identidad de la entidad y del proveedor como variables: se aplazó por decisión del equipo («por ahora no hagas cambios en ese aspecto»), para no memorizar entidades.
- Usar el texto libre del objeto del contrato como variable: se descartó porque repite la categoría UNSPSC, identifica a la entidad y a veces se edita después de firmar.
- Desplegar el modelo como una calculadora de parámetros: se prefirió una herramienta prescriptiva que ordena los contratos vigentes por riesgo.
- Varias versiones de la página: se unificaron pestañas y se movieron los resultados a Conclusiones a pedido del integrante.

**Verificación:** todas las cifras del informe salen del cuaderno ejecutado en el equipo del integrante (corrida `2026-10-21_1326`, datos del 20 de octubre de 2026). La IA no tuvo acceso a datos que no fueran públicos.

## Kimberly Moreno (Líder)

**Herramienta:** Claude (Anthropic), en Claude Code en la web (claude.ai/code): una sesión en la nube conectada a los repositorios de GitHub del proyecto. Entre el 17 y el 23 de octubre de 2026.

**Para qué se usó:**

1. Montar el repositorio del proyecto (`kimmoreno03/ml1-trabajo-final`) y configurar el acceso a datos.gov.co desde el entorno de trabajo.
2. Revisar los conjuntos de SECOP II (Contratos y Procesos): identificar la llave del cruce, proponer cómo definir el sobrecosto e identificar las columnas que son identificadores o tienen fuga de información, verificándolo con los datos reales.
3. Construir la primera versión del cuaderno (descarga por la API, cruce, variable objetivo, exclusión de columnas, modelo base y comparación del efecto de la fuga) y el README inicial.
4. Revisar, sin modificarlos, la versión ampliada del cuaderno, el informe y el resumen ejecutivo frente a la rúbrica de la entrega.
5. Aplicar los ajustes acordados: reorientar el informe y el resumen al enfoque de intraemprendimiento, redactar el anexo A, corregir el resumen en inglés y las inconsistencias del informe, confirmar la licencia de los datos y regenerar los PDF de la entrega.

**Prompts representativos** (textuales):

- «Puedes leer los dos archivos con la data y revisar de cara a predecir si un proyecto tiene un sobre costo ten presente que no se pueden utilizar columnas que sean indentificadores y generen fuga de información»
- «sí, 1. usa A', 2. al adjudicar y 3. súbelo a main»
- «mira hemos realizado algunos ajustes el el notebook de acuerdo a lo que queremos presentar en el modelo solo quiero que lo revises como lo ves no modifiques nada solo quiero validaciones»
- «pero digamos con ese 90% de la datos que se pierden que pasa»
- «Puedes revisar que cumpla con estas indicaciones por favor no modifiques nada sin mi permiso solo quiero que hagas la respectiv revision»
- «Aceptamos tu sugerencia de orientar el reporte hacia el "intraemprendimiento". Por favor, reestructura y ajusta la narrativa general del reporte para que se alinee con este concepto.»

**Qué se aceptó:**

- La llave del cruce entre tablas (`proceso_de_compra` = `id_del_portafolio`), verificada con los datos.
- La definición del objetivo (sobrecosto = valor del contrato > valor adjudicado), después de verificar que `valor_del_contrato` incluye las adiciones: el crecimiento se acumula en 1,5 veces, el tope legal.
- La lista de identificadores y de columnas con fuga, cada una con su evidencia: las fuentes de financiación suman el valor final; la fecha de fin se mueve con las prórrogas; `estado_contrato` y `dias_adicionados` delatan la adición.
- Predecir en el momento de adjudicar, de modo que las variables de competencia y el valor adjudicado sí se pueden usar.
- Las observaciones de la revisión de la entrega: el anexo A no correspondía al bono de enfoque, quedaban textos de borrador, el resumen en inglés afirmaba que la prueba solo tenía entidades no vistas y el informe decía «siete cláusulas» en lugar de seis.
- El enfoque de intraemprendimiento, el anexo A y los ajustes de redacción, revisados por la integrante.

**Qué se descartó o se modificó:**

- Definir el sobrecosto como valor del contrato > precio base: se descartó porque mezcla el descuento de la oferta con las adiciones.
- Definir el sobrecosto como valor facturado > valor del contrato: se descartó porque casi la mitad de los contratos tiene el valor facturado en 0 y depende de la ejecución.
- Predecir desde la publicación del proceso: se prefirió el momento de la adjudicación.
- Leer los datos desde Google Drive o desde Chrome: no fue posible en el entorno de la herramienta; se usó directamente la API de datos.gov.co.
- Un análisis adicional para validar el precio base como valor inicial en la contratación directa: lo detuvo la integrante, porque en ese momento solo quería la explicación.
- La primera versión del cuaderno (solo 2022 y partición aleatoria por entidad): la reemplazó la versión ampliada del equipo (2021-2024, partición temporal y selección automática del campeón).
- La sección de microcredenciales no la propuso la IA: las microcredenciales y su contenido los aportó la integrante; la IA solo redactó dónde se aplicó cada técnica en el proyecto.

**Verificación:** la IA ejecutó la primera versión del cuaderno en su entorno, únicamente con datos públicos de datos.gov.co. Las cifras finales del informe salen de la versión ampliada, ejecutada en el equipo de Sebastián (corrida `2026-10-21_1326`); al regenerar los PDF no se cambió ninguna cifra, solo la redacción, la estructura y las aclaraciones.

## Luly Castiblanco (Crack)

**Herramienta:** Gemini (Google)

**Para qué se usó:** Para realizar la revisión técnica y la auditoría de los datos, comprobar la consistencia de los resultados del modelado predictivo, verificar las métricas de desempeño y validar la solidez del análisis antes de la presentación final del equipo.

**Prompts representativos** (textuales):

1. ¿Cómo podemos estructurar la validación cruzada agrupada por entidad para evitar el sesgo de filtración de información entre pliegues?
2. Revisemos el comportamiento de la métrica PR-AUC frente al desbalance de clases en los contratos de 2024 para asegurar que la curva de calibración sea confiable.
3. Verifica si el filtrado de valores atípicos y la limpieza de montos adjudicados en los datos abiertos afectaron la distribución de las modalidades contractuales.

**Qué se aceptó:**

- La separación estricta de la validación cruzada por entidad (para garantizar que el modelo no evaluara entidades que ya conocía).
- El uso de la métrica PR-AUC como indicador principal de desempeño debido al desbalance de las clases (sobrecostos).
- Las limitaciones metodológicas reportadas sobre la exclusión de contratos de contratación directa y régimen especial.

**Qué se descartó o se modificó:**

- Se descartó el uso directo de variables con fugas de datos (como el valor final, los días reales o el estado del contrato), ya que inflaban artificialmente las métricas predictivas a niveles inválidos.
- Se ajustaron los umbrales de decisión para el ranking de contratos vigentes, buscando un equilibrio más realista entre la capacidad operativa de los equipos de control y la cobertura de los sobrecostos.

**Verificación:** Validación cruzada iterativa contra el conjunto de datos de prueba y contraste de los resultados con las estadísticas históricas de adiciones de la plataforma SECOP II La IA ejecutó la versión final del documento no modificó el cuaderno.
