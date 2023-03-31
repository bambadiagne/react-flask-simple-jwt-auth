from datetime import timedelta
import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from validator import verifyBody
import secrets
from sqlalchemy import Column, Integer, String, Boolean, select
from flask_jwt import jwt_required, JWT, current_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.debug = True
app.config['SECRET_KEY'] = os.getenv(
    'SECRET_KEY', 'c7df3154b325b13bde5424538873d9733836390788a31ec5')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=3000)
CORS(app)
db = SQLAlchemy(app)


class User(db.Model):
    id = Column(Integer, primary_key=True)
    pseudo = Column(String(100), nullable=False, unique=True)
    email = Column(String(80), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    token = Column(String(32), nullable=False, unique=True)
    emailChecked = Column(Boolean, nullable=False, default=False)

    def __repr__(self):
        return f'<User {self.pseudo}>'


def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()


def authenticate(username, password):
    user = db.session.scalars(
        select(User).where(User.pseudo == username)).all()
    print(user)
    if (user):
        if (check_password_hash(user[0].password, password)):
            return user[0]


jwt = JWT(app, authenticate, identity)


@app.route('/signup', methods=['POST'])
def signup():
    try:
        request_body = request.get_json(silent=True)
        check_body = verifyBody(
            request_body, [('pseudo', str), ('email', str), ('password', str)])
        if (check_body[0]):
            token = secrets.token_hex(16)
            check_if_user_exists = db.session.scalars(
                select(User).where(User.pseudo == request_body['pseudo']))
            if (check_if_user_exists.all()):
                return jsonify({'message': 'Pseudo deja pris', 'status': 'FAILED'})
            check_if_user_exists = db.session.scalars(
                select(User).where(User.email == request_body['email']))
            if (check_if_user_exists.all()):
                return jsonify({'message': 'Email deja pris', 'status': 'FAILED'})
            user = User(pseudo=request_body['pseudo'], email=request_body['email'],
                        password=generate_password_hash(request_body['password']), token=token)
            db.session.add(user)
            db.session.commit()
            return jsonify({'message': 'Utilisateur créé', 'status': 'SUCCESSFUL'})
        return jsonify({'message': check_body[1], 'status': 'FAILED'})
    except BaseException as e:
        print(e)
        return jsonify({'message': str(e), 'status': 'FAILED'})

# @app.route('/login', methods=['POST'])
# def login():
#     try:
#         request_body = request.get_json(silent=True)
#         check_body=verifyBody(request_body,[('email',str),('password',str)])
#         if(check_body[0]):
#             user=db.session.scalars(select(User).where(User.email == request_body['email'])).all()
#             if(user):
#                 if(check_password_hash(user[0].password,request_body['password'])):
#                     return jsonify({'message':'Connexion réussie','status':'SUCCESSFUL',})
#             return jsonify({'message':'Combinaison email+password incorrecte','status':'FAILED'})
#         return jsonify({'message':check_body[1],'status':'FAILED'})
#     except BaseException as e:
#         print(e)
#         return jsonify({'message':str(e),'status':'FAILED'})


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"message": "nice"})


if __name__ == '__main__':
    app.run()
