/* Página de resultados del cuaderno sobrecosto_secop.ipynb.
   Lee los archivos de datos/ que exporta la sección 16 del cuaderno; no ejecuta ningún modelo. */
(function () {
  "use strict";

  // ---------------- utilidades ----------------
  const $ = (s) => document.querySelector(s);
  const nf0 = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf3 = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const pct = (x, d = 1) => (x == null ? "—" : new Intl.NumberFormat("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }).format(100 * x) + " %");
  const num = (x) => (x == null ? "—" : nf0.format(x));
  const dec3 = (x) => (x == null ? "—" : nf3.format(x));
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const millones = (x) => nf1.format(x / 1e6);

  const ETIQUETAS = {
    unspsc_familia: "Familia UNSPSC (tipo de bien o servicio)", unspsc_segmento: "Segmento UNSPSC",
    log_precio_base: "Precio base", log_valor_adjudicado: "Valor adjudicado",
    adjudicado_sobre_base: "Valor adjudicado / precio base", duracion_dias: "Duración pactada (días)",
    departamento: "Departamento", sector: "Sector", tipo_de_contrato: "Tipo de contrato",
    modalidad_de_contratacion: "Modalidad", respuestas_al_procedimiento: "Ofertas recibidas",
    proveedores_unicos_con: "Proveedores que ofertaron", proveedores_invitados: "Proveedores invitados",
    proveedores_con_invitacion: "Proveedores con invitación", numero_de_lotes: "Número de lotes",
    mes_firma: "Mes de firma", orden: "Orden (nacional / territorial)", rama: "Rama",
    entidad_centralizada: "Entidad centralizada", origen_de_los_recursos: "Origen de los recursos",
    destino_gasto: "Destino del gasto", es_pyme: "Proveedor pyme", es_grupo: "Proveedor consorcio o unión temporal",
    tipodocproveedor: "Tipo de documento del proveedor", obligaci_n_ambiental: "Obligación ambiental",
    reversion: "Reversión", el_contrato_puede_ser_prorrogado: "Contrato prorrogable",
    habilita_pago_adelantado: "Pago anticipado", documentos_tipo: "Documentos tipo", espostconflicto: "Posconflicto",
  };
  const SEGMENTOS = {
    "10": "Material vivo animal y vegetal", "11": "Minerales y textiles", "12": "Químicos", "14": "Papel",
    "15": "Combustibles y lubricantes", "20": "Maquinaria de minería", "21": "Maquinaria agrícola",
    "22": "Maquinaria de construcción", "23": "Maquinaria industrial", "24": "Manejo de materiales",
    "25": "Vehículos y accesorios", "26": "Generación de energía", "27": "Herramientas",
    "30": "Componentes de construcción", "31": "Componentes de manufactura", "32": "Componentes electrónicos",
    "39": "Equipo eléctrico e iluminación", "40": "Climatización y fluidos", "41": "Laboratorio y medición",
    "42": "Equipo médico", "43": "Tecnologías de la información", "44": "Equipos de oficina",
    "45": "Imprenta y audiovisuales", "46": "Equipos de defensa y seguridad", "47": "Limpieza",
    "48": "Equipos de alimentación", "49": "Deportes y recreación", "50": "Alimentos y bebidas",
    "51": "Medicamentos", "52": "Artículos para el hogar", "53": "Ropa y aseo personal", "55": "Publicaciones",
    "56": "Muebles", "60": "Material educativo", "70": "Servicios agrícolas", "71": "Servicios de minería y petróleo",
    "72": "Construcción y mantenimiento", "73": "Producción industrial", "76": "Limpieza y descontaminación",
    "77": "Servicios ambientales", "78": "Transporte y almacenaje", "80": "Gestión y servicios profesionales",
    "81": "Ingeniería e investigación", "82": "Editorial, diseño y artes", "83": "Servicios públicos",
    "84": "Financieros y seguros", "85": "Salud", "86": "Educación y formación",
    "90": "Viajes, alimentación y eventos", "91": "Servicios personales", "92": "Defensa, orden público y seguridad",
    "93": "Servicios políticos y cívicos", "94": "Organizaciones", "95": "Terrenos y edificios",
  };
  const nombreFamilia = (cod) => {
    if (cod == null || cod === "NA") return "Sin código (UNSPECIFIED)";
    if (cod === "OTRA") return "Otras";
    const seg = SEGMENTOS[String(cod).slice(0, 2)];
    return seg ? `${cod} · ${seg}` : String(cod);
  };
  const corto = (s, n = 34) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  // ---------------- gráficos ----------------
  const GRAFICOS = {};
  function base() {
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = css("--texto-2");
    Chart.defaults.borderColor = css("--rejilla");
    Chart.defaults.plugins.tooltip.backgroundColor = css("--texto");
    Chart.defaults.plugins.tooltip.titleColor = css("--superficie");
    Chart.defaults.plugins.tooltip.bodyColor = css("--superficie");
    Chart.defaults.plugins.tooltip.padding = 8;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation = false;
  }
  function grafico(id, config) {
    if (GRAFICOS[id]) GRAFICOS[id].destroy();
    GRAFICOS[id] = new Chart(document.getElementById(id), config);
  }
  const ejePct = (titulo, max) => ({ min: 0, max, title: { display: !!titulo, text: titulo }, ticks: { callback: (v) => nf0.format(v * 100) + " %" }, grid: { color: css("--rejilla") } });
  const sinRejilla = { grid: { display: false } };

  function tabla(cont, columnas, filas, opciones = {}) {
    const html = [`<div class="marco-tabla"><table class="tabla"><thead><tr>`];
    columnas.forEach((c) => html.push(`<th class="${c.num ? "num" : ""}">${esc(c.t)}</th>`));
    html.push("</tr></thead><tbody>");
    filas.forEach((f) => {
      html.push(`<tr class="${opciones.resaltar && opciones.resaltar(f) ? "resaltada" : ""}">`);
      columnas.forEach((c) => html.push(`<td class="${c.num ? "num" : ""}">${c.f ? c.f(f) : esc(f[c.k])}</td>`));
      html.push("</tr>");
    });
    html.push("</tbody></table></div>");
    cont.innerHTML = html.join("");
  }
  function tarjetas(cont, items) {
    cont.innerHTML = items.map((i) => `<div class="tarjeta"><div class="valor">${i.v}</div><div class="etiqueta">${i.e}</div>${i.d ? `<div class="detalle">${i.d}</div>` : ""}</div>`).join("");
  }

  // ---------------- datos ----------------
  const D = {};
  async function cargar() {
    const nombres = ["resumen", "magnitud", "ganancia", "comparacion", "importancia", "alcance", "ranking_vigentes"];
    const r = await Promise.all(nombres.map((n) => fetch(`datos/${n}.json`).then((x) => { if (!x.ok) throw new Error(n); return x.json(); })));
    nombres.forEach((n, i) => (D[n] = r[i]));
  }

  // ---------------- 1 · Resumen ----------------
  // ---------------- 1 · El problema ----------------
  function problema() {
    const M = D.magnitud, filas = M.por_anio;
    const total = filas.reduce((a, f) => a + f["adiciones (miles de millones)"], 0);
    const adj = filas.reduce((a, f) => a + f["valor adjudicado (miles de millones)"], 0);
    const R = D.resumen;
    const conSobre = filas.reduce((a, f) => a + f.con_sobrecosto, 0), contratos = filas.reduce((a, f) => a + f.contratos, 0);
    $("#problema-mensaje").textContent = `Uno de cada ${Math.round(contratos / conSobre)} contratos públicos termina costando más de lo adjudicado: entre ${filas[0].anio_firma} y ${filas[filas.length - 1].anio_firma}, las adiciones sumaron ${nf1.format(total / 1000)} billones de pesos.`;
    tarjetas($("#problema-kpis"), [
      { v: pct(conSobre / contratos), e: "de los contratos terminados tuvo sobrecosto", d: `${num(conSobre)} de ${num(contratos)} contratos` },
      { v: nf1.format(total / 1000) + " billones", e: "en adiciones de valor", d: `${pct(total / adj, 0)} de lo adjudicado en esos contratos` },
      { v: pct(M.crecimiento_mediano, 0), e: "crece el valor de un contrato con sobrecosto", d: "mediana, sobre su valor adjudicado" },
      { v: pct(M.concentracion["10%"], 0), e: "del monto adicionado está en el 10 % de los sobrecostos más grandes", d: `el 1 % más grande concentra el ${pct(M.concentracion["1%"], 0)}` },
    ]);
    const pasos = [
      ["datos", "Datos y alcance", "de dónde salen los datos y qué contratos cubre el modelo"],
      ["modelos", "Modelos", "cinco modelos comparados y cómo se eligió el campeón"],
      ["valor", "Valor de priorizar", "qué se habría encontrado en 2024 revisando lo que señala el modelo"],
      ["riesgo", "Qué impulsa el riesgo", "las variables que más pesan"],
      ["priorizacion", "Priorización 2025-2026", "el ranking de contratos vigentes"],
      ["limites", "Conclusiones", "resultados, limitaciones y próximos pasos"],
    ];
    $("#resumen-recorrido").innerHTML = pasos.map(([t, n, d], k) => `<li><span><a href="#${t}">${n}</a> · ${d}</span></li>`).join("");
    const anios = filas.map((f) => String(f.anio_firma));
    grafico("g-adiciones", {
      type: "bar",
      data: { labels: anios, datasets: [{ label: "Adiciones", data: filas.map((f) => f["adiciones (miles de millones)"]), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 56 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${nf0.format(c.parsed.y)} miles de millones` } } },
        scales: { x: sinRejilla, y: { beginAtZero: true, ticks: { callback: (v) => nf0.format(v) } } } },
    });
    grafico("g-tasa", {
      type: "bar",
      data: { labels: anios, datasets: [{ label: "Tasa", data: filas.map((f) => f.tasa), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 56 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${pct(c.parsed.y)} de los contratos` } } },
        scales: { x: sinRejilla, y: ejePct("", 0.35) } },
    });
    tabla($("#t-magnitud"), [
      { t: "Año de firma", k: "anio_firma" },
      { t: "Contratos", num: 1, f: (f) => num(f.contratos) },
      { t: "Con sobrecosto", num: 1, f: (f) => num(f.con_sobrecosto) },
      { t: "Tasa", num: 1, f: (f) => pct(f.tasa) },
      { t: "Valor adjudicado (miles de millones)", num: 1, f: (f) => num(f["valor adjudicado (miles de millones)"]) },
      { t: "Adiciones (miles de millones)", num: 1, f: (f) => num(f["adiciones (miles de millones)"]) },
      { t: "Adiciones / adjudicado", num: 1, f: (f) => pct(f["adiciones / valor adjudicado"]) },
    ], filas);
    $("#problema-nota").textContent = `Contratos de modalidades con valor adjudicado (${pct(R.cobertura)} de los contratos del período), firmados entre ${filas[0].anio_firma} y ${filas[filas.length - 1].anio_firma} y ya terminados. Pesos corrientes de cada año. Datos de SECOP II descargados el ${R.fecha_descarga}.`;
  }

  // ---------------- 2 · Datos y alcance ----------------
  function datos() {
    const R = D.resumen, A = D.alcance;
    const pasos = Object.entries(R.embudo);
    $("#datos-mensaje").textContent = `De ${num(pasos[0][1])} contratos descargados quedan ${num(pasos[pasos.length - 1][1])} con etiqueta confiable. El modelo cubre el ${pct(A.cobertura)} de los contratos del período: las modalidades que tienen valor adjudicado.`;
    const etiquetasEmbudo = { "descargados": "Descargados", "un contrato por proceso, cruzan y valores positivos": "Un contrato por proceso y valores válidos",
      "valor adjudicado coherente con el precio base": "Valor adjudicado coherente", "terminados": "Contratos terminados" };
    grafico("g-embudo", {
      type: "bar",
      data: { labels: pasos.map(([k]) => etiquetasEmbudo[k] || (k.startsWith("dentro del tope") ? "Dentro del tope legal (base)" : k)),
        datasets: [{ data: pasos.map(([, v]) => v), backgroundColor: pasos.map((_, i) => (i === pasos.length - 1 ? css("--serie-1") : css("--neutro"))), borderRadius: 4, maxBarThickness: 30 }] },
      options: { indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${num(c.parsed.x)} contratos` } } },
        scales: { x: { beginAtZero: true, ticks: { callback: (v) => nf0.format(v / 1000) + " mil" } }, y: sinRejilla } },
    });
    const mod = A.conteo_modalidades.slice().sort((a, b) => b.contratos - a.contratos);
    const excluida = (m) => m === "Contratación directa" || m === "Contratación régimen especial";
    grafico("g-modalidades", {
      type: "bar",
      data: { labels: mod.map((m) => corto(m.modalidad_de_contratacion, 38)),
        datasets: [
          { label: "Cubierta por el modelo", data: mod.map((m) => (excluida(m.modalidad_de_contratacion) ? null : m["% del total"] / 100)), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 18 },
          { label: "Sin valor adjudicado (fuera del alcance)", data: mod.map((m) => (excluida(m.modalidad_de_contratacion) ? m["% del total"] / 100 : null)), backgroundColor: css("--neutro"), borderRadius: 4, maxBarThickness: 18 },
        ] },
      options: { indexAxis: "y", plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (c) => `${pct(c.parsed.x)} · ${num(mod[c.dataIndex].contratos)} contratos` } } },
        scales: { x: { stacked: true, beginAtZero: true, ticks: { callback: (v) => nf0.format(v * 100) + " %" } }, y: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } } } },
    });
    const controles = [
      "Se cruza cada contrato con su proceso y solo entran procesos con un único contrato.",
      "Se descartan los valores adjudicados incoherentes con el precio base (más de 1,5 veces o menos de una décima): son errores de digitación de varios órdenes de magnitud.",
      "Solo entran contratos <strong>terminados</strong>, para que la etiqueta no cambie después de la descarga.",
      "Se descartan los crecimientos por encima del tope legal de adiciones (Ley 80, art. 40, medido en salarios mínimos).",
      `Se excluyen identificadores y columnas que se actualizan durante la ejecución (fuga de información), incluida la cláusula de ${esc((A.clausulas_excluidas || []).map((c) => c.replace("liquidaci_n", "liquidación")).join(", "))}.`,
      "La categoría UNSPSC «UNSPECIFIED» crece desde 2023 por un cambio de registro; se trata como categoría propia.",
    ];
    $("#datos-controles").innerHTML = controles.map((c) => `<li>${c}</li>`).join("");
    grafico("g-unspsc", {
      type: "bar",
      data: { labels: A.unspecified_por_anio.map((f) => String(f.anio)), datasets: [{ data: A.unspecified_por_anio.map((f) => f.proporcion), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 40 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => pct(c.parsed.y) } } }, scales: { x: sinRejilla, y: ejePct("", 0.12) } },
    });
  }

  // ---------------- 3 · Modelos ----------------
  function modelos() {
    const C = D.comparacion, R = D.resumen, camp = C.campeon;
    const ic = C.ic.filter((f) => f.modelo !== "Línea base").sort((a, b) => b.pr_auc - a.pr_auc);
    const base = C.ic.find((f) => f.modelo === "Línea base");
    const empatados = ic.filter((f) => f.modelo !== camp && f.dif_inf <= 0 && f.dif_sup >= 0).map((f) => f.modelo);
    $("#modelos-mensaje").textContent = `${camp} es el que mejor ordena los contratos por riesgo: ${nf1.format(R.metricas_campeon.pr_auc / base.pr_auc)} veces la línea base (PR-AUC ${dec3(R.metricas_campeon.pr_auc)} frente a ${dec3(base.pr_auc)}).` +
      (empatados.length ? ` En la prueba no se distingue del ${empatados.join(" ni del ").toLowerCase()}.` : "");
    grafico("g-prauc", {
      type: "bar",
      data: { labels: ic.map((f) => f.modelo), datasets: [
        { type: "bar", label: "Intervalo de 95 %", data: ic.map((f) => [f.pr_auc_inf, f.pr_auc_sup]), backgroundColor: ic.map((f) => (f.modelo === camp ? css("--serie-1") : css("--neutro"))), borderRadius: 3, barThickness: 8 },
        { type: "line", label: "PR-AUC", data: ic.map((f) => f.pr_auc), showLine: false, pointRadius: 6, pointHoverRadius: 7,
          pointBackgroundColor: ic.map((f) => (f.modelo === camp ? css("--serie-1") : css("--texto-2"))), pointBorderColor: css("--superficie"), pointBorderWidth: 2 },
      ] },
      options: { indexAxis: "y", plugins: { legend: { display: false },
          tooltip: { callbacks: { label: (c) => { const f = ic[c.dataIndex]; return `PR-AUC ${dec3(f.pr_auc)} [${dec3(f.pr_auc_inf)} - ${dec3(f.pr_auc_sup)}]`; } } } },
        scales: { x: { min: 0, max: 0.65, title: { display: true, text: "PR-AUC en 2024 (más alto = mejor)" } }, y: sinRejilla } },
      plugins: [{ id: "linea-azar", afterDraw(ch) { const x = ch.scales.x.getPixelForValue(base.pr_auc); const { top, bottom } = ch.chartArea; const ctx = ch.ctx;
        ctx.save(); ctx.strokeStyle = css("--neutro"); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
        ctx.fillStyle = css("--texto-3"); ctx.font = "11px " + Chart.defaults.font.family; ctx.fillText("azar", x + 4, top + 10); ctx.restore(); } }],
    });
    const sel = Object.fromEntries(C.seleccion.map((f) => [f.modelo, f]));
    $("#modelos-campeon").innerHTML = `<strong>Campeón: ${esc(camp)}.</strong> ` + (R.elegibles.length === 1
      ? "Ningún modelo más simple quedó a menos de un error estándar en la validación, así que la regla eligió al de mejor desempeño."
      : `Elegibles: ${esc(R.elegibles.join(", "))}; se eligió el más interpretable.`);
    const filas = C.tabla.slice().sort((a, b) => b["PR-AUC"] - a["PR-AUC"]);
    const icm = Object.fromEntries(C.ic.map((f) => [f.modelo, f]));
    tabla($("#t-modelos"), [
      { t: "Modelo", f: (f) => esc(f.modelo) + (f.modelo === camp ? " ★" : "") },
      { t: "PR-AUC validación", num: 1, f: (f) => dec3(f["PR-AUC CV"]) },
      { t: "PR-AUC prueba 2024 [IC 95 %]", num: 1, f: (f) => `${dec3(f["PR-AUC"])} <span style="color:var(--texto-3)">[${dec3(icm[f.modelo].pr_auc_inf)} - ${dec3(icm[f.modelo].pr_auc_sup)}]</span>` },
      { t: "ROC-AUC", num: 1, f: (f) => dec3(f["ROC-AUC"]) },
      { t: "Acierto en el 10 % más riesgoso", num: 1, f: (f) => pct(f["precisión@10%"]) },
      { t: "Brier (menor = mejor)", num: 1, f: (f) => dec3(f.Brier) },
      { t: "Interpretabilidad", f: (f) => (sel[f.modelo] ? ["", "alta", "media", "baja"][sel[f.modelo].nivel] : "—") },
    ], filas, { resaltar: (f) => f.modelo === camp });

    const mostrar = [camp, "Regresión logística", "Bosque aleatorio"].filter((v, i, a) => a.indexOf(v) === i && C.calibracion[v]);
    const colores = [css("--serie-1"), css("--serie-2"), css("--serie-3")];
    grafico("g-calibracion", {
      type: "line",
      data: { datasets: [
        ...mostrar.map((n, i) => ({ label: n, data: C.calibracion[n], borderColor: colores[i], backgroundColor: colores[i], borderWidth: 2, pointRadius: 3, borderDash: i === 2 ? [5, 4] : [] })),
        { label: "Calibración perfecta", data: [{ x: 0, y: 0 }, { x: 1, y: 1 }], borderColor: css("--neutro"), borderDash: [3, 3], borderWidth: 1, pointRadius: 0 },
      ] },
      options: { parsing: false, plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: predicho ${pct(c.parsed.x, 0)} · observado ${pct(c.parsed.y, 0)}` } } },
        scales: { x: { type: "linear", min: 0, max: 1, title: { display: true, text: "probabilidad predicha" }, ticks: { callback: (v) => nf0.format(v * 100) + " %" } },
          y: { min: 0, max: 1, title: { display: true, text: "frecuencia observada" }, ticks: { callback: (v) => nf0.format(v * 100) + " %" } } } },
    });
    const rob = C.robustez.map((f) => ({ ...f, variante: f.variante.replace(/^12\.\d /, "") }));
    tabla($("#t-robustez"), [
      { t: "Variante", f: (f) => esc(f.variante) },
      { t: `PR-AUC ${camp}`, num: 1, f: (f) => dec3(f[`PR-AUC ${camp}`]) },
      { t: "PR-AUC logística", num: 1, f: (f) => dec3(f["PR-AUC Regresión logística"]) },
    ], rob);
    tabla($("#t-modalidad"), [
      { t: "Modalidad", k: "modalidad" }, { t: "Contratos", num: 1, f: (f) => num(f.contratos) },
      { t: "Tasa", num: 1, f: (f) => pct(f.tasa) }, { t: "PR-AUC", num: 1, f: (f) => dec3(f["PR-AUC"]) }, { t: "ROC-AUC", num: 1, f: (f) => dec3(f["ROC-AUC"]) },
    ], C.por_modalidad);
  }

  // ---------------- 4 · Valor de priorizar ----------------
  function valor() {
    const G = D.ganancia;
    const nombres = Object.keys(G.curvas);
    const camp = nombres.find((n) => n.startsWith("campeón"));
    const fila = (rev, crit) => G.tabla.find((f) => f.revisar === rev && f.criterio === crit);
    const c10 = fila("10%", camp), v10 = fila("10%", "mayor valor adjudicado");
    const pesosAnio = (D.magnitud.por_anio.find((f) => f.anio_firma === G.anio) || {})["adiciones (miles de millones)"];
    $("#valor-mensaje").textContent = `Revisando el 10 % de contratos que señala el modelo se habrían encontrado ${pct(c10["% de los sobrecostos"], 0)} de los sobrecostos de ${G.anio}, con ${pct(c10["precisión"], 0)} de acierto: ${nf1.format(c10["veces el azar"])} veces lo que da revisar al azar.`;
    tarjetas($("#valor-kpis"), [
      { v: pct(c10["precisión"], 0), e: "de acierto en el 10 % que señala el modelo", d: `al azar: ${pct(G.tasa, 0)} · mayores contratos: ${pct(v10["precisión"], 0)}` },
      { v: num(c10["sobrecostos encontrados"]), e: `sobrecostos encontrados revisando ${num(c10["contratos revisados"])} contratos`, d: `${pct(c10["% de los sobrecostos"], 0)} del total (mayores contratos: ${pct(v10["% de los sobrecostos"], 0)})` },
      { v: pct(c10["% de los pesos de sobrecosto"], 0), e: `del monto adicionado en ${G.anio} estaba en ese mismo 10 % de contratos`,
        d: pesosAnio ? `${nf0.format(pesosAnio * c10["% de los pesos de sobrecosto"])} de ${nf0.format(pesosAnio)} miles de millones · revisando los más grandes: ${pct(v10["% de los pesos de sobrecosto"], 0)}`
                     : `revisando los más grandes: ${pct(v10["% de los pesos de sobrecosto"], 0)}` },
    ]);
    const estilo = (n, i) => {
      if (n.startsWith("campeón")) return { borderColor: css("--serie-1"), borderWidth: 3, borderDash: [] };
      if (n.startsWith("mayor")) return { borderColor: css("--serie-2"), borderWidth: 2, borderDash: [6, 4] };
      return { borderColor: css("--serie-3"), borderWidth: 2, borderDash: [2, 3] };
    };
    const etiqueta = (n) => (n.startsWith("campeón") ? `Modelo (${n.match(/\((.*)\)/)?.[1] || ""})` : n.startsWith("mayor") ? "Revisar primero los contratos más grandes" : "Regresión logística");
    ["conteo", "pesos"].forEach((clave) => {
      grafico(`g-ganancia-${clave}`, {
        type: "line",
        data: { datasets: [
          ...nombres.map((n, i) => ({ label: etiqueta(n), data: G.curvas[n][clave], pointRadius: 0, pointHoverRadius: 4, ...estilo(n, i) })),
          { label: "Al azar", data: [{ x: 0, y: 0 }, { x: 1, y: 1 }], borderColor: css("--neutro"), borderDash: [3, 3], borderWidth: 1, pointRadius: 0 },
        ] },
        options: { parsing: false, interaction: { mode: "nearest", axis: "x", intersect: false },
          plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { title: (it) => `Revisando el ${pct(it[0].parsed.x, 0)} de los contratos`, label: (c) => `${c.dataset.label}: ${pct(c.parsed.y, 0)}` } } },
          scales: { x: { type: "linear", min: 0, max: 1, title: { display: true, text: "contratos revisados" }, ticks: { callback: (v) => nf0.format(v * 100) + " %" } },
            y: { min: 0, max: 1, title: { display: true, text: clave === "conteo" ? "sobrecostos encontrados" : "monto adicionado encontrado" }, ticks: { callback: (v) => nf0.format(v * 100) + " %" } } } },
        plugins: [{ id: "marca-10", afterDraw(ch) { const x = ch.scales.x.getPixelForValue(0.1); const { top, bottom } = ch.chartArea; const ctx = ch.ctx;
          ctx.save(); ctx.strokeStyle = css("--texto-3"); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke(); ctx.restore(); } }],
      });
    });
    const filas = G.tabla.filter((f) => f.criterio === camp || f.criterio === "mayor valor adjudicado");
    tabla($("#t-ganancia"), [
      { t: "Contratos revisados", f: (f) => `${esc(f.revisar)} <span style="color:var(--texto-3)">(${num(f["contratos revisados"])})</span>` },
      { t: "Criterio", f: (f) => esc(etiqueta(f.criterio)) },
      { t: "Sobrecostos encontrados", num: 1, f: (f) => num(f["sobrecostos encontrados"]) },
      { t: "Acierto", num: 1, f: (f) => pct(f["precisión"]) },
      { t: "% de los sobrecostos", num: 1, f: (f) => pct(f["% de los sobrecostos"]) },
      { t: "% del monto adicionado", num: 1, f: (f) => pct(f["% de los pesos de sobrecosto"]) },
      { t: "Veces el azar", num: 1, f: (f) => nf1.format(f["veces el azar"]) },
    ], filas, { resaltar: (f) => f.criterio === camp && f.revisar === "10%" });
    $("#valor-nota").textContent = `Evaluación retrospectiva con los contratos firmados en ${G.anio}, que el modelo no vio al entrenar. En número de sobrecostos el modelo supera con claridad a revisar los contratos más grandes; en monto, revisar los contratos más grandes cubre más pesos, porque las adiciones grandes ocurren en contratos grandes y el modelo estima si ocurre un sobrecosto, no su tamaño. Los dos criterios se complementan.`;
  }

  // ---------------- 5 · Qué impulsa el riesgo ----------------
  function riesgo() {
    const I = D.importancia;
    const imp = I.importancia.slice(0, 10);
    const FRASE = { unspsc_familia: "el tipo de bien o servicio (familia UNSPSC)", unspsc_segmento: "el tipo de bien o servicio (segmento UNSPSC)",
      log_precio_base: "el precio base", log_valor_adjudicado: "el valor adjudicado", duracion_dias: "la duración pactada",
      departamento: "el departamento", sector: "el sector", tipo_de_contrato: "el tipo de contrato", modalidad_de_contratacion: "la modalidad",
      adjudicado_sobre_base: "el descuento frente al precio base", respuestas_al_procedimiento: "el número de ofertas" };
    const top3 = imp.slice(0, 3).map((f) => FRASE[f.variable] || (ETIQUETAS[f.variable] || f.variable).toLowerCase());
    $("#riesgo-mensaje").textContent = `Lo que más pesa en el riesgo es ${top3[0]}, seguido de ${top3[1]} y ${top3[2]}.`.replace(/ de el /g, " del ");
    grafico("g-importancia", {
      type: "bar",
      data: { labels: imp.map((f) => ETIQUETAS[f.variable] || f.variable), datasets: [{ data: imp.map((f) => f.media), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 22 }] },
      options: { indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `caída de PR-AUC: ${dec3(c.parsed.x)}` } } },
        scales: { x: { beginAtZero: true, title: { display: true, text: "caída de la PR-AUC" } }, y: { grid: { display: false }, ticks: { font: { size: 11.5 } } } } },
    });
    const cont = $("#riesgo-dependencias");
    cont.innerHTML = "";
    Object.entries(I.dependencia).forEach(([variable, filas], i) => {
      const id = `g-pd-${i}`;
      const numerica = I.numericas.includes(variable);
      const log = variable.startsWith("log_");
      const fig = document.createElement("figure");
      fig.className = "grafico";
      fig.innerHTML = `<figcaption>${esc(ETIQUETAS[variable] || variable)}<span>probabilidad media de sobrecosto${log ? " · eje en millones de pesos (escala logarítmica)" : ""}</span></figcaption><div class="lienzo"><canvas id="${id}"></canvas></div>`;
      cont.appendChild(fig);
      if (numerica) {
        const datos = filas.map((f) => ({ x: log ? Math.expm1(f.valor) / 1e6 : f.valor, y: f["probabilidad media"] }));
        grafico(id, {
          type: "line",
          data: { datasets: [{ data: datos, borderColor: css("--serie-1"), backgroundColor: css("--serie-1"), borderWidth: 2, pointRadius: 3 }] },
          options: { parsing: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${log ? nf1.format(c.parsed.x) + " millones" : nf1.format(c.parsed.x)} → ${pct(c.parsed.y)}` } } },
            scales: { x: { type: log ? "logarithmic" : "linear", ticks: { maxRotation: 0, autoSkipPadding: 12, callback: (v) => (log ? nf0.format(v) : new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(v)) } },
              y: { ticks: { callback: (v) => nf0.format(v * 100) + " %" } } } },
        });
      } else {
        const ord = filas.slice().sort((a, b) => b["probabilidad media"] - a["probabilidad media"]);
        const nombre = (v) => (variable === "unspsc_familia" ? nombreFamilia(v) : variable === "unspsc_segmento" ? (SEGMENTOS[v] || v) : v);
        grafico(id, {
          type: "bar",
          data: { labels: ord.map((f) => corto(String(nombre(f.valor)), 27)), datasets: [{ data: ord.map((f) => f["probabilidad media"]), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 16 }] },
          options: { indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { title: (it) => String(nombre(ord[it[0].dataIndex].valor)), label: (c) => pct(c.parsed.x) } } },
            scales: { x: { beginAtZero: true, ticks: { callback: (v) => nf0.format(v * 100) + " %" } }, y: { grid: { display: false }, ticks: { font: { size: 10.5 } } } } },
        });
      }
    });
  }

  // ---------------- 6 · Priorización ----------------
  const P = { filas: [], filtradas: [], pagina: 0, porPagina: 25 };
  function priorizacion() {
    const K = D.ranking_vigentes, R = D.resumen;
    P.filas = K.filas;
    const top = P.filas.slice(0, K.prioridad_alta);
    const valorTop = top.reduce((a, f) => a + (f.valor_adjudicado || 0), 0);
    const tipos = K.reparto_prioridad_alta.tipo_de_contrato.filter((f) => f["% en todos los vigentes"] >= 0.01 && f["veces su peso"] > 1.5)
      .sort((a, b) => b["veces su peso"] - a["veces su peso"]).slice(0, 3).map((f) => f.tipo_de_contrato.toLowerCase());
    $("#prio-mensaje").textContent = `De ${num(K.total)} contratos vigentes sin adiciones, ${num(K.prioridad_alta)} quedan en prioridad alta (el 10 % de mayor riesgo).` +
      (tipos.length ? ` Ahí están sobrerrepresentados los contratos de ${tipos.join(", ").replace(/, ([^,]*)$/, " y $1")}.` : "");
    tarjetas($("#prio-kpis"), [
      { v: num(K.total), e: `contratos vigentes ${R.anios_priorizar.join("-")} sin adiciones de valor`, d: `en ejecución al ${esc(R.fecha_descarga)}` },
      { v: num(K.prioridad_alta), e: "en prioridad alta", d: "el 10 % de mayor probabilidad" },
      { v: nf1.format(valorTop / 1e12) + " billones", e: "adjudicados en la prioridad alta", d: "pesos corrientes" },
    ]);
    if (P.listo) { filtrar(); } else {
    P.listo = true;
    // controles
    const opcionesN = [100, 500, 1000, K.prioridad_alta, K.publicados].filter((v, i, a) => v <= K.publicados && a.indexOf(v) === i).sort((a, b) => a - b);
    $("#f-n").innerHTML = opcionesN.map((n) => `<option value="${n}" ${n === K.prioridad_alta ? "selected" : ""}>${num(n)}${n === K.prioridad_alta ? " (prioridad alta)" : ""}</option>`).join("");
    const llenar = (id, campo) => {
      const valores = [...new Set(P.filas.map((f) => f[campo]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
      $(id).insertAdjacentHTML("beforeend", valores.map((v) => `<option>${esc(v)}</option>`).join(""));
    };
    llenar("#f-departamento", "departamento"); llenar("#f-modalidad", "modalidad"); llenar("#f-sector", "sector"); llenar("#f-tipo", "tipo_de_contrato");
    ["#f-n", "#f-departamento", "#f-modalidad", "#f-sector", "#f-tipo"].forEach((s) => $(s).addEventListener("change", () => { P.pagina = 0; filtrar(); }));
    let espera; $("#f-texto").addEventListener("input", () => { clearTimeout(espera); espera = setTimeout(() => { P.pagina = 0; filtrar(); }, 200); });
    $("#b-descargar").addEventListener("click", descargar);
    filtrar();
    }
    // reparto
    const RM = K.reparto_prioridad_alta.modalidad.filter((f) => f["% en todos los vigentes"] >= 0.005).sort((a, b) => b["veces su peso"] - a["veces su peso"]);
    grafico("g-reparto-modalidad", {
      type: "bar",
      data: { labels: RM.map((f) => corto(f.modalidad, 36)), datasets: [{ data: RM.map((f) => f["veces su peso"]), backgroundColor: RM.map((f) => (f["veces su peso"] >= 1 ? css("--serie-1") : css("--neutro"))), borderRadius: 4, maxBarThickness: 18 }] },
      options: { indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => { const f = RM[c.dataIndex]; return `${nf1.format(f["veces su peso"])}x · ${pct(f["% en prioridad alta"])} de la prioridad alta frente a ${pct(f["% en todos los vigentes"])} de todos`; } } } },
        scales: { x: { beginAtZero: true, title: { display: true, text: "veces su peso (1 = igual que en todos los vigentes)" } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } } },
      plugins: [{ id: "linea-1", afterDraw(ch) { const x = ch.scales.x.getPixelForValue(1); const { top, bottom } = ch.chartArea; const ctx = ch.ctx;
        ctx.save(); ctx.strokeStyle = css("--texto-3"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke(); ctx.restore(); } }],
    });
    const RD = K.reparto_prioridad_alta.departamento;
    grafico("g-reparto-departamento", {
      type: "bar",
      data: { labels: RD.map((f) => f.departamento), datasets: [{ data: RD.map((f) => f["% en prioridad alta"]), backgroundColor: css("--serie-1"), borderRadius: 4, maxBarThickness: 18 }] },
      options: { indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => { const f = RD[c.dataIndex]; return `${pct(f["% en prioridad alta"])} de la prioridad alta · ${pct(f["% en todos los vigentes"])} de todos los vigentes`; } } } },
        scales: { x: { beginAtZero: true, ticks: { callback: (v) => nf0.format(v * 100) + " %" } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } } },
    });
  }
  function nivel(f) {
    const K = D.ranking_vigentes;
    if (f.posicion <= Math.max(1, Math.round(K.total * 0.01))) return '<span class="insignia muy-alta">Muy alta</span>';
    if (f.posicion <= K.prioridad_alta) return '<span class="insignia">Alta</span>';
    return '<span class="insignia">Media</span>';
  }
  function filtrar() {
    const n = +$("#f-n").value;
    const dep = $("#f-departamento").value, mod = $("#f-modalidad").value, sec = $("#f-sector").value, tip = $("#f-tipo").value;
    const txt = $("#f-texto").value.trim().toLowerCase();
    P.filtradas = P.filas.slice(0, n).filter((f) => (!dep || f.departamento === dep) && (!mod || f.modalidad === mod) && (!sec || f.sector === sec) && (!tip || f.tipo_de_contrato === tip)
      && (!txt || (f.entidad || "").toLowerCase().includes(txt) || (f.objeto || "").toLowerCase().includes(txt)));
    const valor = P.filtradas.reduce((a, f) => a + (f.valor_adjudicado || 0), 0);
    $("#prio-conteo").innerHTML = `<strong>${num(P.filtradas.length)}</strong> contratos de los primeros ${num(n)} · ${nf1.format(valor / 1e9)} miles de millones adjudicados`;
    pintarTabla();
  }
  function pintarTabla() {
    const ini = P.pagina * P.porPagina, filas = P.filtradas.slice(ini, ini + P.porPagina);
    const cab = `<thead><tr><th class="num">#</th><th>Prioridad</th><th>Probabilidad</th><th>Entidad</th><th>Objeto</th><th>Modalidad</th><th>Departamento</th><th class="num">Valor adjudicado (millones)</th><th>Fin</th><th>SECOP</th></tr></thead>`;
    const cuerpo = filas.map((f) => `<tr>
      <td class="num">${num(f.posicion)}</td><td>${nivel(f)}</td>
      <td><div class="barra-prob"><div class="pista"><div class="relleno" style="width:${(100 * f.probabilidad).toFixed(1)}%"></div></div><span>${pct(f.probabilidad, 0)}</span></div></td>
      <td class="entidad">${esc(f.entidad)}</td><td class="objeto" title="${esc(f.objeto)}">${esc(corto(f.objeto || "", 120))}</td>
      <td class="modalidad">${esc(f.modalidad)}</td><td>${esc(f.departamento)}</td><td class="num">${millones(f.valor_adjudicado)}</td>
      <td class="fecha">${esc(f.fecha_fin)}</td><td>${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">Ver</a>` : "—"}</td></tr>`).join("");
    $("#t-ranking").innerHTML = cab + `<tbody>${cuerpo || '<tr><td colspan="10">No hay contratos con esos filtros.</td></tr>'}</tbody>`;
    const paginas = Math.max(1, Math.ceil(P.filtradas.length / P.porPagina));
    $("#paginacion").innerHTML = `<button ${P.pagina === 0 ? "disabled" : ""} data-p="-1">Anterior</button><span>Página ${P.pagina + 1} de ${paginas}</span><button ${P.pagina >= paginas - 1 ? "disabled" : ""} data-p="1">Siguiente</button>`;
    $("#paginacion").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { P.pagina += +b.dataset.p; pintarTabla(); }));
  }
  function descargar() {
    const cols = ["posicion", "probabilidad", "entidad", "objeto", "modalidad", "tipo_de_contrato", "departamento", "sector", "familia_unspsc", "valor_adjudicado", "fecha_firma", "fecha_fin", "duracion_dias", "respuestas", "id_contrato", "proceso", "url"];
    const celda = (v) => { const s = v == null ? "" : String(v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const texto = "﻿" + [cols.join(";"), ...P.filtradas.map((f) => cols.map((c) => celda(c === "probabilidad" ? String(f[c]).replace(".", ",") : f[c])).join(";"))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texto], { type: "text/csv;charset=utf-8" }));
    a.download = "contratos_priorizados_seleccion.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------------- pestañas ----------------
  // ---------------- 7 · Conclusiones ----------------
  function conclusiones() {
    const R = D.resumen, m = R.metricas_campeon, G = D.ganancia, C = D.comparacion;
    const camp = Object.keys(G.curvas).find((n) => n.startsWith("campeón"));
    const c10 = G.tabla.find((f) => f.revisar === "10%" && f.criterio === camp), v10 = G.tabla.find((f) => f.revisar === "10%" && f.criterio === "mayor valor adjudicado");
    const base = C.ic.find((f) => f.modelo === "Línea base");
    $("#conclusiones-mensaje").textContent = `Es posible anticipar el riesgo de sobrecosto al adjudicar: revisando el 10 % de contratos que señala el modelo, ${nf0.format(c10["precisión"] * 100)} de cada 100 tienen sobrecosto, frente a ${nf0.format(m.tasa_prueba * 100)} al azar.`;
    tarjetas($("#conclusiones-kpis"), [
      { v: pct(c10["precisión"], 0), e: "de acierto revisando el 10 % que señala el modelo", d: `al azar: ${pct(m.tasa_prueba, 0)} · revisando los contratos más grandes: ${pct(v10["precisión"], 0)} (prueba ${R.anio_prueba})` },
      { v: pct(c10["% de los sobrecostos"], 0), e: "de todos los sobrecostos se encuentra en ese 10 %", d: `revisando los contratos más grandes: ${pct(v10["% de los sobrecostos"], 0)}` },
      { v: dec3(m.pr_auc), e: `PR-AUC del campeón (${esc(R.campeon)})`, d: `${nf1.format(m.pr_auc / base.pr_auc)} veces la línea base (${dec3(base.pr_auc)})` },
      { v: num(R.n_vigentes), e: `contratos vigentes ${R.anios_priorizar.join("-")} priorizados`, d: `${num(R.n_prioridad_alta)} en prioridad alta` },
    ]);
    const lista = [
      `<strong>El sobrecosto es frecuente y costoso:</strong> ${pct(R.tasa_sobrecosto)} de los contratos terminados lo tuvo, y las adiciones sumaron ${nf1.format(D.magnitud.total_adiciones / 1e12)} billones de pesos en ${R.anios_entrenamiento[0]}-${R.anio_prueba}.`,
      `<strong>Se puede anticipar con información disponible al adjudicar:</strong> el ${esc(R.campeon)} ordena los contratos ${nf1.format(m.pr_auc / base.pr_auc)} veces mejor que el azar, y el resultado se sostuvo en dos ventanas de tiempo y dentro de cada modalidad.`,
      `<strong>Priorizar con el modelo encuentra más sobrecostos</strong> que revisar los contratos más grandes; revisar los más grandes cubre más monto. Los dos criterios se complementan.`,
      `<strong>El riesgo depende sobre todo del tipo de bien o servicio, del tamaño y del plazo pactado</strong>; luego, de dónde y en qué sector se contrata.`,
      `<strong>El resultado es operable:</strong> ${num(R.n_vigentes)} contratos vigentes quedan ordenados por prioridad para revisión, con su enlace a SECOP.`,
    ];
    $("#conclusiones-lista").innerHTML = lista.map((t) => `<li>${t}</li>`).join("");
    $("#lim-cobertura").textContent = pct(R.cobertura);
  }

  const RENDER = { problema, datos, modelos, valor, riesgo, priorizacion, limites: conclusiones };
  const hechas = new Set();
  function mostrar(tab, empujar) {
    if (!RENDER[tab]) tab = "problema";
    document.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    document.querySelectorAll("[role=tabpanel]").forEach((p) => (p.hidden = p.id !== `tab-${tab}`));
    if (!hechas.has(tab)) { RENDER[tab](); hechas.add(tab); }
    if (empujar) history.replaceState(null, "", `#${tab}`);
    window.scrollTo({ top: 0 });
  }
  function repintar() {
    base();
    const activa = document.querySelector("[role=tab][aria-selected=true]")?.dataset.tab || "problema";
    hechas.clear();
    mostrar(activa, false);
  }

  async function iniciar() {
    try {
      await cargar();
    } catch (e) {
      const err = $("#error");
      err.hidden = false;
      err.textContent = "No se pudieron cargar los datos de la carpeta datos/. Si abriste el archivo directamente desde el disco, sírvelo con un servidor local (por ejemplo: py -m http.server, dentro de la carpeta docs) o ábrelo desde GitHub Pages.";
      $("#meta-corrida").textContent = "";
      return;
    }
    base();
    const R = D.resumen;
    $("#meta-corrida").innerHTML = `Datos descargados el ${esc(R.fecha_descarga)}<br>Corrida ${esc(R.corrida)}`;
    document.querySelectorAll("[role=tab]").forEach((b) => b.addEventListener("click", () => mostrar(b.dataset.tab, true)));
    window.addEventListener("hashchange", () => mostrar(location.hash.slice(1), false));
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", repintar);
    mostrar(location.hash.slice(1) || "problema", false);
  }
  iniciar();
})();
