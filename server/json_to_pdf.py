from json2html import *
import json
import pdfkit

class PdfConverter(object):

    def __init__(self):
        pass

    def to_html(self, json_doc):
        return json2html.convert(json=json_doc)

    def to_pdf(self, html_str):
        config = pdfkit.configuration(wkhtmltopdf='wkhtmltopdf.exe')
        return pdfkit.from_string(html_str, None, configuration=config)
    
def generate_pdf(data):
    pdfc = PdfConverter()
    with open("exports\\pdf\\Selected_papers.pdf", "wb") as pdf_fl:
        pdf_fl.write(pdfc.to_pdf(pdfc.to_html(json.dumps(data))))