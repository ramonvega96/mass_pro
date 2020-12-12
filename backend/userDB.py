from pymongo import MongoClient
import json
import os

import eucaristiaDB

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
usuarios = db.usuarios
eucaristias_db = db.eucaristias

def autenticarUsuario(user):
    userId = user.get("id")
    password = user.get("password")
    
    usuario = usuarios.find_one( { "id": userId } )

    if usuario is None:
        resp = {
            "error": "No existe un usuario con esta identificación."
        }
        return resp
    
    if usuario.get("password") != password:
        resp = {
            "error": "Password incorrecto."
        }
        return resp

    idsList = usuario.get("reservas")
    active_reservas = eucaristias_db.find( { "id": { "$in": idsList }, "available": True } , {"id": 1, "_id":0})
    
    idsList = []
    for i in active_reservas:
        idsList.append(i.get("id"))

    usuarios.update(
        {"id": userId},
        {"$set": 
            {
                "reservas": idsList
            }
        }
    )

    del usuario["_id"]
    del usuario["password"]
    return usuario

def crearUsuario(user):
    userId = user.get("id")

    if usuarios.find( { "id": userId } ).count() > 0:
        resp = {
            "error": "Ya existe un usuario con esta identificación."
        }
        return resp
    
    usuarios.insert(user)
    del user["_id"]
    del user["password"]
    return user

def recoverPassword(data):
    userId = data.get("userId")
    usuario = usuarios.find_one( { "id": userId } )

    if usuario is None:
        resp = {
            "error": "No existe un usuario con esta identificación."
        }
        return resp

    res = {
        "password": usuario.get("password"),
        "email": usuario.get("email")
    }

    return res

def deleteUsuario(data):
    userId = data.get("userId")
    usuario = usuarios.find_one( { "id": userId } )

    if len(usuario["reservas"]) > 0:
        usuario = autenticarUsuario({ "id": userId, "password": usuario["password"] })

    if len(usuario["reservas"]) > 0:
        reservas = usuario["reservas"]
        for i in reservas:
            eucaristiaDB.deleteReserva({ "usuario": userId, "eucaristia": i })

    usuarios.remove( { "id": userId } )
