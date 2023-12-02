import os
from flask import Flask, request, render_template, session, jsonify
from bs4 import BeautifulSoup
import requests, time, random
#from api.routes import api 
from flask_cors import CORS
from flask_jwt_extended import create_access_token

app = Flask(__name__, static_folder='static')
#CORS disabled to be able to access the backend from the react frontend
CORS(app)

#Get the secret key from the .env file
app.config["JWT_SECRET_KEY"] = os.environ.get('FLASK_JWT')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
}

session = requests.Session()

@app.route('/')
def index():
    print(f'[INDEX] We here!')
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    print(f'[SEARCH] We here!')
    query = request.form.get('query')
    results = scrape_google_scholar(query)
    return render_template('search.html', results=results)

def scrape_google_scholar(query):
    print(f'[SCRAPE] We here')
    results = []

    for i in range(3):
        if i == 0:
            url = f'https://scholar.google.com/scholar?q={query}'
        else:
            url = f'https://scholar.google.com/scholar?start={i*10}&q={query}'
        
        try:
            response = session.get(url, headers=headers, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')

        for result in soup.select('.gs_ri'):
            title = result.select_one('.gs_rt').text
            authors = [i.text for i in result.select('.gs_a')]
            
            try:
                urlPage = result.select_one('a')['href']
            except TypeError:
                urlPage = None
            
            results.append({
                'title': title, 
                'authors': authors,
                'url': urlPage,
            })
            
        print(f'[SCRAPE] Found {len(results)} results')

        time.sleep(random.randrange(1, 3))
            
        print(results, "\n")

    return results

@app.route('/api/text-api', methods=['POST'])
def receive_data():
    try:
       data = request.get_json()
       text = data.get('text', '')
       result = scrape_google_scholar(text)
       print(result, "\n")
       return jsonify({'message' : 'Success', 'text' : result})
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message' : 'Error processing the request'}), 500

if __name__ == '__main__':
    print(f'[MAIN] We here!')
    app.run(debug=True)