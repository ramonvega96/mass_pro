from pymongo import MongoClient
import json
import os
import time

# establecer conexion
conn = MongoClient(
    os.environ['MONGODB_HOST'], 
    username=os.environ['MONGODB_USERNAME'], 
    password=os.environ['MONGODB_PASSWORD'],
    authSource='webapp',
    authMechanism='SCRAM-SHA-1')

# crear db
db = conn.webapp

# crear colecciones
parroquias = db.parroquias
horarios = db.horarios

# insertar parroquia
def crearParroquia(parroquia):
    nit = parroquia.get("nit")

    if parroquias.find( { "nit": nit } ).count() > 0:
        resp = {
            "error": "Una parroquia con este NIT ya existe en el sistema"
        }
        return resp
    
    parroquia["available"] = False
    parroquia["fechaInscripcion"] = int(time.time())
    parroquias.insert(parroquia)
    
    del parroquia["_id"]
    return parroquia

# editar parroquia
def editarParroquia(newParroquia):
    nit = newParroquia.get("nit")

    parroquias.update(
        {"nit": nit},
        {"$set": 
            {
                "nombre": newParroquia.get("newNombre"),
                "diocesis": newParroquia.get("newDiocesis"),
                "ubicacion": newParroquia.get("newUbicacion"),
                "parroco": newParroquia.get("newParroco"),
                "capacidad": newParroquia.get("newCapacidad"),
                "password": newParroquia.get("newPassword"),
                "direccion": newParroquia.get("newDireccion"),
                "telefono": newParroquia.get("newTelefono"),
                "autoEvalCovid": newParroquia.get("newAutoEvalCovid")
            }
        }
    )

    return newParroquia

# insertar horario parroquia
def crearHorarioParroquia(horario):
    nit = horario.get("nit")

    if horarios.find( { "nit": nit } ).count() > 0:
        resp = {
            "error": "Esta parroquia ya tiene sus horarios programados."
        }
        return resp
    
    resp = {
        "nit": nit,
        "horario": horario.get("horario")
    }
    
    horarios.insert(resp)
    del resp["_id"]
    return resp

# editar horario parroquia
def editarHorarioParroquia(newHorario):
    nit = newHorario.get("nit")
    horario = horarios.find_one( { "nit": nit } )

    horarios.update(
        {"nit": nit},
        {"$set": 
            {
                "horario.lunAm": newHorario.get("horario").get("lunAm"),
                "horario.marAm": newHorario.get("horario").get("marAm"),
                "horario.mieAm": newHorario.get("horario").get("mieAm"),
                "horario.jueAm": newHorario.get("horario").get("jueAm"),
                "horario.vieAm": newHorario.get("horario").get("vieAm"),
                "horario.sabAm": newHorario.get("horario").get("sabAm"),
                "horario.domAm": newHorario.get("horario").get("domAm"),
                "horario.lunPm": newHorario.get("horario").get("lunPm"),
                "horario.marPm": newHorario.get("horario").get("marPm"),
                "horario.miePm": newHorario.get("horario").get("miePm"),
                "horario.juePm": newHorario.get("horario").get("juePm"),
                "horario.viePm": newHorario.get("horario").get("viePm"),
                "horario.sabPm": newHorario.get("horario").get("sabPm"),
                "horario.domPm": newHorario.get("horario").get("domPm")
            }
        }
    )

    return newHorario

# get todas las parroquias
def getParroquias(avail=True):
    res = []
    cur = parroquias.find({ "available": avail })
    
    for i in cur:
        del i["_id"]
        del i["password"]
        res.append(i)

    obj = {
        "parroquias": res
    }
    
    return obj

def autenticarParroquia(data):
    nit = data.get("nit")
    password = data.get("password")
    
    parroquia = parroquias.find_one( { "nit": nit } )

    if parroquia is None:
        resp = {
            "error": "No existe una parroquia con este NIT en el sistema."
        }
        return resp
    
    if parroquia.get("password") != password:
        resp = {
            "error": "Password incorrecto."
        }
        return resp

    if parroquia.get("available") != True:
        resp = {
            "error": "La parroquia aún no ha sido verificada. Recibirás un correo una vez termine este proceso."
        }
        return resp

    horario = horarios.find_one( { "nit": nit } )
    
    del parroquia["_id"]
    del horario["_id"]

    obj = {
        "parroquia" : parroquia,
        "horario" : horario
    }

    return obj

def getHorarioParroquia(data):
    horario = horarios.find_one( { "nit": data } )
    del horario["_id"]
    return horario

def getParroquiasWithIds(ids):
    parroquiasList = []
    
    for i in ids:
        parroquia = parroquias.find_one( { "nit": i } )
        del parroquia["_id"]
        parroquiasList.append(parroquia)
    
    obj = {
        "parroquias": parroquiasList
    }
    
    return obj

def recoverPassword(data):
    nit = data.get("nit")
    parroquia = parroquias.find_one( { "nit": nit } )

    if parroquia is None:
        resp = {
            "error": "No existe una parroquia con esta identificación."
        }
        return resp

    res = {
        "password": parroquia.get("password"),
        "email": parroquia.get("email")
    }

    return res

def enableParroquia(data):
    nit = data.get("nit")
    enable = data.get("enable")
    reason = data.get("reason")

    parroquia = parroquias.find_one( { "nit": nit } )

    msg = ""

    if enable:
        parroquias.update(
            {"nit": nit},
            {"$set": 
                {
                    "available": enable
                }
            }
        )
        msg = "La inscripción de la parroquia se realizó con éxito. Ya se encuentra disponible dentro de nuestra plataforma"
    
    else:
        parroquias.delete_one({"nit": nit})
        horarios.delete_one({"nit": nit})
        msg = "Error en la inscripción. Motivo: " + reason

    res = {
        "enabled": enable,
        "msg": msg,
        "email": parroquia.get("email")
    }

    return res
