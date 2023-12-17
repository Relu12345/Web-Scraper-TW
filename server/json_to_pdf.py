from jinja2 import Template
import json
import pdfkit

class PdfConverter(object):

    def __init__(self):
        pass

    def to_html(self, json_doc):
        template_string = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Research Papers</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                }
            </style>
        </head>
        <body>
            <h1>Research Papers</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Authors</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    {% for entry in entries %}
                        <tr>
                            <td>{{ entry.get('title', 'No Title') }}</td>
                            <td>
                                {% for author in entry.get('authors', ['No Authors']) %}
                                    {{ author }}{% if not loop.last %}, {% endif %}
                                {% endfor %}
                            </td>
                            <td><a href="{{ entry.get('url', '#') }}">{{ entry.get('url', '#') }}</a></td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </body>
        </html>
        """

        template = Template(template_string)
        html = template.render(entries=json_doc)

        return html

    def to_pdf(self, html_str):
        config = pdfkit.configuration(wkhtmltopdf='server\\wkhtmltopdf.exe')
        return pdfkit.from_string(html_str, verbose=True, options=get_options(), configuration=config)

def get_options():
    return {
        'encoding': 'UTF-8',
        'enable-local-file-access': True
    }

def generate_pdf(data):
    pdfc = PdfConverter()
    with open("server\\exports\\pdf\\Selected_papers.pdf", "wb") as pdf_fl:
        pdf_fl.write(pdfc.to_pdf(pdfc.to_html(data)))