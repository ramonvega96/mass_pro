import React, { Component } from 'react'
import { Button, Modal, Form, Message, List, Checkbox, Card, Divider } from 'semantic-ui-react'

export default class ModalInscripcion extends Component {
  state = { open: false }

  show = (size) => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  openModal(e) {
    this.setState({
        parroquia: e, 
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
        selectedDay: "",
        selectedWeek: "",
        selectedEucaristias: [],
        authStepCompleted: false,
        errorInscripcion: "",
        eucaristiasSemana: [],
        errorGetEucaristias: "",
        semanas: []
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

    delete data.reservas

    this.setState({
      authStepCompleted: true,
      errorAuth: "",
      usuario: data,
      step: 2,
      size: 'small'
    });

    let errorMsg = "";

    fetch("/getHorarioParroquia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.parroquia.nit)
    }).then(res =>
      res.json().then(data => {
          if(!res.ok){
              errorMsg = "Error interno. Por favor vuelva a intentar.";
              this.setState({ errorGetHorario: errorMsg });
          }
          else{
              function comparar ( a, b ){ return a - b; }
              
              data.horario.lunAm.sort( comparar );
              data.horario.marAm.sort( comparar ); 
              data.horario.mieAm.sort( comparar ); 
              data.horario.jueAm.sort( comparar ); 
              data.horario.vieAm.sort( comparar ); 
              data.horario.sabAm.sort( comparar ); 
              data.horario.domAm.sort( comparar );
              data.horario.lunPm.sort( comparar );
              data.horario.marPm.sort( comparar ); 
              data.horario.miePm.sort( comparar ); 
              data.horario.juePm.sort( comparar ); 
              data.horario.viePm.sort( comparar ); 
              data.horario.sabPm.sort( comparar ); 
              data.horario.domPm.sort( comparar );   
              
              this.setState({ horario: data.horario, horarioDisponible: true });

              fetch('/getSemanas').then(response =>
                response.json().then(data => {
                  this.setState({ semanas: data.semanas });
                })
              );
          }
      })
    );
  }

  render() {
    const { open, size } = this.state;

    const horariosAm = [
      {
        key: '600',
        text: '06:00 a.m',
        value: '600'
      },
      {
          key: '630',
          text: '06:30 a.m',
          value: '630'
      },
      {
        key: '700',
        text: '07:00 a.m',
        value: '700'
      },
      {
          key: '730',
          text: '07:30 a.m',
          value: '730'
      },
      {
          key: '800',
          text: '08:00 a.m',
          value: '800'
      },
      {
          key: '830',
          text: '08:30 a.m',
          value: '830'
      },
      {
          key: '900',
          text: '09:00 a.m',
          value: '900'
      },
      {
          key: '930',
          text: '09:30 a.m',
          value: '930'
      },
      {
          key: '1000',
          text: '10:00 a.m',
          value: '1000'
      },
      {
          key: '1030',
          text: '10:30 a.m',
          value: '1030'
      },
      {
          key: '1100',
          text: '11:00 a.m',
          value: '1100'
      },
      {
          key: '1130',
          text: '11:30 a.m',
          value: '1130'
      }
    ];

    const horariosPm = [
      {
        key: '1200',
        text: '12:00 p.m',
        value: '1200'
      },
      {
          key: '1230',
          text: '12:30 p.m',
          value: '1200'
      },
      {
        key: '1300',
        text: '01:00 p.m',
        value: '1300'
      },
      {
          key: '1330',
          text: '01:30 p.m',
          value: '1330'
      },
      {
          key: '1400',
          text: '02:00 p.m',
          value: '1400'
      },
      {
          key: '1430',
          text: '02:30 p.m',
          value: '1430'
      },
      {
          key: '1500',
          text: '03:00 p.m',
          value: '1500'
      },
      {
          key: '1530',
          text: '03:30 p.m',
          value: '1530'
      },
      {
          key: '1600',
          text: '04:00 p.m',
          value: '1600'
      },
      {
          key: '1630',
          text: '04:30 p.m',
          value: '1630'
      },
      {
          key: '1700',
          text: '05:00 p.m',
          value: '1700'
      },
      {
          key: '1730',
          text: '05:30 p.m',
          value: '1730'
      },
      {
          key: '1800',
          text: '06:00 p.m',
          value: '1800'
      },
      {
          key: '1830',
          text: '06:30 p.m',
          value: '1830'
      },
      {
          key: '1900',
          text: '07:00 p.m',
          value: '1900'
      },
      {
          key: '1930',
          text: '07:30 p.m',
          value: '1930'
      },
    ];

    const dias = [
        {
          key: 0,
          text: 'Domingo',
          value: 'dom'
        },
        {
          key: 1,
          text: 'Lunes',
          value: 'lun'
        },
        {
          key: 2,
          text: 'Martes',
          value: 'mar'
        },
        {
          key: 3,
          text: 'Miércoles',
          value: 'mie'
        },
        {
          key: 4,
          text: 'Jueves',
          value: 'jue'
        },
        {
          key: 5,
          text: 'Viernes',
          value: 'vie'
        },
        {
          key: 6,
          text: 'Sábado',
          value: 'sab'
        }
    ];

    const handleChangeDay = (e, {value}) => {
      this.setState({selectedDay: value, errorInscripcion: "" })
    }

    const handleChangeWeek = (e, {value}) => {
      this.setState({selectedWeek: value});
      
      const dataWeekParroquia = {
        id: value + ":" + this.state.parroquia.nit
      };

      let errorMsg = "";

      fetch("/getEucaristias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataWeekParroquia)
      }).then(res =>
        res.json().then(data => {
            if(!res.ok){
                errorMsg = "Error interno. Por favor vuelva a intentar.";
                this.setState({ errorGetEucaristias: errorMsg });
            }
            else if (data.error){
                errorMsg = data.error;
                this.setState({ errorGetEucaristias: errorMsg });
            }
            else{
              this.setState({ eucaristiasSemana: data.eucaristias });
            }
        })
      );
    }

    const handleChangeCheckbox = (e, {id}) => {
      var eucaristias = this.state.selectedEucaristias;
      
      
      if(!this.state.selectedEucaristias.includes(id)){        
        eucaristias.push(id);        
      } 
      else{
        eucaristias = eucaristias.filter(e => e !== id)
      }

      this.setState({selectedEucaristias: eucaristias, errorInscripcion: ""})
    }

    const horarioDisponible = (h) => {
      let theHour = parseInt(h.split(":")[0])/100;
      let theDay = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initDay + dias.find(obj => {return obj.value === h.split(":")[1]}).key;
      let theMonth = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initMonth - 1;
      let theYear = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initYear;
      
      var hEucaristia = new Date(theYear, theMonth, theDay, theHour);
      
      if(hEucaristia < new Date() || cuposDisponibles(h) < 1){
        return true;
      }
      
      return false;
    }

    const cuposDisponibles = (h) => {
      const eucaristia = this.state.eucaristiasSemana.find(obj => {return obj.id === h});
      const cupos = eucaristia ? eucaristia.cupos : this.state.parroquia.capacidad;
      return cupos
    }

    return (
      <div>
        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Reservar Cupo</Modal.Header>
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
                                ubicacion: this.state.ubicacion,
                                telefono: this.state.telefono,
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

                {this.state.step === 2 && this.state.horarioDisponible && <Form>
                    
                    <Form.Group widths='equal'>
                      <Form.Select
                        label='Semana'
                        fluid
                        options={this.state.semanas}
                        placeholder='Semana'
                        selection
                        onChange={handleChangeWeek.bind(this)}
                        value={this.state.selectedWeek}
                        disabled={this.state.selectedWeek ? true : false}                        
                        />
                        <Form.Select
                        label='Dia de la semana'
                        fluid
                        options={dias}
                        placeholder='Dia de la semana'
                        onChange={handleChangeDay.bind(this)}
                        value={this.state.selectedDay}
                        disabled={!this.state.selectedWeek}
                        />                        
                    </Form.Group>
                    
                    {this.state.horario.lunAm.length > 0 && this.state.selectedDay === "lun" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.lunAm.length >= 3 ? 3 : this.state.horario.lunAm.length}>
                      {this.state.horario.lunAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.lunPm.length > 0 && this.state.selectedDay === "lun" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.lunPm.length >= 3 ? 3 : this.state.horario.lunPm.length}>
                      {this.state.horario.lunPm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}

                    {this.state.horario.marAm.length > 0 && this.state.selectedDay === "mar" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.marAm.length >= 3 ? 3 : this.state.horario.marAm.length}>
                      {this.state.horario.marAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.marPm.length > 0 && this.state.selectedDay === "mar" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.marPm.length >= 3 ? 3 : this.state.horario.marPm.length}>
                      {this.state.horario.marPm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>} 

                    {this.state.horario.mieAm.length > 0 && this.state.selectedDay === "mie" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.mieAm.length >= 3 ? 3 : this.state.horario.mieAm.length}>
                      {this.state.horario.mieAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.miePm.length > 0 && this.state.selectedDay === "mie" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.miePm.length >= 3 ? 3 : this.state.horario.miePm.length}>
                      {this.state.horario.miePm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>} 

                    {this.state.horario.jueAm.length > 0 && this.state.selectedDay === "jue" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.jueAm.length >= 3 ? 3 : this.state.horario.jueAm.length}>
                      {this.state.horario.jueAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.juePm.length > 0 && this.state.selectedDay === "jue" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.juePm.length >= 3 ? 3 : this.state.horario.juePm.length}>
                      {this.state.horario.juePm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>} 

                    {this.state.horario.vieAm.length > 0 && this.state.selectedDay === "vie" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.vieAm.length >= 3 ? 3 : this.state.horario.vieAm.length}>
                      {this.state.horario.vieAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.viePm.length > 0 && this.state.selectedDay === "vie" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.viePm.length >= 3 ? 3 : this.state.horario.viePm.length}>
                      {this.state.horario.viePm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>} 

                    {this.state.horario.sabAm.length > 0 && this.state.selectedDay === "sab" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.sabAm.length >= 3 ? 3 : this.state.horario.sabAm.length}>
                      {this.state.horario.sabAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.sabPm.length > 0 && this.state.selectedDay === "sab" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.sabPm.length >= 3 ? 3 : this.state.horario.sabPm.length}>
                      {this.state.horario.sabPm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>} 

                    {this.state.horario.domAm.length > 0 && this.state.selectedDay === "dom" && <Form.Field>
                    <label>Horarios en la mañana</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.domAm.length >= 3 ? 3 : this.state.horario.domAm.length}>
                      {this.state.horario.domAm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosAm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}
                    
                    {this.state.horario.domPm.length > 0 && this.state.selectedDay === "dom" && <Form.Field>
                      <label>Horarios en la tarde</label>
                      <Form.Group widths='equal'>                    
                      <Card.Group itemsPerRow={this.state.horario.domPm.length >= 3 ? 3 : this.state.horario.domPm.length}>
                      {this.state.horario.domPm.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{horariosPm.find(obj => {return obj.key === h}).text}</Card.Header> 
                                      <Card.Meta>Cupos: {cuposDisponibles(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <Checkbox
                                      id={h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit}
                                      checked={this.state.selectedEucaristias.includes(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)} 
                                      label='Elegir'
                                      onChange={handleChangeCheckbox.bind(this)}
                                      disabled={horarioDisponible(h + ":" + this.state.selectedDay + ":" + this.state.selectedWeek + ":" + this.state.parroquia.nit)}/>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                      </Form.Group>
                    </Form.Field>}

                    {this.state.selectedEucaristias.length > 0 && <Form.Field><Divider />
                      <label>Horarios escogidos</label>
                      <Card.Group itemsPerRow={this.state.selectedEucaristias.length >= 2 ? 2 : this.state.selectedEucaristias.length}>
                      {this.state.selectedEucaristias.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{dias.find(obj => {return obj.value === h.split(":")[1]}).text}</Card.Header> 
                                      <Card.Meta>{horariosAm.concat(horariosPm).find(obj => {return obj.key === h.split(":")[0]}).text}</Card.Meta>
                                  </Card.Content>
                                  <Card.Content extra>
                                    <div className='ui buttons'>
                                      <Button
                                      id={h} 
                                      basic 
                                      color='red' 
                                      onClick={handleChangeCheckbox.bind(this)}>
                                          Quitar
                                      </Button>
                                    </div>
                                  </Card.Content>
                              </Card>
                          )
                      })}        
                      </Card.Group>
                    </Form.Field>}

                    {this.state.errorInscripcion && <Message
                        error
                        header='Error en la inscripción'
                        content={this.state.errorInscripcion}
                        visible
                    />}                      
                    
                    <Button.Group>
                        <Button
                        negative
                        icon='close'
                        labelPosition='left'
                        content='Cerrar'
                        onClick={this.close}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='save outline'
                        labelPosition='right'
                        content='Guardar'
                        disabled={this.state.selectedEucaristias.length < 1}
                        onClick={() => {
                          
                          const inscripcionData = {
                            eucaristias: this.state.selectedEucaristias,
                            user: this.state.usuario
                          };

                          let errorMsg = "";
                          let day = "";
                          let hora = "";

                          fetch("/crearInscripcion", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(inscripcionData)
                          }).then(res =>
                            res.json().then(data => {
                                if(!res.ok){
                                    errorMsg = "Error interno. Por favor vuelva a intentar.";
                                    this.setState({ errorInscripcion: errorMsg });
                                }
                                else if (data.error){
                                    day = dias.find(obj => {return obj.value === data.horario.split(":")[1]}).text;
                                    hora = horariosAm.concat(horariosPm).find(obj => {return obj.value === data.horario.split(":")[0]}).text;
                                    errorMsg = data.error + ": " + day + " - " + hora;
                                    this.setState({ errorInscripcion: errorMsg });
                                }
                                else{
                                  this.close();
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