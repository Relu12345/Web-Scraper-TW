from flask import Flask, request, render_template
from bs4 import BeautifulSoup
import requests, time

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    print(f'[INDEX] We here!')
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    print(f'[SEARCH] We here!')
    query = request.form.get('query')
    results = scrape_google_scholar(query)
    return render_template('index.html', results=results)

def scrape_google_scholar(query):
    print(f'[SCRAPE] We here')
    url = f'https://www.google.com/scholar?q={query}'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    print(soup)

    results = []

    for result in soup.find_all('h3', class_='gs_rt'):
        if len(results) >= 9:
            break

        link = result.a['href']
        title = result.get_text()
        results.append((title, link))

        time.sleep(2) 

    print(results)

    return results

if __name__ == '__main__':
    print(f'[MAIN] We here!')
    app.run(debug=True)
