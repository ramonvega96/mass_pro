from pymongo import MongoClient
import json
from datetime import datetime
import time
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
semanas = db.semanas

# get todas las semanas
def getSemanas():
    res = []
    cur = semanas.find({"$or":[{"status":"current"},{"status":"future"}]})
    
    for i in cur:
        del i["_id"]
        i["text"] = "hola"
        res.append(i)

    obj = {"semanas": res}
    
    return obj

# get semana with date
def getSemana(data):
    fecha = datetime(data.get("year"), data.get("month") + 1, data.get("day")).timestamp()

    week = semanas.find_one( {"$and":[ 
        { "initTs": { "$lte": fecha } }, 
        { "endTs": { "$gt": fecha } },
        {"$or":[ { "status": "current" }, { "status": "future" }]}
    ]})

    if week is not None:
        del week["_id"]
        return week
        
    return {"error": "Semana no encontrada"}

# add week
def addSemana():
    print("[" + datetime.today().strftime('%Y-%m-%d-%H:%M:%S') + "]: Health check addSemana.")
    current_week = semanas.find_one({"status": "current"})
    future_week = semanas.find_one({"status": "future"})

    if(current_week.get("endTs") < time.time()):

        fecha_init = datetime.fromtimestamp(future_week.get("endTs"))
        
        new_week = {
            "initTs": future_week.get("endTs"),
            "endTs": future_week.get("endTs") + 604800,
            "status": "future",
            "value": str(int(future_week.get("value")) + 1),
            "initDay": fecha_init.day,
            "initMonth": fecha_init.month,
            "initYear": fecha_init.year
        }


        semanas.update(
        {"status": "current"},
        {"$set": 
            {
                "status": "passed"
            }
        })
        
        semanas.update(
        {"status": "future"},
        {"$set": 
            {
                "status": "current"
            }
        })

        semanas.insert(new_week)
        print("[" + datetime.today().strftime('%Y-%m-%d-%H:%M:%S') + "]: New week added")
    
    

