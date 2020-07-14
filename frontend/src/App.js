import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import { Input } from 'semantic-ui-react'
import ModalParroquia from './components/ModalParroquia';
import Parroquias from './components/Parroquias';
import ModalMisReservas from './components/ModalMisReservas';
import AdminModule from './components/AdminModule';
import SpeedDial from './components/SpeedDial';


function App() {
  
  const [parroquias, setParroquias] = useState([]);
  const [filteredParroquias, setFilteredParroquias] = useState([]);

  useEffect(() => {
    fetch("/api/parroquias").then(response =>
      response.json().then(data => {
        setParroquias(data.parroquias);
        setFilteredParroquias(data.parroquias);
      })
    );
  }, []);

  function setFilteredValues(val){
    setFilteredParroquias(parroquias.filter(p => p.nombre.toLowerCase().includes(val.toLowerCase())));
  }

  function refreshOnEdit(newParroquia){
    const parroquia = { 
      nombre: newParroquia.newNombre,
      diocesis: newParroquia.newDiocesis,
      ubicacion: newParroquia.newUbicacion,
      nit: newParroquia.nit, 
      parroco: newParroquia.newParroco, 
      capacidad: newParroquia.newCapacidad, 
      password: newParroquia.newPassword, 
      direccion: newParroquia.newDireccion,
      telefono: newParroquia.newTelefono
    };
    
    setParroquias(parroquias.filter(p => p.nit !== newParroquia.nit));
    setFilteredParroquias(parroquias.filter(p => p.nit !== newParroquia.nit));
    setParroquias(currentParroquias => [parroquia, ...currentParroquias]);
    setFilteredParroquias(currentParroquias => [parroquia, ...currentParroquias]);
  }

  function Footer({ children }) {
    return (
      <div>
        <div className="phantomStyle" />
        <div className="footerStyle">{children}</div>
      </div>
    );
  }

  const IndexPage = () => {
    return <div className="App" >
      <ModalMisReservas />
      <Parroquias parroquias={filteredParroquias}/>
      <Footer>
        <ModalParroquia onParroquiaChange={p => refreshOnEdit(p)}/>
      </Footer>
    </div>;
  };
  
  const adminModulePage = () => {
    return <AdminModule />;
  };

  return (
    <section className="App">
      <Input id="buscar-parroquia" fluid icon='search' placeholder='Busca tu parroquia por su nombre!' onChange={e => setFilteredValues(e.target.value)}/>
      <SpeedDial />
      <Router>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/adminModule" component={adminModulePage} />
      </Router>
    </section>
  );
}

export default App;
