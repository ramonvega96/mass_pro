from pymongo import MongoClient
import json

# establecer conexion
conn = MongoClient('localhost', 27017)
conn = MongoClient()

# crear db
db = conn.baseDeDatos

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