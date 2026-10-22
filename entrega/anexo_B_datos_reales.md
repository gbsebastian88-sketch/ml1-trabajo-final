# Anexo B · Bono de datos reales

**Equipo:** SECOPE · Machine Learning I · Universidad EAN

## 1. Procedencia

- **Qué son:** registros reales de la contratación pública colombiana en SECOP II, el sistema electrónico obligatorio en el que las entidades públicas publican sus procesos y contratos.
- **Quién los publica:** la Agencia Nacional de Contratación Pública - Colombia Compra Eficiente, en el Portal Nacional de Datos Abiertos (datos.gov.co).
- **Conjuntos:** Contratos Electrónicos (`jbjy-vk9h`), Procesos de Contratación (`p6dx-8zbt`) y Adiciones (`cb9c-h8sn`).
- **Cómo se obtuvieron:** directamente de la API oficial del portal, desde el cuaderno, sin intermediarios ni copias de terceros. Las consultas exactas están en `datos_crudos/como_obtener_los_datos.md`.
- **Cuándo:** descarga del 20 de octubre de 2026. El cuaderno guarda la fecha y el número de filas en `data/2026-10-20/descarga.json` (442.367 contratos y 741.747 filas de procesos).
- **Volumen:** contratos firmados entre 2021 y octubre de 2026 en las modalidades con valor adjudicado. Tras la limpieza, 244.518 contratos terminados forman la base del modelo y 31.486 contratos vigentes se priorizan.
- **Trazabilidad:** cada contrato del ranking conserva su identificador y el enlace a su página en SECOP II, así que cualquier resultado se puede verificar en la fuente.

## 2. Licencia o autorización

- Datos abiertos publicados en cumplimiento de la Ley 1712 de 2014 (transparencia y acceso a la información pública nacional).
- El portal indica que sus conjuntos se publican con licencia Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0), que permite reutilizarlos citando la fuente.
- Se citan en APA 7 en `ficha_datos.md` y en las referencias del informe.
- No se requirió autorización adicional. El equipo debe confirmar la licencia de cada conjunto en su página antes de entregar.

## 3. Tratamiento ético

- **Datos personales:** no se descargaron nombres ni documentos de los contratistas. Del proveedor solo se usan el tipo de documento y si es pyme o consorcio. Los identificadores que sí se usan (NIT de la entidad, proceso y contrato) son de entidades públicas y solo sirven para cruzar tablas y agrupar la validación; no son variables del modelo.
- **Lo que se publica:** la página muestra el nombre de la entidad pública, el objeto del contrato y el enlace a SECOP II, que ya son públicos. No se publica información de personas naturales que no esté en la fuente.
- **Uso del resultado:** el ranking indica dónde revisar primero. Una probabilidad alta no prueba ninguna irregularidad, y así se advierte en la página y en el informe.
- **Sesgos posibles:** algunas modalidades, sectores y departamentos quedan sobrerrepresentados en la prioridad alta (por ejemplo, la licitación de obra pública, 5,3 veces su peso). Se recomienda revisar también una muestra al azar y vigilar el acierto por grupo.
- **Calidad y honestidad:** los registros con errores evidentes (valores adjudicados incoherentes, crecimientos por encima del tope legal) se descartan y se informa cuántos son. Las cifras infladas por fuga de información se muestran solo como advertencia (anexo A del cuaderno).
- **Redistribución:** no se redistribuyen los datos modificados como si fueran oficiales. El repositorio no incluye los datos descargados, solo el código para obtenerlos.
