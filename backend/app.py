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
 
@app.route("/api/parroquias", methods = ['GET'])
def getParroquias():
    response = jsonify(parroquiaDB.getParroquias())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/unavailParroquias", methods = ['GET'])
def unavailParroquias():
    response = jsonify(parroquiaDB.getParroquias(avail=False))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
 
@app.route('/api/crearParroquia', methods = ['POST'])
def crearParroquia():
    # Insertar parroquia en la DB
    NBData = request.get_json()
    response = parroquiaDB.crearParroquia(NBData)

    if response.get("nombre") is not None:
        
        msg = Message('Protocol Meet: Verificar Parroquia', recipients = ["csalazar@coquizables.com"])    
        msg.html = """<div style="
                font-family:Trebuchet MS, Helvetica, sans-serif;
                color: white;
                border-radius: 15px 50px 30px;
                background: #ded759;
                padding: 20px;
                width: 70%;
                margin: 0 auto;">
                    <h2>¡Hola! Se registró una nueva parroquia:</h2>
                    <p style="text-align: center; font-size: 20px;">""" + response.get("nombre") + """</p>
            </div>"""
        
        mail.send(msg)

    return response

@app.route('/api/editarParroquia', methods = ['PATCH'])
def editarParroquia():
    # Editar parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.editarParroquia(NBData)

@app.route('/api/crearHorarioParroquia', methods = ['POST'])
def crearHorarioParroquia():
    # Insertar horario parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.crearHorarioParroquia(NBData)

@app.route('/api/editarHorarioParroquia', methods = ['PATCH'])
def editarHorarioParroquia():
    # Insertar horario parroquia en la DB
    NBData = request.get_json()
    return parroquiaDB.editarHorarioParroquia(NBData)

@app.route('/api/auth', methods = ['POST'])
def autenticarParroquia():
    # Autenticacion con nit y password
    NBData = request.get_json()
    return parroquiaDB.autenticarParroquia(NBData)

@app.route('/api/authUser', methods = ['POST'])
def autenticarUsuario():
    # Autenticacion con id y password
    NBData = request.get_json()
    return userDB.autenticarUsuario(NBData)

@app.route('/api/createUser', methods = ['POST'])
def crearUsuario():
    # Autenticacion con id y password
    NBData = request.get_json()
    return userDB.crearUsuario(NBData)

@app.route('/api/getHorarioParroquia', methods = ['POST'])
def getHorarioParroquia():
    # Get horario parroquia con nit
    NBData = request.get_json()
    return parroquiaDB.getHorarioParroquia(NBData)

@app.route('/api/crearInscripcion', methods = ['POST'])
def crearInscripcion():
    # Crear inscripcion en una misa de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.crearInscripcion(NBData)

@app.route('/api/createEucaristiaParticular', methods = ['POST'])
def createEucaristiaParticular():
    # Crear inscripcion en una misa de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.createEucaristiaParticular(NBData)

@app.route('/api/buscarEucaristiaParticular', methods = ['POST'])
def buscarEucaristiaParticular():
    # Crear inscripcion en una misa de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.buscarEucaristiaParticular(NBData)

@app.route('/api/getEucaristiaParticular', methods = ['POST'])
def getEucaristiaParticular():
    # Crear inscripcion en una misa de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiaParticular(NBData)

@app.route('/api/getEucaristias', methods = ['POST'])
def getEucaristias():
    # Get eucaristias de una parroquia
    NBData = request.get_json()
    return eucaristiaDB.getEucaristias(NBData)

@app.route('/api/getEucaristiasForUser', methods = ['POST'])
def getEucaristiasForUser():
    # Get eucaristias para un usuario especifico - sus reservas
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiasForUser(NBData)

@app.route('/api/getSemanas', methods = ['GET'])
def getSemanas():
    response = jsonify(semanaDB.getSemanas())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/deleteReserva', methods = ['PATCH'])
def deleteReserva():
    NBData = request.get_json()
    return eucaristiaDB.deleteReserva(NBData)

@app.route('/api/getEucaristiasPorDia', methods = ['POST'])
def getEucaristiasPorDia():
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiasPorDia(NBData)

@app.route('/api/getParroquiasWithIds', methods = ['POST'])
def getParroquiasWithIds():
    NBData = request.get_json()
    return parroquiaDB.getParroquiasWithIds(NBData)

@app.route('/api/postUserCovidForm', methods = ['POST'])
def postUserCovidForm():
    NBData = request.get_json()
    return eucaristiaDB.postUserCovidForm(NBData)

@app.route('/api/getSemana', methods = ['POST'])
def getSemana():
    NBData = request.get_json()
    return semanaDB.getSemana(NBData)

@app.route('/api/registrarIngreso', methods = ['POST'])
def registrarIngreso():
    NBData = request.get_json()
    return eucaristiaDB.registrarIngreso(NBData)

@app.route('/api/generarColabCode', methods = ['POST'])
def generarColabCode():
    NBData = request.get_json()
    return eucaristiaDB.generarColabCode(NBData)

@app.route('/api/getEucaristiaColaborador', methods = ['POST'])
def getEucaristiaColaborador():
    NBData = request.get_json()
    return eucaristiaDB.getEucaristiaColaborador(NBData)
     
@app.route('/api/forgotUserPassword', methods = ['POST'])
def forgotUserPassword():
    NBData = request.get_json()
    userInfo = userDB.recoverPassword(NBData)

    if userInfo.get("email") is None:
        return userInfo

    msg = Message('Protocol Meet: Tu password de usuario.', recipients = [userInfo.get("email")])    
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

    try:
        mail.send(msg)
    except:
        userDB.deleteUsuario(NBData)        
        return {
            "error": "Tu usuario fue ELIMINADO: Proporcionaste un correo inválido al inscribirte. Por favor crear tu usuario nuevamente con un correo válido."
        }    
    
    obj = {"email": userInfo.get("email")} 
    return obj

@app.route('/api/forgotParroquiaPassword', methods = ['POST'])
def forgotParroquiaPassword():  
    NBData = request.get_json()
    parroquiaInfo = parroquiaDB.recoverPassword(NBData)

    if parroquiaInfo.get("email") is None:
        return parroquiaInfo

    msg = Message('Protocol Meet: El password de tu Parroquia.', recipients = [parroquiaInfo.get("email")])    
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

    try:
        mail.send(msg)
    except:
        return {
            "error": "El correo que proporcionaste al inscribirte, no es un correo válido. Ponte en contacto con nosotros."
        } 

    obj = {"email": parroquiaInfo.get("email")} 
    return obj

@app.route('/api/enableParroquia', methods = ['POST'])
def enableParroquia():  
    NBData = request.get_json()
    ans = parroquiaDB.enableParroquia(NBData)
    color = """#80ed72; """ if ans.get("enabled") else """#e36666; """

    msg = Message('Protocol Meet: Inscripción Parroquia.', recipients = [ans.get("email")])    
    msg.html = """<div style="
        font-family:Trebuchet MS, Helvetica, sans-serif;
        color: white;
        border-radius: 15px 50px 30px;
        background:""" + color + """padding: 20px;
        width: 70%;
        margin: 0 auto;">
            <h2>¡Hola! Resultado inscripción Parroquia:</h2>
            <p style="text-align: center; font-size: 20px; color: white;">""" + ans.get("msg") + """</p>
    </div>"""
    
    try:
        mail.send(msg)
    except:
        return {
            "error": "El correo de la parroquia, no es un correo válido."
        }

    obj = {"email": ans.get("email")} 
    return obj

# Background tastks

def add_semana():
    semanaDB.addSemana()

def disable_eucaristias():
    eucaristiaDB.disable_eucaristias()

scheduler = BackgroundScheduler()
scheduler.add_job(func=add_semana, trigger="interval", seconds=3600)
scheduler.add_job(func=disable_eucaristias, trigger="interval", seconds=600)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(debug=True, port=5000)