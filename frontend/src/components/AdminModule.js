import React, { Component } from 'react'
import { Button, Modal, Form, Message, Card, TextArea } from 'semantic-ui-react'

export default class ModalMisReservas extends Component {
  state = { open: false }

  show = (size) => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  closeModalMotivo = () => this.setState({ 
    open: false, 
    rechazo: false, 
    rechazado: "",
    motivo: "" 
  })

  openModal = () => {
    this.setState({ 
        size: 'mini', 
        open: true,
        step: 1,
        
        id: "",
        password: "",
        errorAuth: "",
        usuario: "",

        authStepCompleted: false
    });
  }

  checkDataAuth() {
    if(this.state.id &&
      this.state.password &&
      !this.state.newUser){
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
      open: false,
      step: 0
    });

    fetch("/api/unavailParroquias").then(response =>
      response.json().then(data => {
        this.setState({parroquias: data.parroquias});
      })
    );

  }

  render() {
    const { open, size } = this.state;

    return (
      <div>
        {!this.state.usuario && <Button id="soy-admin-button" positive onClick={this.openModal}>Soy Administrador</Button>}
        <Modal size={size} open={open} onClose={this.close}>
          
        {this.state.step === 1 && <Modal.Header>Autenticación Administrador</Modal.Header>}
        {this.state.step === 0 && <Modal.Header>Motivo del Rechazo</Modal.Header>}

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
                                password: this.state.password                       
                            }

                          fetch("/api/authUser", {
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
                                      if(!data.admin){
                                        errorMsg = "No estás registrado como administrador.";
                                        this.setState({ errorAuth: errorMsg });
                                      }
                                      else{
                                        this.authDone(data);
                                      }
                                    }
                                })
                              );
                        }}
                        />
                    </Button.Group>
                </Form>}

                {this.state.rechazo && this.state.rechazado && <Form>
                  <Form.Field required>
                      <label>Motivo del rechazo</label>
                      <TextArea 
                        placeholder='Motivo' 
                        style={{ minHeight: 100 }} 
                        onChange={e => this.setState({ motivo: e.target.value })}
                        value={this.state.motivo}/>
                  </Form.Field>
                  <Button.Group>
                          <Button
                          negative
                          icon='arrow circle left'
                          labelPosition='left'
                          content='Volver'
                          onClick={this.closeModalMotivo}
                          />
                          <Button.Or text='O'/>
                          <Button
                          positive
                          icon='paper plane'
                          labelPosition='right'
                          content='Enviar'
                          disabled={!this.state.motivo}
                          onClick={() => {

                            const data = {
                              nit: this.state.rechazado,
                              enable: false,
                              reason: this.state.motivo
                            };

                            let errorMsg = "";

                            fetch("/api/enableParroquia", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(data)
                            }).then(res =>
                              res.json().then(data => {
                                  if(!res.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      this.setState({ errorEnableParroquia: errorMsg });
                                  }
                                  else{
                                    this.setState({
                                      parroquias: this.state.parroquias.filter(p => p.nit !== this.state.rechazado),
                                      rechazado: "",
                                      motivo: "",
                                      rechazo: false,
                                      open: false
                                    });
                                  }
                              })
                            );

                          }}/>
                      </Button.Group>
              </Form>}
          </Modal.Content>
        </Modal>

        {this.state.parroquias && <div id="solicitudes-pendientes">
          <Card.Group>
              {this.state.parroquias.map(parroquia => {
                  return(
                      <Card key={parroquia.nit}>
                          <Card.Content>
                              <Card.Header>
                                  {parroquia.nombre} <br/>
                                  ({parroquia.ubicacion})
                              </Card.Header>
                              <br/>
                              <Card.Meta>Diocesis: {parroquia.diocesis}</Card.Meta>
                              <Card.Meta>{parroquia.direccion}</Card.Meta>
                              <Card.Meta>{parroquia.telefono}</Card.Meta>
                              <Card.Description>
                              <strong>{parroquia.parroco}</strong>
                              </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div className='ui two buttons'>
                              <Button 
                                basic 
                                color='green'
                                onClick={() => {

                                  const data = {
                                    nit: parroquia.nit,
                                    enable: true,
                                    reason: ""
                                  };

                                  let errorMsg = "";

                                  fetch("/api/enableParroquia", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(data)
                                  }).then(res =>
                                    res.json().then(data => {
                                        if(!res.ok){
                                            errorMsg = "Error interno. Por favor vuelva a intentar.";
                                            this.setState({ errorEnableParroquia: errorMsg });
                                        }
                                        else{
                                          this.setState({parroquias: this.state.parroquias.filter(p => p.nit !== parroquia.nit)});
                                        }
                                    })
                                  );

                                }}>
                                Aprobar
                              </Button>
                              <Button 
                                basic 
                                color='red'
                                onClick={() => this.setState({ 
                                  open: true, 
                                  rechazo: true, 
                                  rechazado: parroquia.nit, 
                                  motivo: ""})}>
                                Rechazar
                              </Button>
                            </div>
                        </Card.Content>
                      </Card>
                  )
              })}        
          </Card.Group>

        </div>}

      </div>
    )
  }
}