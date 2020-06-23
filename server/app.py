from flask import Flask, jsonify, request

import time
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

import parroquiaDB, userDB, eucaristiaDB, semanaDB
 
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

@app.route('/authUser', methods = ['POST'])
def autenticarUsuario():
    # Autenticacion con id y password
    NBData = request.get_json()
    return userDB.autenticarUsuario(NBData)

@app.route('/createUser', methods = ['POST'])
def crearUsuario():
    # Autenticacion con id y password
    NBData = request.get_json()
    return userDB.crearUsuario(NBData)

@app.route('/getHorarioParroquia', methods = ['POST'])
def getHorarioParroquia():
    # Get horario parroquia con nit
    NBData = request.get_json()
    return parroquiaDB.getHorarioParroquia(NBData)

@app.route('/crearInscripcion', methods = ['POST'])
def crearInscripcion():
    # Crear inscripcion en una misa de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.crearInscripcion(NBData)

@app.route('/getEucaristias', methods = ['POST'])
def getEucaristias():
    # Get eucaristias de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.getEucaristias(NBData)

@app.route('/getEucaristiasForUser', methods = ['POST'])
def getEucaristiasForUser():
    # Get eucaristias para un usuario especifico - sus reservas
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiasForUser(NBData)

@app.route('/getSemanas', methods = ['GET'])
def getSemanas():
    response = jsonify(semanaDB.getSemanas())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/deleteReserva', methods = ['PATCH'])
def deleteReserva():
    NBData = request.get_json()
    return eucaristiaDB.deleteReserva(NBData)

@app.route('/getEucaristiasPorDia', methods = ['POST'])
def getEucaristiasPorDia():
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiasPorDia(NBData)

@app.route('/getParroquiasWithIds', methods = ['POST'])
def getParroquiasWithIds():
    NBData = request.get_json()
    return parroquiaDB.getParroquiasWithIds(NBData)

@app.route('/postUserCovidForm', methods = ['POST'])
def postUserCovidForm():
    NBData = request.get_json()
    return eucaristiaDB.postUserCovidForm(NBData)

@app.route('/getSemana', methods = ['POST'])
def getSemana():
    NBData = request.get_json()
    return semanaDB.getSemana(NBData)

@app.route('/registrarIngreso', methods = ['POST'])
def registrarIngreso():
    NBData = request.get_json()
    return eucaristiaDB.registrarIngreso(NBData)

@app.route('/generarColabCode', methods = ['POST'])
def generarColabCode():
    NBData = request.get_json()
    return eucaristiaDB.generarColabCode(NBData)

@app.route('/getEucaristiaColaborador', methods = ['POST'])
def getEucaristiaColaborador():
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiaColaborador(NBData)

def check_reservas():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

def add_semana():
    semanaDB.addSemana()


scheduler = BackgroundScheduler()
scheduler.add_job(func=add_semana, trigger="interval", seconds=5)
#scheduler.add_job(func=check_reservas, trigger="interval", seconds=1800)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())
app.run()