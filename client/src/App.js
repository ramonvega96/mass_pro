import React, { useEffect, useState } from 'react';
import './App.css';
import { Parroquias } from './components/Parroquias';
import { Input } from 'semantic-ui-react'
import InscribirParroquia from './components/InscribirParroquia';
import EditarParroquia from './components/EditarParroquia';


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
      <InscribirParroquia visible={false} onNewParroquia={parroquia => setFilteredParroquias(currentParroquias => [parroquia, ...currentParroquias])}/>
      <EditarParroquia onNewParroquia={parroquia => setFilteredParroquias(currentParroquias => [parroquia, ...currentParroquias])}/>
    </Footer>
  </div>;
}

export default App;
