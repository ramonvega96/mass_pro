import React, { Component } from 'react'
import { Button, Modal, Form, Message, List, Icon, Card } from 'semantic-ui-react'

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
        horario: "",
        horarioDisponible: false,
        authStepCompleted: false,
        errorGetReservas: "",
        reservas: []
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

    fetch("/getEucaristiasForUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data.reservas)
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
              r.fecha = new Date(r.year, r.mes, r.dia)
            });
            result.reservas.sort(function(a, b) { 
              return a.fecha - b.fecha;
            })
            this.setState({ reservas: result.reservas });
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

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Button positive onClick={this.openModal}>Ver mis reservas</Button>
        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Mis Reservas</Modal.Header>
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

                        const months = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
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
                                <Card.Content extra>
                                    <div className='ui buttons'>
                                    <Button
                                    basic 
                                    color='red' 
                                    onClick={() => {this.liberarCupo(res.id)}}>
                                        <Icon name='warning sign' />
                                        Liberar cupo: No voy a ir
                                    </Button>
                                    </div>
                                </Card.Content>
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
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}