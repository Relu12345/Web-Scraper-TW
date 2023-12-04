from datetime import datetime
import os
import bcrypt
from dotenv import load_dotenv
from flask import Flask, request, render_template, session, jsonify, send_file
from bs4 import BeautifulSoup
from flask_pymongo import PyMongo
import requests, time, random
#from api.routes import api 
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from json_to_pdf import generate_pdf
from json_to_csv import generate_csv

app = Flask(__name__, static_folder='static')
#CORS disabled to be able to access the backend from the react frontend
CORS(app)
mongo = PyMongo(app)
bcyrypt = bcrypt(app)
jwt = JWTManager(app)

load_dotenv()
connection_string: str = os.environ.get('CONNECTION_STRING')

#Get the secret key from the .env file
app.config["JWT_SECRET_KEY"] = os.environ.get('FLASK_JWT')
app.config['MONGO_DBNAME'] = 'proiect'
app.config["MONGO_URI"] = connection_string

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
}

session = requests.Session()

@app.route("/users/register",methods=['POST'])
def register():
	users = mongo.db.users
	first_name = request.get_json()['first_name']
	last_name = request.get_json()['last_name']
	user_name = request.get_json()['user_name']
	email = request.get_json()['email']
	password = bcyrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
	created = datetime.utcnow()

	user_id = users.insert({
		'first_name': first_name,
		'last_name': last_name,
		'user_name': user_name,
		'email': email,
		'password': password,
		'created': created,
		})

	new_user = users.find_one({'_id': user_id})

	result = {'email': new_user['email']+' registered'}

	return jsonify({'result':result})

@app.route("/users/register",methods=['GET'])
def get_users():
	users = mongo.db.users

	result = []

	for field in users.find():
		result.append({'_id':str(field['_id']), 'user_name':str(field['user_name']),'email':str(field['email']),'password':str(field['password'])})

	return jsonify(result)




@app.route("/users/login",methods=['POST'])
def login():
	users = mongo.db.users
	email = request.get_json()['email']
	password = request.get_json()['password']
	result = ""

	response = users.find_one({'email':email})

	if response:
		if bcyrypt.check_password_hash(response['password'], password):
			access_token = create_access_token(identity = {
				'first_name': response['first_name'],
				'last_name': response['last_name'],
				'email': response['email']
				})

			result = jsonify({"token": access_token})

		else:
			result = jsonify({"error": "Invalid Username or Password"})

	else:
		result = jsonify({"result": "No result found"})

	return result

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
       return jsonify({'message' : 'Success', 'text' : result})
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message' : 'Error processing the request'}), 500

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
        return send_file(file)
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'message' : 'Error processing the request'}), 500


if __name__ == '__main__':
    print(f'[MAIN] We here!')
    app.run(debug=True)