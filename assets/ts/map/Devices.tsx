import * as React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export default function Devices() {
    const devices = useSelector((state: RootState) => state.okRoad.devices);

    const options = devices.map((device) => {
        return <option key={device.id} value={device.id}>{device.description}</option>;
    });

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Device:</Form.Label>
            <Col sm={9}>
                <Form.Select>
                    {options}
                </Form.Select>
            </Col>
        </Form.Group>
    );
}
