import * as React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';

import { selectDevice } from '../slice';
import { AppDispatch, RootState } from '../store';

const useAppDispatch: () => AppDispatch = useDispatch;

export default function Devices() {
    const devices = useSelector((state: RootState) => state.okRoad.devices);
    const selectedDevice = useSelector((state: RootState) => state.okRoad.selectedDevice);

    const options = devices.map((device) => {
        return <option key={device.id} value={device.id}>{device.description}</option>;
    });
    const dispatch = useAppDispatch();

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Device:</Form.Label>
            <Col sm={9}>
                <Form.Select
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
