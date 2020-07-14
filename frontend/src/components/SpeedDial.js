import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import ChatIcon from '@material-ui/icons/Chat';
import { Header, Image, Modal, Icon, Accordion, Button, Form, TextArea, Message} from 'semantic-ui-react';
import YouTube from 'react-youtube';
import qr_donacion from '../images/qr_donacion.jpeg';


const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(6),
    right: theme.spacing(2),
  }
}));

const actions = [
  { icon: <HelpIcon />, name: 'Ayuda', key:'help' },
  { icon: <InfoIcon />, name: 'Información', key:'info' },
  { icon: <ChatIcon />, name: 'Contactanos', key:'contact' }
];

export default function SpeedDials() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [openHelp, setOpenHelp] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [videoId, setVideoId] = React.useState("YaKWUpzuQX8");
  
  const [motivo, setMotivo] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [result, setResult] = React.useState("");

  
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  const handleChange = (e, {value}) => {
    setMotivo(value)
  }
  
  const options = [
    { key: 1, text: 'Sugerencia', value: "Sugerencia" },
    { key: 2, text: 'Pregunta', value: "Pregunta" },
    { key: 3, text: 'Reportar una falla', value: "Falla" },
    { key: 4, text: 'Uso indebido de mis datos', value: "Uso de datos" },
    { key: 5, text: 'Otro', value: "Otro" }
  ]

  return (
    <div>
        <SpeedDial
            ariaLabel="SpeedDial example"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction="up"
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                    switch(action.key){
                        case "help":
                            setVideoId("YaKWUpzuQX8");
                            setActiveIndex(-1);
                            setOpenHelp(true);
                            setOpenInfo(false);
                            setOpenContact(false);
                            handleClose();
                            break;
                        case "info":
                            setOpenHelp(false);
                            setOpenInfo(true);
                            setOpenContact(false);
                            handleClose();
                            break;
                        case "contact":
                            setMotivo("");
                            setMensaje("");
                            setContact("");
                            setResult("");
                            setOpenHelp(false);
                            setOpenInfo(false);
                            setOpenContact(true);
                            handleClose();
                            break;
                        default:
                            break;
                    }
                    
                }}
                tooltipOpen
                tooltipPlacement="left"
            />
            ))}
        </SpeedDial>
        
        <Modal open={openHelp} closeIcon onClose={() => setOpenHelp(!openHelp)} size="small">
            <Modal.Header>Ayuda</Modal.Header>
            <Modal.Content>
                <YouTube 
                    videoId={videoId} 
                    opts={{
                        height: "300",
                        width: "100%",
                        playerVars: {
                            autoplay: 1}}} />
            </Modal.Content>
            <Accordion fluid styled>
            <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleClick}
            >
            <Icon name='dropdown' />
            Protocol Meet Project - Presentación del Proyecto
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
            <Button.Group vertical labeled icon fluid>
                <Button icon='video camera' color='green' content='Ver video de presentación' onClick={() => setVideoId("YaKWUpzuQX8")}/>
            </Button.Group>
            </Accordion.Content>

            <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleClick}
            >
            <Icon name='dropdown' />
            ¿Cómo debo usar la plataforma? - Administro una Parroquia
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
            <Button.Group vertical labeled icon fluid>
                <Button icon='video camera' color='teal' content='¿Cómo inscribir mi Parroquia?' onClick={() => setVideoId("FTRdmZr2xiU")}/>
                <Button icon='video camera' color='teal' content='¿Cómo programar Eucaristias particulares?' onClick={() => setVideoId("-7dHJmVrDec")} />
                <Button icon='video camera' color='teal' content='¿Cómo tomar asistencia en las Eucaristias?' onClick={() => setVideoId("eRANe-OwuuE")} />
                <Button icon='video camera' color='teal' content='¿Qué reportes puedo generar?' onClick={() => setVideoId("X6EeGi62kGw")} />
            </Button.Group>
            </Accordion.Content>

            <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={handleClick}
            >
            <Icon name='dropdown' />
            ¿Cómo debo usar la plataforma? - Soy Feligrés
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
            <Button.Group vertical labeled icon fluid>
                <Button icon='video camera' color='green' content='¿Cómo me inscribo a una Eucaristía?' onClick={() => setVideoId("exE1hfTdZDY")} />
                <Button icon='video camera' color='green' content='¿Cómo me inscribo a una Eucaristía particular? - Bautizo, Matrimonio, etc.' onClick={() => setVideoId("pZ4enrX-zM8")}/>
            </Button.Group>
            </Accordion.Content>
        </Accordion>
        </Modal>

        <Modal open={openInfo} closeIcon onClose={() => setOpenInfo(!openInfo)} size="tiny">
            <Modal.Header>Información</Modal.Header>
            <Modal.Content>
                <Header>¿Qué es protocolmeet.com?</Header>
                <p>Es una plataforma que apoya el protocolo de bioseguridad en las Parroquias 
                    permitiendo realizar un cerco epidemiológico efectivo.</p>
                <Header>¿Quién lo creó?</Header>
                <p>Este es un proyecto pensado y construido por una familia de laícos comprometidos. 
                    Papá y mamá son miembros activos del Movimiento de Cursillos de Cristiandad (Diocesis de 
                    Zipaquirá) y sus hijos están vinculados a la organización Central de Juventudes.</p>
                <Header>¿Cómo puedo participar?</Header>
                <p>Puedes hablarle a otros de la existencia de la plataforma, contribuir con tus ideas / 
                    sugerencias o hacer una contribución económica que se usará para propósitos de sostenimiento de 
                    la plataforma.</p>
                <Header>Contribuciones</Header>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <Image wrapped src={qr_donacion} size='medium' />
                </div>
                <p style={{ display: 'flex', justifyContent: 'center'}}>Bancolombia / Cuenta de Ahorros / No. 03203263591</p>
            </Modal.Content>
        </Modal>

        <Modal open={openContact} closeIcon onClose={() => setOpenContact(!openContact)} size="mini">
            <Modal.Header>Contactanos</Modal.Header>
            <Modal.Content>
                {!result && <Form>
                    <Form.Field required>
                        <label>Motivo</label>
                        <Form.Select 
                        placeholder="Motivo de tu mensaje" 
                        options={options} 
                        selection 
                        value={motivo}
                        onChange={handleChange.bind(this)} />
                    </Form.Field>
                    <Form.Field required>
                      <label>Mensaje</label>
                      <TextArea 
                        placeholder='Mensaje' 
                        style={{ minHeight: 100 }} 
                        onChange={e => setMensaje(e.target.value)}
                        value={mensaje}/>
                  </Form.Field>
                  <Form.Field required>
                      <label>¿Cómo te podemos contactar?</label>
                      <input 
                        placeholder='Déjanos tu teléfono o email' 
                        onChange={e => setContact(e.target.value)}
                        value={contact}/>
                  </Form.Field>
                  <Button.Group>
                        <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => {
                            setMensaje("");
                            setContact("");
                            setOpenContact(!openContact);
                            handleClose();
                        }}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='paper plane'
                        labelPosition='right'
                        content='Enviar'
                        disabled={!mensaje || !contact || !motivo}
                        onClick={() => {

                            const msgData = {
                                motivo: motivo,
                                msg: mensaje,
                                contact: contact                
                            }

                          fetch("/api/sendMsg", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(msgData)
                              }).then(res =>
                                res.json().then(data => {
                                    if(!res.ok){
                                        setResult({
                                            error: "Error interno. Por favor vuelva a intentar."
                                        });
                                    }
                                    else{
                                        setMotivo("");
                                        setMensaje("");
                                        setContact("");
                                        setResult(data);
                                    }
                                })
                              );
                        }}
                        />
                    </Button.Group>
                </Form>}
                {result.success && <Message
                        icon='paper plane'
                        success
                        header='Recibimos tu mensaje'
                        content={result.success}
                        visible
                    />}
                {result.error && <Message
                        icon='frown'
                        error
                        header='Hubo un error enviando tu mensaje'
                        content={result.error}
                        visible
                    />}
            </Modal.Content>
        </Modal>

    </div>
  );
}
