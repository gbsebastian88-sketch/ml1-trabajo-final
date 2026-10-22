# Anexo A · Bono de enfoque: despliegue del modelo

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

> Nota del equipo: para este curso, desplegar en una página de GitHub Pages cuenta como despliegue válido. Si la caja del bono pide evidencias adicionales, agregarlas en este archivo.

## 1. Qué se desplegó

Una **herramienta prescriptiva**, no una calculadora: la página publica el ranking de los **31.486 contratos vigentes de 2025-2026** que todavía no tienen adiciones de valor, ordenados por la probabilidad de sobrecosto que estima el modelo campeón (Gradient Boosting). El equipo de control elige cuántos puede revisar y la página le muestra, en orden, cuáles revisar primero.

- **Página oficial:** https://kimmoreno03.github.io/ml1-trabajo-final/
- **Copia de respaldo:** https://gbsebastian88-sketch.github.io/ml1-trabajo-final/
- **Código:** carpeta `docs/` del repositorio https://github.com/kimmoreno03/ml1-trabajo-final

## 2. Cómo funciona

| Paso | Dónde | Qué hace |
| --- | --- | --- |
| 1. Descarga | cuaderno, sección 2 | trae los datos de la API de datos.gov.co y los guarda en parquet |
| 2. Entrenamiento y evaluación | secciones 3 a 13 | limpia, entrena 5 modelos, elige el campeón y lo evalúa en 2024 |
| 3. Modelo final | sección 14 | reentrena el campeón con 2021-2024 y calcula la probabilidad de cada contrato vigente |
| 4. Exportación | sección 16 | escribe en `docs/datos/` los resultados en JSON y el ranking completo en CSV |
| 5. Publicación | GitHub Pages | al fusionar cambios en `main`, la página se actualiza sola en uno o dos minutos |

La página es estática (HTML, CSS y JavaScript con Chart.js incluido en el repositorio): no ejecuta Python ni el modelo, solo lee los archivos que exporta el cuaderno. Así funciona sin servidor y cualquiera puede verificar los resultados.

## 3. Qué ofrece al usuario

- **Siete pestañas en orden de presentación:** el problema y la decisión, datos y alcance, modelos, valor de priorizar, qué impulsa el riesgo, priorización y conclusiones.
- **Pestaña de priorización:** selector de cuántos contratos revisar, filtros por departamento, modalidad, sector y tipo de contrato, búsqueda por entidad u objeto, descarga de la selección en CSV y enlace a cada contrato en SECOP II.
- **Contexto para decidir:** costo de cada error, umbral recomendado (operar por capacidad: el 10 % de los vigentes son 3.149 contratos), gobernanza y límites de uso.
- **Diseño para cualquier pantalla:** modo claro y oscuro, y vista de celular sin desplazamiento horizontal.

## 4. Evidencias

1. La página publicada en la dirección de la sección 1.
2. El historial de cambios del repositorio, con las solicitudes de extracción (PR) que publicaron la página.
3. El cuaderno `cuaderno_PFI.ipynb`, cuya sección 16 genera los archivos que la página muestra.
4. Los archivos `docs/datos/*.json` y `docs/datos/ranking_vigentes.csv` del repositorio.

## 5. Mantenimiento

1. Correr el cuaderno con `DESCARGAR_DATOS = True` y `ENTRENAR_MODELOS = True` (datos nuevos y modelo reentrenado), o con ambos en `False` para regenerar la página con la corrida guardada.
2. Hacer commit y push de `docs/` y abrir una solicitud de extracción (PR) hacia el repositorio oficial.
3. Al fusionarla, la página se actualiza.
4. Se recomienda reentrenar cada año y comparar el ranking con lo que ocurra cuando los contratos priorizados terminen.
