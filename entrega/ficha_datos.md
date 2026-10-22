# Ficha de datos

**Proyecto:** Priorización de contratos públicos con riesgo de sobrecosto (SECOP II)
**Equipo:** SECOPE · Machine Learning I · Universidad EAN

## 1. Fuente

| Conjunto | Identificador | Portal | Publicador | Uso en el proyecto |
| --- | --- | --- | --- | --- |
| SECOP II - Contratos Electrónicos | `jbjy-vk9h` | [datos.gov.co](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h) | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | contrato, entidad, tipo de proveedor, cláusulas y valor final (con adiciones) |
| SECOP II - Procesos de Contratación | `p6dx-8zbt` | [datos.gov.co](https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt) | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | precio base, valor adjudicado, duración pactada y competencia |
| SECOP II - Adiciones | `cb9c-h8sn` | [datos.gov.co](https://www.datos.gov.co/Gastos-Gubernamentales/SECOP-II-Adiciones/cb9c-h8sn) | Agencia Nacional de Contratación Pública - Colombia Compra Eficiente | tipo y fecha de cada modificación (sin montos) |

- **Acceso:** API Socrata del Portal Nacional de Datos Abiertos (`https://www.datos.gov.co/resource/<id>.csv`), consultada desde el cuaderno.
- **Fecha de acceso:** 20 de octubre de 2026 (carpeta `data/2026-10-20/`).
- **Cómo obtenerlos de nuevo:** ver `datos_crudos/como_obtener_los_datos.md`.

## 2. Licencia o autorización

- Son **datos abiertos** publicados por una entidad pública en el Portal Nacional de Datos Abiertos de Colombia, en cumplimiento de la Ley 1712 de 2014 (transparencia y acceso a la información pública).
- El portal indica que sus conjuntos se publican con licencia **Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)**: se pueden reutilizar, también con fines comerciales, citando la fuente y compartiendo las obras derivadas con la misma licencia.
- **Antes de entregar:** confirmar la licencia en la sección «Acerca de este conjunto de datos» de cada conjunto. En PowerShell:
  `(Invoke-RestMethod "https://www.datos.gov.co/api/views/jbjy-vk9h.json").license`
- No se requiere autorización adicional: no se usan datos personales sensibles (ver `anexo_B_datos_reales.md`).

## 3. Tablas descargadas

La API entrega todos los campos como texto; el cuaderno convierte montos, fechas y conteos.

| Tabla (archivo parquet) | Filas | Columnas | Filtro de la consulta |
| --- | ---: | ---: | --- |
| Contratos (`contratos.parquet`) | 442.367 | 36 | firmados entre 2021-01-01 y 2026-10-21, sin contratación directa ni régimen especial sin ofertas |
| Procesos (`procesos.parquet`) | 741.747 | 11 | publicados entre 2020-01-01 y 2026-10-21 y adjudicados |
| Adiciones para el tope legal (`adiciones_tope.parquet`) | 35.554 | 3 | contratos que crecen más de 1,5 veces |
| Adiciones para validar la etiqueta (`adiciones_validacion.parquet`) | 2.973 | 5 | muestra de 600 contratos |
| Adiciones de contratos vigentes (`adiciones_vigentes.parquet`) | 12.432 | 3 | contratos vigentes 2025-2026 candidatos a priorizar |

### Columnas de Contratos (36)

| Grupo | Columnas | Tipo | Faltantes |
| --- | --- | --- | --- |
| Llaves | `proceso_de_compra`, `id_contrato`, `nit_entidad` | texto (identificador) | 0 |
| Objetivo | `valor_del_contrato` | numérico (pesos) | 0 |
| Entidad | `departamento`, `orden`, `sector`, `rama`, `entidad_centralizada`, `nombre_entidad` | categórica / texto | 0 (en `departamento`, 2,8 % dice «No Definido») |
| Contrato | `tipo_de_contrato`, `modalidad_de_contratacion`, `codigo_de_categoria_principal`, `origen_de_los_recursos`, `destino_gasto` | categórica | 0 (en el código UNSPSC, 7,8 % sin código) |
| Proveedor | `es_pyme`, `es_grupo`, `tipodocproveedor` | categórica | 0 (en `tipodocproveedor`, 1,6 % «No Definido») |
| Cláusulas | `habilita_pago_adelantado`, `el_contrato_puede_ser_prorrogado`, `espostconflicto`, `obligaci_n_ambiental`, `reversion`, `liquidaci_n`, `documentos_tipo` | categórica (Sí / No) | 0 |
| Fechas | `fecha_de_firma`, `fecha_de_inicio_del_contrato`, `fecha_de_fin_del_contrato` | fecha | 0 · 9.208 · 2 |
| Ejecución (solo diagnóstico, con fuga) | `estado_contrato`, `dias_adicionados`, `presupuesto_general_de_la_nacion_pgn`, `recursos_propios`, `valor_facturado`, `valor_pagado` | categórica / numérica | 0 |
| Texto e identificación | `objeto_del_contrato`, `urlproceso` | texto | 0 |

### Columnas de Procesos (11)

`id_del_portafolio` (llave), `precio_base`, `valor_total_adjudicacion`, `duracion`, `unidad_de_duracion`, `numero_de_lotes`, `proveedores_invitados`, `proveedores_con_invitacion`, `respuestas_al_procedimiento`, `proveedores_unicos_con`, `fecha_de_ultima_publicaci`. Sin faltantes.

### Columnas de Adiciones

`id_contrato`, `tipo`, `fecharegistro` (más `identificador` y `descripcion` en la muestra de validación). Sin faltantes.

## 4. Base del modelo

| Concepto | Valor |
| --- | --- |
| Unidad | un contrato de un proceso con un solo contrato, ya terminado |
| Filas | 244.518 contratos firmados entre 2021 y 2024 |
| Variables de entrada | 30 (20 categóricas y 10 numéricas) |
| Variable objetivo | `sobrecosto` = 1 si valor final > valor adjudicado × 1,001 |
| Tasa de la clase positiva | 25,5 % |
| Entrenamiento / prueba | 176.495 (2021-2023) / 68.023 (2024) |
| Contratos vigentes priorizados | 31.486 (2025-2026, en ejecución y sin adiciones de valor) |

| Variable | Tipo | Unidad o niveles | Faltantes |
| --- | --- | --- | ---: |
| `departamento` | categórica | 34 niveles | 0 |
| `orden` | categórica | 3 | 0 |
| `sector` | categórica | 25 | 0 |
| `rama` | categórica | 4 | 0 |
| `entidad_centralizada` | categórica | 2 | 0 |
| `tipo_de_contrato` | categórica | 18 | 0 |
| `modalidad_de_contratacion` | categórica | 12 | 0 |
| `origen_de_los_recursos` | categórica | 2 | 0 |
| `destino_gasto` | categórica | 3 | 0 |
| `es_pyme` | categórica | 2 | 0 |
| `es_grupo` | categórica | 2 | 0 |
| `tipodocproveedor` | categórica | 9 | 0 |
| `obligaci_n_ambiental` | categórica | 2 | 0 |
| `reversion` | categórica | 2 | 0 |
| `el_contrato_puede_ser_prorrogado` | categórica | 2 | 0 |
| `habilita_pago_adelantado` | categórica | 3 | 0 |
| `documentos_tipo` | categórica | 3 | 0 |
| `espostconflicto` | categórica | 2 | 0 |
| `unspsc_segmento` | categórica | 57 (2 dígitos UNSPSC) | 0* |
| `unspsc_familia` | categórica | 395 (4 dígitos UNSPSC) | 0* |
| `log_precio_base` | numérica | ln(1 + pesos) | 0 |
| `log_valor_adjudicado` | numérica | ln(1 + pesos) | 0 |
| `adjudicado_sobre_base` | numérica | razón entre 0,1 y 1,5 | 0 |
| `duracion_dias` | numérica | días | 3 |
| `numero_de_lotes` | numérica | conteo | 0 |
| `proveedores_invitados` | numérica | conteo | 0 |
| `proveedores_con_invitacion` | numérica | conteo | 0 |
| `respuestas_al_procedimiento` | numérica | conteo | 0 |
| `proveedores_unicos_con` | numérica | conteo | 0 |
| `mes_firma` | numérica | 1 a 12 | 0 |

\* El 5,4 % de los contratos de la base no tiene código UNSPSC (`UNSPECIFIED`): 3,6 % en entrenamiento y 10,1 % en prueba. Se trata como una categoría propia, que funciona como indicador de faltante. Las 3 duraciones faltantes se imputan con la mediana del entrenamiento.

## 5. Cita en APA 7

Agencia Nacional de Contratación Pública - Colombia Compra Eficiente. (2026). *SECOP II - Contratos Electrónicos* [Conjunto de datos]. Portal Nacional de Datos Abiertos. Recuperado el 20 de octubre de 2026, de https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h

Agencia Nacional de Contratación Pública - Colombia Compra Eficiente. (2026). *SECOP II - Procesos de Contratación* [Conjunto de datos]. Portal Nacional de Datos Abiertos. Recuperado el 20 de octubre de 2026, de https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Procesos-de-Contrataci-n/p6dx-8zbt

Agencia Nacional de Contratación Pública - Colombia Compra Eficiente. (2026). *SECOP II - Adiciones* [Conjunto de datos]. Portal Nacional de Datos Abiertos. Recuperado el 20 de octubre de 2026, de https://www.datos.gov.co/Gastos-Gubernamentales/SECOP-II-Adiciones/cb9c-h8sn
