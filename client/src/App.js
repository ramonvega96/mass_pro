import React, { useEffect, useState } from 'react';
import './App.css';
import { Parroquias } from './components/Parroquias';
import { Input } from 'semantic-ui-react'
import ModalParroquia from './components/ModalParroquia';


function App() {
  
  const [parroquias, setParroquias] = useState([]);
  const [filteredParroquias, setFilteredParroquias] = useState([]);

  useEffect(() => {
    fetch('/parroquias').then(response =>
      response.json().then(data => {
        setParroquias(data.parroquias);
        setFilteredParroquias(data.parroquias);
      })
    );
  }, []);

  function setFilteredValues(val){
    setFilteredParroquias(parroquias.filter(p => p.nombre.toLowerCase().includes(val)))
  }

  function refreshOnEdit(newParroquia){
    const parroquia = { 
      nombre: newParroquia.newNombre, 
      nit: newParroquia.newNit, 
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

  function refreshOnAdd(parroquia){
    setFilteredParroquias(currentParroquias => [parroquia, ...currentParroquias]);
    setParroquias(currentParroquias => [parroquia, ...currentParroquias]);
  }

  function Footer({ children }) {
    return (
      <div>
        <div className="phantomStyle" />
        <div className="footerStyle">{children}</div>
      </div>
    );
  }
  
  return <div className="App" >
    <Input fluid icon='search' placeholder='Busca tu parroquia por su nombre!' onChange={e => setFilteredValues(e.target.value)}/>
    <Parroquias parroquias={filteredParroquias}/>
    <Footer>
      <ModalParroquia onNewParroquia={p => refreshOnAdd(p)} onParroquiaChange={p => refreshOnEdit(p)}/>
    </Footer>
  </div>;
}

export default App;
