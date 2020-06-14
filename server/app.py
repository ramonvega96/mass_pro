from flask import Flask, jsonify
from flask import request
import parroquiaDB 
 
app = Flask(__name__)
 
 
@app.route("/parroquias", methods = ['GET'])
def getParroquias():
    response = jsonify(parroquiaDB.getParroquias())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
 
@app.route('/crearParroquia', methods = ['POST'])
def crearParroquia():
    # Insertar parroquia en la DB
    NBData = request.get_json()
    response = jsonify(parroquiaDB.crearParroquia(NBData))
    return response

@app.route('/editarParroquia', methods = ['PATCH'])
def editarParroquia():
    # Editar parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.editarParroquia(NBData)

@app.route('/crearHorarioParroquia', methods = ['POST'])
def crearHorarioParroquia():
    # Insertar horario parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.crearHorarioParroquia(NBData)

@app.route('/editarHorarioParroquia', methods = ['PATCH'])
def editarHorarioParroquia():
    # Insertar horario parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.editarHorarioParroquia(NBData)

@app.route('/auth', methods = ['POST'])
def autenticarParroquia():
    # Autenticacion con nit y password
    NBData = request.get_json()
    return parroquiaDB.autenticarParroquia(NBData)

app.run()