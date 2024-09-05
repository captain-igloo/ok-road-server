import * as moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

function Location(props: any) {
    let image = 'gray.svg';
    if (props.location.speedLimit !== undefined) {
        if (props.location.velocity > props.location.speedLimit.speedLimit) {
            image = 'red.svg';
        } else {
            image = 'green.svg';
        }
    }

    return (
        <tr>
            <td>
                <img height={20} src={`/img/${image}`} width={20} />
            </td>
            <td>
                {moment(new Date(props.location.timestamp * 1000)).format('MMM D, HH:mm')}
            </td>
            <td>
                Speed: {props.location.velocity} km/h
            </td>
        </tr>
    );
}

export default function Locations() {
    const locations = useSelector((state: RootState) => state.okRoad.features);

    return (
        <Card style={{ marginTop: '1px' }}>
            <Card.Header>Results</Card.Header>
            <Card.Body style={{ padding: 0 }}>
                <Table bordered hover size="sm" striped style={{ marginBottom: '0' }}>
                    <tbody>
                        {Object.keys(locations).slice(0, 5).map((id) => (
                            <Location key={id} location={locations[id]} />
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}
