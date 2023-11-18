from flask import Flask, request, jsonify, url_for, Blueprint
import os
#from api_models import db, User
#from apil.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


@api.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"message": "Bad username or password"}), 401

    access_token = creatr_access_token(identity=username)
    return jsonify(access_token=access_token)