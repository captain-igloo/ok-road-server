import moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';

import SpeedLimitImage from '../misc/SpeedLimitImage';
import { AppDispatch, RootState } from '../store';
import { Feature, highlightLocation } from './slice';

const useAppDispatch: () => AppDispatch = useDispatch;

function Location(props: { index: number; location: Feature }) {
    const { index, location } = props;

    let image = 'gray.svg';
    let alt = 'No speed limit data';
    if (location.speedLimit !== undefined) {
        if (location.velocity > location.speedLimit.speedLimit) {
            image = 'red.svg';
            alt = 'Above speed limit';
        } else {
            image = 'green.svg';
            alt = 'Within speed limit';
        }
    }

    const dispatch = useAppDispatch();

    const onMouseOver = React.useCallback(() => {
        dispatch(highlightLocation(index));
    }, [index]);
    const onMouseOut = React.useCallback(() => {
        dispatch(highlightLocation());
    }, []);

    return (
        <tr
            onBlur={onMouseOut}
            onFocus={onMouseOver}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        >
            <td>
                <img alt={alt} height={20} src={`/img/${image}`} width={20} />
            </td>
            <td>
                {moment(new Date(location.timestamp * 1000)).format('MMM D, HH:mm')}
            </td>
            <td>
                <SpeedLimitImage speedLimit={location.speedLimit?.speedLimit} />
                {' '}
                {location.velocity}
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
                        {locations.slice(0, 10).map((location, index) => (
                            <Location index={index} key={location.id} location={location} />
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}
