import * as moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';

import Devices from './Devices';
import { setFromDate, setShowRecent, setToDate } from '../slice';
import { AppDispatch, RootState } from '../store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Search() {
    const fromDate = useSelector((state: RootState) => state.okRoad.fromDate);
    const showRecent = useSelector((state: RootState) => state.okRoad.showRecent);
    const toDate = useSelector((state: RootState) => state.okRoad.toDate);
    
    const dispatch = useAppDispatch();

    return (
        <Card>
            <Card.Header>Search</Card.Header>
            <Card.Body>
                <Form>
                    <Devices />
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 3 }}>
                            <Form.Check
                                checked={showRecent}
                                id="show-recent"
                                label="Last 24 hours"
                                onChange={(e) => {
                                    dispatch(setShowRecent(e.target.checked));
                                }}
                                type="checkbox"
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>From:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                disabled={showRecent}
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
                                disabled={showRecent}
                                onChange={(e) => {
                                    dispatch(setToDate((new Date(e.target.value)).getTime()));
                                }}
                                type="datetime-local"
                                value={moment(new Date(toDate)).format('Y-MM-DDTHH:mm')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 3 }}>
                            <Form.Check label="Fit map" type="checkbox" />
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}
