from datetime import datetime
import os
import re
from threading import Thread
from dotenv import load_dotenv
from flask import Flask, request, render_template, session, jsonify, send_file
from bs4 import BeautifulSoup
from flask_pymongo import PyMongo

import pymongo
import requests, time, random

#from api.routes import api 
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt
from json_to_pdf import generate_pdf
from json_to_csv import generate_csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options

app = Flask(__name__, static_folder='static')
CORS(app)
#CORS disabled to be able to access the backend from the react frontend
load_dotenv()
connection_string: str = os.environ.get('CONNECTION_STRING')

#Get the secret key from the .env file
app.config["JWT_SECRET_KEY"] = os.environ.get('FLASK_JWT')
app.config['MONGO_DBNAME'] = 'proiect'
app.config["MONGO_URI"] = connection_string

mongo = pymongo.MongoClient(connection_string)
bcyrypt = Bcrypt(app)
jwt = JWTManager(app)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
}

session = requests.Session()

db = mongo['proiect']
users = db['register']
history = db['history']
favourites = db['favourites']


@app.route("/users/register",methods=['POST'])
def register():
    user_name = request.get_json()['username']
    email = request.get_json()['email']
    password = bcyrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    existing_user = users.find_one({'username': user_name})
    existing_email = users.find_one({'email': email})
    
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 401
    
    if existing_email:
        return jsonify({'error': 'Email already exists'}), 400

    user_id = users.insert_one({
		'username': user_name,
		'email': email,
		'password': password,
		'created': created,
		})

    new_user = users.find_one({'username': user_name})

    access_token = create_access_token(identity = {
				'username': new_user['username'],
				'email': new_user['email']
				})

    result = {'email': new_user['email']+' registered'}

    return jsonify({'result':result, 'token': access_token}), 200


@app.route("/users/register",methods=['GET'])
def get_users():
	result = []

	for field in users.find():
		result.append({'_id':str(field['_id']), 'username':str(field['username']),'email':str(field['email']),'password':str(field['password'])})

	return jsonify(result)


@app.route("/users/login",methods=['POST'])
def login():
	email = request.get_json()['email']
	password = request.get_json()['password']
	result = ""

	response = users.find_one({'email':email})

	if response:
		if bcyrypt.check_password_hash(response['password'], password):
			access_token = create_access_token(identity = {
				'username': response['username'],
				'email': response['email']
				})

			result = jsonify({"token": access_token}), 200

		else:
			result = jsonify({"error": "Invalid Username or Password"}), 400

	else:
		result = jsonify({"result": "No result found"}), 400

	return result


@app.route("/users/logout", methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt_identity()
    access_token = create_access_token(identity=jti, expires_delta=False)
    return jsonify(logout=True, access_token=access_token)


def scrape_google_scholar(query, user):
    
    print(f'[SCRAPE] We here')
    results = []
    page = 0

    #For all the pages
    #while True:

    #For "i" pages:
    while page < 3:
        url = f'https://scholar.google.com/scholar?start={page * 10}&q={query}'
        
        try:
            response = session.get(url, headers=headers, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')

        if not soup.select('.gs_ri'):
            break

        for result in soup.select('.gs_ri'):
            title = result.select_one('.gs_rt').text
            authors = [i.text for i in result.select('.gs_a')]
            
            try:
                urlPage = result.select_one('a')['href']

                if 'ieeexplore.ieee.org' in urlPage:
                    urlPage = re.sub(r'/abstract', '', urlPage)
                
            except TypeError:
                urlPage = None
            
            results.append({
                'title': title, 
                'authors': authors,
                'url': urlPage,
                'source': ['Google Scholar'],
            })

        print(f'[SCRAPE] Found a total of {len(results)} results. Now on page {page + 1}')

        time.sleep(random.randrange(1, 3))
        page += 1
            
    return results


def scrape_ieee_xplore(query, user):
    print('[SCRAPE IEEE XPLORE] We here')
    results = []

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3')
    chrome_options.add_argument('window-size=1920x1080')

    driver = webdriver.Chrome(options=chrome_options)

    search_url = "https://ieeexplore.ieee.org/"
    driver.get(search_url)

    try:
        search_input = WebDriverWait(driver, 1).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.global-search-bar input.Typeahead-input'))
        )

        # Enter search query
        search_input.send_keys(query)

        # Find and click the search button
        search_button = WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'div.search-icon button.stats-Global_Search_Icon'))
        )
        search_button.click()

        page = 1
        while page < 3:
            # Wait for the results to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'xpl-results-list .List-results-items'))
            )

            # Your scraping logic here...
            results_list = driver.find_element("css selector", "xpl-results-list")

            for result_item in results_list.find_elements("css selector", ".List-results-items"):
                title = result_item.find_element("css selector", "h3 a").text
                authors = result_item.find_elements("css selector", ".author span")
                authors_list = [author.text.strip(';').strip() for author in authors if author.text.strip() != '']
                authors_set = set(authors_list)
                authors_list = ', '.join(authors_set).lstrip(', ')

                authors = []
                authors.append(authors_list)

                url = result_item.find_element("css selector", "h3 a").get_attribute("href")

                # Create a dictionary for each result
                results.append({
                    "title": title,
                    "authors": authors,
                    "url": url,
                    "source": ["IEEE Xplore"]
                })

            # Construct the URL for the next page
            page += 1
            next_page_url = f"https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText={query}&pageNumber={page}"

            # Navigate to the next page
            driver.get(next_page_url)

            # Wait for the next page to load
            time.sleep(5)

            # Check if there are no more pages
            no_results_message = driver.find_elements(By.CLASS_NAME, "List-results-none")
            if no_results_message:
                break

    except Exception as e:
        print(f"Error: {e}")

    driver.quit()

    return results


class CustomThread(Thread):
    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}, Verbose=None):
        Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None
    
    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)
            print(self._return)

    def join(self):
         Thread.join(self)
         return self._return

def scrape_both_sources(query, user):
    google_thread = CustomThread(target=scrape_google_scholar, args=(query, user))
    ieee_thread = CustomThread(target=scrape_ieee_xplore, args=(query, user))

    google_thread.start()
    ieee_thread.start()

    results_google_scholar = google_thread.join()
    results_ieee_xplore = ieee_thread.join()
    insert_history(query, user)

    url_to_result = {}
    for result in results_google_scholar + results_ieee_xplore:
        url = result['url']
        if url not in url_to_result:
            url_to_result[url] = result
        else:
            # Merge sources if duplicate URL
            url_to_result[url]['source'].extend(result['source'])

    # Deduplicate results
    results = list(url_to_result.values())

    print(f'[SCRAPE BOTH SOURCES] Results:\n{results}')
    return results


def insert_history(query, user):
    print("in insert history")
    search_data = datetime.utcnow()
    if(user == ''):
         return None
    if(history.find_one({'user': user})):
        history_list = history.find_one({'user': user})['history']
        history_list.append({'query': query, 'date': search_data})
        history.update_one({'user': user}, {'$set': {'history': history_list}})
    else:
        history_item = {
            'user': user,
            'history': [{'query': query, 'date': search_data}],
        }
        print("history item", history_item)
        history.insert_one(history_item)
        print("after insert")

"""
@app.route('/api/delete_history', methods=['POST'])
def delete_history():
    try:
        data = request.get_json()
        user = data.get('user')
        date = data.get('url')
        if(user == ''):
            return jsonify({'error': 'Invalid user'})
        
        print(data)
        
        history.update_one({'user': user}, {'$pull': {'history': {'date': date}}})
        return jsonify({'message': + 'item deleted successfully'})
        
    except Exception as e:
        print('Error', str(e))
        return jsonify({'message': 'Error processing the request'}), 500
"""

@app.route('/api/delete_history', methods=['POST'])
def delete_history():
    try:
        data = request.get_json()
        user = data.get('user')
        query = data.get('query')
        date = data.get('date')
        
        if not user:
            return jsonify({'error': 'Missing user'}), 400

        user_history = history.find_one({'user': user})

        if not user_history:
            print("User not found")
            return jsonify({'error': 'User not found'}), 404

        date = str(date)[:-5]
        date = str.replace(date, 'T',' ')

        for i, entry in enumerate(user_history['history']):
            ent_date = str(entry['date'])[:-7]

            if entry['query'] == query and ent_date == date:
                del user_history['history'][i]
                history.update_one({'user': user}, {'$set': {'history': user_history['history']}})
                print("History item deleted")
                return jsonify({'message': 'History item deleted'})
            
        print("History item not found")
        return jsonify({'error': 'History item not found'}), 404  
             
    except Exception as e:
        print('Error', str(e))
        return jsonify({'message': 'Error processing the request'}), 500


@app.route('/api/get_history/<string:user>', methods=['POST'])
def get_history(user):
    try:
        if(user == ''):
            return jsonify({'error': 'Invalid user'})
        user_history = history.find_one({'user': user})
        if user_history:
            return jsonify({'history': user_history['history']})
    except Exception as e:
        print('Error', str(e))
        return jsonify({'message': 'Error processing the request'}), 500
    
@app.route('/api/get_favourites/<string:user>', methods=['POST'])
def get_favourites(user):
    try:
        if(user == ''):
            return jsonify({'error': 'Invalid user'})
        user_favourites = favourites.find_one({'user': user})
        print(user_favourites)
        if user_favourites:
            return jsonify({'favourites': user_favourites['favourites']})
    except Exception as e:
        print('Error', str(e))
        return jsonify({'message': 'Error processing the request'}), 500
    

@app.route('/api/insert_favourite', methods=['POST'])
def insert_favourite():
    try:    
        data = request.get_json()
        user = data.get('user')
        url = data.get('url')
        source = data.get('source')
        authors = data.get('authors')
        title = data.get('title')
        print(data)
        
        if(user == ''):
            return jsonify({'error': 'Invalid user'})

        if(favourites.find_one({'user': user})):
            favourite_item = {
                'url': url,
                'source': source,
                'authors': authors,
                'title': title
            }
            favourites_list = favourites.find_one({'user': user})['favourites']
            favourites_list.append({favourite_item})
            favourites.update_one({'user': user}, {'$set':{'favourites': favourites_list}})
        else:
            favourites_item = {
                'user': user,
                'favourite': [{
                    'url': url,
                    'source': source,
                    'authors': authors,
                    'title': title
                    }],
            }
            favourites.insert_one(favourites_item)
        return jsonify({'message': 'Favorite added successfully'})
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message': 'Error processing the request'}), 500
    

@app.route('/delete_favourite', methods=['POST'])
def delete_favourite():
    try:
        data = request.get_json()
        user = data.get('user')
        url = data.get('url')
        if(user == ''):
            return jsonify({'error': 'Invalid user'})
        
        favourites.update_one({'user': user}, {'$pull': {'favourites': {'url': url}}})
        return jsonify({'message':'Favourite deleted successfully'})
        
    except Exception as e:
        print('Error', str(e))
        return jsonify({'message': 'Error processing the request'}), 500
    


    

@app.route('/api/text-api', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()
        text = data.get('text', '')
        user = data.get('username', '')
        result = scrape_both_sources(text, user)
        return jsonify({'message': 'Success', 'text': result})
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message': 'Error processing the request'}), 500

@app.route('/api/exportData', methods=['POST'])
def get_export():
    try:
        data = request.get_json()
        type = data.get('type', '')
        values = data.get('values', '')
        if type == "pdf":
            if not os.path.exists('server/exports/pdf'):
                os.makedirs('server/exports/pdf') 
            generate_pdf(values)
            file = "server\\exports\\pdf\\Selected_papers.pdf"
        elif type == "csv":
            if not os.path.exists('server/exports/csv'):
                os.makedirs('server/exports/csv')
            generate_csv(values)
            file = "server\\exports\\csv\\Selected_papers.csv"
        with open(file, 'rb') as file_content:
            response = app.response_class(
                response=file_content.read(),
                status=200,
                mimetype='application/pdf' if type == 'pdf' else 'text/csv',
                headers={'Content-Disposition': f'attachment;filename={file}'}
            )
            return response
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message' : 'Error processing the request'}), 500




if __name__ == '__main__':
    print(f'[MAIN] We here!')
    app.run(debug=True)