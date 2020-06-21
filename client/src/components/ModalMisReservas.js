import React, { Component } from 'react'
import { Button, Modal, Form, Message, List, Icon, Card, Radio, Accordion } from 'semantic-ui-react'

export default class ModalMisReservas extends Component {
  state = { open: false }

  show = (size) => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  openModal = () => {
    this.setState({ 
        size: 'mini', 
        open: true,
        step: 1,
        
        id: "",
        password: "",
        newUser: false,
        errorAuth: "",
        nombre: "",
        direccion: "",
        ubicacion: "",
        telefono: "",
        cPassword: "",

        authStepCompleted: false,
        errorGetReservas: "",
        reservas: [],

        selectedReserva: "",

        p0: "¿Está de acuerdo con la autorización de tratamiento de sus datos?",
        p1: "¿Ha tenido fiebre? (Mayor o igual a 38 ºC)",
        p2: "¿Ha presentado tos seca?",
        p3: "¿Siente que se cansa con el mínimo esfuerzo?",
        p4: "¿Ha tenido malestar general (“maluquera”)?",
        p5: "¿Siente que le duelen los músculos?",
        p6: "¿Le duele la cabeza?",
        p7: "¿Siente que respira normal?",
        p8: "¿Siente alguna molestia en el pecho? (“opresión o ardor”)",
        p9: "¿Ha tenido la nariz tapada o fluido nasal?",
        p10: "¿Ha tenido dolor de garganta?",
        p11: "¿Siente que ha dejado de percibir olores y/o sabores?",
        p12: "¿Ha tenido diarrea?",
        p13: "¿Ha tenido contacto en los últimos 14 días o vive con alguien sospechoso o confirmado de tener COVID-19?",

        covidFormFilled: false
    });
  }

  checkDataAuth() {
    if(this.state.id &&
      this.state.password &&
      !this.state.newUser){
          this.setState({ authStepCompleted: true });
    }
    else if(this.state.id &&
      !isNaN(this.state.id) &&
      this.state.password &&
      this.state.cPassword &&
      this.state.cPassword === this.state.password &&
      this.state.nombre &&
      this.state.direccion &&
      this.state.ubicacion &&
      this.state.telefono &&
      !isNaN(this.state.telefono) &&
      this.state.newUser
      ){
        this.setState({ authStepCompleted: true });
    }
    else{
      this.setState({ authStepCompleted: false });
    }
  }

  authDone(data){
    this.setState({
      authStepCompleted: true,
      errorAuth: "",
      usuario: data,
      step: 2,
      size: 'small'
    });

    let errorMsg = "";
    let parroquias = [];

    fetch("/getEucaristiasForUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res =>
      res.json().then(result => {
          if(!res.ok){
              errorMsg = "Error interno. Por favor vuelva a intentar.";
              this.setState({ errorGetReservas: errorMsg });
          }
          else if (result.reservas.length < 1){
              errorMsg = "Aún no tienes reservas: Elige tu parroquia y reserva un cupo en la Eucaristia a la que quieres asistir.";
              this.setState({ errorGetReservas: errorMsg });
          }
          else{
            result.reservas.forEach(r => {
              parroquias.indexOf(r.id.split(":")[3]) === -1 ? parroquias.push(r.id.split(":")[3]) : void(0);
            });
            
            fetch("/getParroquiasWithIds", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(parroquias)
            }).then(res =>
              res.json().then(resp => {
                  if(!res.ok){
                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                      this.setState({ errorGetParroquias: errorMsg });
                  }
                  else{
                    result.reservas.forEach(r => {                      
                      var parroquia = resp.parroquias.find(obj => {return obj.nit === r.id.split(":")[3]});
                      r.fecha = new Date(r.year, r.mes, r.dia, parseInt(r.id.split(":")[0])/100);
                      r.parroquia = parroquia.nombre
                      r.direccion = parroquia.direccion
                      r.ubicacion = parroquia.ubicacion
                      r.autoEvalCovid = parroquia.autoEvalCovid
                    });
                    result.reservas.sort(function(a, b) { 
                      return a.fecha - b.fecha;
                    })
                    this.setState({ reservas: result.reservas });
                  }
              })
            );
          }
      })
    );
  }

  liberarCupo(data){
    const deleteReservaData = {
      eucaristia: data,
      usuario: this.state.usuario.id
    }

    let errorMsg = "";

    fetch("/deleteReserva", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(deleteReservaData)
    }).then(res =>
      res.json().then(result => {
          if(!res.ok){
              errorMsg = "Error interno. Por favor vuelva a intentar.";
              this.setState({ errorDeleteReserva: errorMsg });
          }
          else{
            const reservas = this.state.reservas.filter(r => r.id !== result.eucaristia);
            this.setState({ reservas: reservas });
            if (reservas.length < 1){
              errorMsg = "No tienes reservas: Elige tu parroquia y reserva un cupo en la Eucaristia a la que quieres asistir.";
              this.setState({ errorGetReservas: errorMsg });
            }
          }
      })
    );
  }

  checkAutoReporteAvailability(reserva){
    if (!reserva.autoEvalCovid){
      return true;
    }
    else{
      const diff = (reserva.fecha.getTime() - new Date().getTime()) / 1000;
      if(diff < 3600){
        return false;
      }
      else{
        return true;
      }      
    }
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  covidFormFilled(){
    if(this.state.aP0 === "Si" && 
    this.state.aP1 &&
    this.state.aP2 &&
    this.state.aP3 &&
    this.state.aP4 &&
    this.state.aP5 &&
    this.state.aP6 &&
    this.state.aP7 &&
    this.state.aP8 &&
    this.state.aP9 &&
    this.state.aP10 &&
    this.state.aP11 &&
    this.state.aP12 &&
    this.state.aP13){
      this.setState({covidFormFilled: true})
    }
    else{
      this.setState({covidFormFilled: false})
    }    
  }

  covidFormUnfill(){
    this.setState({
      aP0: "",
      aP1: "",
      aP2: "",
      aP3: "",
      aP4: "",
      aP5: "",
      aP6: "",
      aP7: "",
      aP8: "",
      aP9: "",
      aP10: "",
      aP11: "",
      aP12: "",
      aP13: ""
    })
  }

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Button positive onClick={this.openModal}>Ver mis reservas</Button>
        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>{this.state.step < 3 ? "Mis Reservas" : "Autoevaluación COVID-19"}</Modal.Header>
          <Modal.Content>
          
          {this.state.step === 1 && <Form>
                    {this.state.errorAuth && <Message
                        error
                        header='Error en la autenticación'
                        content={this.state.errorAuth}
                        visible
                    />}
                    
                    <Form.Field required>
                        <label>Cédula o Tarjeta de Identidad</label>
                        <input
                            placeholder='Identificación (sin puntos ni espacios)' 
                            onChange={e => this.setState({ id: e.target.value }, () => this.checkDataAuth())}
                            value={this.state.id}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Contraseña</label>
                        <input
                            type='password'
                            placeholder='Contraseña' 
                            onChange={e => this.setState({ password: e.target.value }, () => this.checkDataAuth())}
                            value={this.state.password}/>
                    </Form.Field>

                    {this.state.newUser && <Form.Field required>
                          <label>Confirmar Contraseña {this.state.password && this.state.cPassword && this.state.cPassword !== this.state.password && " (No coinciden)"}</label>
                          <input
                              type='password'
                              placeholder='Confirmar Contraseña' 
                              onChange={e => this.setState({ cPassword: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.cPassword}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Nombres y Apellidos</label>
                          <input
                              placeholder='Nombres y Apellidos' 
                              onChange={e => this.setState({ nombre: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.nombre}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Teléfono</label>
                          <input
                              placeholder='Teléfono' 
                              onChange={e => this.setState({ telefono: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.telefono}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Dirección</label>
                          <input
                              placeholder='Dirección' 
                              onChange={e => this.setState({ direccion: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.direccion}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Ubicación</label>
                          <input
                              placeholder='Ciudad / Municipio' 
                              onChange={e => this.setState({ ubicacion: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.ubicacion}/>
                      </Form.Field>}

                    <Button.Group>
                        <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={this.close}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='arrow circle right'
                        labelPosition='right'
                        content='Siguiente'
                        disabled={!this.state.authStepCompleted}
                        onClick={() => {

                            var errorMsg = "";

                            const authData = {
                                id: this.state.id,
                                password: this.state.password,
                                nombre: this.state.nombre,
                                direccion: this.state.direccion,
                                telefono: this.state.telefono,
                                ubicacion: this.state.ubicacion,
                                reservas: []                                
                            }

                            if(!this.state.newUser){
                              fetch("/authUser", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify(authData)
                                }).then(res =>
                                  res.json().then(data => {
                                      if(!res.ok){
                                          errorMsg = "Error interno. Por favor vuelva a intentar.";
                                          this.setState({ errorAuth: errorMsg });
                                      }
                                      else if (data.error){
                                          errorMsg = data.error;
                                          this.setState({ errorAuth: errorMsg });
                                      }
                                      else{
                                        this.authDone(data);
                                      }
                                  })
                                );
                            }
                            else{
                              fetch("/createUser", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(authData)
                              }).then(res =>
                                res.json().then(data => {
                                    if(!res.ok){
                                        errorMsg = "Error interno. Por favor vuelva a intentar.";
                                        this.setState({ errorAuth: errorMsg });
                                    }
                                    else if (data.error){
                                        errorMsg = data.error;
                                        this.setState({ errorAuth: errorMsg });
                                    }
                                    else{
                                        this.authDone(data);
                                    }
                                })
                              );
                            }
                        }}
                        />
                    </Button.Group>
                    <Modal.Actions>
                      <List celled horizontal>
                          <List.Item href='#' onClick={() => {
                            const nuevoUsuario = this.state.newUser; 
                            this.setState({ 
                              newUser: !nuevoUsuario, 
                              authStepCompleted: false, 
                              errorAuth: "" }, () => this.checkDataAuth());                              
                            }}>{this.state.newUser ? 'Estoy registrado' : 'No estoy registrado'}</List.Item>
                          <List.Item href='#'>Olvidé mi contraseña</List.Item>
                      </List>
                    </Modal.Actions>
                </Form>}

                {this.state.step === 2 && !this.state.errorGetReservas && <div>
                  <Card.Group>
                    {this.state.reservas.map(res => {

                        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                        const buttonAvailable = this.checkAutoReporteAvailability(res);
                        const evalCovid = res.covidForm ? false : true;

                        return(
                            <Card key={res.id}>
                                <Card.Content>
                                    <Card.Header>
                                      {res.fecha.getDate() + " de " + months[res.fecha.getMonth()] + " de " + res.fecha.getFullYear()} <br/>
                                      {res.hora}                                        
                                    </Card.Header>
                                    <br/>
                                    <Card.Meta>{res.parroquia}</Card.Meta>
                                    <Card.Meta>{res.direccion}</Card.Meta>
                                    <Card.Meta>{res.ubicacion}</Card.Meta>
                                </Card.Content>
                                {evalCovid && <Card.Content extra>
                                  <div className='ui two buttons'>
                                  {!buttonAvailable && <Button
                                      basic
                                      color='green'
                                      onClick={() => this.setState({ step: 3, selectedReserva: res, size: "mini" })}                                          
                                      content="Llenar Autoreporte COVID"/>}
                                      <Button
                                        icon='warning sign'
                                        content="No voy a ir"
                                        labelPosition='left'                                         
                                        color='red'
                                        onClick={() => {this.liberarCupo(res.id)}}/>
                                      </div>                                    
                                </Card.Content>}
                            </Card>
                        )
                    })}        
                    </Card.Group>                    
                    <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={this.close}
                      />
                </div>}

                {this.state.step === 2 && this.state.errorGetReservas && <div> 
                    <Message
                        error
                        header='Ups ...'
                        content={this.state.errorGetReservas}
                        visible
                    />                   
                    <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={this.close}
                      />
                </div>}

                {this.state.step === 3 && this.state.selectedReserva && <Form>

                  <Form.Field>
                  <Accordion>
                    <Accordion.Title
                      active={this.state.activeIndex === 0}
                      index={0}
                      onClick={this.handleAccordionClick}
                    >
                      <Icon name='dropdown' />
                      Haga click aquí para leer la autorización de tratamiento de datos
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 0}>
                      <p>
                        Toda la información se recoge con fines estrictamente de interés público ante 
                        la situación decretada por las Autoridades Públicas, para proteger y salvaguardar 
                        un interés esencial para la vida de las personas, en consecuencia, autorizo a esta 
                        aplicación, para el manejo de la información aportada en esta autoevaluación de 
                        síntomas COVID-19 con el propósito de desarrollar acciones de promoción y prevención 
                        frente al riesgo de contagio acorde con lo normado por el Ministerio de Salud y las 
                        demás autoridades competentes.
                      </p>
                      <p>
                        De conformidad con lo establecido en la Ley 1581 de 2012 de protección de datos personales, 
                        se podrá suministrar información a las entidades públicas o administrativas que en el ejercicio 
                        de sus funciones legales así lo requieran, o a las personas establecidas en el artículo 13 de la ley.
                      </p>
                      <p>
                        Los datos proporcionados por el usuario deben ser veraces, completos, exactos, actualizados, 
                        comprobables y comprensibles y en consecuencia el usuario asume toda la responsabilidad sobre 
                        la falta de veracidad o exactitud de éstos.
                      </p>
                      <p>
                        La Autoevaluación es una guía de identificación de síntomas y signos de alarma que puedan estar 
                        relacionados con el coronavirus COVID-19, pero en ningún caso reemplaza la atención médica ni las 
                        pruebas diagnósticas realizadas por el personal médico autorizado.
                      </p>
                    </Accordion.Content>
                  </Accordion>
                  </Form.Field>

                  <label>{this.state.p0}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP0'
                          checked={this.state.aP0 === 'Si'}
                          onChange={() => this.setState({ aP0: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP0'
                          checked={this.state.aP0 === 'No'}
                          onChange={() => this.setState({ aP0: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    {this.state.aP0 === 'No' && <Message
                        warning
                        header='Importante'
                        content="Al no aceptar la autorización de tratamiento de datos la parroquia puede restringir su ingreso."
                        visible
                    />}
                  
                  {this.state.aP0 === 'Si' && <div>
                  <label>{this.state.p1}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP1'
                          checked={this.state.aP1 === 'Si'}
                          onChange={() => this.setState({ aP1: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP1'
                          checked={this.state.aP1 === 'No'}
                          onChange={() => this.setState({ aP1: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p2}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Sin tos seca'
                          name='radioGroupP2'
                          checked={this.state.aP2 === 'Sin tos seca'}
                          onChange={() => this.setState({ aP2: 'Sin tos seca' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Poca tos'
                          name='radioGroupP2'
                          checked={this.state.aP2 === 'Poca tos'}
                          onChange={() => this.setState({ aP2: 'Poca tos' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Tos Persistente'
                          name='radioGroupP2'
                          checked={this.state.aP2 === 'Tos Persistente'}
                          onChange={() => this.setState({ aP2: 'Tos Persistente' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p3}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP3'
                          checked={this.state.aP3 === 'Si'}
                          onChange={() => this.setState({ aP3: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP3'
                          checked={this.state.aP3 === 'No'}
                          onChange={() => this.setState({ aP3: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p4}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP4'
                          checked={this.state.aP4 === 'Si'}
                          onChange={() => this.setState({ aP4: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP4'
                          checked={this.state.aP4 === 'No'}
                          onChange={() => this.setState({ aP4: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p5}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Sin dolor'
                          name='radioGroupP5'
                          checked={this.state.aP5 === 'Sin dolor'}
                          onChange={() => this.setState({ aP5: 'Sin dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Poco dolor'
                          name='radioGroupP5'
                          checked={this.state.aP5 === 'Poco dolor'}
                          onChange={() => this.setState({ aP5: 'Poco dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Fuerte dolor'
                          name='radioGroupP5'
                          checked={this.state.aP5 === 'Fuerte dolor'}
                          onChange={() => this.setState({ aP5: 'Fuerte dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p6}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Sin dolor'
                          name='radioGroupP6'
                          checked={this.state.aP6 === 'Sin dolor'}
                          onChange={() => this.setState({ aP6: 'Sin dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Poco dolor'
                          name='radioGroupP6'
                          checked={this.state.aP6 === 'Poco dolor'}
                          onChange={() => this.setState({ aP6: 'Poco dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Fuerte dolor'
                          name='radioGroupP6'
                          checked={this.state.aP6 === 'Fuerte dolor'}
                          onChange={() => this.setState({ aP6: 'Fuerte dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p7}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP7'
                          checked={this.state.aP7 === 'Si'}
                          onChange={() => this.setState({ aP7: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP7'
                          checked={this.state.aP7 === 'No'}
                          onChange={() => this.setState({ aP7: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p8}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Ninguna Molestia'
                          name='radioGroupP8'
                          checked={this.state.aP8 === 'Ninguna Molestia'}
                          onChange={() => this.setState({ aP8: 'Ninguna Molestia' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Poca Molestia'
                          name='radioGroupP8'
                          checked={this.state.aP8 === 'Poca Molestia'}
                          onChange={() => this.setState({ aP8: 'Poca Molestia' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Fuerte Molestia'
                          name='radioGroupP8'
                          checked={this.state.aP8 === 'Fuerte Molestia'}
                          onChange={() => this.setState({ aP8: 'Fuerte Molestia' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p9}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP9'
                          checked={this.state.aP9 === 'Si'}
                          onChange={() => this.setState({ aP9: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP9'
                          checked={this.state.aP9 === 'No'}
                          onChange={() => this.setState({ aP9: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p10}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Sin dolor'
                          name='radioGroupP10'
                          checked={this.state.aP10 === 'Sin dolor'}
                          onChange={() => this.setState({ aP10: 'Sin dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Poco dolor'
                          name='radioGroupP10'
                          checked={this.state.aP10 === 'Poco dolor'}
                          onChange={() => this.setState({ aP10: 'Poco dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Fuerte dolor'
                          name='radioGroupP10'
                          checked={this.state.aP10 === 'Fuerte dolor'}
                          onChange={() => this.setState({ aP10: 'Fuerte dolor' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p11}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP11'
                          checked={this.state.aP11 === 'Si'}
                          onChange={() => this.setState({ aP11: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP11'
                          checked={this.state.aP11 === 'No'}
                          onChange={() => this.setState({ aP11: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p12}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP12'
                          checked={this.state.aP12 === 'Si'}
                          onChange={() => this.setState({ aP12: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP12'
                          checked={this.state.aP12 === 'No'}
                          onChange={() => this.setState({ aP12: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>

                    <label>{this.state.p13}</label>
                  <Form.Group widths='equal'>                        
                        <Form.Field>
                        <Radio
                          label='Si'
                          name='radioGroupP13'
                          checked={this.state.aP13 === 'Si'}
                          onChange={() => this.setState({ aP13: 'Si' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='radioGroupP13'
                          checked={this.state.aP13 === 'No'}
                          onChange={() => this.setState({ aP13: 'No' }, this.covidFormFilled)}
                        />
                      </Form.Field>
                    </Form.Group>
                    </div>}

                    <Button.Group fluid>
                      <Button
                          negative
                          icon='arrow circle left'
                          labelPosition='left'
                          content='Volver'
                          onClick={() => this.setState({step: 2, size: "small"}, this.covidFormUnfill)}
                        />
                      <Button.Or text='O'/>
                      <Button
                          positive
                          icon='paper plane'
                          labelPosition='right'
                          content='Enviar'
                          disabled={!this.state.covidFormFilled}
                          onClick={() => {                          

                            const covidFormResult = {
                              p1: this.state.p1 + ":" + this.state.aP1,
                              p2: this.state.p2 + ":" + this.state.aP2,
                              p3: this.state.p3 + ":" + this.state.aP3,
                              p4: this.state.p4 + ":" + this.state.aP4,
                              p5: this.state.p5 + ":" + this.state.aP5,
                              p6: this.state.p6 + ":" + this.state.aP6,
                              p7: this.state.p7 + ":" + this.state.aP7,
                              p8: this.state.p8 + ":" + this.state.aP8,
                              p9: this.state.p9 + ":" + this.state.aP9,
                              p10: this.state.p10 + ":" + this.state.aP10,
                              p11: this.state.p11 + ":" + this.state.aP11,
                              p12: this.state.p12 + ":" + this.state.aP12,
                              p13: this.state.p13 + ":" + this.state.aP13
                            }

                            const data = {
                              userId: this.state.id,
                              reservaId: this.state.selectedReserva.id,
                              covidForm: covidFormResult
                            }

                            var errorMsg = "";

                            fetch("/postUserCovidForm", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(data)
                            }).then(res =>
                              res.json().then(resp => {
                                  if(!res.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      this.setState({ errorPostForm: errorMsg });
                                  }
                                  else{
                                    let reservas = this.state.reservas;
                                    reservas.find(obj => {return obj.id === resp.id}).covidForm = covidFormResult;
                                    this.setState({ reservas: reservas, step: 2, size: "small" }, this.covidFormUnfill);
                                  }
                              })
                            );
                          }}
                        />
                    </Button.Group>
                </Form>}
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}