import sys, pathlib
from playwright.sync_api import sync_playwright
pie = ('<div style="font-family:DejaVu Sans,sans-serif;font-size:7.5pt;color:#555;width:100%;padding:0 0.75in;'
       'display:flex;justify-content:space-between"><span>Equipo SECOPE · Riesgo de sobrecosto en SECOP II</span>'
       '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
with sync_playwright() as p:
    b = p.chromium.launch()
    for html, pdf, footer in [("informe_PFI.html", "informe_PFI.pdf", True), ("resumen_ejecutivo_EN.html", "resumen_ejecutivo_EN.pdf", False)]:
        pg = b.new_page()
        pg.goto(pathlib.Path(html).resolve().as_uri()); pg.wait_for_load_state("networkidle")
        pg.pdf(path=pdf, format="Letter", prefer_css_page_size=True, print_background=True,
               display_header_footer=footer, header_template="<span></span>", footer_template=pie if footer else "<span></span>")
    b.close()
