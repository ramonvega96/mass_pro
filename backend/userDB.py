from pymongo import MongoClient
import json
import os

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

