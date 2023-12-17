from datetime import datetime
import os
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


@app.route('/')
def index():
    print(f'[INDEX] We here!')
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    print(f'[SEARCH] We here!')
    query = request.form.get('query')
    results = scrape_google_scholar(query, '')
    return render_template('search.html', results=results)

def scrape_google_scholar(query, user):
    insert_history(query, user)
    
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
            except TypeError:
                urlPage = None
            
            results.append({
                'title': title, 
                'authors': authors,
                'url': urlPage,
            })

        print(f'[SCRAPE] Found a total of {len(results)} results. Now on page {page + 1}')

        time.sleep(random.randrange(1, 3))
        page += 1
            
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


@app.route('/api/text-api', methods=['POST'])
def receive_data():
    try:
       data = request.get_json()
       text = data.get('text', '')
       user = data.get('username', '')
       result = scrape_google_scholar(text, user)
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