import * as moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import Devices from './Devices';
import { setFromDate, setToDate } from './slice';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Search() {
    const fromDate = useSelector((state: RootState) => state.okRoad.fromDate);
    const toDate = useSelector((state: RootState) => state.okRoad.toDate);
    const dispatch = useAppDispatch();

    return (
        <Card>
            <Card.Header>Search</Card.Header>
            <Card.Body>
                <Form>
                    <Devices />
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>From:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch(setFromDate((new Date(e.target.value)).getTime()));
                                }}
                                type="datetime-local"
                                value={moment(new Date(fromDate)).format('Y-MM-DDTHH:mm')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>To:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch(setToDate((new Date(e.target.value)).getTime()));
                                }}
                                type="datetime-local"
                                value={moment(new Date(toDate)).format('Y-MM-DDTHH:mm')}
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}
