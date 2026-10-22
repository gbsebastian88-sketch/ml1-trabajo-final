# Declaración de uso de inteligencia artificial

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

> Borrador por confirmar: cada integrante debe revisar y completar su sección antes de la entrega.

## Sebastián Gómez (Jefe)

**Herramienta:** Claude (Anthropic), en la aplicación de escritorio de Claude (modo Cowork), conectada a la carpeta del proyecto. Entre el 19 y el 22 de octubre de 2026.

**Para qué se usó:**

1. Escribir y ajustar el código del cuaderno: descarga por la API con caché en parquet, limpieza y cruce de tablas, validación cruzada agrupada por entidad, búsqueda de hiperparámetros, regla automática del campeón, intervalos por bootstrap, priorización de contratos vigentes y exportación de resultados.
2. Construir la página de resultados en GitHub Pages (HTML, CSS y JavaScript con Chart.js).
3. Redactar la guía teórica y práctica del proyecto, el README y los borradores del informe, el resumen ejecutivo y estas fichas.
4. Explicar conceptos (PR-AUC frente a ROC-AUC, calibración, validación por entidad) y guiar el uso de git y GitHub.

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

[Por confirmar: herramienta, prompt, qué se aceptó y qué se descartó. Si no usó IA, escribir «No usé herramientas de inteligencia artificial».]

## Luly Castiblanco (Crack)

[Por confirmar: herramienta, prompt, qué se aceptó y qué se descartó. Si no usó IA, escribir «No usé herramientas de inteligencia artificial».]
