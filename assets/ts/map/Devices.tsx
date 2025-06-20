import * as React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../store';
import { selectDevice } from './slice';

export default function Devices() {
    const devices = useSelector((state: RootState) => state.map.devices);
    const selectedDevice = useSelector((state: RootState) => state.map.selectedDevice);
    const user = useSelector((state: RootState) => state.map.user);

    const options = devices.map((device) => {
        const username = (user !== undefined && user.username !== device.username)
            ? `${device.username} - `
            : '';
        const description = `${username}${device.description}`;
        return (
            <option key={device.id} value={device.id}>
                {description}
            </option>
        );
    });
    const dispatch = useAppDispatch();

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Device:</Form.Label>
            <Col sm={9}>
                <Form.Select
                    aria-label="Device"
                    onChange={(e) => {
                        dispatch(selectDevice(parseInt(e.target.value, 10)));
                    }}
                    value={selectedDevice}
                >
                    {options}
                </Form.Select>
            </Col>
        </Form.Group>
    );
}
