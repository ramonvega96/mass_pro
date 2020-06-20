from pymongo import MongoClient
import json

# establecer conexion
conn = MongoClient('localhost', 27017)
conn = MongoClient()

# crear db
db = conn.baseDeDatos

# crear colecciones
semanas = db.semanas

# get todas las semanas
def getSemanas():
    res = []
    cur = semanas.find({})
    
    for i in cur:
        del i["_id"]
        res.append(i)

    obj = {"semanas": res}
    
    return obj