import React, { Component } from 'react'
import { Button, Modal, Form, Message, List, Checkbox, Card, Divider, Icon, Accordion } from 'semantic-ui-react'

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

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
        email: "",
        horario: "",
        horarioDisponible: false,
        selectedDay: "",
        selectedWeek: "",
        selectedEucaristias: [],
        authStepCompleted: false,
        errorInscripcion: "",
        eucaristiasSemana: [],
        errorGetEucaristias: "",
        semanas: [],
        forgotPw: false,
        pwRecovered: false,
        partiCode: "", 
        parti: "",
        errorEucaristiaParticular: ""
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
      this.state.email &&
      this.state.newUser
      ){
        this.setState({ authStepCompleted: true });
    }
    else{
      this.setState({ authStepCompleted: false });
    }
  }

  checkDataPwRecover() {
    if(this.state.id &&
      !isNaN(this.state.id)){
        this.setState({ authStepCompleted: true, errorAuth: "" });
    }
    else{
        this.setState({ authStepCompleted: false, errorAuth: "" });
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

    fetch("/api/getHorarioParroquia", {
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
              
              fetch("/api/getSemanas").then(response =>
                response.json().then(dataSemanas => {
                  this.setState({ 
                    semanas: dataSemanas.semanas, 
                    horario: data.horario, 
                    horarioDisponible: true 
                  });
                })
              );
          }
      })
    );
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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

    const handleChangeDate = (value, date) => {
      this.setState({selectedWeek: value});
      
      const dataWeekParroquia = {
        id: value + ":" + this.state.parroquia.nit
      };

      let errorMsg = "";

      fetch("/api/getEucaristias", {
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
              this.setState({ 
                eucaristiasSemana: data.eucaristias,
                selectedDay: dias.find(obj => {return obj.key === date.getDay()}).value
               });
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
      let theMinutes = h.split(":")[0].endsWith("30") ? 30 : 0;
      let theHour = Math.floor(parseInt(h.split(":")[0])/100);
      
      let theDay = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initDay + dias.find(obj => {return obj.value === h.split(":")[1]}).key;
      let theMonth = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initMonth - 1;
      let theYear = this.state.semanas.find(obj => {return obj.value === this.state.selectedWeek}).initYear;
      
      var hEucaristia = new Date(theYear, theMonth, theDay, theHour, theMinutes);
      
      if(new Date(hEucaristia.getTime() + 30 * 60000) < new Date() || cuposDisponibles(h) < 1){
        return true;
      }
      
      return false;
    }

    const cuposDisponibles = (h) => {
      const eucaristia = this.state.eucaristiasSemana.find(obj => {return obj.id === h});
      const cupos = eucaristia ? eucaristia.cupos : this.state.parroquia.capacidad;
      return cupos
    }

    const handleDateChange = (date) => {
      if(date instanceof Date){
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.setState({selectedDate: date});
        
        const dateData = {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear()
        }

        let errorMsg = "";
        
        fetch("/api/getSemana", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dateData)
        }).then(resp =>
            resp.json().then(data => {
                  if(!resp.ok){
                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                      this.setState({ errorColabCodeEucaristia: errorMsg });
                  }
                  else if (data.error){
                    errorMsg = data.error;
                    this.setState({ errorGetSemanas: errorMsg, size: 'mini', selectedDay: "" });
                  }
                  else{
                    this.setState({errorGetSemanas: "", size: 'small'});
                    handleChangeDate(data.value, date);
                  }
            })
        );
      }
    };

    return (
      <div>
        <Modal size={size} open={open} onClose={this.close} closeOnEscape={false} closeOnDimmerClick={false}>
          <Modal.Header>{this.state.step > 0 ? "Reservar Cupo" : "Recuperar Contraseña"}</Modal.Header>
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
                            value={this.state.id}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Contraseña</label>
                        <input
                            type='password'
                            placeholder='Contraseña' 
                            onChange={e => this.setState({ password: e.target.value }, () => this.checkDataAuth())}
                            value={this.state.password}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>

                    {this.state.newUser && <Form.Field required>
                          <label>Confirmar Contraseña {this.state.password && this.state.cPassword && this.state.cPassword !== this.state.password && " (No coinciden)"}</label>
                          <input
                              type='password'
                              placeholder='Confirmar Contraseña' 
                              onChange={e => this.setState({ cPassword: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.cPassword}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Nombres y Apellidos</label>
                          <input
                              placeholder='Nombres y Apellidos' 
                              onChange={e => this.setState({ nombre: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.nombre}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Teléfono</label>
                          <input
                              placeholder='Teléfono' 
                              onChange={e => this.setState({ telefono: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.telefono}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Email</label>
                          <input
                              placeholder='Correo electrónico' 
                              onChange={e => this.setState({ email: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.email}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Dirección</label>
                          <input
                              placeholder='Dirección' 
                              onChange={e => this.setState({ direccion: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.direccion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {this.state.newUser && <Form.Field required>
                          <label>Ubicación</label>
                          <input
                              placeholder='Ciudad / Municipio' 
                              onChange={e => this.setState({ ubicacion: e.target.value }, () => this.checkDataAuth())}
                              value={this.state.ubicacion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}

                      {this.state.newUser && <Form.Field>
                        <Accordion>
                          <Accordion.Title
                            active={this.state.activeIndex === 0}
                            index={0}
                            onClick={this.handleAccordionClick}
                          >
                            <Icon name='dropdown' />
                            Haga click aquí para leer nuestra política de tratamiento de datos y click en "Siguiente" 
                            si está de acuerdo con la misma.
                          </Accordion.Title>
                          <Accordion.Content active={this.state.activeIndex === 0}>
                            <p>
                              Toda la información se recoge con fines de interés público ante 
                              la situación decretada por las Autoridades Públicas, para proteger y salvaguardar 
                              un interés esencial para la vida de las personas, en consecuencia, autorizo a esta 
                              aplicación, para el manejo de la información aportada en este formulario de inscripción 
                              con el propósito de desarrollar acciones de promoción y prevención frente al riesgo 
                              de contagio acorde con lo normado por el Ministerio de Salud y las demás autoridades 
                              competentes.
                            </p>
                            <p>
                              De conformidad con lo establecido en la Ley 1581 de 2012 de protección de datos personales, 
                              se podrá suministrar información a las entidades públicas o administrativas que en el ejercicio 
                              de sus funciones legales así lo requieran, o a las personas establecidas en el artículo 13 de la ley.
                            </p>
                            <p>
                              Los datos proporcionados por el usuario deben ser veraces, completos, exactos, actualizados, 
                              comprobables y comprensibles y en consecuencia el usuario asume TODA la responsabilidad sobre 
                              la falta de veracidad o exactitud de éstos.
                            </p>
                            <p>
                              A los datos proporcionados por el usuario, podrán acceder únicamente los administradores de las 
                              parroquias en las que se celebren las Eucaristías a las que este se inscriba. Los administradores
                              de las parroquias se comprometen a usar esta información estrictamente para presentarla a las 
                              autoridades pertinentes en caso de ser requerida. Si los administradores de las parroquias no hacen
                              uso debido de los datos proporcionados por el usuario, el usuario puede reportar esto y en ese caso 
                              la parroquia será removida de la plataforma. El usuario, al inscribirse en esta plataforma, asume TODA 
                              responsabilidad sobre el uso que se le de a sus datos por parte de los administradores de las 
                              parroquias a las que asiste y por parte de los administradores de esta plataforma.
                            </p>
                            <p>
                              Los administradores de esta plataforma se limitan única y exclusivamente a garantizar el Habeas Data, 
                              es decir el derecho que tiene los usuarios de conocer, actualizar, rectificar y eliminar la información que 
                              se haya recogido sobre ellos en bases de datos.
                            </p>
                          </Accordion.Content>
                        </Accordion>
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
                                id: this.state.id.trim(),
                                password: this.state.password,
                                nombre: this.state.nombre,
                                direccion: this.state.direccion,
                                ubicacion: this.state.ubicacion,
                                telefono: this.state.telefono,
                                email: this.state.email,
                                reservas: []
                            }

                            if(!this.state.newUser){
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
                                        this.authDone(data);
                                        handleDateChange(new Date());
                                      }
                                  })
                                );
                            }
                            else{
                              fetch("/api/createUser", {
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
                                        handleDateChange(new Date());
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
                          <List.Item href='#'onClick={() => this.setState({forgotPw: true, id: "", step: 0})                              
                            }>Olvidé mi contraseña</List.Item>
                      </List>
                    </Modal.Actions>
                </Form>}

                {this.state.forgotPw && <Form>
                  
                  {!this.state.pwdSent && !this.state.errorAuth && <Message
                        warning
                        header='Recuperar contraseña'
                        content='Para recuperar tu contraseña necesitamos identificarte.'
                        visible
                    />}

                  <Form.Field required>
                        <label>Cédula o Tarjeta de Identidad</label>
                        <input
                            placeholder='Identificación (sin puntos ni espacios)' 
                            onChange={e => this.setState({ id: e.target.value }, () => this.checkDataPwRecover())}
                            value={this.state.id}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>

                    {this.state.pwdSent && <Message
                        success
                        header='Contraseña enviada'
                        content={this.state.pwdSent}
                        visible
                    />}

                    {this.state.errorAuth && <Message
                        error
                        header='Error'
                        content={this.state.errorAuth}
                        visible
                    />}

                    <Button.Group>
                        <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => this.setState({
                          forgotPw: false, 
                          id: "", 
                          step: 1, 
                          errorAuth: "",
                          pwdSent: "",
                          pwRecovered: false,
                          authStepCompleted: false
                        })}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='paper plane outline'
                        labelPosition='right'
                        content='Enviar'
                        disabled={!this.state.authStepCompleted || this.state.pwRecovered}
                        onClick={() => {

                          let errorMsg = "";
                          const authData = {
                            "userId": this.state.id
                          }

                          fetch("/api/forgotUserPassword", {
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
                                  this.setState({ 
                                    pwdSent: "Tu contraseña fue enviada a: " + data.email,
                                    pwRecovered: true
                                  });
                                }
                            })
                          );

                        }}
                        />
                    </Button.Group>                  
                  </Form>}
                
                {this.state.step === 2 && this.state.horarioDisponible && <Form>
                  
                  <Form.Field>
                    <div id="date-picker-dialog-asistencia" >
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                              id="date-picker-dialog-asistencia"                        
                              format="dd/MM/yyyy"
                              value={this.state.selectedDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{'aria-label': 'change date'}}
                              minDate={new Date()}
                              />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Form.Field>

                  {this.state.errorGetSemanas && <Message
                        warning
                        header={this.state.errorGetSemanas}
                        content="Únicamente están disponibles la semana en curso y la siguiente. Asegurese de que el formato (dia/mes/año) es el correcto"
                        visible
                    />}
                    
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

                    {this.state.horario.lunAm.length === 0 && this.state.horario.lunPm.length === 0 && this.state.selectedDay === "lun" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Lunes. Para más información, comunicate con tu parroquia."
                        visible
                    />}

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

                    {this.state.horario.marAm.length === 0 && this.state.horario.marPm.length === 0 && this.state.selectedDay === "mar" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Martes. Para más información, comunicate con tu parroquia."
                        visible
                    />} 

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
                    
                    {this.state.horario.mieAm.length === 0 && this.state.horario.miePm.length === 0 && this.state.selectedDay === "mie" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Miércoles. Para más información, comunicate con tu parroquia."
                        visible
                    />} 

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

                    {this.state.horario.jueAm.length === 0 && this.state.horario.juePm.length === 0 && this.state.selectedDay === "jue" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Jueves. Para más información, comunicate con tu parroquia."
                        visible
                    />}                      

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

                    {this.state.horario.vieAm.length === 0 && this.state.horario.viePm.length === 0 && this.state.selectedDay === "vie" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Viernes. Para más información, comunicate con tu parroquia."
                        visible
                    />}  

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

                    {this.state.horario.sabAm.length === 0 && this.state.horario.sabPm.length === 0 && this.state.selectedDay === "sab" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Sábado. Para más información, comunicate con tu parroquia."
                        visible
                    />}  

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

                    {this.state.horario.domAm.length === 0 && this.state.horario.domPm.length === 0 && this.state.selectedDay === "dom" && <Message
                        warning
                        header="No hay horarios programados."
                        content="No se han programado aún horarios ni en la mañana ni en la tarde para los días Domingo. Para más información, comunicate con tu parroquia."
                        visible
                    />} 

                    {this.state.selectedEucaristias.length > 0 && <Form.Field><Divider />
                      <label>Horarios escogidos</label>
                      <Card.Group itemsPerRow={this.state.selectedEucaristias.length >= 2 ? 2 : this.state.selectedEucaristias.length}>
                      {this.state.selectedEucaristias.map(h => {
                          return(
                              <Card key={h}>
                                  <Card.Content>
                                      <Card.Header>{dias.find(obj => {return obj.value === h.split(":")[1]}).text}</Card.Header> 
                                      <Card.Meta>{horariosAm.concat(horariosPm).find(obj => {return obj.key === h.split(":")[0]}).text}</Card.Meta>
                                      <Card.Meta>{this.state.semanas.find(obj => {return obj.value === h.split(":")[2]}).status === "current" ? "Esta semana" : "Próxima semana"}</Card.Meta>
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

                          fetch("/api/crearInscripcion", {
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
                    <Modal.Actions>
                      <List horizontal>
                          <List.Item id="tengo-un-codigo" href='#'onClick={() => this.setState({
                              step: 3, 
                              size: "mini", 
                              partiCode: "", 
                              parti: "",
                              errorEucaristiaParticular: ""})}>
                            <Icon name='qrcode' /> Tengo un Código - Eucaristia Particular
                          </List.Item>
                      </List>
                    </Modal.Actions>
                </Form>}
                
                {this.state.step === 3 && <Form>
                  <Form.Group widths='equal'>
                    <input
                      id="search-parti-eucaristia"
                      placeholder='Código de la Eucaristia'
                      onChange={e => this.setState({ partiCode: e.target.value })}
                      value={this.state.partiCode}
                      onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    />
                    <Button 
                      circular
                      icon='search'
                      color='teal'
                      disabled={!this.state.partiCode}
                      onClick={() => {
                          
                          const dataParticular = {
                              "partiCode": this.state.partiCode
                          };
      
                          let errorMsg = "";
      
                          fetch("/api/getEucaristiaParticular", {
                              method: "POST",
                              headers: {
                              "Content-Type": "application/json"
                              },
                              body: JSON.stringify(dataParticular)
                          }).then(resp =>
                              resp.json().then(data => {
                                  if(!resp.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      this.setState({ errorEucaristiaParticular: errorMsg });
                                  }
                                  else if (data.error){
                                      errorMsg = data.error;
                                      this.setState({ errorEucaristiaParticular: errorMsg, parti: "" });
                                  }
                                  else{
                                      this.setState({ 
                                          errorEucaristiaParticular: "",
                                          parti: data
                                      });
                                  }
                              })
                          );
                        }}
                      />
                  </Form.Group>

                  {this.state.errorEucaristiaParticular && <Message
                        error
                        header='Error en la inscripción'
                        content={this.state.errorEucaristiaParticular}
                        visible
                  />}

                  {this.state.parti && <Card fluid>
                    <Card.Content header={this.state.parti.hora + " - " + this.state.parti.dia + "/" + parseInt(this.state.parti.mes + 1) + "/" + this.state.parti.year } />
                    <Card.Content description={"Motivo: " + this.state.parti.motivo} />
                    <Card.Content extra>
                        <Icon name='ticket' /> {"Cupos: " + this.state.parti.cupos}
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='qrcode' /> {"Código: " + this.state.parti.partiCode}
                    </Card.Content>
                    <Card.Content extra>
                        {this.state.parti.cupos > 0 && <Button 
                          fluid
                          basic 
                          color='green' 
                          onClick={() => {
                          
                            const inscripcionData = {
                              eucaristias: [this.state.parti.id],
                              user: this.state.usuario
                            };
  
                            let errorMsg = "";
                            let day = "";
                            let hora = "";
  
                            fetch("/api/crearInscripcion", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(inscripcionData)
                            }).then(res =>
                              res.json().then(data => {
                                  if(!res.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      this.setState({ errorEucaristiaParticular: errorMsg });
                                  }
                                  else if (data.error){
                                      day = dias.find(obj => {return obj.value === data.horario.split(":")[1]}).text;
                                      hora = horariosAm.concat(horariosPm).find(obj => {return obj.value === data.horario.split(":")[0]}).text;
                                      errorMsg = data.error + ": " + day + " - " + hora;
                                      this.setState({ errorEucaristiaParticular: errorMsg });
                                  }
                                  else{
                                    this.close();
                                  }
                              })
                            );
                          }}>
                              ¡Guardar Cupo!
                        </Button>}
                        {this.state.parti.cupos === 0 && <Message
                            error
                            header='Cupos'
                            content="Ya no hay cupos disponibles en esta Eucaristia."
                            visible
                        />}
                    </Card.Content>
                  </Card>}
                
                  <Modal.Actions>
                    <List horizontal>
                        <List.Item id="tengo-un-codigo" href='#'onClick={() => this.setState({step: 2, size: "small"})}>
                          <Icon name='qrcode' /> NO tengo un código
                        </List.Item>
                    </List>
                  </Modal.Actions>
                </Form>}

          </Modal.Content>
        </Modal>
      </div>
    )
  }
}