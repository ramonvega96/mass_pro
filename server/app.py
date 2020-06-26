from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from datetime import datetime
import os, time, atexit

import parroquiaDB, userDB, eucaristiaDB, semanaDB
 
app = Flask(__name__)

# configuration of mail 
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'noreply.massproject@gmail.com'
app.config['MAIL_DEFAULT_SENDER'] = 'noreply.massproject@gmail.com'
app.config['MAIL_PASSWORD'] = os.environ['EMAILPASSWORD']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app) 
 
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
     
@app.route('/forgotUserPassword', methods = ['POST'])
def forgotUserPassword():
    NBData = request.get_json()
    userInfo = userDB.recoverPassword(NBData)

    if userInfo.get("email") is None:
        return userInfo

    msg = Message('Mass Project: Tu password de usuario.', recipients = [userInfo.get("email")])    
    msg.html = """<div style="
            font-family:Trebuchet MS, Helvetica, sans-serif;
            color: white;
            border-radius: 15px 50px 30px;
            background: #89f0bc;
            padding: 20px;
            width: 70%;
            margin: 0 auto;">
                <h2>¡Hola! Tu contraseña es:</h2>
                <p style="text-align: center; font-size: 20px;">""" + userInfo.get("password") + """</p>
        </div>"""
    
    mail.send(msg)
    obj = {"email": userInfo.get("email")} 
    return obj

@app.route('/forgotParroquiaPassword', methods = ['POST'])
def forgotParroquiaPassword():  
    NBData = request.get_json()
    parroquiaInfo = parroquiaDB.recoverPassword(NBData)

    if parroquiaInfo.get("email") is None:
        return parroquiaInfo

    msg = Message('Mass Project: El password de tu Parroquia.', recipients = [parroquiaInfo.get("email")])    
    msg.html = """<div style="
        font-family:Trebuchet MS, Helvetica, sans-serif;
        color: white;
        border-radius: 15px 50px 30px;
        background: #b7e8e8;
        padding: 20px;
        width: 70%;
        margin: 0 auto;">
            <h2>¡Hola! La contraseña de la parroquia es:</h2>
            <p style="text-align: center; font-size: 20px;">""" + parroquiaInfo.get("password") + """</p>
    </div>"""
    
    mail.send(msg)
    obj = {"email": parroquiaInfo.get("email")} 
    return obj



# Background tastks

def add_semana():
    semanaDB.addSemana()

def disable_eucaristias():
    eucaristiaDB.disable_eucaristias()

scheduler = BackgroundScheduler()
scheduler.add_job(func=add_semana, trigger="interval", seconds=3600)
scheduler.add_job(func=disable_eucaristias, trigger="interval", seconds=900)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())