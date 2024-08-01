import * as moment from 'moment';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';

import Chart from './Chart';
import Devices from './Devices';
import Header from './Header';
import Map from './Map';
import { setFromDate, setShowRecent, setToDate } from './slice';
import { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function App() {
    const bounds = useSelector((state: RootState) => state.okRoad.bounds);
    const fromDate = useSelector((state: RootState) => state.okRoad.fromDate);
    const showRecent = useSelector((state: RootState) => state.okRoad.showRecent);
    const toDate = useSelector((state: RootState) => state.okRoad.toDate);
    
    const dispatch = useAppDispatch();

    return (
        <>
            <Header />
            <Container className="main-container" fluid>
                <Row className="main-container--row">
                    <Col className="left-container" xs={3}>
                        <Card>
                            <Card.Header>Search</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Devices />
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            checked={showRecent}
                                            id="show-recent"
                                            label="Last 24 hours"
                                            onChange={(e) => {
                                                dispatch(setShowRecent(e.target.checked));
                                            }}
                                            type="checkbox"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>From:</Form.Label>
                                        <Form.Control
                                            disabled={showRecent}
                                            onChange={(e) => {
                                                dispatch(setFromDate((new Date(e.target.value)).getTime()));
                                            }}
                                            type="datetime-local"
                                            value={moment(new Date(fromDate)).format('Y-MM-DDTHH:mm')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>To:</Form.Label>
                                        <Form.Control
                                            disabled={showRecent}
                                            onChange={(e) => {
                                                dispatch(setToDate((new Date(e.target.value)).getTime()));
                                            }}
                                            type="datetime-local"
                                            value={moment(new Date(toDate)).format('Y-MM-DDTHH:mm')}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check label="Fit map" type="checkbox" />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="right-container" xs={9}>
                        <Map bounds={bounds} />
                        <Chart />
                    </Col>
                </Row>
            </Container>
        </>        
    );
}
