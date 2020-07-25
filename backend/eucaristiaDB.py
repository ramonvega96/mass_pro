from pymongo import MongoClient
import json
from datetime import datetime
import time
import random
import math
import os
import semanaDB
import pytz

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
eucaristias_db = db.eucaristias
parroquias = db.parroquias
usuarios = db.usuarios
semanas = db.semanas
horarios_db = db.horarios

horarios = [
      {
        'key': '600',
        'text': '06:00 a.m'
      },
      {
        'key': '630',
        'text': '06:30 a.m'
      },
      {
        'key': '700',
        'text': '07:00 a.m'
      },
      {
        'key': '730',
        'text': '07:30 a.m'
      },
      {
          'key': '800',
          'text': '08:00 a.m'
      },
      {
        'key': '830',
        'text': '08:30 a.m'
      },
      {
          'key': '900',
          'text': '09:00 a.m'
      },
      {
        'key': '930',
        'text': '09:30 a.m'
      },
      {
          'key': '1000',
          'text': '10:00 a.m'
      },
      {
        'key': '1030',
        'text': '10:30 a.m'
      },
      {
          'key': '1100',
          'text': '11:00 a.m'
      },
      {
        'key': '1130',
        'text': '11:30 a.m'
      },
      {
        'key': '1200',
        'text': '12:00 p.m'
      },
      {
        'key': '1200',
        'text': '12:30 p.m'
      },
      {
        'key': '1300',
        'text': '01:00 p.m'
      },
      {
        'key': '1330',
        'text': '01:30 p.m'
      },
      {
          'key': '1400',
          'text': '02:00 p.m'
      },
      {
        'key': '1430',
        'text': '02:30 p.m'
      },
      {
          'key': '1500',
          'text': '03:00 p.m'
      },
      {
        'key': '1530',
        'text': '03:30 p.m'
      },
      {
          'key': '1600',
          'text': '04:00 p.m'
      },
      {
        'key': '1630',
        'text': '04:30 p.m'
      },
      {
          'key': '1700',
          'text': '05:00 p.m'
      },
      {
        'key': '1730',
        'text': '05:30 p.m'
      },
      {
          'key': '1800',
          'text': '06:00 p.m'
      },
      {
        'key': '1830',
        'text': '06:30 p.m'
      },
      {
        'key': '1900',
        'text': '07:00 p.m'
      },
      {
        'key': '1930',
        'text': '07:30 p.m'
      }
    ]

dias = [
        {
          'text': 'Domingo',
          'key': 'dom',
          'value': 0
        },
        {
          'text': 'Lunes',
          'key': 'lun',
          'value': 1
        },
        {
          'text': 'Martes',
          'key': 'mar',
          'value': 2
        },
        {
          'text': 'Miércoles',
          'key': 'mie',
          'value': 3
        },
        {
          'text': 'Jueves',
          'key': 'jue',
          'value': 4
        },
        {
          'text': 'Viernes',
          'key': 'vie',
          'value': 5
        },
        {
          'text': 'Sábado',
          'key': 'sab',
          'value': 6
        }
    ]

def crearInscripcion(data):
    eucaristias = data.get("eucaristias")
    usuario = data.get("user")

    for i in eucaristias:
        eucaristia = eucaristias_db.find_one( { "id": i } )
        if eucaristia is not None:
            asistentes = eucaristia.get("asistentes")
            existe = any(x.get("id") == usuario.get("id") for x in asistentes)
            if existe:
                resp = {
                    "error": "Ya reservaste un cupo en alguno de los horarios escogidos",
                    "horario": i
                }
                return resp
    
    for i in eucaristias:
        eucaristia = eucaristias_db.find_one( { "id": i } )
        
        if eucaristia is None:
            asistentes = []
            asistentes.append(usuario)
            parroquia = parroquias.find_one( { "nit": i.split(":")[-1] } )
            semana = semanas.find_one( { "value": i.split(":")[2] } )

            anio = int(semana.get("initYear"))
            mes = int(semana.get("initMonth"))
            dia = int(semana.get("initDay") + next((x.get('value') for x in dias if x.get('key') == i.split(":")[1]), None))

            full_date = 0
            
            try:
              full_date = datetime(anio, mes, dia)

            except:
              dias_restados = 1  
              while full_date == 0:
                
                try:
                  full_date = datetime(anio, mes, dia - dias_restados)
                  try:
                    full_date = datetime(anio, mes + 1, dias_restados)
                  except:
                    full_date = datetime(anio + 1, 1, dias_restados)
                
                except:
                  full_date = 0
                  dias_restados += 1
            
            obj = {
                "id": i,
                "asistentes": asistentes,
                "hora": next((x.get('text') for x in horarios if x.get('key') == i.split(":")[0]), None),
                "dia": full_date.day,
                "mes": full_date.month - 1,
                "year": full_date.year,
                "cupos": int(parroquia.get("capacidad")) - 1,
                "available": True
            }
            
            eucaristias_db.insert(obj)
        
        else:
            cupos = eucaristia.get("cupos")
            asistentes = eucaristia.get("asistentes")
            asistentes.append(usuario)
            
            eucaristias_db.update(
                {"id": i},
                {"$set": 
                    {
                        "asistentes": asistentes,
                        "cupos": cupos - 1
                    }
                }
            )

        reservas = usuarios.find_one( { "id": usuario.get("id") } ).get("reservas")
        reservas.append(i)
        usuarios.update(
            {"id": usuario.get("id")},
            {"$set": 
                {
                    "reservas": reservas
                }
            }
        )
        
    return data

def createEucaristiaParticular(data):
  week = semanaDB.getSemana({"year": data.get("year"), "month": data.get("mes"), "day": data.get("dia")})

  if week.get("error"):
    return {"error": "Únicamente se puede programar Eucaristias particulares para la semana en curso y la siguiente."}
  
  hour = math.floor(int(data.get("hora"))/100)
  minute = 30 if data.get("hora").endswith("30") else 0
  
  py_date = datetime(data.get("year"), data.get("mes") + 1, data.get("dia"), hour, minute)  
  
  horario = horarios_db.find_one({ "nit": data.get("nit") })

  day = py_date.weekday()
  day = day + 1 if day < 6 else 0
  day = next((x.get('key') for x in dias if x.get('value') == day), None)

  horas = horario.get("horario").get(day + "Am") + horario.get("horario").get(day + "Pm")
  
  if(data.get("hora") in horas):
    return {"error": "El horario seleccionado ya existe dentro de los horarios habituales de Eucaristia."}

  eucaristiaId = data.get("hora") + ":" + day + ":" + week.get("value") + ":" + data.get("nit")
  
  eucaristia = eucaristias_db.find_one( { "id": eucaristiaId } )
  
  if eucaristia is not None:
    return {"error": "En el horario seleccionado ya hay una Eucaristia programada."}

  parroquia = parroquias.find_one( { "nit": data.get("nit") } )
  partiCode = generarPartiCode(eucaristiaId)

  if partiCode == 0:
    return {"error": "Error creando la Eucaristia. Por favor, vuelva a intentarlo."}
  
  obj = {
      "id": eucaristiaId,
      "asistentes": [],
      "hora": next((x.get('text') for x in horarios if x.get('key') == data.get("hora")), None),
      "dia": py_date.day,
      "mes": py_date.month - 1,
      "year": py_date.year,
      "cupos": data.get("capacidad"),
      "available": True,
      "motivo": data.get("motivo"),
      "partiCode": partiCode
  }
  
  eucaristias_db.insert(obj)
  del obj["_id"]
  return obj

def buscarEucaristiaParticular(data):
  week = semanaDB.getSemana({"year": data.get("year"), "month": data.get("mes"), "day": data.get("dia")})

  if week.get("error"):
    return {"error": "Únicamente hay programadas Eucaristias particulares para la semana en curso y la siguiente."}

  horario = horarios_db.find_one({ "nit": data.get("nit") })

  
  py_date = datetime(data.get("year"), data.get("mes") + 1, data.get("dia"))
  day = py_date.weekday()
  day = day + 1 if day < 6 else 0
  day = next((x.get('key') for x in dias if x.get('value') == day), None)

  horas = horario.get("horario").get(day + "Am") + horario.get("horario").get(day + "Pm")
  
  if(data.get("hora") in horas):
    return {"error": "El horario seleccionado es un horario habitual y no uno particular."}

  eucaristiaId = data.get("hora") + ":" + day + ":" + week.get("value") + ":" + data.get("nit")
  
  eucaristia = eucaristias_db.find_one( { "id": eucaristiaId } )
  
  if eucaristia is None:
    return {"error": "No existe ninguna Eucaristia particular programada en este horario."}

  del eucaristia["_id"]
  return eucaristia

def getEucaristiaParticular(data):
  partiCode = int(data.get("partiCode"))  
  eucaristia = eucaristias_db.find_one( { "partiCode": partiCode, "available": True } )
  
  if eucaristia is None:
    return {"error": "No existe ninguna Eucaristia particular con este código."}

  del eucaristia["_id"]
  return eucaristia

def getEucaristias(data):
    regexExp = data.get("id") + "$"
    eucaristias = eucaristias_db.find( { "id": { "$regex": regexExp } } )

    lista = []
    for i in eucaristias:
        del i["_id"]
        del i["asistentes"]
        lista.append(i)

    resp = {"eucaristias": lista}
    return resp

def getEucaristiasForUser(data):
  idsList = data.get("reservas")
  userId = data.get("id")
  reservas = []  
  
  reservas_new = eucaristias_db.find( { "id": { "$in": idsList }, "available": True } )
  
  for i in reservas_new:
    asistentes = i.get("asistentes")

    for j in asistentes:
        if j.get("covidForm") is not None and j.get("id") == userId:
            i["covidForm"] = j.get("covidForm")
            break
    
    del i["asistentes"]
    del i["_id"]
    del i["cupos"]
    reservas.append(i)

  obj = {"reservas": reservas}
  return obj

def deleteReserva(data):
  userId = data.get("usuario")
  eucaristiaId = data.get("eucaristia")

  reservas = usuarios.find_one( { "id": userId } ).get("reservas")
  reservas.remove(eucaristiaId)
  usuarios.update(
            {"id": userId},
            {"$set": 
                {
                    "reservas": reservas
                }
            }
        )
  
  eucaristia = eucaristias_db.find_one( { "id": eucaristiaId } )
  asistentes = eucaristia.get("asistentes")
  asistentes = [i for i in asistentes if i.get("id") != userId]
  cupos = eucaristia.get("cupos") + 1
  eucaristias_db.update(
          {"id": eucaristiaId},
          {"$set": 
              {
                  "asistentes": asistentes,
                  "cupos": cupos
              }
          }
      )

  return data

def getEucaristiasPorDia(data):
  regexExp = data.get("id") + "$"  
  eucaristias = eucaristias_db.find( { "dia": data.get("dia"), "mes": data.get("mes"), "year": data.get("year"), "id": { "$regex": regexExp } } )

  lista = []
  for i in eucaristias:
      del i["_id"]
      del i["dia"]
      del i["mes"]
      del i["year"]

      if len(i.get("asistentes")) > 0:
        i.get("asistentes").sort(key=lambda x: x.get("nombre"))
        lista.append(i)

  resp = {"eucaristias": lista}
  return resp

def postUserCovidForm(data):
    userId = data.get("userId")
    eucaristiaId = data.get("reservaId")

    eucaristia = eucaristias_db.find_one( { "id": eucaristiaId } )
    asistentes = eucaristia.get("asistentes")

    for i in asistentes:
        if i.get("id") == userId:
            i["covidForm"] = data.get("covidForm")

    eucaristias_db.update(
          {"id": eucaristiaId},
          {"$set": 
              {
                  "asistentes": asistentes
              }
          }
      )

    del eucaristia["_id"]
    return eucaristia

def registrarIngreso(data):
  userId = data.get("userId")
  temperatura = data.get("temperatura")
  eucaristiaId = data.get("eucaristiaId")
  
  eucaristia = eucaristias_db.find_one( { "id": eucaristiaId } )
  asistentes = eucaristia.get("asistentes")
  covidForm = {}

  for i in asistentes:
      if i.get("id") == userId:
          covidForm = i.get("covidForm")
          covidForm["p14"] = "temperatura:" + str(temperatura)
          i["covidForm"] = covidForm

  eucaristias_db.update(
          {"id": eucaristiaId},
          {"$set": 
              {
                  "asistentes": asistentes
              }
          }
      )

  return {"asistentes": asistentes}

def generarColabCode(data):
  eucaristiaId = data.get("eucaristiaId")
  code = random.randint(100000, 999999)

  eucaristias = eucaristias_db.find( {"$and": [{ "colabCode": code }, { "available": True }]} )

  if eucaristias.count() > 0:
    return {"error": "No se pudo generar el código. Vuelva a intentarlo"}

  eucaristias_db.update(
          {"id": eucaristiaId},
          {"$set": 
              {
                  "colabCode": code
              }
          }
      )
  
  return {"colabCode": code}  

def generarPartiCode(eucaristiaId):
  code = random.randint(100000, 999999)

  eucaristias = eucaristias_db.find( {"$and": [{ "partiCode": code }, { "available": True }]} )

  if eucaristias.count() > 0:
    return 0

  return code   

def getEucaristiaColaborador(data):
  code = data.get("colabCode")
  eucaristia = eucaristias_db.find_one( {"$and": [{ "colabCode": code }, { "available": True }]} )

  if eucaristia is None:
    return {"error": "Código incorrecto. El código ingresado no existe"}

  
  del eucaristia["_id"]
  return eucaristia

def disable_eucaristias():
  print("[" + datetime.today().strftime('%Y-%m-%d-%H:%M:%S') + "]: Health check disable_eucaristias.")
  current_time = int(time.time())
  eucaristias = eucaristias_db.find( { "available": True } )
  to_update = []

  for i in eucaristias:
    hour = math.floor(int(i.get("id").split(":")[0])/100)
    minute = 30 if i.get("id").split(":")[0].endswith("30") else 0

    tz = pytz.timezone("Etc/GMT+5")
    full_date = tz.localize(datetime(int(i.get("year")), int(i.get("mes")) + 1, int(i.get("dia")), hour, minute), is_dst=None).timestamp() + 900

    if full_date < current_time:
      to_update.append(i.get("id"))
  
  if len(to_update) > 0:
    eucaristias_db.update(
        {"id": { "$in": to_update }},
        {"$set": 
            {
                "available": False
            }
        }, multi=True
    )

    print("[" + datetime.today().strftime('%Y-%m-%d-%H:%M:%S') + "]: Old eucaristias marked as unavailable.")
