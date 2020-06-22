from pymongo import MongoClient
import json
import datetime

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

# get semana with date
def getSemana(data):
    fecha = datetime.datetime(data.get("year"), data.get("month") + 1, data.get("day")).timestamp()

    week = semanas.find_one( {"$and":[ 
        { "initTs": { "$lte": fecha } }, 
        { "endTs": { "$gte": fecha } }
        ]})

    if week is not None:
        del week["_id"]
        return week
        
    return {"error": "Semana no encontrada"}
    

