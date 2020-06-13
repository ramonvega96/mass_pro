from pymongo import MongoClient
import json

# establecer conexion
conn = MongoClient('localhost', 27017)
conn = MongoClient()

# crear db
db = conn.baseDeDatos

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
    
    parroquias.insert(parroquia)
    del parroquia["_id"]
    return parroquia

# editar parroquia
def editarParroquia(newParroquia):
    nit = newParroquia.get("nit")
    password = newParroquia.get("password")

    parroquia = parroquias.find_one( { "nit": nit } )
    
    if parroquia is None:
        return "ERROR: No existe una parroquia con este NIT en el sistema. NIT: " + nit
    
    if parroquia.get("password") != password:
        return "ERROR: Password incorrecto."

    parroquias.update(
        {"nit": nit},
        {"$set": 
            {
                "nombre": newParroquia.get("newNombre") if newParroquia.get("newNombre") else parroquia.get("nombre"),
                "parroco": newParroquia.get("newParroco") if newParroquia.get("newParroco") else parroquia.get("parroco"),
                "capacidad": newParroquia.get("newCapacidad") if newParroquia.get("newCapacidad") else parroquia.get("capacidad"),
                "password": newParroquia.get("newPassword") if newParroquia.get("newPassword") else parroquia.get("password"),
                "direccion": newParroquia.get("newDireccion") if newParroquia.get("newDireccion") else parroquia.get("direccion"),
                "telefono": newParroquia.get("newTelefono") if newParroquia.get("newTelefono") else parroquia.get("telefono")
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
    nit = newHorario.get("nitParroquia")
    password = newHorario.get("passwordParroquia")

    parroquia = parroquias.find_one( { "nit": nit } )
    horario = horarios.find_one( { "nit": nit } )
    
    if parroquia is None:
        return "ERROR: No existe una parroquia con este NIT en el sistema. NIT: " + nit

    if horario is None:
        return "ERROR: Aun no se ha definido un horario para esta parroquia."
    
    if parroquia.get("password") != password:
        return "ERROR: Password incorrecto."

    horarios.update(
        {"nit": nit},
        {"$set": 
            {
                "horario.lun": newHorario.get("horario").get("lun") if newHorario.get("horario").get("lun") else horario.get("horario").get("lun"),
                "horario.mar": newHorario.get("horario").get("mar") if newHorario.get("horario").get("mar") else horario.get("horario").get("mar"),
                "horario.mie": newHorario.get("horario").get("mie") if newHorario.get("horario").get("mie") else horario.get("horario").get("mie"),
                "horario.jue": newHorario.get("horario").get("jue") if newHorario.get("horario").get("jue") else horario.get("horario").get("jue"),
                "horario.vie": newHorario.get("horario").get("vie") if newHorario.get("horario").get("vie") else horario.get("horario").get("vie"),
                "horario.sab": newHorario.get("horario").get("sab") if newHorario.get("horario").get("sab") else horario.get("horario").get("sab"),
                "horario.dom": newHorario.get("horario").get("dom") if newHorario.get("horario").get("dom") else horario.get("horario").get("dom"),
            }
        }
    )

    return newHorario

# get todas las parroquias
def getParroquias():
    res = []
    cur = parroquias.find({})
    
    for i in cur:
        del i["_id"]
        res.append(i)

    obj = {
        "parroquias": res
    }
    
    return obj