# Anexo A · Bono de enfoque: investigación aplicada

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

**Enfoque declarado:** investigación aplicada, sostenido desde el reto R10 hasta la entrega.

Este anexo indica dónde está en el informe (`informe_PFI.pdf`) cada elemento que pide el bono.

| Elemento que pide el bono | Dónde está en el informe | Resumen |
| --- | --- | --- |
| Pregunta o hipótesis | Sección 1.1 | ¿Se puede anticipar, con la información disponible al adjudicar, qué contratos públicos terminarán con sobrecosto, con un acierto que justifique usarlo para priorizar la revisión? H1: en el 10 % más riesgoso, la precisión supera al azar y a revisar primero los contratos más grandes. H2: el resultado se sostiene en otra ventana de tiempo, con otra definición del objetivo y dentro de cada modalidad. |
| Estado del arte (≥ 4 fuentes en APA 7, ≥ 2 en inglés) | Sección 1.2 y referencias | Flyvbjerg et al. (2002), Fazekas y Kocsis (2020), Gallego et al. (2021), Moon et al. (2020) y Saito y Rehmsmeier (2015). Las cinco están en inglés y tienen DOI. |
| Método | Secciones 2 a 4 | Diseño predictivo retrospectivo con datos reales de SECOP II: limpieza con reglas explícitas, 30 variables conocidas al adjudicar, partición temporal (2021-2023 → 2024), validación cruzada agrupada por entidad, cinco modelos contra una línea base y regla del campeón fijada de antemano. |
| Validez de las conclusiones | Sección 5.7 (y 5.4) | Validez interna (sin fuga, prueba usada una sola vez, intervalos por bootstrap de entidades), validez externa (alcance de la contratación con competencia), validez de la etiqueta (99,7 % con modificación registrada) y lo que no se puede concluir. |
| Limitaciones | Secciones 6.2 y 6.3 | Alcance, cambios de norma y de registro, deriva, contratos vigentes y posibles perjuicios por grupo. |
| Aporte a quien decide o a la literatura | Sección 6.4 | A quien decide: un ranking de 31.486 contratos vigentes con el acierto esperado por fracción revisada. A la literatura: evidencia de que el sobrecosto de la contratación colombiana con competencia se anticipa al adjudicar, con una etiqueta depurada con el tope legal y una evaluación que separa entidades y años. |

## Resultado frente a las hipótesis

- **H1 se sostiene.** En los contratos de 2024, revisar el 10 % que señala el modelo da 64,8 % de precisión, frente a 25,5 % al azar y 45,0 % al revisar primero los contratos más grandes.
- **H2 se sostiene.** PR-AUC de 0,568 en la segunda ventana (2021-2022 → 2023), 0,544 con el objetivo nominal, y ROC-AUC entre 0,73 y 0,80 en siete de las ocho modalidades.

## Material de apoyo

- Cuaderno reproducible: `cuaderno_PFI.ipynb`.
- Página con los resultados y el ranking: https://kimmoreno03.github.io/ml1-trabajo-final/
