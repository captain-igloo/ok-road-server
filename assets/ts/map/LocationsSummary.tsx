import moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';

import SpeedLimitImage from '../misc/SpeedLimitImage';
import { RootState, useAppDispatch } from '../store';
import { Feature, highlightLocations } from './slice';

function Location(props: { location: Feature }) {
    const { location } = props;

    let image = 'gray.svg';
    let alt = 'Grey circle';
    let title = 'No speed limit data';
    if (location.speedLimit !== undefined) {
        if (location.velocity > location.speedLimit.speedLimit) {
            image = 'red.svg';
            alt = 'Red circle';
            title = 'Above speed limit';
        } else {
            image = 'green.svg';
            alt = 'Green circle';
            title = 'Within speed limit';
        }
    }

    const dispatch = useAppDispatch();

    const onMouseOver = React.useCallback(() => {
        dispatch(highlightLocations([location.id]));
    }, [location]);
    const onMouseOut = React.useCallback(() => {
        dispatch(highlightLocations([]));
    }, []);

    return (
        <tr
            onBlur={onMouseOut}
            onFocus={onMouseOver}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        >
            <td>
                <img alt={alt} height={20} src={`/img/${image}`} title={title} width={20} />
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
    const locations = useSelector((state: RootState) => state.map.features);

    return (
        <Card style={{ marginTop: '1px' }}>
            <Card.Header>Results</Card.Header>
            <Card.Body style={{ padding: 0 }}>
                <Table bordered hover size="sm" striped style={{ marginBottom: '0' }}>
                    <tbody>
                        {Object.keys(locations).slice(0, 10).map((id) => (
                            <Location key={locations[id].id} location={locations[id]} />
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}
