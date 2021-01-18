import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Header, Image, Modal, Icon, Accordion, Button} from 'semantic-ui-react';
import { Form, Message, List, Divider } from 'semantic-ui-react'
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
  { icon: <ChatIcon />, name: 'Contactanos', key:'contact' },
  { icon: <AccountCircleIcon />, name: 'Mi Usuario', key:'user' }
];

export default function SpeedDials() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [openHelp, setOpenHelp] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [videoId, setVideoId] = React.useState("YaKWUpzuQX8");

  const [step, setStep] = React.useState(1)
  const [errorAuth, setErrorAuth] = React.useState("")
  
  const [id, setId] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [cPassword, setCPassword] = React.useState("")
  const [nombre, setNombre] = React.useState("")
  const [telefono, setTelefono] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [direccion, setDireccion] = React.useState("")
  const [ubicacion, setUbicacion] = React.useState("")

  const [newUser, setNewUser] = React.useState(false)
  const [authStepCompleted, setAuthStepCompleted] = React.useState(false)
  const [pwdSent, setPwdSent] = React.useState(false)
  const [pwRecovered, setPwRecovered] = React.useState(false)

  const handleAccordionClick = () => {
    const newIndex = activeIndex === 0 ? -1 : 0;
    setActiveIndex(newIndex)
  }

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

  const checkDataAuth = () => {
    if(id &&
      password &&
      !newUser){
        setAuthStepCompleted(true);
        return true;
    }
    else if(id &&
      !isNaN(id) &&
      password &&
      cPassword &&
      cPassword === password &&
      nombre &&
      direccion &&
      ubicacion &&
      telefono &&
      !isNaN(telefono) &&
      email &&
      newUser
      ){
        setAuthStepCompleted(true);
        return true;

    }
    else{
      setAuthStepCompleted(false);
      return false;
    }
  }

  const clearData = () => {
    setId("");
    setPassword("");
    setCPassword("");
    setNombre("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setUbicacion("");
  }
 
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
                            setOpenUser(false);
                            handleClose();
                            break;
                        case "info":
                            setOpenHelp(false);
                            setOpenInfo(true);
                            setOpenContact(false);
                            setOpenUser(false);
                            handleClose();
                            break;
                        case "contact":
                            setOpenHelp(false);
                            setOpenInfo(false);
                            setOpenContact(true);
                            setOpenUser(false);
                            handleClose();
                            break;
                        case "user":
                            setOpenHelp(false);
                            setOpenInfo(false);
                            setOpenContact(false);
                            setOpenUser(true);
                            setStep(1);
                            setNewUser(false);
                            setId("");
                            setPassword("");
                            setErrorAuth("");
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
                <Button color='green' href="https://wa.me/573194203184">
                    <Icon name='whatsapp' /> Escribenos a nuestro Whatsapp haciendo click aquí
                </Button>
            </Modal.Content>
        </Modal>

        <Modal open={openUser} closeIcon onClose={() => setOpenUser(!openUser)} size="mini" closeOnEscape={false} closeOnDimmerClick={false}>
          {step === 0 && <Modal.Header>Recuperar Contraseña</Modal.Header>}
          {step === 1 && <Modal.Header>Mi Usuario</Modal.Header>}
          {step === 2 && <Modal.Header>Escoger Acción</Modal.Header>}
          {step === 3 && <Modal.Header>Editar Usuario</Modal.Header>}
          {step === 4 && <Modal.Header>Eliminar Usuario</Modal.Header>}

          
          <Modal.Content>
          
          {step === 1 && <Form>
                    {errorAuth && <Message
                        error
                        header='Error en la autenticación'
                        content={errorAuth}
                        visible
                    />}
                    
                    <Form.Field required>
                        <label>Cédula o Tarjeta de Identidad</label>
                        <input
                            placeholder='Identificación (sin puntos ni espacios)' 
                            onChange={e => {setId(e.target.value)}}
                            value={id}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Contraseña</label>
                        <input
                            type='password'
                            placeholder='Contraseña' 
                            onChange={e => {setPassword(e.target.value)}}
                            value={password}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>

                    {newUser && <Form.Field required>
                          <label>Confirmar Contraseña {password && cPassword && cPassword !== password && " (No coinciden)"}</label>
                          <input
                              type='password'
                              placeholder='Confirmar Contraseña' 
                              onChange={e => {setCPassword(e.target.value)}}
                              value={cPassword}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {newUser && <Form.Field required>
                          <label>Nombres y Apellidos</label>
                          <input
                              placeholder='Nombres y Apellidos' 
                              onChange={e => {setNombre(e.target.value)}}
                              value={nombre}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {newUser && <Form.Field required>
                          <label>Teléfono</label>
                          <input
                              placeholder='Teléfono' 
                              onChange={e => {setTelefono(e.target.value)}}
                              value={telefono}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {newUser && <Form.Field required>
                          <label>Email</label>
                          <input
                              placeholder='Correo electrónico' 
                              onChange={e => {setEmail(e.target.value)}}
                              value={email}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {newUser && <Form.Field required>
                          <label>Dirección</label>
                          <input
                              placeholder='Dirección' 
                              onChange={e => {setDireccion(e.target.value)}}
                              value={direccion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}
                      {newUser && <Form.Field required>
                          <label>Ubicación</label>
                          <input
                              placeholder='Ciudad / Municipio' 
                              onChange={e => {setUbicacion(e.target.value)}}
                              value={ubicacion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>}

                      {newUser && <Form.Field>
                        <Accordion>
                          <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={ () => { handleAccordionClick()}  }
                          >
                            <Icon name='dropdown' />
                            Haga click aquí para leer nuestra política de tratamiento de datos y click en "Siguiente" 
                            si está de acuerdo con la misma.
                          </Accordion.Title>
                          <Accordion.Content active={activeIndex === 0}>
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
                        positive
                        icon='arrow circle right'
                        labelPosition='right'
                        content='Siguiente'
                        onClick={() => {

                            if(checkDataAuth()){
                          
                              var errorMsg = "";

                              const authData = {
                                  id: id.trim(),
                                  password: password,
                                  nombre: nombre,
                                  direccion: direccion,
                                  telefono: telefono,
                                  email: email,
                                  ubicacion: ubicacion,
                                  reservas: []                                
                              }

                              if(!newUser){
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
                                            setErrorAuth(errorMsg);
                                          }
                                        else if (data.error){
                                            errorMsg = data.error;
                                            setErrorAuth(errorMsg);
                                          }
                                        else{
                                          setStep(2);
                                          setDireccion(data.direccion);
                                          setEmail(data.email);
                                          setNombre(data.nombre);
                                          setTelefono(data.telefono);
                                          setUbicacion(data.ubicacion);
                                          setCPassword(password);
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
                                          setErrorAuth(errorMsg);
                                      }
                                      else if (data.error){
                                          errorMsg = data.error;
                                          setErrorAuth(errorMsg);
                                      }
                                      else{
                                          setStep(2);
                                          setDireccion(data.direccion);
                                          setEmail(data.email);
                                          setNombre(data.nombre);
                                          setTelefono(data.telefono);
                                          setUbicacion(data.ubicacion);
                                      }
                                  })
                                );
                              }
                            }
                          else{
                            errorMsg = "Todos los campos son obligatorios. Verifique la contraseña y su confirmación";
                            setErrorAuth(errorMsg);
                          }
                        }}
                        />
                    </Button.Group>
                    <Modal.Actions>
                      <List celled horizontal>
                          
                          <List.Item href='#' onClick={() => {
                            const nuevoUsuario = newUser;
                            setNewUser(!nuevoUsuario);
                            setAuthStepCompleted(false);
                            setErrorAuth("");
                            setActiveIndex(-1);
                            checkDataAuth();                              
                            }}>{newUser ? 'Estoy registrado' : 'No estoy registrado'}</List.Item>
                          
                          <List.Item href='#'onClick={() => {
                            setId("");
                            setErrorAuth(""); 
                            setStep(0);}}>Olvidé mi contraseña</List.Item>

                      </List>
                    </Modal.Actions>
                </Form>}

                {step === 0 && <Form>
                  
                  {!pwdSent && !errorAuth && <Message
                        warning
                        header='Recuperar contraseña'
                        content='Para recuperar tu contraseña necesitamos identificarte.'
                        visible
                    />}

                  <Form.Field required>
                        <label>Cédula o Tarjeta de Identidad</label>
                        <input
                            placeholder='Identificación (sin puntos ni espacios)' 
                            onChange={e => {
                                if(e.target.value &&
                                    !isNaN(e.target.value)){
                                        setAuthStepCompleted(true);
                                        setErrorAuth("");
                                        setId(e.target.value);
                                  }
                                  else{
                                      setAuthStepCompleted(false);
                                      setErrorAuth("");
                                      setId(e.target.value);
                                  }
                            }}
                            value={id}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>

                    {pwdSent && <Message
                        success
                        header='Contraseña enviada'
                        content={pwdSent}
                        visible
                    />}

                    {errorAuth && <Message
                        error
                        header='Error'
                        content={errorAuth}
                        visible
                    />}

                    <Button.Group>
                      <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => { setStep(1); setErrorAuth(""); }}
                        />
                        <Button.Or text='O'/>
                        <Button
                        positive
                        icon='paper plane outline'
                        labelPosition='right'
                        content='Enviar'
                        disabled={!authStepCompleted || pwRecovered}
                        onClick={() => {

                          let errorMsg = "";
                          const authData = {
                            "userId": id
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
                                    setErrorAuth(errorMsg);
                                }
                                else if (data.error){
                                    errorMsg = data.error;
                                    setErrorAuth(errorMsg);
                                }
                                else{
                                  setPwdSent("Tu contraseña fue enviada a: " + data.email);
                                  setPwRecovered(true);
                                }
                            })
                          );

                        }}
                        />
                    </Button.Group>                  
                  </Form>}

                  {step === 2 && <Form>
                    <Button
                        fluid 
                        color='green' 
                        icon='edit' 
                        content='Quiero EDITAR mis datos'
                        onClick={() => {
                          setStep(3); 
                          setErrorAuth("");
                          setNewUser(true);
                          }} />

                      <Divider hidden />
                      
                      <Button 
                        fluid
                        color='red' 
                        icon='trash'
                        content='Quiero ELIMINAR mi cuenta'
                        onClick={() => {
                          setStep(4); 
                          setErrorAuth("");
                          }} />

                    <Divider horizontal>O</Divider>

                    <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => {
                          setStep(1); 
                          setErrorAuth("");
                          clearData();
                          setNewUser(false);}}/>
                  </Form>}

                  {step === 3 && <Form> 
                    {errorAuth && <Message
                        error
                        header='Error al guardar'
                        content={errorAuth}
                        visible
                    />}

                    <Form.Field required>
                        <label>Cédula o Tarjeta de Identidad</label>
                        <input
                            placeholder='Identificación (sin puntos ni espacios)' 
                            onChange={e => {setId(e.target.value)}}
                            value={id}
                            disabled
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Contraseña</label>
                        <input
                            type='password'
                            placeholder='Contraseña' 
                            onChange={e => {setPassword(e.target.value)}}
                            value={password}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                    </Form.Field>
                    <Form.Field required>
                          <label>Confirmar Contraseña {password && cPassword && cPassword !== password && " (No coinciden)"}</label>
                          <input
                              type='password'
                              placeholder='Confirmar Contraseña' 
                              onChange={e => {setCPassword(e.target.value)}}
                              value={cPassword}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>
                      <Form.Field required>
                          <label>Nombres y Apellidos</label>
                          <input
                              placeholder='Nombres y Apellidos' 
                              onChange={e => {setNombre(e.target.value)}}
                              value={nombre}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>
                      <Form.Field required>
                          <label>Teléfono</label>
                          <input
                              placeholder='Teléfono' 
                              onChange={e => {setTelefono(e.target.value)}}
                              value={telefono}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>
                      <Form.Field required>
                          <label>Email</label>
                          <input
                              placeholder='Correo electrónico' 
                              onChange={e => {setEmail(e.target.value)}}
                              value={email}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>
                      <Form.Field required>
                          <label>Dirección</label>
                          <input
                              placeholder='Dirección' 
                              onChange={e => {setDireccion(e.target.value)}}
                              value={direccion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>
                      <Form.Field required>
                          <label>Ubicación</label>
                          <input
                              placeholder='Ciudad / Municipio' 
                              onChange={e => {setUbicacion(e.target.value)}}
                              value={ubicacion}
                              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                      </Form.Field>

                      <Button.Group>
                      <Button
                        negative
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => {
                          setStep(1); 
                          setErrorAuth(""); 
                          setNewUser(false);
                          clearData();}}/>
                        
                        <Button.Or text='O'/>
                        
                        <Button
                          positive
                          icon='save outline'
                          labelPosition='right'
                          content='Guardar'
                          onClick={() => {

                          if(checkDataAuth()){
                          
                            var errorMsg = "";

                            const authData = {
                                id: id,
                                password: password,
                                nombre: nombre,
                                direccion: direccion,
                                telefono: telefono,
                                email: email,
                                ubicacion: ubicacion                        
                            }

                            fetch("/api/updateUser", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify(authData)
                                }).then(res =>
                                  res.json().then(data => {
                                      if(!res.ok){
                                          errorMsg = "Error interno. Por favor vuelva a intentar.";
                                          setErrorAuth(errorMsg);
                                        }
                                      else if (data.error){
                                          errorMsg = data.error;
                                          setErrorAuth(errorMsg);
                                        }
                                      else{
                                        setStep(1);
                                        setNewUser(false);
                                        clearData();
                                        setErrorAuth("");
                                      }
                                  })
                                );
                            }
                        else{
                          errorMsg = "Todos los campos son obligatorios. Verifique la contraseña y su confirmación.";
                          setErrorAuth(errorMsg);
                        }

                        }}
                        />
                    </Button.Group> 
                  </Form>}

                  {step === 4 && <Form>
                    
                    <Message
                        warning
                        header='Confirmación'
                        content='Al eliminar tus datos perderas todas tus reservas 
                        y tus datos se eliminaran de la plataforma de manera permanente: ¿Seguro que quieres hacerlo?'
                        visible
                    />                    
                      
                    <Button 
                      fluid
                      color='red' 
                      icon='trash'
                      content='Si, quiero ELIMINAR mi cuenta'
                      onClick={() => {
                        
                        const usrData = {
                          userId: id                      
                        };
                        
                        var errorMsg = "";

                        fetch("/api/deleteUser", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(usrData)
                            }).then(res =>
                              res.json().then(data => {
                                  if(!res.ok){
                                      errorMsg = "Error interno. Por favor vuelva a intentar.";
                                      setErrorAuth(errorMsg);
                                    }
                                  else if (data.error){
                                      errorMsg = data.error;
                                      setErrorAuth(errorMsg);
                                    }
                                  else{
                                    setStep(1);
                                    setNewUser(false);
                                    clearData();
                                  }
                              })
                            );
                      }}/>

                    <Divider horizontal>O</Divider>

                    <Button
                        positive
                        icon='arrow circle left'
                        labelPosition='left'
                        content='Volver'
                        onClick={() => {
                          setStep(1); 
                          setErrorAuth("");
                          clearData();
                          setNewUser(false);}}/>
                  </Form>}

          </Modal.Content>
        </Modal>

    </div>
  );
}
