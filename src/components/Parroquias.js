import React, { Component } from 'react'
import { Button, Card } from 'semantic-ui-react'
import ModalInscripcion from './ModalInscripcion';

export default class Parroquias extends Component {
    
    
    render(){
        return (
            <div>
                <Card.Group>
                    {this.props.parroquias.map(parroquia => {
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
                                    <div className='ui buttons'>
                                    <Button 
                                    basic 
                                    color='green' 
                                    onClick={() => {this.child.openModal(parroquia)}}>
                                        Quiero asistir!
                                    </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        )
                    })}        
                </Card.Group>
                <ModalInscripcion ref={instance => {this.child = instance}}/>
            </div>
            );
    }
}