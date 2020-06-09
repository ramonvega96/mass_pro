import React from 'react'
import { Button, Card } from 'semantic-ui-react'

export const Parroquias = ({ parroquias }) => {
    return (
    <div>
        <Card.Group>
            {parroquias.map(parroquia => {
                return(
                    <Card key={parroquia.nit}>
                        <Card.Content>
                            <Card.Header>{parroquia.nombre}</Card.Header>
                            <br></br>
                            <Card.Meta>{parroquia.direccion}</Card.Meta>
                            <Card.Meta>{parroquia.telefono}</Card.Meta>
                            <Card.Description>
                            <strong>{parroquia.parroco}</strong>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui buttons'>
                            <Button basic color='green'>
                                Quiero ir acá!
                            </Button>
                            </div>
                        </Card.Content>
                    </Card>
                )
            })}        
        </Card.Group>
    </div>
    );
}