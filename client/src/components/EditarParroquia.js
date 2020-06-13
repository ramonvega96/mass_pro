import React, { Component } from 'react'
import { Button, Modal, Form, Icon, Step, List, Message } from 'semantic-ui-react'

export default class ModalEditarParroquia extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            open: false, 
            step: 1,
            firstStepCompleted: false,
            secondStepCompleted: false,

            hLunAm: [],
            hLunPm: [],
            hMarAm: [],
            hMarPm: [],
            hMieAm: [],
            hMiePm: [],
            hJueAm: [],
            hJuePm: [],
            hVieAm: [],
            hViePm: [],
            hSabAm: [],
            hSabPm: [],
            hDomAm: [],
            hDomPm: []
        }
    }

    show = () => this.setState({ open: true })

    close = () => this.setState({ 
        open: false,
        step: 1,
        firstStepCompleted: false,
        secondStepCompleted: false,
        errorCreando: "",

        nombre: "",
        direccion: "",
        nit: "",
        telefono: "",
        parroco: "",
        capacidad: "",
        password: "",
        cPassword: "",

        hLunAm: [],
        hLunPm: [],
        hMarAm: [],
        hMarPm: [],
        hMieAm: [],
        hMiePm: [],
        hJueAm: [],
        hJuePm: [],
        hVieAm: [],
        hViePm: [],
        hSabAm: [],
        hSabPm: [],
        hDomAm: [],
        hDomPm: []
    });
  
  backToFirstStep = () => this.setState({ step: 1, errorCreando: "" })

  goToSecondStep = () => this.setState({ step: 2 })
  
  checkDataParroquia() {
      if(this.state.nombre &&
        this.state.direccion &&
        !isNaN(this.state.nit) &&
        this.state.nit &&
        !isNaN(this.state.telefono) &&
        this.state.telefono &&
        this.state.parroco &&
        !isNaN(this.state.capacidad) &&
        this.state.capacidad &&
        this.state.password &&
        this.state.cPassword &&
        this.state.cPassword === this.state.password){
            this.setState({ firstStepCompleted: true });
      }
      else{
        this.setState({ firstStepCompleted: false });
      }
    }

  render() {
    const { open } = this.state  

    const handleChange = (e, {value, id}) => {
        switch (id) {
            case 'hLunAm':
                this.setState({ hLunAm: value });
                break;
            case 'hMarAm':
                this.setState({ hMarAm: value });
                break;
            case 'hMieAm':
                this.setState({ hMieAm: value });
                break;
            case 'hJueAm':
                this.setState({ hJueAm: value });
                break;
            case 'hVieAm':
                this.setState({ hVieAm: value });
                break;
            case 'hSabAm':
                this.setState({ hSabAm: value });
                break;
            case 'hDomAm':
                this.setState({ hDomAm: value });
                break;
            case 'hLunPm':
                this.setState({ hLunPm: value });
                break;
            case 'hMarPm':
                this.setState({ hMarPm: value });
                break;
            case 'hMiePm':
                this.setState({ hMiePm: value });
                break;
            case 'hJuePm':
                this.setState({ hJuePm: value });
                break;
            case 'hViePm':
                this.setState({ hViePm: value });
                break;
            case 'hSabPm':
                this.setState({ hSabPm: value });
                break;
            case 'hDomPm':
                this.setState({ hDomPm: value });
                break;
            default:
                break
          }
    }

    const horariosAm = [
        {
          key: '600',
          text: '6:00 a.m',
          value: '600'
        },
        {
          key: '700',
          text: '7:00 a.m',
          value: '700'
        },
        {
            key: '800',
            text: '8:00 a.m',
            value: '800'
        },
        {
            key: '900',
            text: '9:00 a.m',
            value: '900'
        },
        {
            key: '1000',
            text: '10:00 a.m',
            value: '1000'
        },
        {
            key: '1100',
            text: '11:00 a.m',
            value: '1100'
        },
      ]

      const horariosPm = [
        {
          key: '1200',
          text: '12:00 p.m',
          value: '1200'
        },
        {
          key: '1300',
          text: '1:00 p.m',
          value: '1300'
        },
        {
            key: '1400',
            text: '2:00 p.m',
            value: '1400'
        },
        {
            key: '1500',
            text: '3:00 p.m',
            value: '1500'
        },
        {
            key: '1600',
            text: '4:00 p.m',
            value: '1600'
        },
        {
            key: '1700',
            text: '5:00 p.m',
            value: '1700'
        },
        {
            key: '1800',
            text: '6:00 p.m',
            value: '1800'
        },
      ]

    return (
      <div>
        <List celled horizontal>
            <List.Item href='#' onClick={this.show}>Agregar Parroquia</List.Item>
            <List.Item href='#'>Editar Parroquia</List.Item>
            <List.Item href='#'>Contactanos</List.Item>
        </List>

        <Modal size='small' open={open} onClose={this.close}>
            <Modal.Header>Agregar Parroquia</Modal.Header>
            
            <Step.Group> 
                <Step active={this.state.step === 1} completed={this.state.firstStepCompleted}>
                <Icon name='info' />
                <Step.Content>
                    <Step.Title>Datos Parroquia</Step.Title>
                    <Step.Description>Datos de la parroquia a inscribir</Step.Description>
                </Step.Content>
                </Step>

                <Step active={this.state.step === 2} completed={this.state.secondStepCompleted}>
                <Icon name='calendar alternate' />
                <Step.Content>
                    <Step.Title>Horarios</Step.Title>
                    <Step.Description>Horarios de las Eucaristias</Step.Description>
                </Step.Content>
                </Step>
            </Step.Group>
          

            <Modal.Content>
                {this.state.step === 1 && <Form>
                    <Form.Field required>
                        <label>Nombre de la Parroquia</label>
                        <input
                            placeholder='Nombre Parroquia' 
                            onChange={e => this.setState({ nombre: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.nombre}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Nombre del Parroco</label>
                        <input
                            placeholder='Nombre Parroco' 
                            onChange={e => this.setState({ parroco: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.parroco}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Número de Teléfono de la Parroquia</label>
                        <input
                            placeholder='Número de Teléfono (sin puntos, guiones o espacios)' 
                            onChange={e => this.setState({ telefono: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.telefono}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Dirección de la Parroquia</label>
                        <input 
                            placeholder='Dirección Parroquia' 
                            onChange={e => this.setState({ direccion: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.direccion}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Capacidad de la Parroquia</label>
                        <input 
                            placeholder='Capacidad Parroquia (Número de personas)' 
                            onChange={e => this.setState({ capacidad: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.capacidad}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Nit de la Parroquia</label>
                        <input 
                            placeholder='Nit Parroquia (sin puntos, guiones o espacios)' 
                            onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.nit}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Contraseña</label>
                            <input
                                type='password' 
                                placeholder='Escoja una contraseña'
                                onChange={e => this.setState({ password: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.password}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Confirmar Contraseña {this.state.password && this.state.cPassword && this.state.cPassword !== this.state.password && " (No coinciden)"}</label>
                            <input
                                icon='check circle'
                                type='password' 
                                placeholder='Escriba de nuevo la contraseña'
                                onChange={e => this.setState({ cPassword: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.cPassword}/>
                        </Form.Field>
                    </Form.Group>
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
                        disabled={!this.state.firstStepCompleted}
                        onClick={this.goToSecondStep}
                        />
                    </Button.Group>
                </Form>}

                {this.state.step === 2 && <Form>
                    {this.state.errorCreando && <Message
                        error
                        header='Error creando la parroquia'
                        content={this.state.errorCreando}
                        visible
                    />}
                    <label>Horario Lunes</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hLunAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hLunAm}
                        />
                        <Form.Select
                        id="hLunPm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hLunPm}
                        />
                    </Form.Group>
                    <label>Horario Martes</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hMarAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hMarAm}
                        />
                        <Form.Select
                        id="hMarPm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hMarPm}
                        />
                    </Form.Group>
                    <label>Horario Miércoles</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hMieAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hMieAm}
                        />
                        <Form.Select
                        id="hMiePm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hMiePm}
                        />
                    </Form.Group>
                    <label>Horario Jueves</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hJueAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hJueAm}
                        />
                        <Form.Select
                        id="hJuePm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hJuePm}
                        />
                    </Form.Group>
                    <label>Horario Viernes</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hVieAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hVieAm}
                        />
                        <Form.Select
                        id="hViePm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hViePm}
                        />
                    </Form.Group>
                    <label>Horario Sábado</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hSabAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hSabAm}
                        />
                        <Form.Select
                        id="hSabPm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hSabPm}
                        />
                    </Form.Group>
                    <label>Horario Domingo</label>
                    <Form.Group widths='equal'>
                        <Form.Select
                        id="hDomAm"
                        fluid
                        options={horariosAm}
                        placeholder='Horarios a.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hDomAm}
                        />
                        <Form.Select
                        id="hDomPm"
                        fluid
                        options={horariosPm}
                        placeholder='Horarios p.m'
                        selection
                        multiple
                        onChange={handleChange.bind(this)}
                        value={this.state.hDomPm}
                        />
                    </Form.Group>
                    <Button.Group>
                        <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={this.backToFirstStep}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='save outline'
                        labelPosition='right'
                        content='Guardar'
                        onClick={() => {
                            
                            var errorMsg = "";

                            const parroquia = { 
                                nombre: this.state.nombre, 
                                nit: this.state.nit, 
                                parroco: this.state.parroco, 
                                capacidad: this.state.capacidad, 
                                password: this.state.password, 
                                direccion: this.state.direccion,
                                telefono: this.state.telefono
                            };

                            const horario = { 
                                nit: this.state.nit, 
                                horario: {
                                    lun: [...this.state.hLunAm, ...this.state.hLunPm],
                                    mar: [...this.state.hMarAm, ...this.state.hMarPm],
                                    mie: [...this.state.hMieAm, ...this.state.hMiePm],
                                    jue: [...this.state.hJueAm, ...this.state.hJuePm],
                                    vie: [...this.state.hVieAm, ...this.state.hViePm],
                                    sab: [...this.state.hSabAm, ...this.state.hSabPm],
                                    dom: [...this.state.hDomAm, ...this.state.hDomPm]
                                }
                            };

                            fetch("/crearParroquia", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(parroquia)
                            }).then(r_1 =>
                                r_1.json().then(data => {
                                    if(!r_1.ok){
                                        errorMsg = "Error interno. Por favor vuelva a intentar.";
                                        this.setState({ errorCreando: errorMsg });
                                    }
                                    else if (data.error){
                                        errorMsg = data.error;
                                        this.setState({ errorCreando: errorMsg });
                                    }
                                    else{
                                        fetch("/crearHorarioParroquia", {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(horario)
                                          }).then(r_2 =>
                                            r_2.json().then(data => {
                                                  if(!r_2.ok){
                                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                                      this.setState({ errorCreando: errorMsg });
                                                  }
                                                  else if (data.error){
                                                      errorMsg = data.error;
                                                      this.setState({ errorCreando: errorMsg });
                                                  }
                                                  else{
                                                    this.props.onNewParroquia(parroquia);
                                                  }
                                              })
                                            );
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