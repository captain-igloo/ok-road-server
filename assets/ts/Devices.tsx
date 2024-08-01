import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';

import { RootState } from './store';

export default function Devices() {
    const devices = useSelector((state: RootState) => state.okRoad.devices);

    const options = devices.map((device) => {
        return <option key={device.id} value={device.id}>{device.description}</option>;
    });

    return (
        <Form.Group className="mb-3">
            <Form.Label>Device:</Form.Label>
            <Form.Select>
                {options}
            </Form.Select>
        </Form.Group>
    );
}
