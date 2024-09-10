import * as moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';

import SpeedLimitImage from '../misc/SpeedLimitImage';
import { highlightLocation } from '../slice';
import { AppDispatch, RootState } from '../store';

const useAppDispatch: () => AppDispatch = useDispatch;

function Location(props: any) {
    let image = 'gray.svg';
    if (props.location.speedLimit !== undefined) {
        if (props.location.velocity > props.location.speedLimit.speedLimit) {
            image = 'red.svg';
        } else {
            image = 'green.svg';
        }
    }

    const dispatch = useAppDispatch();

    return (
        <tr
            onMouseOut={() => {
                dispatch(highlightLocation());
            }}
            onMouseOver={() => {
                dispatch(highlightLocation(props.index));
            }}
        >
            <td>
                <img height={20} src={`/img/${image}`} width={20} />
            </td>
            <td>
                {moment(new Date(props.location.timestamp * 1000)).format('MMM D, HH:mm')}
            </td>
            <td>
                <SpeedLimitImage speedLimit={props.location.speedLimit.speedLimit} />
                {' '}
                {props.location.velocity}
                {' '}
                km/h
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
                        {locations.slice(0, 5).map((location, index) => (
                            <Location index={index} key={location.id} location={location} />
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}
