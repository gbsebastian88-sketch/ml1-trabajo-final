# Cómo obtener los datos crudos

Los datos descargados ocupan más de 100 MB en parquet, así que no se incluyen en el .zip. Son públicos y se obtienen de nuevo de la fuente oficial.

## Opción 1: desde el cuaderno (recomendada)

1. Instalar las dependencias: `py -m pip install -r requirements.txt`.
2. Abrir `cuaderno_PFI.ipynb` y, en la sección 1, poner `DESCARGAR_DATOS = True` y `ENTRENAR_MODELOS = True`. En un equipo sin datos ni corridas guardados, el cuaderno los activa solo.
3. Ejecutar todo con el núcleo reiniciado. Los archivos quedan en `data/<fecha de hoy>/` con un `descarga.json` que registra la fecha y el número de filas.

La descarga completa y el entrenamiento tardan varias horas. Una descarga en otra fecha trae también los contratos firmados o actualizados después del 20 de octubre de 2026, así que las cifras pueden cambiar levemente.

## Opción 2: consultas directas a la API

Base: `https://www.datos.gov.co/resource/<identificador>.csv`, paginando con `$limit=50000`, `$offset` y `$order=:id`.

| Tabla | Identificador | Filtro (`$where`) |
| --- | --- | --- |
| Contratos | `jbjy-vk9h` | `fecha_de_firma between '2021-01-01' and '2026-10-21' and modalidad_de_contratacion not in ('Contratación directa','Contratación régimen especial')` |
| Procesos | `p6dx-8zbt` | `fecha_de_publicacion_del between '2020-01-01' and '2026-10-21' and adjudicado='Si'` |
| Adiciones | `cb9c-h8sn` | `id_contrato in (...)`, solo para los contratos que lo necesitan, en lotes de 150 llaves |

**Columnas de Contratos (`$select`):** `proceso_de_compra, id_contrato, nit_entidad, valor_del_contrato, departamento, orden, sector, rama, entidad_centralizada, tipo_de_contrato, modalidad_de_contratacion, codigo_de_categoria_principal, origen_de_los_recursos, destino_gasto, es_pyme, es_grupo, tipodocproveedor, habilita_pago_adelantado, el_contrato_puede_ser_prorrogado, espostconflicto, obligaci_n_ambiental, reversion, liquidaci_n, documentos_tipo, fecha_de_firma, nombre_entidad, objeto_del_contrato, urlproceso, estado_contrato, dias_adicionados, presupuesto_general_de_la_nacion_pgn, recursos_propios, fecha_de_inicio_del_contrato, fecha_de_fin_del_contrato, valor_facturado, valor_pagado`

**Columnas de Procesos (`$select`):** `id_del_portafolio, precio_base, valor_total_adjudicacion, duracion, unidad_de_duracion, numero_de_lotes, proveedores_invitados, proveedores_con_invitacion, respuestas_al_procedimiento, proveedores_unicos_con, fecha_de_ultima_publicaci`

Ejemplo en PowerShell (primeras 1.000 filas de Contratos):

```powershell
$where = "fecha_de_firma between '2021-01-01' and '2026-10-21' and modalidad_de_contratacion not in ('Contratación directa','Contratación régimen especial')"
Invoke-WebRequest "https://www.datos.gov.co/resource/jbjy-vk9h.csv?`$limit=1000&`$where=$([uri]::EscapeDataString($where))" -OutFile contratos_muestra.csv
```

## Descarga usada en el proyecto

| Archivo | Filas |
| --- | ---: |
| `contratos.parquet` | 442.367 |
| `procesos.parquet` | 741.747 |
| `adiciones_tope.parquet` | 35.554 |
| `adiciones_validacion.parquet` | 2.973 |
| `adiciones_vigentes.parquet` | 12.432 |

Fecha de descarga: 20 de octubre de 2026.
