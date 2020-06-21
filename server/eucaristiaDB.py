from pymongo import MongoClient
import json

# establecer conexion
conn = MongoClient('localhost', 27017)
conn = MongoClient()

# crear db
db = conn.baseDeDatos

# crear colecciones
eucaristias_db = db.eucaristias
parroquias = db.parroquias
usuarios = db.usuarios
semanas = db.semanas

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
            
            obj = {
                "id": i,
                "asistentes": asistentes,
                "hora": next((x.get('text') for x in horarios if x.get('key') == i.split(":")[0]), None),
                "dia": semana.get("initDay") + next((x.get('value') for x in dias if x.get('key') == i.split(":")[1]), None),
                "mes": semana.get("initMonth") - 1,
                "year": semana.get("initYear"),
                "cupos": int(parroquia.get("capacidad")) - 1
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
  
  for i in idsList:
    reserva = eucaristias_db.find_one( { "id": i } )
    asistentes = reserva.get("asistentes")

    for j in asistentes:
        if j.get("covidForm") is not None and j.get("id") == userId:
            reserva["covidForm"] = j.get("covidForm")
            break
    
    del reserva["asistentes"]
    del reserva["_id"]
    del reserva["cupos"]
    reservas.append(reserva)

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
      del i["id"]
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
