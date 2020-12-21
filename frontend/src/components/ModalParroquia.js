import React, { Component } from 'react'
import { Button, Modal, Form, Icon, Step, List, Message, Checkbox, Tab, Table, Divider, TextArea, Card } from 'semantic-ui-react'
import jsPDF from 'jspdf';
import "jspdf-autotable";

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default class ModalParroquia extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            openInscribir: false,
            openEditar: false,
            openDownloadList: false,
            
            step: 1,

            authStepCompleted: false,
            infoStepCompleted: false,
            horarioStepCompleted: false,

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
            hDomPm: [],
            
            hParticular: "",
            motivo: "",
            cupos:"",
            searchCreate: "Crear",
            parti: "",           

            selectedDate: new Date(),
            eucaristias: [],
            autoEvalCovid: false,

            forgotPw: false,
            pwRecovered: false
        }
    }

    showInscribir = () => this.setState({ openInscribir: true, size: 'small' })
    showEditar = () => this.setState({ openEditar: true, size: 'mini' })
    showDownloadList = () => this.setState({ openDownloadList: true, size: 'mini', soyColaborador: false })    
    backToFirstStep = () => this.setState({ step: 1, errorCreando: "" })    
    
    downloadListaInscritos = (e) => {     
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Lista de Inscritos - " + this.state.nombre;
        
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const fecha = this.state.selectedDate.getDate() + " de " + months[this.state.selectedDate.getMonth()] + " de " + this.state.selectedDate.getFullYear();
        const hora = e.hora;
        
        const headers = [["NOMBRE", "C.C. / T.I.", "TELÉFONO", "DIRECCIÓN", "UBICACIÓN"]];

        const data = e.asistentes.map(a => [a.nombre, a.id, a.telefono, a.direccion, a.ubicacion]);

        let content = {
            theme: "grid",
            startY: 90,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.text("Fecha: " + fecha, marginLeft, 60);
        doc.text("Hora: " + hora, marginLeft, 80);
        doc.autoTable(content);
        doc.save(fecha + " - " + hora + " - Inscritos.pdf")
    }

    downloadReporteBio = (e) => {     
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Reporte Bioseguridad - " + this.state.nombre;
        
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const fecha = this.state.selectedDate.getDate() + " de " + months[this.state.selectedDate.getMonth()] + " de " + this.state.selectedDate.getFullYear();
        const hora = e.hora;
        
        const headers = [["NOMBRE", "C.C. / T.I.", "TELÉFONO", "DIRECCIÓN", "UBICACIÓN"]];

        let ausentes = e.asistentes.filter(e => !e.covidForm)
        let asistentes = e.asistentes.filter(e => e.covidForm)
        
        for (var i = 0; i < asistentes.length; i++) {
            let a = asistentes[i];

            if( i % 2 === 0){
                
                if(i > 0){
                    doc.addPage();
                }

                doc.text(title, marginLeft, 40);
                doc.text("Fecha: " + fecha + " - Hora: " + hora, marginLeft, 60);
            }

            let data = [
                [a.nombre, a.id, a.telefono, a.direccion, a.ubicacion], 
                [{
                    content: a.covidForm.p1.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p1.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p2.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p2.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p3.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p3.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p4.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p4.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p5.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p5.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p6.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p6.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p7.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p7.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p8.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p8.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p9.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p9.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p10.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p10.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p11.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p11.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p12.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p12.split(":")[1],
                    colSpan: 2
                }], 
                [{
                    content: a.covidForm.p13.split(":")[0],
                    colSpan: 3
                },
                {
                    content: a.covidForm.p13.split(":")[1],
                    colSpan: 2
                }]
            ];

            if(a.covidForm.p14){
                data.push(
                    [{
                        content: a.covidForm.p14.split(":")[0],
                        colSpan: 3
                    },
                    {
                        content: a.covidForm.p14.split(":")[1],
                        colSpan: 2
                    }]
                );
            }
            else{
                data.push(
                    [{
                        content: "No hay registro de temperatura.",
                        colSpan: 5,
                        styles: { halign: 'center', fillColor: [255, 209, 209] },
                    }]
                );
            }
            
            let content = {
                theme: "grid",
                startY: i % 2 === 0 ? 70 : 430,
                head: headers,
                body: data
            };

            doc.autoTable(content);
        }

        if(ausentes.length > 0){
            if(asistentes.length > 0){
                doc.addPage();
            }

            doc.text(title, marginLeft, 40);
            doc.text("Fecha: " + fecha + " - Hora: " + hora, marginLeft, 60);
            doc.text("Lista de inscritos SIN autoevaluación", marginLeft, 80);
            
            const data = ausentes.map(a => [a.nombre, a.id, a.telefono, a.direccion, a.ubicacion]);

            let content = {
                theme: "grid",
                startY: 90,
                head: headers,
                body: data
            };

            doc.autoTable(content);
        }
        
        doc.save(fecha + " - " + hora + " - Reporte.pdf")
    }

    close = () => this.setState({ 
        openInscribir: false,
        openEditar: false,
        openDownloadList: false,

        step: 1,
        authStepCompleted: false,
        infoStepCompleted: false,
        horarioStepCompleted: false,
        
        errorCreando: "",
        errorAuth: "",
        errorEditando: "",

        nombre: "",
        direccion: "",
        nit: "",
        telefono: "",
        parroco: "",
        capacidad: "",
        password: "",
        cPassword: "",
        diocesis: "",
        ubicacion: "",
        email: "",
        autoEvalCovid: false,

        selectedDate: new Date(),
        eucaristias: [],

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
        hDomPm: [],
        
        hParticular: "",
        motivo: "",
        cupos:"",
        searchCreate: "Crear",
        parti: "",

        codigoColaborador: "",
        forgotPw: false,
        pwRecovered: false
    });
  
  
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
        this.state.diocesis &&
        this.state.ubicacion &&
        this.state.email &&
        this.state.password &&
        this.state.cPassword &&
        this.state.cPassword === this.state.password){
            this.setState({ infoStepCompleted: true });
      }
      else{
        this.setState({ infoStepCompleted: false });
      }
    }

    checkDataAuth() {
        if(this.state.nit &&
          this.state.password){
              this.setState({ authStepCompleted: true });
        }
        else{
          this.setState({ authStepCompleted: false });
        }
    }

    checkDataPwRecover() {
        if(this.state.nit &&
            !isNaN(this.state.nit)){
            this.setState({ authStepCompleted: true, errorAuth: "" });
        }
        else{
            this.setState({ authStepCompleted: false, errorAuth: "" });
        }
    }

    handleChangeSearchCreate = (e, { value }) => this.setState({ 
        searchCreate: value, 
        errorEucaristiaParticular: "",
        parti: "" 
    })

    handleChangeCupos(evt) {
        const cupos = (evt.target.validity.valid) ? evt.target.value : this.state.cupos;
        this.setState({ cupos });
      }

  render() {
    const { openInscribir, openEditar, openDownloadList, size } = this.state

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
            case 'hParticular':
                this.setState({ hParticular: value, errorEucaristiaParticular: "", parti: "" });
                break;
            default:
                break
          }
    }

    const horariosAm = [
        {
            key: '400',
            text: '04:00 a.m',
            value: '400'
          },
          {
            key: '430',
            text: '04:30 a.m',
            value: '430'
          },
          {
            key: '500',
            text: '05:00 a.m',
            value: '500'
          },
          {
            key: '530',
            text: '05:30 a.m',
            value: '530'
          },
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
            value: '1230'
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
        {
            key: '2000',
            text: '08:00 p.m',
            value: '2000'
        },
        {
            key: '2030',
            text: '08:30 p.m',
            value: '2030'
        },
        {
            key: '2100',
            text: '09:00 p.m',
            value: '2100'
        },
        {
            key: '2130',
            text: '09:30 p.m',
            value: '2130'
        },
        {
            key: '2200',
            text: '10:00 p.m',
            value: '2200'
        },
        {
            key: '2230',
            text: '10:30 p.m',
            value: '2230'
        }
      ];

      const handleDateChange = (date, selectedHorario = "", asistenteId = "") => {
    
        var errorMsg = "";
        const fecha = {
            "dia": date.getDate(),
            "mes": date.getMonth(),
            "year": date.getFullYear(),
            "id": this.state.nit
        }

        fetch("/api/getEucaristiasPorDia", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(fecha)
          }).then(res =>
            res.json().then(resp => {
                if(!res.ok){
                    errorMsg = "Error interno. Por favor vuelva a intentar.";
                    this.setState({ 
                        errorGetInscritos: errorMsg,
                        selectedDate: date,
                        selectedHorario: "", 
                        asistente: "",
                        asistenteId: "", 
                        temperatura: "",
                        eucaristias: [] 
                    });
                }
                else if (resp.eucaristias.length < 1){
                    errorMsg = "No hay cupos reservados en las Eucaristias de este día.";
                    this.setState({ 
                        errorGetInscritos: errorMsg,
                        errorNonAvailable: "",
                        selectedDate: date,
                        selectedHorario: "", 
                        asistente: "",
                        asistenteId: "", 
                        temperatura: "",
                        eucaristias: []  
                    });
                }
                else{

                    resp.eucaristias.forEach(e => {
                        e.value = e.hora.endsWith("a.m") ? parseInt(horariosAm.find(obj => {return obj.text === e.hora}).value) : parseInt(horariosPm.find(obj => {return obj.text === e.hora}).value);
                        e.text = e.hora;
                    });

                    resp.eucaristias.sort(function(a, b) { 
                        return a.value - b.value;
                    })

                    if(resp.eucaristias.filter(e => e.available === true).length < 1){
                        errorMsg = "Las Eucaristias de este día ya no están disponibles para toma de asistencia.";
                        this.setState({ 
                            errorNonAvailable: errorMsg,
                            errorGetInscritos: "",
                            eucaristias: resp.eucaristias,
                            selectedDate: date 
                        });
                    }
                    else{
                        this.setState({ 
                            errorNonAvailable: "",
                            errorGetInscritos: "",
                            eucaristias: resp.eucaristias,
                            selectedDate: date
                         });
                    }

                    if(selectedHorario && asistenteId){
                        this.setState({ 
                            selectedEucaristia: resp.eucaristias.find(obj => {return obj.value === selectedHorario}),
                            asistentesEucaristia: resp.eucaristias.find(obj => {return obj.value === selectedHorario}).asistentes,
                            selectedHorario: selectedHorario,
                            asistente: resp.eucaristias.find(obj => {return obj.value === selectedHorario}).asistentes.find(obj => {return obj.id === asistenteId})
                        });
                    }

                    else if(selectedHorario && !isNaN(selectedHorario) && !asistenteId){
                        this.setState({ 
                            selectedEucaristia: resp.eucaristias.find(obj => {return obj.value === selectedHorario}),
                            asistentesEucaristia: resp.eucaristias.find(obj => {return obj.value === selectedHorario}).asistentes,
                            selectedHorario: selectedHorario,
                            asistente: "",
                            asistenteId: "", 
                            temperatura: ""
                        });
                    }

                    else{
                        this.setState({
                            selectedEucaristia: "",
                            asistentesEucaristia: [], 
                            selectedHorario: "",
                            asistente: "",
                            asistenteId: "", 
                            temperatura: "" 
                        });
                    }                    
                }
            })
          );
      };

      const handleDateParticularChange = (date) => {
          this.setState({selectedParticularDate: date, hParticular: "", parti: ""});
      };

      const handleChangeEucaristia = (e, {value}) => {
        this.setState({
            selectedEucaristia: this.state.eucaristias.find(obj => {return obj.value === value}),
            asistentesEucaristia: this.state.eucaristias.find(obj => {return obj.value === value}).asistentes,
            selectedHorario: value,
            asistenteId: "",
            asistente: "",
            temperatura: ""
        });
      };

      const handleChangeTemperatura = (temperatura) => {
          if(!isNaN(temperatura)){
            this.setState({ temperatura: temperatura });
          }
          else{
            this.setState({ temperatura: "" });
          }        
      };

      const lookForAsistente = (id) => {
          this.setState({asistenteId: id});
          const asistente = this.state.asistentesEucaristia.find(obj => {return obj.id === id})
          
          if (asistente){
              this.setState({asistente: asistente});
          }
          else{
            this.setState({asistente: "", temperatura: ""});
          }
      }

      const reportesBio = <Form>
            {this.state.errorGetInscritos && <Message
                error
                header='Importante'
                content={this.state.errorGetInscritos}
                visible
            />}

            <Form.Field>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        id="date-picker-dialog-reportes"
                        format="dd/MM/yyyy"
                        value={this.state.selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{'aria-label': 'change date'}}
                        />
                </MuiPickersUtilsProvider>
            </Form.Field>

            {!this.state.errorGetInscritos && <Message
                warning
                header='Importante'
                content="Si no sale el horario específico que buscas para este día, es porque no hay asistentes inscritos en ese horario."
                visible
            />}

            {this.state.eucaristias.length > 0 && <Form.Field>
                <Button.Group basic vertical fluid>
                    {this.state.eucaristias.map(res => {
                        return(
                            <Button key={res.hora}
                            icon='download' 
                            labelPosition='right' 
                            content={res.hora}
                            onClick={()=>{this.downloadListaInscritos(res)}}
                            />
                        )
                    })}
                </Button.Group>
            </Form.Field>} 
        </Form>

    const reportesNoBio = <Form>
        {this.state.errorGetInscritos && <Message
            error
            header='Importante'
            content={this.state.errorGetInscritos}
            visible
        />}

        <Form.Field>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    id="date-picker-dialog-reportes"
                    format="dd/MM/yyyy"
                    value={this.state.selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{'aria-label': 'change date'}}
                    />
            </MuiPickersUtilsProvider>
        </Form.Field>

        {!this.state.errorGetInscritos && <Message
            warning
            header='Importante'
            content="Si no sale el horario específico que buscas para este día, es porque no hay asistentes inscritos en ese horario."
            visible
        />}

        {this.state.eucaristias.length > 0 && <Form.Group widths='equal'>
            <Form.Field>
            <Button.Group basic vertical fluid>
                {this.state.eucaristias.map(res => {
                    return(
                        <Button key={res.hora}
                        icon='download' 
                        labelPosition='right' 
                        content={"Lista Inscritos - " + res.hora}
                        onClick={()=>{this.downloadListaInscritos(res)}}
                        />
                    )
                })}
            </Button.Group>
            </Form.Field>
            <Form.Field>
            <Button.Group basic vertical fluid>
                {this.state.eucaristias.map(res => {
                    return(
                        <Button key={res.hora}
                        icon='download' 
                        labelPosition='right' 
                        content={"Reporte Bioseguridad - " + res.hora}
                        onClick={()=>{this.downloadReporteBio(res)}}
                        />
                    )
                })}
            </Button.Group>
            </Form.Field>
        </Form.Group>} 
        </Form>
      
      
      const asistencia = <Form>
        
        {this.state.errorGetInscritos && <Message
                error
                header='Importante'
                content={this.state.errorGetInscritos}
                visible
        />}

        {this.state.errorNonAvailable && <Message
                warning
                header='Importante'
                content={this.state.errorNonAvailable}
                visible
        />}

        <Form.Field>
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
        </Form.Field>

        {this.state.eucaristias.length > 0 && !this.state.errorNonAvailable && <Form.Field required>
                <Form.Select
                    label='Horarios'
                    fluid
                    options={this.state.eucaristias.filter(e => e.available === true)}
                    placeholder='Seleccione el horario'
                    selection
                    value={this.state.selectedHorario}
                    onChange={handleChangeEucaristia.bind(this)}/>
            </Form.Field>}

            {this.state.selectedHorario && <Form.Field>
                {this.state.selectedEucaristia && !this.state.selectedEucaristia.colabCode && <Button            
                    color='teal'
                    icon='barcode'
                    labelPosition='left'
                    content={this.state.errorGenColabCode ? this.state.errorGenColabCode :'Generar Código Colaboradores'}
                    onClick={() => {
                        const dataColabCode = {
                            eucaristiaId: this.state.selectedEucaristia.id
                        }

                        let errorMsg = ""                        
                        
                        fetch("/api/generarColabCode", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(dataColabCode)
                          }).then(resp =>
                            resp.json().then(data => {
                                  if(!resp.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      this.setState({ errorRegistroIngreso: errorMsg });
                                  }
                                  else if (data.error){
                                    errorMsg = data.error;
                                    this.setState({ errorGenColabCode: errorMsg });
                                  }
                                  else{
                                    handleDateChange(this.state.selectedDate, this.state.selectedHorario, "");
                                    this.setState({ errorGenColabCode: "" });
                                  }
                              })
                        );
                    }}
                    />}

                    {this.state.selectedEucaristia && this.state.selectedEucaristia.colabCode && <Button            
                        color='teal'
                        icon='barcode'
                        labelPosition='left'
                        content={'Comparta este código con los colaboradores de la parroquia: '+ this.state.selectedEucaristia.colabCode}
                        disabled
                        />}
            </Form.Field>}

        {this.state.eucaristias.length > 0 && this.state.selectedEucaristia && !this.state.errorNonAvailable && <Form.Field required>
            <label>Cédula o Tarjeta de Identidad</label>
            <input
                placeholder='Identificación (sin puntos ni espacios)'
                value={this.state.asistenteId} 
                onChange={e => {lookForAsistente(e.target.value)}}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
        </Form.Field>}

        {this.state.asistente && !this.state.asistente.covidForm && <Message
                warning
                header='Importante'
                content='Aún no registra autoevaluación. El asistente debe llenarla para registrar el ingreso.'
                visible
        />}

        {this.state.asistente && <Form.Field>
            <Table celled >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Autoevaluación</Table.HeaderCell>
                    <Table.HeaderCell>Temperatura (ºC)</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row>
                    <Table.Cell>{this.state.asistente.nombre}</Table.Cell>
                    <Table.Cell>
                        <Icon name={this.state.asistente.covidForm ? "check" : "close"} color={this.state.asistente.covidForm ? "green" : "red"}/>
                    </Table.Cell>
                    <Table.Cell>
                        <input 
                        disabled={this.state.asistente.covidForm ? false : true} 
                        onChange={e => handleChangeTemperatura(e.target.value)}
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        />
                    </Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>
        </Form.Field>}

        {this.state.asistente && this.state.asistente.covidForm && this.state.asistente.covidForm.p14 && <Message
                warning
                header='Importante'
                content='Ya se registró el ingreso de este usuario. Si desea corregir su temperatura vuelva a enviar este formulario.'
                visible
        />}

        {this.state.temperatura && <Button            
                positive
                icon='save outline'
                labelPosition='right'
                content='Registrar Ingreso'
                onClick={() => {
                    
                    const dataIngreso = {
                        userId: this.state.asistenteId,
                        temperatura: this.state.temperatura,
                        eucaristiaId: this.state.selectedEucaristia.id
                    };

                    let errorMsg = "";

                    fetch("/api/registrarIngreso", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataIngreso)
                      }).then(resp =>
                        resp.json().then(() => {
                              if(!resp.ok){
                                  errorMsg = "Error interno. Por favor vuelva a intentar.";
                                  this.setState({ errorRegistroIngreso: errorMsg });
                              }
                              else{
                                handleDateChange(this.state.selectedDate, this.state.selectedHorario, "");
                              }
                          })
                    );
                }}
            />}
        
        {this.state.asistente && !this.state.asistente.covidForm && <Button            
                color='yellow'
                icon='redo'
                labelPosition='right'
                content='Refrescar datos'
                onClick={() => handleDateChange(this.state.selectedDate, this.state.selectedHorario, this.state.asistenteId)}
                />}

        {!this.state.asistente && !this.state.errorNonAvailable && <Button            
                color='yellow'
                icon='redo'
                labelPosition='right'
                content='Refrescar datos'
                onClick={() => handleDateChange(this.state.selectedDate, this.state.selectedHorario, this.state.asistenteId)}
                />}

    </Form>
    
    const asistenciaColab = <Form>

        <Form.Field required>
            <label>Cédula o Tarjeta de Identidad</label>
            <input
                placeholder='Identificación (sin puntos ni espacios)'
                value={this.state.asistenteId} 
                onChange={e => {lookForAsistente(e.target.value)}}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
        </Form.Field>

        {this.state.asistente && !this.state.asistente.covidForm && <Message
                warning
                header='Importante'
                content='Aún no registra autoevaluación. El asistente debe llenarla para registrar el ingreso.'
                visible
        />}

        {this.state.asistente && <Form.Field>
            <Table celled >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Autoevaluación</Table.HeaderCell>
                    <Table.HeaderCell>Temperatura (ºC)</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row>
                    <Table.Cell>{this.state.asistente.nombre}</Table.Cell>
                    <Table.Cell>
                        <Icon name={this.state.asistente.covidForm ? "check" : "close"} color={this.state.asistente.covidForm ? "green" : "red"}/>
                    </Table.Cell>
                    <Table.Cell>
                        <input 
                        disabled={this.state.asistente.covidForm ? false : true} 
                        onChange={e => handleChangeTemperatura(e.target.value)}
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        />
                    </Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>
        </Form.Field>}

        {this.state.asistente && this.state.asistente.covidForm && this.state.asistente.covidForm.p14 && <Message
                warning
                header='Importante'
                content='Ya se registró el ingreso de este usuario. Si desea corregir su temperatura vuelva a enviar este formulario.'
                visible
        />}

        {this.state.temperatura && <Button            
                positive
                icon='save outline'
                labelPosition='right'
                content='Registrar Ingreso'
                onClick={() => {
                    
                    const dataIngreso = {
                        userId: this.state.asistenteId,
                        temperatura: this.state.temperatura,
                        eucaristiaId: this.state.selectedEucaristia.id
                    };

                    let errorMsg = "";

                    fetch("/api/registrarIngreso", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataIngreso)
                      }).then(resp =>
                        resp.json().then(() => {
                              if(!resp.ok){
                                  errorMsg = "Error interno. Por favor vuelva a intentar.";
                                  this.setState({ errorRegistroIngreso: errorMsg });
                              }
                              else{

                                const colabCode = {
                                    colabCode : parseInt(this.state.codigoColaborador)
                                }

                                let errorMsg = "";

                                fetch("/api/getEucaristiaColaborador", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(colabCode)
                                  }).then(resp =>
                                    resp.json().then(data => {
                                          if(!resp.ok){
                                              errorMsg = "Error interno. Por favor vuelva a intentar.";
                                              this.setState({ errorColabCodeEucaristia: errorMsg });
                                          }
                                          else if (data.error){
                                            errorMsg = data.error;
                                            this.setState({ errorColabCodeEucaristia: errorMsg });
                                          }
                                          else{
                                            this.setState({ 
                                                errorColabCodeEucaristia: "", 
                                                selectedEucaristia: data,
                                                asistentesEucaristia: data.asistentes,
                                                asistenteId: "",
                                                asistente: "", 
                                                temperatura: ""
                                            });
                                          }
                                      })
                                );
                              }
                          })
                    );
                }}
            />}
        
        {this.state.asistente && !this.state.asistente.covidForm && <Button            
                color='yellow'
                icon='redo'
                labelPosition='right'
                content='Refrescar datos'
                onClick={() => {
                    const colabCode = {
                        colabCode : parseInt(this.state.codigoColaborador)
                    }

                    let errorMsg = "";

                    fetch("/api/getEucaristiaColaborador", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(colabCode)
                      }).then(resp =>
                        resp.json().then(data => {
                              if(!resp.ok){
                                  errorMsg = "Error interno. Por favor vuelva a intentar.";
                                  this.setState({ errorColabCodeEucaristia: errorMsg });
                              }
                              else if (data.error){
                                errorMsg = data.error;
                                this.setState({ errorColabCodeEucaristia: errorMsg });
                              }
                              else{
                                this.setState({ 
                                    errorColabCodeEucaristia: "", 
                                    selectedEucaristia: data,
                                    asistentesEucaristia: data.asistentes,
                                    asistente: data.asistentes.find(obj => {return obj.id === this.state.asistenteId})
                                });
                              }
                          })
                    );
                }}
                />}

            {!this.state.asistente && <Button            
                color='yellow'
                icon='redo'
                labelPosition='right'
                content='Refrescar datos'
                onClick={() => {
                    const colabCode = {
                        colabCode : parseInt(this.state.codigoColaborador)
                    }

                    let errorMsg = "";

                    fetch("/api/getEucaristiaColaborador", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(colabCode)
                      }).then(resp =>
                        resp.json().then(data => {
                              if(!resp.ok){
                                  errorMsg = "Error interno. Por favor vuelva a intentar.";
                                  this.setState({ errorColabCodeEucaristia: errorMsg });
                              }
                              else if (data.error){
                                errorMsg = data.error;
                                this.setState({ errorColabCodeEucaristia: errorMsg });
                              }
                              else{
                                this.setState({ 
                                    errorColabCodeEucaristia: "", 
                                    selectedEucaristia: data,
                                    asistentesEucaristia: data.asistentes,
                                    asistente: data.asistentes.find(obj => {return obj.id === this.state.asistenteId})
                                });
                              }
                          })
                    );
                }}
            />}

    </Form> 
    
    const crearParticular = <Form>
            <Form.Field required>
                <label>Fecha</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    id="date-picker-dialog-crear-particular"                        
                    format="dd/MM/yyyy"
                    value={this.state.selectedParticularDate}
                    onChange={handleDateParticularChange}
                    KeyboardButtonProps={{'aria-label': 'change date'}}
                    minDate={new Date()}
                    />
                </MuiPickersUtilsProvider>
            </Form.Field>
            <Form.Field required>
                <label>Hora</label>
                <Form.Select
                    id="hParticular"
                    fluid
                    options={horariosAm.concat(horariosPm)}
                    placeholder='Hora'
                    selection
                    onChange={handleChange.bind(this)}
                    value={this.state.hParticular}
                    />
            </Form.Field>
            
            <Form.Field>
                Quiero: <b>{this.state.searchCreate} una Eucaristia</b>
            </Form.Field>
            <Form.Field>
                <Checkbox
                    radio
                    label='Crear una Eucaristia'
                    name='checkboxRadioGroup'
                    value='Crear'
                    checked={this.state.searchCreate === 'Crear'}
                    onChange={this.handleChangeSearchCreate}
                />
            </Form.Field>
            <Form.Field>
                <Checkbox
                    radio
                    label='Buscar una Eucaristia'
                    name='checkboxRadioGroup'
                    value='Buscar'
                    checked={this.state.searchCreate === 'Buscar'}
                    onChange={this.handleChangeSearchCreate}
                />
            </Form.Field>
            
            {this.state.searchCreate === "Crear" && <Form.Field required>
                <label>Motivo Eucaristia</label>
                <TextArea 
                    onChange={e => this.setState({ motivo: e.target.value })}
                    value={this.state.motivo}/>
            </Form.Field>}

            {this.state.searchCreate === "Crear" && <Form.Field required>
                <label>Cupos</label>
                <input
                    type="text"
                    pattern="[0-9]*" 
                    placeholder='Cantidad asistentes'                     
                    onInput={this.handleChangeCupos.bind(this)}
                    value={this.state.cupos}
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
            </Form.Field>}
            
            {this.state.errorEucaristiaParticular && <Message
                error
                header='¡Error!'
                content={this.state.errorEucaristiaParticular}
                visible
            />}

            {this.state.searchCreate === "Buscar" && <Button
                color='teal'
                icon='search'
                labelPosition='left'
                content='Buscar'
                disabled={!this.state.hParticular}
                onClick={() => {
                    
                    const dataParticular = {
                        "hora": this.state.hParticular,
                        "dia": this.state.selectedParticularDate.getDate(),
                        "mes": this.state.selectedParticularDate.getMonth(),
                        "year": this.state.selectedParticularDate.getFullYear(),
                        "nit": this.state.nit
                    };

                    let errorMsg = "";
                    
                    fetch("/api/buscarEucaristiaParticular", {
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
                                this.setState({ 
                                    errorEucaristiaParticular: errorMsg 
                                });
                            }
                            else{
                                this.setState({ 
                                    errorEucaristiaParticular: "",
                                    hParticular: "",
                                    parti: data  
                                });
                            }
                        })
                    );
                }}
            />}
            
            {this.state.searchCreate === "Crear" && <Button            
                color='green'
                icon='magic'
                labelPosition='right'
                content='Crear'
                disabled={!this.state.motivo || !this.state.hParticular || !this.state.cupos}
                onClick={() => {
                    
                    const dataParticular = {
                        "hora": this.state.hParticular,
                        "dia": this.state.selectedParticularDate.getDate(),
                        "mes": this.state.selectedParticularDate.getMonth(),
                        "year": this.state.selectedParticularDate.getFullYear(),
                        "nit": this.state.nit,
                        "motivo": this.state.motivo,
                        "capacidad": parseInt(this.state.cupos)
                    };

                    const selectedFecha = new Date(dataParticular.year, 
                        dataParticular.mes, 
                        dataParticular.dia, 
                        Math.floor(dataParticular.hora/100),
                        dataParticular.hora - Math.floor(dataParticular.hora/100)*100);

                    if (selectedFecha > new Date()){
                        let errorMsg = "";
                        
                        fetch("/api/createEucaristiaParticular", {
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
                                    this.setState({ errorEucaristiaParticular: errorMsg });
                                }
                                else{
                                    this.setState({ 
                                        errorEucaristiaParticular: "",
                                        hParticular: "",
                                        motivo: "",
                                        cupos: "",
                                        parti: data
                                    });
                                }
                            })
                        );
                    }

                    else{
                        this.setState({ errorEucaristiaParticular: "No se puede crear una Eucaristia en el pasado." });
                    }
                }}
            />}
            
            {this.state.parti && <Card fluid>
                <Card.Content header={this.state.parti.hora + " - " + this.state.parti.dia + "/" + parseInt(this.state.parti.mes + 1) + "/" + this.state.parti.year } />
                <Card.Content description={"Motivo: " + this.state.parti.motivo} />
                <Card.Content extra>
                    <Icon name='ticket' /> {"Cupos: " + this.state.parti.cupos}
                </Card.Content>
                <Card.Content extra>
                    <Icon name='qrcode' /> {"Código: " + this.state.parti.partiCode + " - (Comparta este código)"}
                </Card.Content>
            </Card>}

        </Form>

      const panesBio = [
        {
          menuItem: 'Asistencia',
          pane: { 
              key: 'tab1', 
              content: asistencia
            }
        },
        {
          menuItem: 'Reportes',
          pane: {
            key: 'tab2',
            content: reportesNoBio
          }
        },
        {
          menuItem: 'Eucaristias Particulares',
          pane: {
            key: 'tab3',
            content: crearParticular
          }
        }
      ];

      const panesBioColab = [
        {
          menuItem: 'Asistencia',
          pane: { 
              key: 'tab1', 
              content: asistenciaColab
            }
        }
      ];

      const panesNoBio = [
        {
          menuItem: 'Listas',
          pane: {
            key: 'tab1',
            content: reportesBio
          }
        },
        {
          menuItem: 'Eucaristias Particulares',
          pane: {
            key: 'tab2',
            content: crearParticular
          }
        }
      ];

    return (
      <div>
        <List celled horizontal>
            <List.Item href='#' onClick={this.showInscribir}>Agregar Parroquia</List.Item>
            <List.Item href='#' onClick={this.showEditar}>Editar Parroquia</List.Item>
            <List.Item href='#' onClick={this.showDownloadList}>Asistencia</List.Item>
        </List>

        <Modal size={size} open={openInscribir} onClose={this.close} closeOnEscape={false} closeOnDimmerClick={false}>
            <Modal.Header>Agregar Parroquia</Modal.Header>
            
            <Step.Group> 
                <Step active={this.state.step === 1} completed={this.state.infoStepCompleted}>
                <Icon name='info' />
                <Step.Content>
                    <Step.Title>Datos Parroquia</Step.Title>
                    <Step.Description>Datos de la parroquia a inscribir</Step.Description>
                </Step.Content>
                </Step>

                <Step active={this.state.step === 2} completed={this.state.horarioStepCompleted}>
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
                        <label>Diocesis</label>
                        <input
                            placeholder='Diocesis a la que pertenece' 
                            onChange={e => this.setState({ diocesis: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.diocesis}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Ubicación: Ciudad / Municipio</label>
                        <input
                            placeholder='Ciudad / Municipio donde se encuentra' 
                            onChange={e => this.setState({ ubicacion: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.ubicacion}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>                          
                    <Form.Field required>
                        <label>Nombre de la Parroquia</label>
                        <input
                            placeholder='Nombre Parroquia' 
                            onChange={e => this.setState({ nombre: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.nombre}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Nombre del Parroco</label>
                        <input
                            placeholder='Nombre Parroco' 
                            onChange={e => this.setState({ parroco: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.parroco}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Número de Teléfono de la Parroquia</label>
                        <input
                            placeholder='Número de Teléfono (sin puntos, guiones o espacios)' 
                            onChange={e => this.setState({ telefono: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.telefono}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Email</label>
                        <input
                            placeholder='Correo Electrónico' 
                            onChange={e => this.setState({ email: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.email}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field> 
                    <Form.Field required>
                        <label>Dirección de la Parroquia</label>
                        <input 
                            placeholder='Dirección Parroquia' 
                            onChange={e => this.setState({ direccion: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.direccion}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Capacidad de la Parroquia - Considere restricciones de aforo COVID</label>
                        <input 
                            placeholder='Capacidad Parroquia (Número de personas - Considerando restricciones de aforo COVID)' 
                            onChange={e => this.setState({ capacidad: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.capacidad}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Nit de la Parroquia</label>
                            <input 
                                placeholder='Nit Parroquia (sin puntos, guiones o espacios)' 
                                onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.nit}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                        </Form.Field>
                        <Form.Field>
                            <label id='auto-eval-covid'>¿Habilitar autoevaluación COVID?</label>
                            <Checkbox 
                                label='Si, habilitar autoevaluación COVID'
                                checked={this.state.autoEvalCovid}
                                onChange={() => this.setState({ autoEvalCovid: !this.state.autoEvalCovid })} 
                                />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Contraseña</label>
                            <input
                                type='password' 
                                placeholder='Escoja una contraseña'
                                onChange={e => this.setState({ password: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.password}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Confirmar Contraseña {this.state.password && this.state.cPassword && this.state.cPassword !== this.state.password && " (No coinciden)"}</label>
                            <input
                                icon='check circle'
                                type='password' 
                                placeholder='Escriba de nuevo la contraseña'
                                onChange={e => this.setState({ cPassword: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.cPassword}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
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
                        disabled={!this.state.infoStepCompleted}
                        onClick={e => this.setState({ step: 2 })}
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
                                diocesis: this.state.diocesis,
                                ubicacion: this.state.ubicacion,
                                email: this.state.email, 
                                nombre: this.state.nombre, 
                                nit: this.state.nit, 
                                parroco: this.state.parroco, 
                                capacidad: this.state.capacidad, 
                                password: this.state.password, 
                                direccion: this.state.direccion,
                                telefono: this.state.telefono,
                                autoEvalCovid: this.state.autoEvalCovid
                            };

                            const horario = { 
                                nit: this.state.nit, 
                                horario: {
                                    lunAm: this.state.hLunAm,
                                    marAm: this.state.hMarAm,
                                    mieAm: this.state.hMieAm,
                                    jueAm: this.state.hJueAm,
                                    vieAm: this.state.hVieAm,
                                    sabAm: this.state.hSabAm,
                                    domAm: this.state.hDomAm,
                                    lunPm: this.state.hLunPm,
                                    marPm: this.state.hMarPm,
                                    miePm: this.state.hMiePm,
                                    juePm: this.state.hJuePm,
                                    viePm: this.state.hViePm,
                                    sabPm: this.state.hSabPm,
                                    domPm: this.state.hDomPm
                                }
                            };

                            fetch("/api/crearParroquia", {
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
                                        fetch("/api/crearHorarioParroquia", {
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
                                                    this.setState({ horarioStepCompleted: true, step: 3 });
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

                {this.state.horarioStepCompleted && this.state.step === 3 && <Form>
                    <Message
                        positive
                        header='¡Solicitud Enviada!'
                        content='Recibimos tú solicitud de inscripción. Una vez procesada, se enviará un email de confirmación al correo de la Parroquia.'
                        icon='paper plane'
                        visible
                    />    
                    <Button.Group>
                        <Button
                        positive
                        icon='smile outline'
                        labelPosition='left'
                        content='¡Listo!'
                        onClick={this.close}
                        />
                    </Button.Group>                
                </Form>}

            </Modal.Content>
        </Modal>

        <Modal size={size} open={openEditar} onClose={this.close} closeOnEscape={false} closeOnDimmerClick={false}>
            <Modal.Header>Editar Parroquia</Modal.Header>
            
            {this.state.step > 1 && <Step.Group>
                <Step active={this.state.step === 2} completed={this.state.infoStepCompleted}>
                <Icon name='info' />
                <Step.Content>
                    <Step.Title>Datos Parroquia</Step.Title>
                    <Step.Description>Datos de la parroquia</Step.Description>
                </Step.Content>
                </Step>

                <Step active={this.state.step === 3} completed={this.state.horarioStepCompleted}>
                <Icon name='calendar alternate' />
                <Step.Content>
                    <Step.Title>Horarios</Step.Title>
                    <Step.Description>Horarios de las Eucaristias</Step.Description>
                </Step.Content>
                </Step>
            </Step.Group>}
          

            <Modal.Content>
            {this.state.step === 1 && <Form>
                    {this.state.errorAuth && <Message
                        error
                        header='Error en la autenticación'
                        content={this.state.errorAuth}
                        visible
                    />}
                    <Form.Field required>
                        <label>Nit de la Parroquia</label>
                        <input
                            placeholder='Nit de la Parroquia' 
                            onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataAuth())}
                            value={this.state.nit}
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
                                nit: this.state.nit,
                                password: this.state.password
                            }

                            fetch("/api/auth", {
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
                                            size:'small', 
                                            authStepCompleted: true,
                                            step: 2,
                                            diocesis: data.parroquia.diocesis,
                                            ubicacion: data.parroquia.ubicacion,
                                            email: data.parroquia.email,
                                            nombre: data.parroquia.nombre,
                                            parroco: data.parroquia.parroco, 
                                            capacidad: data.parroquia.capacidad,
                                            direccion: data.parroquia.direccion,
                                            telefono: data.parroquia.telefono,
                                            autoEvalCovid: data.parroquia.autoEvalCovid,
                                            hLunAm: data.horario.horario.lunAm,
                                            hLunPm: data.horario.horario.lunPm,
                                            hMarAm: data.horario.horario.marAm,
                                            hMarPm: data.horario.horario.marPm,
                                            hMieAm: data.horario.horario.mieAm,
                                            hMiePm: data.horario.horario.miePm,
                                            hJueAm: data.horario.horario.jueAm,
                                            hJuePm: data.horario.horario.juePm,
                                            hVieAm: data.horario.horario.vieAm,
                                            hViePm: data.horario.horario.viePm,
                                            hSabAm: data.horario.horario.sabAm,
                                            hSabPm: data.horario.horario.sabPm,
                                            hDomAm: data.horario.horario.domAm,
                                            hDomPm: data.horario.horario.domPm
                                          });
                                    }
                                })
                              );
                        }}
                        />
                    </Button.Group>
                    <Modal.Actions>
                      <List celled horizontal>
                          <List.Item href='#'onClick={() => this.setState({forgotPw: true, nit: "", step: 0})                              
                            }>Olvidé la contraseña</List.Item>
                      </List>
                    </Modal.Actions>
                </Form>}

                {this.state.forgotPw && <Form>
                  
                  {!this.state.pwdSent && !this.state.errorAuth && <Message
                        warning
                        header='Recuperar contraseña'
                        content='Para recuperar la contraseña necesitamos identificar la parroquia.'
                        visible
                    />}

                  <Form.Field required>
                        <label>Nit de la parroquia</label>
                        <input
                            placeholder='NIT (sin puntos ni espacios)' 
                            onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataPwRecover())}
                            value={this.state.nit}
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
                          nit: "", 
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
                            "nit": this.state.nit
                          }

                          fetch("/api/forgotParroquiaPassword", {
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

                {this.state.step === 2 && <Form>
                    <Form.Field required>
                        <label>Diocesis</label>
                        <input
                            placeholder='Diocesis a la que pertenece' 
                            onChange={e => this.setState({ diocesis: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.diocesis}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Ubicación: Ciudad / Municipio</label>
                        <input
                            placeholder='Ciudad / Municipio donde se encuentra' 
                            onChange={e => this.setState({ ubicacion: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.ubicacion}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>  
                    <Form.Field required>
                        <label>Nombre de la Parroquia</label>
                        <input
                            placeholder='Nombre Parroquia' 
                            onChange={e => this.setState({ nombre: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.nombre}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Nombre del Parroco</label>
                        <input
                            placeholder='Nombre Parroco' 
                            onChange={e => this.setState({ parroco: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.parroco}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Número de Teléfono de la Parroquia</label>
                        <input
                            placeholder='Número de Teléfono (sin puntos, guiones o espacios)' 
                            onChange={e => this.setState({ telefono: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.telefono}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Email</label>
                        <input
                            placeholder='Correo Electrónico' 
                            onChange={e => this.setState({ email: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.email}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>  
                    <Form.Field required>
                        <label>Dirección de la Parroquia</label>
                        <input 
                            placeholder='Dirección Parroquia' 
                            onChange={e => this.setState({ direccion: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.direccion}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Capacidad de la Parroquia - Considere restricciones de aforo COVID</label>
                        <input 
                            placeholder='Capacidad Parroquia (Número de personas - Considerando restricciones de aforo COVID)' 
                            onChange={e => this.setState({ capacidad: e.target.value }, () => this.checkDataParroquia())}
                            value={this.state.capacidad}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Nit de la Parroquia</label>
                            <input 
                                placeholder='Nit Parroquia (sin puntos, guiones o espacios)'
                                disabled={true}
                                value={this.state.nit}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                        </Form.Field>
                        <Form.Field>
                            <label id='auto-eval-covid'>¿Habilitar autoevaluación COVID?</label>
                            <Checkbox 
                                label='Si, habilitar autoevaluación COVID'
                                checked={this.state.autoEvalCovid}
                                onChange={() => this.setState({ autoEvalCovid: !this.state.autoEvalCovid })} 
                                />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Contraseña</label>
                            <input
                                type='password' 
                                placeholder='Escoja una contraseña'
                                onChange={e => this.setState({ password: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.password}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Confirmar Contraseña {this.state.password && this.state.cPassword && this.state.cPassword !== this.state.password && " (No coinciden)"}</label>
                            <input
                                type='password' 
                                placeholder='Escriba de nuevo la contraseña'
                                onChange={e => this.setState({ cPassword: e.target.value }, () => this.checkDataParroquia())}
                                value={this.state.cPassword}
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
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
                        disabled={!this.state.infoStepCompleted}
                        onClick={e => this.setState({ step: 3 })}
                        />
                    </Button.Group>
                </Form>}

                {this.state.step === 3 && <Form>
                    {this.state.errorEditando && <Message
                        error
                        header='Error editando la parroquia'
                        content={this.state.errorEditando}
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
                        onClick={e => this.setState({ step: 2, errorEditando: "" })}
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
                                nit: this.state.nit, 
                                newNombre: this.state.nombre,
                                newDiocesis: this.state.diocesis,
                                newUbicacion: this.state.ubicacion,
                                newEmail: this.state.email,
                                newParroco: this.state.parroco, 
                                newCapacidad: this.state.capacidad, 
                                newPassword: this.state.password, 
                                newDireccion: this.state.direccion,
                                newTelefono: this.state.telefono,
                                newAutoEvalCovid: this.state.autoEvalCovid
                            };

                            const horario = { 
                                nit: this.state.nit, 
                                horario: {
                                    lunAm: this.state.hLunAm,
                                    marAm: this.state.hMarAm,
                                    mieAm: this.state.hMieAm,
                                    jueAm: this.state.hJueAm,
                                    vieAm: this.state.hVieAm,
                                    sabAm: this.state.hSabAm,
                                    domAm: this.state.hDomAm,
                                    lunPm: this.state.hLunPm,
                                    marPm: this.state.hMarPm,
                                    miePm: this.state.hMiePm,
                                    juePm: this.state.hJuePm,
                                    viePm: this.state.hViePm,
                                    sabPm: this.state.hSabPm,
                                    domPm: this.state.hDomPm
                                }
                            };

                            fetch("/api/editarParroquia", {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(parroquia)
                            }).then(r_1 =>
                                r_1.json().then(data => {
                                    if(!r_1.ok){
                                        errorMsg = "Error interno. Por favor vuelva a intentar.";
                                        this.setState({ errorEditando: errorMsg });
                                    }
                                    else if (data.error){
                                        errorMsg = data.error;
                                        this.setState({ errorEditando: errorMsg });
                                    }
                                    else{
                                        fetch("/api/editarHorarioParroquia", {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(horario)
                                          }).then(r_2 =>
                                            r_2.json().then(data => {
                                                  if(!r_2.ok){
                                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                                      this.setState({ errorEditando: errorMsg });
                                                  }
                                                  else if (data.error){
                                                    errorMsg = data.error;
                                                    this.setState({ errorEditando: errorMsg });
                                                }
                                                else{
                                                    this.props.onParroquiaChange(parroquia);
                                                    this.setState({ horarioStepCompleted: true });
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

        <Modal size={size} open={openDownloadList} onClose={this.close} closeIcon closeOnEscape={false} closeOnDimmerClick={false}>
            <Modal.Header>Asistencia</Modal.Header>          

            <Modal.Content>
            {this.state.step === 1 && <Form>
                    {this.state.errorAuth && <Message
                        error
                        header='Error en la autenticación'
                        content={this.state.errorAuth}
                        visible
                    />}
                    <Form.Field required>
                        <label>Nit de la Parroquia</label>
                        <input
                            placeholder='Nit de la Parroquia' 
                            onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataAuth())}
                            value={this.state.nit}
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
                                nit: this.state.nit,
                                password: this.state.password
                            }

                            fetch("/api/auth", {
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
                                        handleDateChange(this.state.selectedDate);
                                        handleDateParticularChange(this.state.selectedDate);
                                        this.setState({
                                            authStepCompleted: true,
                                            step: 2,
                                            size: "small",
                                            diocesis: data.parroquia.diocesis,
                                            ubicacion: data.parroquia.ubicacion,
                                            email: data.parroquia.email,
                                            nombre: data.parroquia.nombre,
                                            parroco: data.parroquia.parroco, 
                                            capacidad: data.parroquia.capacidad,
                                            direccion: data.parroquia.direccion,
                                            telefono: data.parroquia.telefono,
                                            autoEvalCovid: data.parroquia.autoEvalCovid,
                                            hLunAm: data.horario.horario.lunAm,
                                            hLunPm: data.horario.horario.lunPm,
                                            hMarAm: data.horario.horario.marAm,
                                            hMarPm: data.horario.horario.marPm,
                                            hMieAm: data.horario.horario.mieAm,
                                            hMiePm: data.horario.horario.miePm,
                                            hJueAm: data.horario.horario.jueAm,
                                            hJuePm: data.horario.horario.juePm,
                                            hVieAm: data.horario.horario.vieAm,
                                            hViePm: data.horario.horario.viePm,
                                            hSabAm: data.horario.horario.sabAm,
                                            hSabPm: data.horario.horario.sabPm,
                                            hDomAm: data.horario.horario.domAm,
                                            hDomPm: data.horario.horario.domPm
                                        });
                                    }
                                })
                              );
                        }}
                        />
                    </Button.Group>
                    
                    <Modal.Actions>
                      <List celled horizontal>
                          <List.Item href='#'onClick={() => this.setState({forgotPw: true, nit: "", step: 0})                              
                            }>Olvidé la contraseña</List.Item>
                      </List>
                    </Modal.Actions>
                    
                    
                    <Divider />
                    <Form.Field>
                        <Button  fluid          
                            color='teal'
                            icon='hand point up'
                            labelPosition='left'
                            content='Soy Colaborador'
                            onClick={() => this.setState({soyColaborador: !this.state.soyColaborador})}
                        />
                    </Form.Field>
                    
                    {this.state.soyColaborador && <Form.Field required>
                        <label>Código colaborador</label>
                        <input
                            placeholder='Código colaborador' 
                            onChange={e => this.setState({ codigoColaborador: e.target.value })}
                            value={this.state.codigoColaborador}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>}

                    {this.state.soyColaborador && this.state.codigoColaborador && <Form.Field>
                        <Button  fluid          
                            color='green'
                            icon='eye'
                            labelPosition='left'
                            content='Validar Código'
                            onClick={() => {
                                if(!isNaN(this.state.codigoColaborador)){
                                    const colabCode = {
                                        colabCode : parseInt(this.state.codigoColaborador)
                                    }
    
                                    let errorMsg = "";
    
                                    fetch("/api/getEucaristiaColaborador", {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(colabCode)
                                      }).then(resp =>
                                        resp.json().then(data => {
                                              if(!resp.ok){
                                                  errorMsg = "Error interno. Por favor vuelva a intentar.";
                                                  this.setState({ errorColabCodeEucaristia: errorMsg });
                                              }
                                              else if (data.error){
                                                errorMsg = data.error;
                                                this.setState({ errorColabCodeEucaristia: errorMsg });
                                              }
                                              else{
                                                this.setState({ 
                                                    errorColabCodeEucaristia: "", 
                                                    step: 2,
                                                    size: "small",
                                                    selectedEucaristia: data,
                                                    asistentesEucaristia: data.asistentes 
                                                });
                                              }
                                          })
                                    );
                                }                                
                            }}
                        />
                    </Form.Field>}

                    {this.state.errorColabCodeEucaristia && <Message
                        error
                        header='Error en la autenticación'
                        content={this.state.errorColabCodeEucaristia}
                        visible
                    />} 

                </Form>}

                {this.state.forgotPw && <Form>
                  
                  {!this.state.pwdSent && !this.state.errorAuth && <Message
                        warning
                        header='Recuperar contraseña'
                        content='Para recuperar la contraseña necesitamos identificar la parroquia.'
                        visible
                    />}

                  <Form.Field required>
                        <label>Nit de la parroquia</label>
                        <input
                            placeholder='NIT (sin puntos ni espacios)' 
                            onChange={e => this.setState({ nit: e.target.value }, () => this.checkDataPwRecover())}
                            value={this.state.nit}
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
                          nit: "", 
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
                            "nit": this.state.nit
                          }

                          fetch("/api/forgotParroquiaPassword", {
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

                {this.state.step === 2 && !this.state.codigoColaborador && <div>
                    
                    <Tab panes={this.state.autoEvalCovid ? panesBio : panesNoBio} renderActiveOnly={false}/>
                    
                </div>}

                {this.state.step === 2 && this.state.codigoColaborador && <div>
                    
                    <Tab panes={panesBioColab} renderActiveOnly={false}/>
                    
                </div>}
            </Modal.Content>
        </Modal>

      </div>
    )
  }
}